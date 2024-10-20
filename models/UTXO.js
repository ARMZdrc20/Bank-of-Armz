const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UTXOSchema = new Schema({
    txid: {
        type: String,
        required: true,
    },
    vout: {
        type: Number,
        required: true,
    },
    script: {
        type: String,
        required: true,
    },
    satoshis: {
        type: Number,
        required: true,
    },
});

module.exports = mongoose.model("UTXO", UTXOSchema);
