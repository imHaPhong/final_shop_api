const mongosse = require("mongoose");

const voucherSchema = new mongosse.Schema({
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  isLimited: {
    type: Boolean,
    required: true,
  },
  qtn: {
    type: Number,
    default: 0,
  },
  minBill: {
    type: Number,
    required: true,
  },
  maxDisCount: {
    type: Number,
    required: true,
  },
  voucherDetail: {
    type: String,
    required: true,
  },
  voucherDescription: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    require: true,
  },
  discount: {
    type: String,
    required: true,
  },
});

const Voucher = mongosse.model("Voucher", voucherSchema);

module.exports = Voucher;
