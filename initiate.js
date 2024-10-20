const mongoose = require("mongoose");
const dotenv = require("dotenv");
const inscriptions = require("./inscription.json");

const {
  walletSync,
  registerNFTToDatabase,
} = require("./services/transaction.service");
const { generateRandomPrivateKey, mnemonicToPrivateKey, getPublicAddress } = require("./config/utils");
const { default: axios } = require("axios");
const { getNFTInscriptions, _getPendingTransactionId, getDRC20ImageURL, getNFTImageURL } = require("./services/information.service");
const logMessage = require("./config/logger");

dotenv.config();

async function main() {
  let cmd = process.argv[2];

  if (cmd == "wallet") await wallet();
  else if (cmd === "reg-nft") await registerNFT();
  else if (cmd === "random-wallet") generateRandomWallet();
  else if (cmd === "convert") {
    let mnemonic = process.argv[3];
    const privateKey = mnemonicToPrivateKey(mnemonic);
    logMessage("PrivateKey:", privateKey);
    logMessage("PublicAddress:", getPublicAddress(privateKey));
  }
  else {
    logMessage("HELLO");
    const result = await getNFTImageURL("2241796b026e1be58e5d7f6655834114d010ebcc207a4b2b89112f1836e91f47i0");
    console.log("result", result);
    // await _getPendingTransactionId("DDtEMKKYqkd3Mta8WAbnyXA1BFPDg6Gekh");
  }
  //   else if (cmd == "drc-20") {
  //     await doge20();
  //   } else if (cmd == "nft") {
  //     await nft();
  //   }
}

async function wallet() {
  let subcmd = process.argv[3];

  if (subcmd == "sync") {
    await walletSync();
  } 
  // else if (subcmd == 'balance') {
  //     walletBalance();
  // } else if (subcmd == 'send') {
  //     await walletSend();
  // } else if (subcmd == 'split') {
  //     await walletSplit();
  // } else {
  //     throw new Error(`unknown subcommand: ${subcmd}`);
  // }
}

async function registerNFT() {
  let i;
  for (i = 0; i < inscriptions.length; i++) {
      await registerNFTToDatabase(inscriptions[i]);
      logMessage(inscriptions[i].inscriptionId);
  }
    logMessage("Finished");
}

async function generateRandomWallet() {
  const mnemonic = generateRandomPrivateKey();
  logMessage(mnemonicToPrivateKey(mnemonic))
}
// Mongoose
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    logMessage("MongoDB Connected");

    main().catch((e) => {
      let reason =
        e.response &&
        e.response.data &&
        e.response.data.error &&
        e.response.data.error.message;
      console.error(reason ? e.message + ":" + reason : e.message);
    });
  })
  .catch(() => {
    logMessage("err");
  });
