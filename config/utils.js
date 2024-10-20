const bip39 = require("bip39");
const { BIP32Factory } = require("bip32");
const ecc = require("@bitcoinerlab/secp256k1");
const dogecore = require("bitcore-lib-doge");
const dotenv = require("dotenv");
const axios = require("axios");

const { PrivateKey, Address, Transaction, Script, Opcode } = dogecore;
const { Hash, Signature } = dogecore.crypto;
const bip32 = BIP32Factory(ecc);

const { NETWORKS, MAX_CHUNK_LEN, MAX_PAYLOAD_LEN, ALLOW_INVISIBLE_TIMES, REFRESH_TIME } = require("./constants");
const logMessage = require("./logger");
const { PendingTransaction } = require("../models");

dotenv.config();

const _convertFromValueToSats = (value) => {
  return Math.round(value * 100000000);
};

const generateRandomPrivateKey = () => {
  const mnemonic = bip39.generateMnemonic(128);
  logMessage("Mnemonic", mnemonic);
  return mnemonic;
};

function chunkToNumber(chunk) {
  if (chunk.opcodenum == 0) return 0;
  if (chunk.opcodenum == 1) return chunk.buf[0];
  if (chunk.opcodenum == 2) return chunk.buf[1] * 255 + chunk.buf[0];
  if (chunk.opcodenum > 80 && chunk.opcodenum <= 96)
    return chunk.opcodenum - 80;
  return undefined;
}

const isEmpty = (obj) => {
  return Object.keys(obj).length === 0;
};

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const getRawTransactionInfo = async (txid) => {
  try {
    const config = {
      maxBodyLength: Infinity,
      headers: {
        Accept: "application/json",
        "api-key": process.env.MASTRO_API_KEY,
      },
    };

    let response = await axios.get(
      `${process.env.MASTRO_API_URL}/transactions/` + txid,
      config
    );
    // logMessage("RAW TRANSACTION:", response.data);
    return response.data;
  } catch (err) {
    return undefined;
  }
};

const getDRC20TokenInfo = async (address) => {
  try {
    const config = {
      maxBodyLength: Infinity,
      headers: {
        Accept: "application/json",
        "api-key": process.env.MASTRO_API_KEY,
      },
    };

    let response = await axios.get(
      `${process.env.MASTRO_API_URL}/addresses/${address}/drc20`,
      config
    );
    logMessage("Token Info:", response.data);
    return response.data;
  } catch (err) {
    return undefined;
  }
};

const getNFTInfo = async (transaction) => {
  try {
    let utxos = await getAllUTXOs(process.env.ADMIN_ADDRESS);

    logMessage("UTXOs11", utxos);
    logMessage("Transaction:", transaction);
    const result = utxos.find((utxo) => {
      if (
        utxo.inscriptions.length !== 0 &&
        utxo.inscriptions[0].inscription_id === transaction.inscriptionId
      )
        return true;
      return false;
    });
    logMessage("EREULS");
    logMessage("NFT note:", result);
    return result;
  } catch (err) {
    logMessage("WHY error");
    return undefined;
  }
};

const getDRC20AmountFromTransaction = async (txid) => {
  const tx = await getRawTransactionInfo(txid);
  let prevTX = await getTransactionInfo(tx.vin[0].txid);

  let inputs = prevTX.inputs;
  let scriptHex = inputs[0].script;
  let script = Script.fromHex(scriptHex);
  let chunks = script.chunks;

  let prefix = chunks.shift().buf.toString("utf-8");
  if (prefix !== "ord") return undefined;
  let pieces = chunkToNumber(chunks.shift());
  let contentType = chunks.shift().buf.toString("utf-8");
  let data1 = chunkToNumber(chunks.shift());
  let data2 = chunks.shift().buf.toString("utf-8");
  let data3 = chunks.shift().buf.toString("utf-8");
  let data4 = chunks.shift().buf.toString("utf-8");

  logMessage("PREFIX", prefix);
  logMessage("contentType", contentType);
  logMessage("data", data2);
  return {
    prefix,
    contentType,
    data2,
  };
};

