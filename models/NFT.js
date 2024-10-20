const mongoose = require("mongoose");
// const UTXO = require("./UTXO");
const Schema = mongoose.Schema;

const NFTSchema = new Schema({
    inscriptionId: {
        type: String,
        required: true,
    },
    // inscriptionNumber: {
    //     type: Number,
    //     required: true,
    // },
    // inscribedBy: {
    //     type: String,
    //     required: true
    // },
    denomination: {
        type: Number,
        required: true
    },
    // listed: {
    //     type: Boolean,
    //     required: true
    // },
    // location: {
    //     type: String,
    //     required: true
    // },
    // outputValue: {
    //     type: Number,
    //     required: true
    // },
    privateKey: {
        type: String,
        required: true
    },
    own: {
        type: Boolean,
        required: true,
        default: false
    },
    status: {
        type: String,
        required: true,
        default: "general" // "general", "pending"
    },
    // It is not good
    txid: {
        type: String,
    },
    vout: {
        type: Number,
    },
    script: {
        type: String,
    },
    satoshis: {
        type: Number,
    },
});

module.exports = mongoose.model("NFT", NFTSchema);
