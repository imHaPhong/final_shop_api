const mongoose = require("mongoose");

const adminChema = new mongoose.Schema({
 setDailySales: {
   type: Number,
   default: 0
 },
 setMonthSales: {
   type: Number,
   default: 0
 },
 dailySales: {
  type: Number,
  default: 0
 },
 monthlySales: {
  type: Number,
  default: 0
 },
 lastUpdate: {
  type: Date,
  default: new Date(),
 },
});

const Admin = mongoose.model("Admin", adminChema);

module.exports = Admin;
