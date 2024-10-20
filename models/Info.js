const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const InfoSchema = new Schema({
  dogecoinPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  armzPrice: {
    type: Number,
    required: true,
    default: 0
  },
});

module.exports = mongoose.model("Info", InfoSchema);