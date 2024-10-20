const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TransactionSchema = new Schema({
  sender: {
    type: String,
    required: true
  },
  txid: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  inscriptionId: {
    type: String,
    required: true
  },
  address: {
    type: String
  },
  status: {
    type: String,
    required: true,
    default: "unconfirmed" // "unconfirmed", "confirmed", "completed", "failed"
  },
  spendTxId: {
    type: String,
  },
  type: {
    type: Number, // 1: Armz to NFT, 2: NFT to Armz
    required: true
  }
});

module.exports = mongoose.model("Transaction", TransactionSchema);