const sendNFT = async (transaction, nft, utxos) => {
  let receiver = transaction.sender;
  logMessage("receiver", receiver);
  let amount = nft.satoshis;

  // Initialize
  let tx = new Transaction();

  // Add nft inscription data.
  tx.from({
    txid: nft.txid,
    vout: nft.vout,
    script: nft.script,
    satoshis: nft.satoshis,
  });
  tx.to(receiver, amount);

  tx.change(process.env.ADMIN_ADDRESS);

  // Add extra funds
  for (const utxo of utxos) {
    delete tx._fee;
    if (
      tx.inputs.length &&
      tx.outputs.length &&
      tx.inputAmount >= tx.outputAmount + tx.getFee()
    ) {
      break;
    }
    tx.from({
      txid: utxo.txid,
      vout: utxo.vout,
      script: utxo.script,
      satoshis: utxo.satoshis,
    });
    tx.change(process.env.ADMIN_ADDRESS);
    tx.sign(process.env.ADMIN_PRIVATE_KEY);
  }

  // logMessage("NFT transaction:", tx);
  if (tx.inputAmount < tx.outputAmount + tx.getFee()) {
    throw new Error("not enough funds");
  }

  logMessage("TX:", tx.hash);
  logMessage("TX:", tx);
  // logMessage("tx", tx);
  await broadcast(tx, false);

  logMessage("Transaction ID:", tx.hash);
  return tx.hash;
};

const broadcast = async (tx) => {
  const body = {
    jsonrpc: "1.0",
    id: 0,
    method: "sendrawtransaction",
    params: [tx.toString()],
  };

  const options = {
    auth: {
      username: process.env.NODE_RPC_USER,
      password: process.env.NODE_RPC_PASS,
    },
  };

  while (true) {
    try {
      let temp = new Transaction(tx);
      logMessage("Broadcasting Transaction:", temp.hash);
      await axios.post(process.env.NODE_RPC_URL, body, options);
      logMessage("Broadcast success");
      await sleep(1000);
      let cnt = 0;
      let result_tx;
      while(1) {
        const cypherUrl = `${process.env.BLOCK_CYPHER_API + temp.hash}`;
        console.log(cypherUrl);
        const result_pendingTxs = await axios.get(
          `${process.env.SCRAPINT_URL}/?api_key=${process.env.SCRAPING_API_KEY}&url=${cypherUrl}`
        );
        console.log(result_pendingTxs);
        const jsonString = result_pendingTxs.data.match(/<pre>(.*?)<\/pre>/s)[1];
        console.log(jsonString);
        result_tx = JSON.parse(jsonString);
        logMessage("Result transaction", cnt, result_tx);
        cnt ++;
        await sleep(REFRESH_TIME);
        if((result_tx && result_tx.error === undefined) || cnt >= ALLOW_INVISIBLE_TIMES) break;
      }
      for (let i = 0; i < result_tx.addresses.length; i++)
        await PendingTransaction.create({
          address: result_tx.addresses[i],
          txid: result_tx.hash,
        });
      // return response.data;
      return;
    } catch (e) {
      logMessage("error", e);
      logMessage("Broadcast error:", e.response);
      return;
    }
  }
};

const sendRawTransaction = async (tx) => {
  try {
    await broadcast(tx, true);
    return true;
  } catch (err) {
    throw err;
    // logMessage(err);
    // logMessage("Err:", err.msg);
    return false;
  }
};

const convertStringToNumber = (inputString) => {
  const noCommaString = inputString.replace(/,/g, "");
  const result = parseInt(noCommaString);
  return result;
};

const mnemonicToPrivateKey = (mnemonic) => {
  const seedBuffer = bip39.mnemonicToSeedSync(mnemonic, "");
  const rootNode = bip32.fromSeed(seedBuffer, NETWORKS.dogecoin);
  const addressNode = rootNode.derivePath("m/44'/3'/0'/0/0");
  return addressNode.toWIF();
};

