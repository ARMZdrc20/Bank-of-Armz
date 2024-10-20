const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ArmzSchema = new Schema({
  tokens: {
    type: Number,
    required: true
  },
});

module.exports = mongoose.model("Armz", ArmzSchema);
