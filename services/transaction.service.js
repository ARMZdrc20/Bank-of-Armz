const axios = require("axios");
const dotenv = require("dotenv");

const {
  getRawTransactionInfo,
  getDRC20TokenInfo,
  getNFTInfo,
  sleep,
  sendNFT,
  sendRawTransaction,
  generateRandomPrivateKey,
  convertStringToNumber,
  mnemonicToPrivateKey,
  getPublicAddress,
  getTransferInscription,
  getUTXOs,
  sendTransferInscription,
  getAllUTXOs
} = require("../config/utils.js");
const { Transaction, NFT, UTXO } = require("../models");
const { REFRESH_TIME, ALLOW_INVISIBLE_TIMES } = require("../config/constants.js");
const logMessage = require("../config/logger.js");

dotenv.config();

/*
 * Wallet Sync function
 * 1. Get the utxos data
 * 2. Get the nft token
 * 3. Delete from utxos nft token data
 * 4. Update utxos and nfts
 */
const walletSync = async () => {
  let index;
  // NFT own flag to the false
  await NFT.updateMany({}, {$set: { own: false }});

  // Get all utxos
  const utxos = await getAllUTXOs(process.env.ADMIN_ADDRESS);
  // logMessage("UTXOs", utxos);

  const onlyUTXOs = [];

  for (index = 0; index < utxos.length; index++) {
    const utxo = utxos[index];
    if(utxo.inscriptions.length === 0) onlyUTXOs.push({ txid: utxo.txid, vout: utxo.vout, script: utxo.script_pubkey, satoshis: utxo.satoshis });
    else {
      const inscriptionId = utxo.inscriptions[0].inscription_id;
      const nft = await NFT.findOne({inscriptionId: inscriptionId});
      if(nft) {
        nft.own = true;
        nft.status = "general";
        nft.txid = utxo.txid;
        nft.vout = utxo.vout;
        nft.script = utxo.script_pubkey;
        nft.satoshis = utxo.satoshis;
        await nft.save();
      }
    }
  }

  // Add to the utxo
  await UTXO.deleteMany({});
  await UTXO.insertMany(onlyUTXOs);
  logMessage("Wallet Sync Completed!");
}

/*
 * NFT counts still remain in the admin's wallet
 */
const _getRemainedCount = async () => {
  const result = await NFT.aggregate([
    {
      $match: {
        own: true,
        status: "general"  // Only include documents where the 'own' field is true
      }
    },
    {
      $group: {
        _id: "$denomination",  // Group by the 'type' field
        count: { $sum: 1 }  // Count the number of documents in each group
      }
    },
    {
      $project: {
        denomination: "$_id",   // Rename _id to type
        count: 1,       // Include the count field
        _id: 0          // Exclude the original _id field
      }
    },
    {
      $sort: { denomination: -1 }  // Sort by denomination in ascending order
    }
  ]);

  return result;
}

/*
 * The maximum inscriptions that can user's can get when they pay
 */
const getInscriptionList = async (amount) => {
  const remainCount = await _getRemainedCount();
  const realCount = [];
  remainCount.forEach((item) => {
    const denomination = item.denomination;
    const count = Math.min(Math.floor(amount / denomination), item.count);
    amount = amount - count * denomination;
    if(count) realCount.push({denomination, count});
  });

  return {
    isSuccess: true,
    message: "Succeed found",
    data: realCount
  };
}

/*
 * Get specific denomination nft address and inscription id
 */
const getSpecificDenominationNFTAddress = async (denomination) => {
  const nft = await NFT.findOne({ denomination: denomination, own: true, status: "general" });
  if(!nft) {
    return {
      isSuccess: false,
      message: "Not available anymore"
    }
  }
  const address = getPublicAddress(nft.privateKey);
  return {
    isSuccess: true,
    message: "Succeed found",
    data: {
      inscriptionId: nft.inscriptionId,
      address: address,
      denomination: nft.denomination
    }
  }
}

/*
 * New transaction created for swap from armz token to the nft notes.
 */
const swapFromArmzToNFT = async (sender, txid, amount, inscriptionId, address) => {
  // Register to the mongodb
  const transaction = await Transaction.create({
    sender: sender,
    txid: txid,
    amount: amount,
    inscriptionId: inscriptionId,
    address: address,
    type: 1,
  });
  logMessage("Transaction received:", {sender, txid, amount, inscriptionId, address});
  const nft = await NFT.findOne({inscriptionId: inscriptionId});
  nft.status = "pending";
  await nft.save();
  logMessage("NFT make into pending state");

  // Here process the transaction.
  // _processTransaction(transaction);

  return {
    isSuccess: true,
    message: "Sucessful Added!",
    data: transaction,
  };
};

