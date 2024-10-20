import dogecore from "bitcore-lib-doge";
import axios from "axios";

import {
    SERVER_URL,
    MAX_CHUNK_LEN,
    MAX_PAYLOAD_LEN,
    LEVEL_USER_AIRDROP_CLIENT_HOLDER,
    LEVEL_USER_AIRDROP_NOTE_HOLDER,
    LEVEL_USER_AIRDROP_ARMZ_HOLDER,
    LEVEL_USER_AIRDROP_GENERAL_HOLDER,
    AIRDROP_BONUS_FEE_LIST,
    MAIN_TOKEN_NAME,
    FEE_STORE_WALLET_ADDRESS
  } from "../config/constants";
import { convertUTXOData, getPublicAddress, isMnemonic, mnemonicToPrivateKey } from "../config/utils";
import { getUTXOs, createInscriptionData, broadcastAll, toBufferSignature, fund, bufferToChunk, numberToChunk, opcodeToChunk } from "./walletService";
const { PrivateKey, Address, Transaction, Script, Opcode } = dogecore;
const { Hash, Signature } = dogecore.crypto;

const getLevelOfUser = async (drc20s, nfts) => {
    // Check Armz note holding
    try {
        const data = nfts.map((nft) => nft.inscriptionId);
        const result_validNFTs = await axios.post(`${SERVER_URL}/api/transaction/validNFT`, { inscriptionIds: data });
        const tvalidNFTs = result_validNFTs.data.data;
        console.log("ValidNFT", tvalidNFTs);
        if(tvalidNFTs.length) return LEVEL_USER_AIRDROP_NOTE_HOLDER;
    } catch (err) {
        console.log("Get nft error");
    }

    // Check Armz token holding
    const drc20 = drc20s.find((item) => item.tick === MAIN_TOKEN_NAME && parseInt(item.total) >= 1000);
    console.log("DRC20", drc20);
    if(drc20) return LEVEL_USER_AIRDROP_ARMZ_HOLDER;

    // Check the client
    try {
        const result_clientNFTs = await axios.get(`${SERVER_URL}/api/information/client`);
        const clientNFTs = result_clientNFTs.data.data;
        console.log("ClientNFTs", clientNFTs);
        const data = clientNFTs.filter((clientNFT) => {
            const nft = nfts.find((nft) => nft.inscriptionId === clientNFT.inscriptionId);
            return nft && nft.inscriptionId === clientNFT.inscriptionId;
        });
        console.log("Client", data);
        if(data.length) return LEVEL_USER_AIRDROP_CLIENT_HOLDER;
    } catch (err) {
        console.log("Get client error");
    }
    return LEVEL_USER_AIRDROP_GENERAL_HOLDER;
};

const _updateUTXOs = (utxos, address, tx) => {
    utxos = utxos.filter((utxo) => {
      for (const input of tx.inputs) {
        if (
          input.prevTxId.toString("hex") == utxo.txid &&
          input.outputIndex == utxo.vout
        ) {
          return false;
        }
      }
      return true;
    });
  
    tx.outputs.forEach((output, vout) => {
        if (output.script.toAddress().toString() == address && output.satoshis !== 100000) {
            utxos.push({
                txid: tx.hash,
                vout,
                script: output.script.toHex(),
                satoshis: output.satoshis,
            });
        }
    });
    return utxos;
};

