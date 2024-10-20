import axios from "axios";
import dogecore from "bitcore-lib-doge";

import {
  MASTRO_API_KEY,
  MASTRO_API_URL,
  MAX_CHUNK_LEN,
  MAX_PAYLOAD_LEN,
  SERVER_URL,
} from "../config/constants";
import {
  getPublicAddress,
  isMnemonic,
  mnemonicToPrivateKey,
} from "../config/utils";

const { PrivateKey, Address, Transaction, Script, Opcode } = dogecore;
const { Hash, Signature } = dogecore.crypto;

const stringToDogecoin = (str) => {
  return parseInt(str) / 100000000;
};

const getWalletInfo = (address) => {
  return new Promise(async (resolve, reject) => {
    const config = {
      maxBodyLength: Infinity,
      headers: {
        Accept: "application/json",
        "api-key": MASTRO_API_KEY,
      },
    };

    try {
      // Get the utxos
      const result = await getUTXOs(address, true);
      const utxos = result.utxos;

      // Loop from 0 ~ n-1
      let i;
      let balance = 0;
      let UTXOs = [];
      let Tokens = [];
      let NFTs = [];

      // Get the UTXOs
      for (i = 0; i < utxos.length; i++) {
        const utxo = utxos[i];
        if (utxo.inscriptions.length === 0) {
          balance += stringToDogecoin(utxo.satoshis);
          UTXOs.push({
            txid: utxo.txid,
            satoshis: parseInt(utxo.satoshis),
            vout: utxo.vout,
            script: utxo.script_pubkey,
          });
          continue;
        }
      }

      // Get the Tokens data
      const drc20_result = await axios.get(
        `${MASTRO_API_URL}/addresses/${address}/drc20`,
        config
      );
      const t_drc20Data = drc20_result.data.data;
      const t_drc20Name = Object.keys(t_drc20Data);
      for(i = 0;i < t_drc20Name.length;i ++) {
        const result_drc20_image = await axios.get(`${SERVER_URL}/api/information/drc20s/${t_drc20Name[i]}/image`);
        Tokens.push({
          tick: t_drc20Name[i],
          image: result_drc20_image.data.data,
          ...t_drc20Data[t_drc20Name[i]]
        });
      }

      // Get the NFTs
      const nft_result = await axios.get(`${SERVER_URL}/api/information/${address}/nfts`);
      NFTs = nft_result.data.data.nfts;
      
      console.log("Balance:", balance);
      console.log("UTXOs", UTXOs);
      console.log("NFTs:", NFTs);
      console.log("Tokens: ", Tokens);

      resolve({ balance: balance, utxos: UTXOs, nfts: NFTs, tokens: Tokens });
    } catch (err) {
      console.log(err);
      console.log("Get wallet info err");
      if(err.message === "Request failed with status code 404") {
        resolve({ balance: 0, utxos: [], nfts: [], tokens: [] })
      }
      reject(err);
    }
  });
};

const getUTXOs = async (address, isWithInscription) => {
  const config = {
    maxBodyLength: Infinity,
    headers: {
      Accept: "application/json",
      "api-key": MASTRO_API_KEY,
    },
  };

  try {
    // Get the utxos
    let utxos = [];
    let response;
    do {
      if(response && response.data.next_cursor) response = await axios.get(`${MASTRO_API_URL}/addresses/${address}/utxos?cursor=${response.data.next_cursor}`, config);
      else response = await axios.get(`${MASTRO_API_URL}/addresses/${address}/utxos`, config);
      utxos.push(...response.data.data);
    } while(response.data.next_cursor);

    if (isWithInscription) {
      return { scucess: true, utxos: utxos };
    } else {
      const onlyUTXOs = utxos.filter((utxo) => {
        if (utxo.inscriptions.length) return false;
        return true;
      });
      return { success: true, utxos: onlyUTXOs };
    }
  } catch (err) {
    console.log(err);
    console.log("Get wallet info err");
    // reject(err);
    return { success: false, utxos: [] };
  }
};