/*
 * New transaction created for swap from nft notes to the armz token.
 */
const swapFromNFTToArmz = async (sender, txid, amount, inscriptionId) => {
  // Register to the mongodb
  const transaction = await Transaction.create({
    sender: sender,
    txid: txid,
    amount: amount,
    inscriptionId: inscriptionId,
    type: 2
  });
  const nft = await NFT.findOne({inscriptionId: inscriptionId});
  nft.status = "pending";
  await nft.save();

  logMessage("NFT make into pending state");
  // Here process the transaction.
  // _processTransactionArmz(transaction);

  // walletSync();
  return {
    isSuccess: true,
    message: "Sucessful Added!",
    data: transaction,
  };
};

/*
 * Transaction Failed Message
 */
const _failedTransaction = async (transaction) => {
  transaction.status = "failed";
  await transaction.save();
  logMessage("Transaction Failed");
};

/*
 * Confirm receiving transaction
 * 1. Check NFT ownership
 * 2. Transaction Confirmed
 * 3. Check Armz token ownership
 */
const _confirmReceivingTransaction = async (transaction) => {
  // 1. Check NFT ownership
  logMessage("NFT ownership");
  const nft = await NFT.findOne({ inscriptionId: transaction.inscriptionId, own: true });
  if(!nft || nft.denomination !== transaction.amount) {
    logMessage("This is invalid id!");
    return false;
  }

  // 2. Transaction Confirmed
  let cnt = 0;
  while (1) {
    logMessage("Transaction confirmed?", transaction.txid);
    const tx = await getRawTransactionInfo(transaction.txid);
    if(tx === undefined) {
      cnt ++;
      if(cnt >= ALLOW_INVISIBLE_TIMES) {logMessage("Confirm Receiving Transaction Failed!"); return false;}
    }
    else if (tx.data.confirmations !== undefined) break;
    await sleep(REFRESH_TIME);
  }

  logMessage("Transaction confirmed");
  // 3. Check Armz token ownership
  const drc20s = await getDRC20TokenInfo(getPublicAddress(nft.privateKey));
  logMessage("DRC-20s", drc20s);
  if (!drc20s) { logMessage("DRC20s don't exist"); return false; }
  logMessage("Not sufficent checking");
  if (drc20s.data[process.env.ARMZ_DRC20_TICKER] === undefined || parseInt(drc20s.data[process.env.ARMZ_DRC20_TICKER].available) !== transaction.amount) {
    logMessage("Not sufficient value of armz token."); 
    return true; 
  }

  // 3. Multiply check
  // -----------------------------------------------------------HERE---------------------------------------------------
  // This is the last step
  // ------------------------------------------------------------------------------------------------------------------

  logMessage("Transaction Received Confirmed!");
  return true;
};

/*
 * Confirm receiving transaction
 * 1. Check NFT ownership
 * 2. Transaction Confirmed
 * 3. Check Armz token ownership
 */
const _confirmReceivingTransactionArmz = async (transaction) => {
  // 1. Check NFT ownership
  logMessage("Finding NFT completed");
  const nft = await NFT.findOne({ inscriptionId: transaction.inscriptionId, own: false });
  logMessage("NFT found completed", nft);
  if(!nft || nft.denomination !== transaction.amount) {
    logMessage("This is invalid id!");
    return false;
  }
  logMessage("Receiving completed");

  // 2. Check NFT
  let cnt = 0;
  while (1) {
    logMessage("Trabsaction, Confirmation completed", transaction.txid);
    const tx = await getRawTransactionInfo(transaction.txid);
    if(tx === undefined) {
      cnt ++;
      if(cnt >= ALLOW_INVISIBLE_TIMES) {logMessage("Confirm Receiving Transaction Failed!"); return false;}
    }
    else if (tx.data.confirmations !== undefined) break;
    await sleep(REFRESH_TIME);
  }
  logMessage("Confirm Receiving Transaction Success!");

  // 3. Check Armz token ownership
  const result = await getNFTInfo(transaction);
  if(result === undefined || !result) {
    logMessage("This is invalid id!");
    return false;
  }

  logMessage("Transaction Received Confirmed!");
  return true;
};

// /*
//  * Confirm Amount of transaction
//  * 1. Check that it contains inscription about drc20
//  * 2. Check amount
//  */
// const _confirmAmountReceived = async (transaction) => {
//   // 1. Check that it contains inscription about drc20
//   const inscriptionContent = await getDRC20AmountFromTransaction(
//     transaction.txID
//   );
//   if (inscriptionContent === undefined) return false;