const _createAirdropDRC20TransferInscription = (privkey, utxos, address, wallets, contentType, data, level) => {
    let txs = [];

    let tx;
    let privateKey = new PrivateKey(privkey);
    let publicKey = privateKey.toPublicKey();
    let parts = [];
    while (data.length) {
        let part = data.slice(0, Math.min(MAX_CHUNK_LEN, data.length));
        data = data.slice(part.length);
        parts.push(part);
    }

    let inscription = new Script();
    inscription.chunks.push(bufferToChunk("ord"));
    inscription.chunks.push(numberToChunk(parts.length));
    inscription.chunks.push(bufferToChunk(contentType));
    parts.forEach((part, n) => {
        inscription.chunks.push(numberToChunk(parts.length - n - 1));
        inscription.chunks.push(bufferToChunk(part));
    });

    let p2shInput;
    let lastLock;
    let lastPartial;

    while (inscription.chunks.length) {
        let partial = new Script();

        if (txs.length == 0) {
        partial.chunks.push(inscription.chunks.shift());
        }

        while (
            partial.toBuffer().length <= MAX_PAYLOAD_LEN &&
            inscription.chunks.length
        ) {
            partial.chunks.push(inscription.chunks.shift());
            partial.chunks.push(inscription.chunks.shift());
        }

        if (partial.toBuffer().length > MAX_PAYLOAD_LEN) {
            inscription.chunks.unshift(partial.chunks.pop());
            inscription.chunks.unshift(partial.chunks.pop());
        }

        let lock = new Script();
            lock.chunks.push(bufferToChunk(publicKey.toBuffer()));
            lock.chunks.push(opcodeToChunk(Opcode.OP_CHECKSIGVERIFY));
            partial.chunks.forEach(() => {
            lock.chunks.push(opcodeToChunk(Opcode.OP_DROP));
        });
        lock.chunks.push(opcodeToChunk(Opcode.OP_TRUE));

        let lockhash = Hash.ripemd160(Hash.sha256(lock.toBuffer()));

        let p2sh = new Script();
        p2sh.chunks.push(opcodeToChunk(Opcode.OP_HASH160));
        p2sh.chunks.push(bufferToChunk(lockhash));
        p2sh.chunks.push(opcodeToChunk(Opcode.OP_EQUAL));

        let p2shOutput = new Transaction.Output({
            script: p2sh,
            satoshis: 100000,
        });

        // let tx1 = new Transaction();
        // console.log("EHEYE123123", tx1);
        tx = new Transaction();
        if (p2shInput) tx.addInput(p2shInput);
        for(let i = 0;i < wallets.length;i ++) tx.addOutput(p2shOutput)
        fund(privkey, utxos, address, tx);

        if (p2shInput) {
            let signature = Transaction.sighash.sign(
                tx,
                privateKey,
                Signature.SIGHASH_ALL,
                0,
                lastLock
            );
            let txsignature = Buffer.concat([
                toBufferSignature(signature),
                Buffer.from([Signature.SIGHASH_ALL]),
            ]);

            let unlock = new Script();
            unlock.chunks = unlock.chunks.concat(lastPartial.chunks);
            unlock.chunks.push(bufferToChunk(txsignature));
            unlock.chunks.push(bufferToChunk(lastLock.toBuffer()));
            tx.inputs[0].setScript(unlock);
        }

        utxos = _updateUTXOs(utxos, address, tx);
        txs.push(tx);

        p2shInput = new Transaction.Input({
            prevTxId: tx.hash,
            outputIndex: 0,
            output: tx.outputs[0],
            script: "",
        });

        p2shInput.clearSignatures = () => {
            return [];
        };
        p2shInput.getSignatures = () => {
            return [];
        };

        lastLock = lock;
        lastPartial = partial;
    }

    for(let i = 0;i < wallets.length;i ++) {
        let tx1 = new Transaction()
        // console.log(tx.outputs[0]);
        p2shInput = new Transaction.Input({
            prevTxId: tx.hash,
            // prevTxId: "be5c5a0047c3f564598db1f762615a7e3cf2755a031cc93f292e89a98ad87e3c",
            outputIndex: i,
            output: tx.outputs[0],
            script: ''
        })

        p2shInput.clearSignatures = () => {
            return [];
        }
        p2shInput.getSignatures = () => {
            return [];
        }

        tx1.addInput(p2shInput);
        // console.log("i", i);
        tx1.to(address, 100000)
        fund(privkey, utxos, address, tx1);

        let signature = Transaction.sighash.sign(tx1, privateKey, Signature.SIGHASH_ALL, 0, lastLock);
        let txsignature = Buffer.concat([toBufferSignature(signature), Buffer.from([Signature.SIGHASH_ALL])]);

        let unlock = new Script()
        unlock.chunks = unlock.chunks.concat(lastPartial.chunks)
        unlock.chunks.push(bufferToChunk(txsignature))
        unlock.chunks.push(bufferToChunk(lastLock.toBuffer()))
        tx1.inputs[0].setScript(unlock)

        utxos = _updateUTXOs(utxos, address, tx1);
        txs.push(tx1)
    }

    // console.log("Txs:", txs[0]);
    // console.log("Txs:", txs[1]);
    
    let tx2 = new Transaction();
    for(let i = 0;i < wallets.length;i ++) {
        // console.log(txs[i].outputs[0].script.toBuffer().toString('hex'));
        tx2.from({
            txid: txs[i + 1].hash,
            vout: 0,
            script: txs[i + 1].outputs[0].script.toBuffer().toString('hex'),
            satoshis: 100000,
        });

        tx2.to(wallets[i], 100000);
    }
    let sumupFees = 0;
    for(let i = 0;i < txs.length;i ++) 
        sumupFees = sumupFees + (txs[i]._inputAmount - txs[i]._outputAmount);
    console.log("SumupFees:", sumupFees);
    if(AIRDROP_BONUS_FEE_LIST[level] !== 0 && AIRDROP_BONUS_FEE_LIST[level] * 100000000 * wallets.length - sumupFees > 0) tx2.to(FEE_STORE_WALLET_ADDRESS, AIRDROP_BONUS_FEE_LIST[level] * 100000000 * wallets.length - sumupFees);

    fund(privkey, utxos, address, tx2);
    // console.log(tx2);
    utxos = _updateUTXOs(utxos, address, tx2);
    txs.push(tx2)
    return txs;
};

