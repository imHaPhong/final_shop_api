const mongoose = require("mongoose");

const payalSchema = new mongoose.Schema({
  payerID: {
    type: String,
  },
  paid: {
    type: Boolean,
  },
  uId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  oId: {
    type: mongoose.Types.ObjectId,
    ref: "Oder",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Payal = mongoose.model("Payal", payalSchema);

module.exports = Payal;