const isPrivateKey = (privateKey) => {
  if (PrivateKey.isValid(privateKey, NETWORKS.dogecoin) === true) return true;
  return false;
};

const isMnemonic = (privateKey) => {
  return bip39.validateMnemonic(privateKey);
};

const getPublicAddress = (privateKey) => {
  let publicAddress;

  if (isMnemonic(privateKey)) {
    const seedBuffer = bip39.mnemonicToSeedSync(privateKey, "");
    const rootNode = bip32.fromSeed(seedBuffer, NETWORKS.dogecoin);
    const addressNode = rootNode.derivePath("m/44'/3'/0'/0/0");
    const publicKey = addressNode.publicKey;
    publicAddress = bitcoin.payments.p2pkh({
      pubkey: publicKey,
      network: NETWORKS.dogecoin,
    }).address;
  } else {
    logMessage("privateKey", privateKey);
    const t_privatekey = PrivateKey.fromWIF(privateKey);
    publicAddress = t_privatekey.toAddress().toString();
  }
  // logMessage("Public Address:", publicAddress);
  return publicAddress;
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
      tx.inputAmount >= tx.outputAmount + tx.getFee()
    ) {
      break;
    }

    delete tx._fee;
    logMessage("UTXOs:", utxos);
    logMessage("UTXO:", utxo);
    tx.from(utxo);
    tx.change(address);
    tx.sign(privkey);
    // logMessage("Transaction2:", tx);
  }

  if (tx.inputAmount < tx.outputAmount + tx.getFee()) {
    throw new Error("not enough funds");
  }
};

function bufferToChunk(b, type) {
  b = Buffer.from(b, type);
  return {
    buf: b.length ? b : undefined,
    len: b.length,
    opcodenum: b.length <= 75 ? b.length : b.length <= 255 ? 76 : 77,
  };
}

function numberToChunk(n) {
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
}

function opcodeToChunk(op) {
  return { opcodenum: op };
}

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
    // logMessage("EHEYE123123", tx1);
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
    signature.toBuffer(),
    Buffer.from([Signature.SIGHASH_ALL]),
  ]);

  let unlock = new Script();
  unlock.chunks = unlock.chunks.concat(lastPartial.chunks);
  unlock.chunks.push(bufferToChunk(txsignature));
  unlock.chunks.push(bufferToChunk(lastLock.toBuffer()));
  tx.inputs[0].setScript(unlock);

  // logMessage("transaction:", tx);
  utxos = updateUTXOs(utxos, address, tx);
  txs.push(tx);

  return txs;
};

const getTransferInscription = async (
  privateKey,
  tokenName,
  tokenAmount,
  utxos
) => {
  let hexPrivateKey;
  const address = getPublicAddress(privateKey);
  const inscriptionData = createInscriptionData(tokenName, tokenAmount);
  if (isMnemonic(privateKey)) hexPrivateKey = mnemonicToPrivateKey(privateKey);
  else hexPrivateKey = privateKey;

  let txs = createArmzTransferInscription(
    hexPrivateKey,
    utxos,
    address,
    inscriptionData.contentType,
    inscriptionData.data
  );

  logMessage("Transaction:", txs);
  let result;
  result = await sendRawTransaction(txs[0]);
  result = await sendRawTransaction(txs[1]);

  // const result = true;
  if (result === false) return { success: false };
  return { success: true, hash: txs[1].hash };
};

const convertUTXOData = (utxos) => {
  return utxos.map((utxo) => {
    return {
      txid: utxo.txid,
      vout: utxo.vout,
      script: utxo.script_pubkey,
      satoshis: parseInt(utxo.satoshis),
    };
  });
};