const _sendInscriptionTransfer = async (privkey, utxos, wallets, tokenName, tokenAmount, level) => {
    // console.log("UTXOS", utxos);
    const inscriptionData = createInscriptionData(tokenName, tokenAmount);
    const address = getPublicAddress(privkey);
    let hexPrivateKey;
    let txs;
  
    if (isMnemonic(privkey)) hexPrivateKey = mnemonicToPrivateKey(privkey);
    else hexPrivateKey = privkey;
  
    // console.log("inscription", inscriptionData);
    try {    
        txs = _createAirdropDRC20TransferInscription(
            hexPrivateKey,
            utxos,
            address,
            wallets,
            inscriptionData.contentType,
            inscriptionData.data,
            level
        );
        // console.log(txs[0].hash);
        // console.log(txs[1].hash);
        console.log("Transactions:", txs);
    
        const result = await broadcastAll(txs);
        // const result = true;
        if (result === false) return { success: false, txids: txs.map((tx) => tx.hash) };
        return { success: true, txids: txs.map((tx) => tx.hash) };
    } catch (err) {
        console.log("Error:", err.message);
        return { success: false };
    }
};

const sendAirdropDRC20s = async (adminAddress, adminPrivateKey, wallets, tokenName, walletPerToken, level) => {
    const result = await getUTXOs(adminAddress);
    if(result.success === true) {
        const utxos = convertUTXOData(result.utxos);
        // console.log(utxos);
        return await _sendInscriptionTransfer(adminPrivateKey, utxos, wallets, tokenName, walletPerToken, level);
    }
    return {success: false};
}

const _createAirdropNFTTransaction = async (privkey, utxos, address, wallets, inscriptions, level) => {
    let txs = [];
    let tx = new Transaction();
    const result_temp = await getUTXOs(address, true);
    // console.log("RESULT:", result_temp);
    // console.log("inscription", inscriptions);
    for(let i = 0;i < wallets.length;i ++)  {
        const nftUTXO = result_temp.utxos.find(
            (utxo) => utxo.inscriptions.length && utxo.inscriptions[0].inscription_id === inscriptions[i]
        );
        // console.log("NFTUTXO:", nftUTXO);
        const restructuredUTXO = {
            txid: nftUTXO.txid,
            vout: nftUTXO.vout,
            script: nftUTXO.script_pubkey,
            satoshis: parseInt(nftUTXO.satoshis),
        };
        // console.log("RESTRUCTURE", restructuredUTXO);
        tx.from(restructuredUTXO);
        tx.to(wallets[i], 100000);  

    }

    let sumupFees = 0;
    for(let i = 0;i < txs.length;i ++)
        sumupFees = sumupFees + (txs[i]._inputAmount - txs[i]._outputAmount);
    console.log("SumupFees:", sumupFees);
    if(AIRDROP_BONUS_FEE_LIST[level] !== 0 && AIRDROP_BONUS_FEE_LIST[level] * 100000000 * wallets.length - sumupFees > 0) tx.to(FEE_STORE_WALLET_ADDRESS, AIRDROP_BONUS_FEE_LIST[level] * 100000000 * wallets.length - sumupFees);
    
    fund(privkey, utxos, address, tx);
    txs.push(tx);

    return txs;
};

const _sendNFTTransfer = async (privkey, utxos, wallets, inscriptions, level) => {
    const address = getPublicAddress(privkey);
    let hexPrivateKey;
    let txs;
  
    if (isMnemonic(privkey)) hexPrivateKey = mnemonicToPrivateKey(privkey);
    else hexPrivateKey = privkey;

    try {
        txs = await _createAirdropNFTTransaction(hexPrivateKey, utxos, address, wallets, inscriptions, level);
        // console.log("txs", txs);
        const result = await broadcastAll(txs);
        // const result = true;
        if (result === false) return { success: false, txids: txs.map((tx) => tx.hash) };
        return { success: true, txids: txs.map((tx) => tx.hash) };
    } catch (err) {
        console.log("Error:", err.message);
        return { success: false };
    }
};

const sendAirdropNFTs = async (adminAddress, adminPrivateKey, wallets, inscriptions, level) => {
    const result = await getUTXOs(adminAddress);
    if(result.success === true) {
        const utxos = convertUTXOData(result.utxos);
        // console.log(utxos);
        return await _sendNFTTransfer(adminPrivateKey, utxos, wallets, inscriptions, level);
    }
    return {success: false};
}

export {
    sendAirdropDRC20s,
    sendAirdropNFTs,
    getLevelOfUser
}