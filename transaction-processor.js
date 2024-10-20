const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

dotenv.config();

const { Transaction, PendingTransaction } = require("./models");
const { processTransaction, processTransactionArmz, walletSync } = require("./services/transaction.service");
const { default: axios } = require("axios");

const pendingTransactionProcessor = async () => {
    const transaction = await Transaction.findOne({ status: "unconfirmed" })
        .sort({ createdAt: 1 })
        .exec();
    if(transaction){
        console.log("Found a transaction:", transaction);
        if(transaction.type === 1) {
            await processTransaction(transaction);
        } else {
            await processTransactionArmz(transaction);
        }
    }

    const config = {
        maxBodyLength: Infinity,
        headers: {
          Accept: "application/json",
          "api-key": process.env.MASTRO_API_KEY,
        },
      };
      
    const pendingTransaction = await PendingTransaction.find({ pending: true });
    for(let i = 0;i < pendingTransaction.length;i ++) {
        const tx = pendingTransaction[i];
        const result_txInfo = await axios.get(`${process.env.MASTRO_API_URL}/transactions/${tx.txid}`, config);
        const txInfo = result_txInfo.data.data;
        if(txInfo.confirmations) {
          tx.pending = false;
          await tx.save();
        }
    }

    setTimeout(async () => {
        await pendingTransactionProcessor();
    }, 5000);
}

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB Connected");
    setTimeout(async () => {
        await walletSync();
        await pendingTransactionProcessor();
    }, 5000);
  })
  .catch(() => {
    console.log("err");
  });
