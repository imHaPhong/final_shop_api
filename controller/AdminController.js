const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Voucher = require("../model/Voucher");
const PostReport = require("../model/PostReport");
const Posts = require("../model/Posts");
const mongoose = require("mongoose")
const Admin = require("../model/Admin");
const Restaurant = require("../model/Restaurant");
const e = require("cors");

module.exports = {
  createVoucher: async (req, res) => {
    function makeid(length) {
      var result = "";
      var characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      var charactersLength = characters.length;
      for (var i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
      }
      return result;
    }
    const voucherObj = { ...req.body, code: makeid(5) };
    const voucher = await new Voucher(voucherObj);
    await voucher.save();
    res.send(voucher);
  },
  createAccount: async (req, res) => {
    try {
      const salt = await bcrypt.genSalt(10);
      const hassedPass = await bcrypt.hash("123", salt);
      const admin = await User({
        userName: "admin",
        password: hassedPass,
        email: "admin@admin.com",
        role: 3,
      });
      await admin.save();
      res.send(admin);
    } catch (error) {
      res.send("loi " + error);
    }
  },
  login: async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      const validPass = await bcrypt.compare(req.body.password, user.password);
      if (!validPass) return res.send("Can not login");
      const token = jwt.sign({ _id: user._id, role: 3 }, "asbdasd");
      res.json({ token: token, user: user });
    } catch (error) {
      res.status(401).json({
        error:
          "Unknown username. Check again or try your email address." + error,
      });
    }
  },
  getAllReport: async (req,res) => {
    const reports = await PostReport.find().populate("pId")
    res.json(reports)
  },
  deletePost: async (req, res) => {
    await Posts.deleteOne({_id: mongoose.Types.ObjectId(req.body.pId)})
    await PostReport.deleteMany({pId: mongoose.Types.ObjectId(req.body.pId)})
    const reports = await PostReport.find()
    res.json(reports)
  },
  ignoreReport: async (req, res) => {
    const reports = await PostReport.deleteOne({_id: mongoose.Types.ObjectId(req.body.rId)})
    const lisr = await PostReport.find()
    res.json(lisr)
  },
  adminGetInfo: async (req, res) => {
    var info = await Admin.find()
    const totalRestaurant = await Restaurant.find()
    const newCreate = []
    totalRestaurant.map(el => {
      if( new Date(el.createAt).toDateString() == (new Date()).toDateString()){
        newCreate.push(el)
      }
    })
    res.json({info: info[0],createNew: newCreate.length, totalRestaurant: totalRestaurant.length })
  },
  adminCreateInfo: async (req, res) => {
    const adInfo = await Admin()
    await adInfo.save();
  },
  adminUpdateInfo: async (req, res) => {
    var info = await Admin.find()
    if(req.body.addIndex == 0) {
      info[0].setDailySales = req.body.data
    } else {
      info[0].setMonthSales = req.body.data
    }
    await info[0].save()
    console.log(info[0]);
    res.json({info: info[0]})
  }
};
