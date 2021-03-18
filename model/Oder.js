const mongoose = require("mongoose");

const oderSchema = new mongoose.Schema({
  rId: {
    type: mongoose.Types.ObjectId,
    ref: "Resutaurant",
  },
  uId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  deliveryAddress: {
    type: String,
    required: true,
  },
  dish: [],
  logs: [],
  time: {
    type: Date,
    default: new Date(),
  },
  status: {
    type: Number,
    default: 0,
  },
  detail: {
    type: String,
  },
  paymentInfo: {
    isPayment: {
      type: Boolean,
      default: false,
    },
    paymentId: {
      type: String,
    },
  },
  total: {
    type: Number,
    require: true,
  },
});

const Oder = mongoose.model("Oder", oderSchema);

module.exports = Oder;
