const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Voucher = require("../model/Voucher");

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
};
