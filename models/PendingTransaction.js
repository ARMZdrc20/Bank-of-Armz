const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PendingTransactionSchema = new Schema({
  address: {
    type: String,
    required: true
  },
  txid: {
    type: String,
    required: true
  },
  pending: {
    type: Boolean,
    required: true,
    default: true
  }
});

module.exports = mongoose.model("PendingTransaction", PendingTransactionSchema);