//   // 2. Check amount
//   const inscriptionJSON = JSON.parse(inscriptionContent.data2);
//   logMessage("inscription:", inscriptionJSON);
//   logMessage("TICK", inscriptionJSON["tick"]);
//   if (
//     !(
//       inscriptionJSON["tick"] === process.env.ARMZ_DRC20_TICKER &&
//       parseInt(inscriptionJSON["amt"]) === transaction.amount
//     )
//   )
//     return false;

//   logMessage("Transaction Amount Confirmed!");
//   return true;
// };

/*
 * Set the status of transaction to the confirmed
 */
const _saveTransactionStatusConfirmed = async (transaction) => {
  transaction.status = "confirmed";
  await transaction.save();
  logMessage("Confirmed status saved");
};

const _transferInscription = async (transaction) => {
  const nft = await NFT.findOne({ inscriptionId: transaction.inscriptionId, own: false });
  
  logMessage("Transfer inscription", nft.privateKey);
  const utxos = await getUTXOs(getPublicAddress(nft.privateKey));
  logMessage("get UTXO", utxos);
  logMessage("get UTXO", getPublicAddress(nft.privateKey));
  const result = await getTransferInscription(nft.privateKey, process.env.ARMZ_DRC20_TICKER, nft.denomination, utxos);

  logMessage("Transfer inscription", result);
  if(result.success === false) {
    logMessage("Get transfer inscription failed!");
    return;
  }

  logMessage("Wait inscription");
  let cnt = 0;
  while (1) {
    logMessage("Still Waiting:", result.hash);
    const tx = await getRawTransactionInfo(result.hash);
    if(tx === undefined) {
      cnt ++;
      if(cnt >= REFRESH_TIME) {logMessage("Confirm Receiving Transaction Failed!"); return false;}
    }
    else if (tx.data.confirmations !== undefined) break;
    await sleep(REFRESH_TIME);
  }

  logMessage("Transfer confirmed");
  // 3. Send Transferinscription
  const tutxos = await getUTXOs(getPublicAddress(nft.privateKey));
  const newUtxos = await getAllUTXOs(getPublicAddress(nft.privateKey));
  
  const drcUtxo = newUtxos.find((utxo) => utxo.txid === result.hash);
  const structuredDRCUtxo = {
    txid: drcUtxo.txid,
    vout: 0,
    script: drcUtxo.script_pubkey,
    satoshis: parseInt(drcUtxo.satoshis),
  };
  logMessage("For sending");

  logMessage("Send Transfer inscription now");
  const newTXId = await sendTransferInscription(nft.privateKey, tutxos, structuredDRCUtxo, transaction.sender);
  logMessage("For Sent");
  transaction.spendTxId = newTXId;
  nft.own = true;
  await nft.save();
}

/*
 * Set the status of transaction to the confirmed
 */
const _sendNFTToSender = async (transaction) => {
  // Send NFT to the transaction.sender about tranction.amount
  const nft = await NFT.findOne({ inscriptionId: transaction.inscriptionId });
  // const utxos = await UTXO.find({});
  const utxos = await getUTXOs(process.env.ADMIN_ADDRESS);
  logMessage("UTXOS", utxos);

  const newTXId = await sendNFT(transaction, nft, utxos);
  logMessage("NewTXId:", newTXId);
  
  nft.own = false;
  await nft.save();
  return newTXId;
};

// const _confirmSendingNFTTransaction = async (txId) => {
//   while (1) {
//     const tx = await getRawTransactionInfo(txId);
//     if (tx.confirmations !== undefined) break;
//     sleep(5000);
//   }

//   logMessage("Transaction Received Confirmed!");
//   return true;
// };

/*
 * Set the status of transaction to the completed
 */
const _saveTransactionStatusCompleted = async (transaction) => {
  transaction.status = "completed";
  await transaction.save();
  logMessage("Completed status saved");
};

const updateNFTData = async (transaction) => {
  try {
    const tx = await getRawTransactionInfo(transaction.txid);

    const nft = await NFT.findOne({inscriptionId: transaction.inscriptionId});
    nft.status = "general";
    nft.txid = tx.data.txid;
    nft.vout = 0;
    nft.satoshis = tx.data.vout[0].value * 100000000;
    nft.script = tx.data.vout[0].scriptPubKey.hex;
    await nft.save();
    logMessage("Data is correctly updated", nft);
    return true;
  } catch (err) {
    logMessage("Updating NFT Data failed");
    return false;
  }
}