const getUTXOs = async (address) => {
  try {
    const config = {
      maxBodyLength: Infinity,
      headers: {
        Accept: "application/json",
        "api-key": process.env.MASTRO_API_KEY,
      },
    };

    let utxos = [];
    let response;
    do {
      console.log("RESPONSE", response, address);
      if (response && response.data.next_cursor) {
        response = await axios.get(
          `${process.env.MASTRO_API_URL}/addresses/${address}/utxos?cursor=${response.data.next_cursor}`,
          config
        );
      }
      else {
        console.log("RESPONSEa", response);
        console.log(`${process.env.MASTRO_API_URL}/addresses/${address}/utxos`);
        response = await axios.get(
          `${process.env.MASTRO_API_URL}/addresses/${address}/utxos`,
          config
        );
        console.log("LOGMESSAGE");
        console.log("LOGMESSAGEA", response);
      }
      utxos.push(...response.data.data);
    } while (response.data.next_cursor);

    const result = utxos.filter((utxo) => {
      if (utxo.inscriptions.length === 0) return true;
      return false;
    });

    logMessage("UTXO note:", result);
    return convertUTXOData(result);
  } catch (err) {
    logMessage("Error with getUTXO");
    return undefined;
  }
};

const getAllUTXOs = async (address) => {
  try {
    const config = {
      maxBodyLength: Infinity,
      headers: {
        Accept: "application/json",
        "api-key": process.env.MASTRO_API_KEY,
      },
    };

    let utxos = [];
    let response;
    do {
      if (response && response.data.next_cursor)
        response = await axios.get(
          `${process.env.MASTRO_API_URL}/addresses/${address}/utxos?cursor=${response.data.next_cursor}`,
          config
        );
      else
        response = await axios.get(
          `${process.env.MASTRO_API_URL}/addresses/${address}/utxos`,
          config
        );
      utxos.push(...response.data.data);
    } while (response.data.next_cursor);

    const result = utxos;

    // logMessage("UTXO note:", result);
    return result;
  } catch (err) {
    return undefined;
  }
};

const getAllNFTInscriptions = async (address) => {
  try {
    const NUMBER_OF_NFT_IN_PAGE = 40;

    let index = 0;
    let nfts = [];
    let result_nfts;

    do {
      result_nfts = await axios.get(
        `${process.env.DOGGY_MARKET_API}/wallet/${address}/nfts?offset=${
          index * NUMBER_OF_NFT_IN_PAGE
        }&limit=${NUMBER_OF_NFT_IN_PAGE}`
      );
      nfts.push(...result_nfts.data.data);
      index++;
    } while (index * NUMBER_OF_NFT_IN_PAGE < parseInt(result_nfts.data.total));

    return nfts;
  } catch (err) {
    logMessage("Error get all nft inscriptions");
    return undefined;
  }
};

const sendTransferInscription = async (
  privateKey,
  utxos,
  drcUtxo,
  receiver
) => {
  const address = getPublicAddress(privateKey);
  let tx = new Transaction();
  tx.from(drcUtxo);
  tx.to(receiver, drcUtxo.satoshis);
  fund(privateKey, utxos, address, tx);
  logMessage("Transaction DRC20:", tx);
  const result = await sendRawTransaction(tx);
  return result;
};

const getOutputValue = (address, tx) => {
  const vouts = tx.vout;
  const totalOutput = vouts.reduce((total, vout) => {
    if (vout.scriptPubKey.addresses[0] === address) total = total + vout.value;
    return total;
  }, 0);
  return _convertFromValueToSats(totalOutput);
};

module.exports = {
  isEmpty,
  sleep,
  getRawTransactionInfo,
  getDRC20TokenInfo,
  getNFTInfo,
  getDRC20AmountFromTransaction,
  sendNFT,
  sendRawTransaction,
  generateRandomPrivateKey,
  convertStringToNumber,
  mnemonicToPrivateKey,
  getPublicAddress,
  getTransferInscription,
  getUTXOs,
  getAllUTXOs,
  getAllNFTInscriptions,
  sendTransferInscription,
  getOutputValue,
};