const updateUTXOs = (utxos, address, tx) => {
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
    if (output.script.toAddress().toString() == address) {
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

const fund = (privkey, utxos, address, tx) => {
  tx.change(address);
  delete tx._fee;

  for (const utxo of utxos) {
    if (
      tx.inputs.length &&
      tx.outputs.length &&
      tx.inputAmount > tx.outputAmount + tx.getFee()
    ) {
      break;
    }

    delete tx._fee;
    // console.log(utxo);
    tx.from(utxo);
    // console.log("Transaction:", tx);
    tx.change(address);
    // console.log("Transaction:", tx);
    // console.log("Priv", privkey);
    // tx.sign(privkey);
    signTransaction(privkey, tx);
  }

  if (tx.inputAmount < tx.outputAmount + tx.getFee()) {
    throw new Error("not enough funds");
  }
};

const createInscriptionData = (tokenName, tokenAmount) => {
  const contentType = "text/plain;charset=utf-8";

  const doge20Tx = {
    p: "drc-20",
    op: "transfer",
    tick: `${tokenName.toLowerCase()}`,
    amt: `${tokenAmount}`,
  };
  const parsedDoge20Tx = JSON.stringify(doge20Tx);
  const encodedDoge20Tx = Buffer.from(parsedDoge20Tx).toString("hex");
  const bufferDoge20Tx = Buffer.from(encodedDoge20Tx, "hex");
  return { contentType: contentType, data: bufferDoge20Tx };
};

const bufferToChunk = (b, type) => {
  b = Buffer.from(b, type);
  return {
    buf: b.length ? b : undefined,
    len: b.length,
    opcodenum: b.length <= 75 ? b.length : b.length <= 255 ? 76 : 77,
  };
};

const numberToChunk = (n) => {
  return {
    buf:
      n <= 16
        ? undefined
        : n < 128
        ? Buffer.from([n])
        : Buffer.from([n % 256, n / 256]),
    len: n <= 16 ? 0 : n < 128 ? 1 : 2,
    opcodenum: n == 0 ? 0 : n <= 16 ? 80 + n : n < 128 ? 1 : 2,
  };
};

const opcodeToChunk = (op) => {
  return { opcodenum: op };
};

const hasAllUtxoInfo = (transaction) => {
  return transaction.inputs.every(function (input) {
    return !!input.output;
  });
};

const getSignatures = (privKey, sigtype, signingMethod, transaction) => {
  // console.log("PRIVKEY", privKey);
  privKey = new PrivateKey(privKey);
  sigtype = sigtype || Signature.SIGHASH_ALL;
  const results = [];
  const hashData = Hash.sha256ripemd160(privKey.publicKey.toBuffer());
  for (let index = 0; index < transaction.inputs.length; index++) {
    const input = transaction.inputs[index];
    // console.log("getsignatures", input.getSignatures);
    if (input.getSignatures === undefined) continue;
    for (const signature of input.getSignatures(
      transaction,
      privKey,
      index,
      sigtype,
      hashData,
      signingMethod
    )) {
      results.push(signature);
    }
  }
  return results;
};

const applySignature = (signature, signingMethod, transaction) => {
  addSignature(
    transaction,
    signature,
    transaction.inputs[signature.inputIndex]
  );
  return transaction;
};

const signTransaction = (privateKey, transaction, sigtype, signingMethod) => {
  if (!hasAllUtxoInfo(transaction)) {
    console.log(
      "Not all utxo information is available to sign the transaction."
    );
    return;
  }
  // if (Array.isArray(privateKey)) {
  //    for (const pk of privateKey) {
  //         this.sign(pk, sigtype, signingMethod);
  //     }
  //     return this;
  // }
  for (const signature of getSignatures(
    privateKey,
    sigtype,
    signingMethod,
    transaction
  )) {
    applySignature(signature, signingMethod, transaction);
  }
  return transaction;
};

const createArmzTransferInscription = (
  privkey,
  utxos,
  address,
  contentType,
  data
) => {
  let txs = [];

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
    let tx = new Transaction();
    if (p2shInput) tx.addInput(p2shInput);
    tx.addOutput(p2shOutput);
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

    utxos = updateUTXOs(utxos, address, tx);
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

  let tx = new Transaction();
  tx.addInput(p2shInput);
  tx.to(address, 100000);
  fund(privkey, utxos, address, tx);

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

  // console.log("transaction:", tx);
  utxos = updateUTXOs(utxos, address, tx);
  txs.push(tx);

  return txs;
};

const assert = (val, msg) => {
  if (!val) throw new Error(msg || "Assertion failed");
};

const toBufferSignature = (signature) => {
  let rnbuf = toBuffer(signature.r);
  let snbuf = toBuffer(signature.s);

  let rneg = rnbuf[0] & 0x80 ? true : false;
  let sneg = snbuf[0] & 0x80 ? true : false;

  let rbuf = rneg ? Buffer.concat([Buffer.from([0x00]), rnbuf]) : rnbuf;
  let sbuf = sneg ? Buffer.concat([Buffer.from([0x00]), snbuf]) : snbuf;

  let rlength = rbuf.length;
  let slength = sbuf.length;
  let length = 2 + rlength + 2 + slength;
  let rheader = 0x02;
  let sheader = 0x02;
  let header = 0x30;

  let der = Buffer.concat([
    Buffer.from([header, length, rheader, rlength]),
    rbuf,
    Buffer.from([sheader, slength]),
    sbuf,
  ]);
  return der;
};

const toBuffer = (bn, endian, length) => {
  assert(typeof Buffer !== "undefined");
  return bn.toArrayLike(Buffer, endian, length);
};

const toDER = (signature) => {
  // console.log("SIGN", signature);
  let rnbuf = toBuffer(signature.r);
  let snbuf = toBuffer(signature.s);

  let rneg = rnbuf[0] & 0x80 ? true : false;
  let sneg = snbuf[0] & 0x80 ? true : false;

  let rbuf = rneg ? Buffer.concat([Buffer.from([0x00]), rnbuf]) : rnbuf;
  let sbuf = sneg ? Buffer.concat([Buffer.from([0x00]), snbuf]) : snbuf;

  let rlength = rbuf.length;
  let slength = sbuf.length;
  let length = 2 + rlength + 2 + slength;
  let rheader = 0x02;
  let sheader = 0x02;
  let header = 0x30;

  let der = Buffer.concat([
    Buffer.from([header, length, rheader, rlength]),
    rbuf,
    Buffer.from([sheader, slength]),
    sbuf,
  ]);
  return der;
};

const addSignature = (transaction, signature, input) => {
  // $.checkState(this.isValidSignature(transaction, signature), 'Signature is invalid');
  if (!input.isValidSignature(transaction, signature)) {
    console.log("Signature is invalid");
    return;
  }

  input.setScript(
    Script.buildPublicKeyHashIn(
      signature.publicKey,
      toDER(signature.signature),
      signature.sigtype
    )
  );

  return this;
};

const broadcast = async (tx) => {
  try {
    const data = {
      txs: [tx.toString()],
    };
    // console.log("DATA", data.txs[0]);
    const result = await axios.post(
      `${SERVER_URL}/api/transaction/broadcast`,
      data
    );
    console.log("result", result);
    if (result.data.isSuccess === true) return true;
    return false;
  } catch (e) {
    console.log("Failed");
    return false;
  }
};

const broadcastAll = async (txs) => {
  try {
    const data = {
      txs: txs.map((tx1) => tx1.toString()),
    };
    // console.log("DATA", data.txs[0]);
    const result = await axios.post(
      `${SERVER_URL}/api/transaction/broadcast`,
      data
    );
    console.log("result", result);
    if (result.data.isSuccess === true) return true;
    return false;
  } catch (e) {
    console.log("Failed");
    return false;
  }
};

const inscriptionTransfer = async (privkey, utxos, tokenName, tokenAmount) => {
  // console.log("UTXOS", utxos);
  const inscriptionData = createInscriptionData(tokenName, tokenAmount);
  const address = getPublicAddress(privkey);
  let hexPrivateKey;

  if (isMnemonic(privkey)) hexPrivateKey = mnemonicToPrivateKey(privkey);
  else hexPrivateKey = privkey;

  let txs = createArmzTransferInscription(
    hexPrivateKey,
    utxos,
    address,
    inscriptionData.contentType,
    inscriptionData.data
  );
  console.log("Transactions:", txs);
  // console.log(txs[0].hash);
  // console.log(txs[1].hash);

  const result = await broadcastAll(txs);
  // const result = true;
  if (result === false) return { success: false };
  return { success: true, hash: txs[1].hash };
};

const getTransactionInfo = async (txid) => {
  try {
    const config = {
      maxBodyLength: Infinity,
      headers: {
        Accept: "application/json",
        "api-key": MASTRO_API_KEY,
      },
    };
    const result = await axios.get(
      `${MASTRO_API_URL}/transactions/` + txid,
      config
    );
    console.log("Result:", result.data);
    return result;
  } catch (err) {
    return undefined;
  }
};

const createDRC20TransferTransaction = (privkey, utxos, drcUtxo, receiver, isForMultisigWallet) => {
  const address = getPublicAddress(privkey);
  let tx = new Transaction();
  tx.from(drcUtxo);
  tx.to(receiver, drcUtxo.satoshis);
  if(isForMultisigWallet) tx.to(receiver, 100000000);
  fund(privkey, utxos, address, tx);
  return tx;
};

const sendDRC20Inscription = async (privkey, utxos, drcUtxo, receiver, isForMultisigWallet) => {
  // console.log("UTXOS", utxos);
  // const inscriptionData = createInscriptionData(tokenName, tokenAmount);
  const address = getPublicAddress(privkey);
  let hexPrivateKey;

  if (isMnemonic(privkey)) hexPrivateKey = mnemonicToPrivateKey(privkey);
  else hexPrivateKey = privkey;

  let tx = createDRC20TransferTransaction(
    hexPrivateKey,
    utxos,
    drcUtxo,
    receiver,
    isForMultisigWallet
  );
  console.log("Transaction DRC20:", tx);

  const result = await broadcast(tx);
  // const result = true;
  if (result === false) return { success: false };
  return { success: true, hash: tx.hash };
};

const createDogeSendTransaction = (privkey, utxos, satoshis, receiver) => {
  const address = getPublicAddress(privkey);
  let tx = new Transaction();
  tx.to(receiver, satoshis);
  // tx.to(receiver, 100000000);
  fund(privkey, utxos, address, tx);
  return tx;
};

const sendDoge = async (privkey, utxos, amount, receiver) => {
  // console.log("UTXOS", utxos);
  // const inscriptionData = createInscriptionData(tokenName, tokenAmount);
  const satoshis = 100000000 * amount;

  let hexPrivateKey;
  if (isMnemonic(privkey)) hexPrivateKey = mnemonicToPrivateKey(privkey);
  else hexPrivateKey = privkey;

  let tx = createDogeSendTransaction(
    hexPrivateKey,
    utxos,
    satoshis,
    receiver
  );
  console.log("Transaction DRC20:", tx);
  
  const result = await broadcast(tx);
  // const result = true;
  if (result === false) return { success: false };
  return { success: true, hash: tx.hash };
};

const createNFTSendTransaction = (privkey, utxos, nftUTXO, receiver, isForMultisigWallet) => {
  const address = getPublicAddress(privkey);
  let tx = new Transaction();
  tx.from(nftUTXO);
  tx.to(receiver, nftUTXO.satoshis);
  if(isForMultisigWallet) tx.to(receiver, 100000000);
  fund(privkey, utxos, address, tx);
  return tx;
};

const sendNFT = async (privkey, utxos, nftUTXO, receiver, isForMultisigWallet) => {

  let hexPrivateKey;
  if (isMnemonic(privkey)) hexPrivateKey = mnemonicToPrivateKey(privkey);
  else hexPrivateKey = privkey;

  let tx = createNFTSendTransaction(
    hexPrivateKey,
    utxos,
    nftUTXO,
    receiver,
    isForMultisigWallet
  );
  console.log("Transaction NFT:", tx);
  
  const result = await broadcast(tx);
  // const result = true;
  if (result === false) return { success: false };
  return { success: true, hash: tx.hash };
};

const getDRC20UTXOs = async (address, tick) => {
  try {
    const result_drc20Utxos = await axios.get(`${SERVER_URL}/api/information/${address}/drc20s/${tick}`);
    return result_drc20Utxos.data.data.drc20s;
  } catch (err) {
    console.log("Get drc20 utxos error");
    return [];
  }
}

const getTransactions = async (address, cursor) => {
  let txs;
  if(cursor) txs = await axios.get(`${SERVER_URL}/api/information/${address}/txs?cursor=${cursor}`);
  else txs = await axios.get(`${SERVER_URL}/api/information/${address}/txs`);
  return txs.data.data;
}

export {
  getWalletInfo,
  inscriptionTransfer,
  broadcastAll,
  getTransactionInfo,
  sendDRC20Inscription,
  getUTXOs,
  getDRC20UTXOs,
  sendDoge,
  sendNFT,
  getTransactions,
  updateUTXOs,
  toBufferSignature,
  fund,
  bufferToChunk,
  numberToChunk,
  opcodeToChunk,
  createInscriptionData
};