/*
* process transaction function
* 1. Confirm received transaction
* 3. Set the status confirmed
* 4. Send NFT
* 5. Confirm Sending transaction
* 6. Set the status completed
*/
const processTransaction = async (transaction) => {
  // 1. Confirm recieved transaction
  logMessage("Waiting confirming receiving transaction");
  const resultConfirmReceived = await _confirmReceivingTransaction(transaction);
  if (resultConfirmReceived === false) {
    _failedTransaction(transaction);
    logMessage("Transaction Failed Receiving");
    return;
  }

  // 2. Set the status confirmed
  logMessage("Set the status confirmed");
  await _saveTransactionStatusConfirmed(transaction);

  // 3. Send NFT
  logMessage("Going to send nft to sender");
  const newTXId = await _sendNFTToSender(transaction);
  transaction.spendTxId = newTXId;
  
  // 4. Set the status completed
  logMessage("Going to send nft to sender");
  await _saveTransactionStatusCompleted(transaction);

  // await walletSync();

  // 5. Set the NFT status to the general
  logMessage("Finding a nft");
  const nft = await NFT.findOne({inscriptionId: transaction.inscriptionId});
  nft.status = "general";
  await nft.save();
  logMessage("NFT state to general again.");
};

/*
* process transaction function
* 1. Confirm received transaction
* 3. Set the status confirmed
* 4. Send NFT
* 5. Confirm Sending transaction
* 6. Set the status completed
*/
const processTransactionArmz = async (transaction) => {
  // 1. Confirm recieved transaction
  logMessage("Waiting transaction as confirmed");
  const resultConfirmReceived = await _confirmReceivingTransactionArmz(transaction);
  if (resultConfirmReceived === false) {
    _failedTransaction(transaction);
    logMessage("Transaction Failed Receiving");
    return;
  }

  logMessage("Save transaction as confirmed");
  // 2. Set the status confirmed
  await _saveTransactionStatusConfirmed(transaction);

  logMessage("Transfer inscription");
  // 3. Send NFT
  const newTXId = await _transferInscription(transaction);
  transaction.spendTxId = newTXId;
  await transaction.save();
  
  // 4. Set the status completed
  await _saveTransactionStatusCompleted(transaction);

  // walletSync();

  // 5. Set the NFT status to the general
  await updateNFTData(transaction);
  // const nft = await NFT.findOne({inscriptionId: transaction.inscriptionId});
  // nft.status = "general";
  // await nft.save();
};

const getStatus = async (transactionId) => {
  const transaction = await Transaction.findById(transactionId);
  if (transaction) {
    return {
      isSuccess: true,
      data: {
        id: transaction.id,
        sender: transaction.sender,
        txID: transaction.txID,
        amount: transaction.amount,
        status: transaction.status,
      },
      message: "Successful Found!",
    };
  }
  return {
    isSuccess: false,
    message: "Not found",
  };
};
  
const broadcast = async (txs) => {
  try {
    let i;

    for (i = 0; i < txs.length; i++) {
      const result = await sendRawTransaction(txs[i]);
      if(result === true) {
        logMessage("Broadcast transaction:", result);
      } else {
        logMessage("Err:", txs[i]);
        return {
          isSuccess: false,
          message: "error"
        }
      }
    }
    return {
      isSuccess: true,
      message: "Successfully Broadcast",
    };
  } catch (err) {
    logMessage("Broadcast error");
    return {
      isSuccess: false,
      message: "Broadcast failed"
    }
  }
};

const registerNFTToDatabase = async (nft) => {
  await NFT.create({
    inscriptionId: nft.inscriptionId,
    denomination: convertStringToNumber(nft.attributes.Denomination),
    privateKey: mnemonicToPrivateKey(generateRandomPrivateKey())
  });

  return true;
}

const getValidNFT = async (inscriptionIds) => {
  const arrayIds = [];
  for (let index = 0; index < inscriptionIds.length; index++) {
    const inscriptionId = inscriptionIds[index];
    const nft = await NFT.findOne({inscriptionId: inscriptionId, own: false});
    if(nft) arrayIds.push({ inscriptionId: inscriptionId, publicAddress: getPublicAddress(nft.privateKey), denomination: nft.denomination });
  }
  logMessage("ValidNFT: ", arrayIds);
  return {
    isSuccess: true,
    message: "Successfully Broadcast",
    data: arrayIds
  };
}

module.exports = {
  walletSync,
  getInscriptionList,
  getSpecificDenominationNFTAddress,
  swapFromArmzToNFT,
  swapFromNFTToArmz,
  getStatus,
  broadcast,
  registerNFTToDatabase,
  getValidNFT,
  processTransaction,
  processTransactionArmz
};
