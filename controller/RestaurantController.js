const Restaurant = require("../model/Restaurant");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
var cloudinary = require("cloudinary").v2;
const sharp = require("sharp");
const fs = require("fs");
const Oder = require("../model/Oder");
const axios = require("axios");
const querystring = require("querystring");
const { PAYAL_SECECTKEY, CLIENT_ID } = require("../cofig");
const io = require("../socketio");
const { log } = require("console");

cloudinary.config({
  cloud_name: "dmqpxd3wh",
  api_key: "919963567122112",
  api_secret: "A21cvkKY9KhIL5imN06zpnE_ZLY",
});

module.exports = {
  checkToken: (req,res) => {
    res.status(200)
  },
  signUp: async (req, res) => {
    const emailExist = await Restaurant.findOne({ email: req.body.email });
    if (emailExist) return res.send("email exist");
    try {
      const salt = await bcrypt.genSalt(10);
      const hashPass = await bcrypt.hash(req.body.password, salt);
      const newRestaurant = Restaurant({ ...req.body, password: hashPass });
      await newRestaurant.save();
      res
        .status(200)
        .json({ msg: "Sign up success", newRestaurant, isLogin: true });
    } catch (error) {
      res.status(200).json({ msg: error, isLogin: false });
    }
  },
  signIn: async (req, res) => {
    const restaurant = await Restaurant.findOne({ email: req.body.email });
    if (!restaurant) {
      return res
        .status(200)
        .json({ msg: "Email or password not correct", isLogin: false });
    }
    const hashedPassword = await bcrypt.compare(
      req.body.password,
      restaurant.password
    );
    if (!hashedPassword)
      return res
        .status(200)
        .json({ msg: "Email or password not correct", isLogin: false });

    try {
      const token = jwt.sign({ _id: restaurant._id, role: 2 }, "asbdasd");
      res.status(200).json({ msg: "Login success", token, isLogin: true });
    } catch (error) {
      res.send(error);
    }
  },
  addMenu: async (req, res) => {
    const data = req.body;

    // su them req.body
    if (req.file) {
      await sharp(req.file.path)
        .resize(120, 120)
        .toFile("./uploads/" + "120x120-" + req.file.filename);
      const imgUploaed = await cloudinary.uploader.upload(
        "./uploads/" + "120x120-" + req.file.filename
      );
      fs.unlinkSync(req.file.path);
      fs.unlinkSync("./uploads/" + "120x120-" + req.file.filename);
      const restaurant = await Restaurant.findById(req.user._id);
      restaurant.menu = restaurant.menu.map((el) => {
        if (el._id == data.itemId) {
          el.items = el.items.concat({
            name: data.name,
            img: imgUploaed.url,
            price: data.price,
          });
        }
        return el;
      });

      await restaurant.save();
      return res
        .status(200)
        .json({ msg: "Add success", menu: restaurant.menu });
    }
  },
  editMenu: async (req, res) => {
    // const data1 = {
    //   itemId: "604645e4d4fbdd5baccdb0ba",
    //   subMenuId: "6046ec93a287cb2694cf0ac4",
    //   name: "sua lai",
    //   price: 111,
    // };
    const data = req.body;
    if (req.file) {
      await sharp(req.file.path)
        .resize(120, 120)
        .toFile("./uploads/" + "120x120-" + req.file.filename);
      const imgUploaed = await cloudinary.uploader.upload(
        "./uploads/" + "120x120-" + req.file.filename
      );

      fs.unlinkSync(req.file.path);
      fs.unlinkSync("./uploads/" + "120x120-" + req.file.filename);
      try {
        const restaurant = await Restaurant.findById(req.user._id);
        restaurant.menu = restaurant.menu.map((el) => {
          if (el._id == data.itemId) {
            el.items.map((i) => {
              if (i._id == data.subMenuId) {
                i.name = data.name;
                i.img = imgUploaed.url;
                i.price = data.price;
              }
              return i;
            });
          }
          return el;
        });
        await restaurant.save();
        return res
          .status(200)
          .json({ msg: "Add success", menu: restaurant.menu });
      } catch (error) {
        console.log(error);
      }
    } else {
      const restaurant = await Restaurant.findById(req.user._id);
      restaurant.menu = restaurant.menu.map((el) => {
        if (el._id == data.itemId) {
          el.items.map((i) => {
            if (i._id == data.subMenuId) {
              i.name = data.name;
              i.price = data.price;
            }
            return i;
          });
        }
        return el;
      });
      await restaurant.save();
      return res
        .status(200)
        .json({ msg: "Add success", menu: restaurant.menu });
    }
  },
  addMenuTitle: async (req, res) => {
    const restaurant = await Restaurant.findById(req.user._id);
    restaurant.menu = restaurant.menu.concat(req.body.menuTitle);
    await restaurant.save();
    var resData = restaurant.menu[restaurant.menu.length - 1];
    res.status(200).json({
      msg: "Add success",
      listMenu: { id: resData._id, menuTitle: resData.menuTitle },
    });
  },
  editMenuTitle: async (req, res) => {
    const restaurant = await Restaurant.findById(req.user._id);
    restaurant.menu = restaurant.menu.map((el) => {
      if (el._id == req.body.id) {
        el.menuTitle = req.body.menuTitile;
      }
      return el;
    });
    await restaurant.save();
    res.json({ msg: "Update new title", isUpdate: true });
  },
  updateAvatar: async (req, res) => {
    await sharp(req.file.path)
      .resize(640, 400)
      .toFile("./uploads/" + "120x120-" + req.file.filename);
    const imgUploaed = await cloudinary.uploader.upload(
      "./uploads/" + "120x120-" + req.file.filename
    );
    fs.unlinkSync(req.file.path);
    fs.unlinkSync("./uploads/" + "120x120-" + req.file.filename);
    const restaurant = await Restaurant.findById(req.user._id);
    restaurant.avatar = imgUploaed.url;
    await restaurant.save();
    res.status(200).json({ msg: "Upload success", imgUrl: imgUploaed.url });
  },
  updateProfile: async (req, res) => {
    const restaurant = await Restaurant.findById(req.user._id);

    if (req.body.oldPassword) {
      const hashedPassword = await bcrypt.compare(
        req.body.oldPassword,
        restaurant.password
      );
      if (!hashedPassword)
        return res
          .status(200)
          .json({ msg: "Email or password not correct", isLogin: false });
      delete req.body.oldPassword;
    }
    const uploads = Object.keys(req.body);
    const uploadField = ["password", "restaurantName", "address", "timeAcitve"];
    const isUpload = uploads.map((el) => {
      if (!uploadField.includes(el)) return false;
      return true;
    });
    if (isUpload.every((el) => el === false)) {
      return res.status(200).json({ msg: "Upload field is not valid" });
    }
    var hashPass;
    var a = uploads.map(async (el) => {
      if (el == "password") {
        const salt = await bcrypt.genSalt(10);
        hashPass = bcrypt.hash(req.body.password, salt);
        return (restaurant.password = hashPass);
      } else {
        restaurant[el] = req.body[el];
      }
    });
    if (req.body.password) {
      Promise.all(a).then(async (value) => {
        var newPass = value.map((el) => {
          if (el) {
            return el;
          }
        });
        restaurant.password = newPass[2];
        await restaurant.save();
        return res.send(restaurant);
      });
    } else {
      await restaurant.save();
      res.send(restaurant);
    }
  },
  editProfile: async (req, res) => {
    const restaurant = await Restaurant.findById(req.user._id);
    var imgUrl = null;
    if (req.file) {
      await sharp(req.file.path)
        .resize(480, 300)
        .toFile("./uploads/" + "120x120-" + req.file.filename);
      const imgUploaed = await cloudinary.uploader.upload(
        "./uploads/" + "120x120-" + req.file.filename
      );
      fs.unlinkSync(req.file.path);
      fs.unlinkSync("./uploads/" + "120x120-" + req.file.filename);
      req.body.avatar = imgUploaed.url;
    }
    const updateField = Object.keys(req.body);
    const time = req.body.timeAcitve.split(",");
    req.body.timeAcitve = time;
    updateField.map((el) => {
      if (req.body[el] != "") {
        restaurant[el] = req.body[el];
      }
    });
    await restaurant.save();
    console.log(restaurant);
  },
  getProfile: async (req, res) => {
    const restaurant = await Restaurant.findById(req.user._id);
    res.status(200).json({ msg: "Ok", restaurantInfo: restaurant });
  },
  checkField: async (req, res) => {
    const fieldCheck = Object.keys(req.body)[0];
    const valueCheck = Object.values(req.body)[0];
    const isExist = await Restaurant.find({ [fieldCheck]: valueCheck });
    if (isExist.length !== 0) {
      return res
        .status(200)
        .json({ msg: `${fieldCheck} is exist`, isExist: true });
    }
    return res.status(200).json({ msg: `Oke`, isExist: false });
  },
  getAll: async (req, res) => {
    const listRes = await Restaurant.findById(req.user._id);
    res.send(listRes);
  },
  getOder: async (req, res) => {
    const oders = await Oder.find({ rId: req.user._id });
    res.status(200).json({ oders });
  },
  change2Processing: async (req, res) => {
    const oder = await Oder.findById(req.body.oId);
    oder.status = oder.status += 1;
    oder.logs = oder.logs.concat({
      msg: "Restaurant dang chuan bi mon an",
      time: Date.now(),
    });
    await oder.save();
    io.getIO().emit("change2Processing", { action: "change2Processing", oder });
    io.getIO().emit("UpdateOder", { action: "createOder", oder: oder });

    res.send(oder);
  },

  deleteMenu: async (req, res) => {
    const deleteKey = Object.keys(req.body)[0];
    const deleteValue = Object.values(req.body)[0];
    const deleteList = ["menu", "menuItem"];
    const isDelete = deleteList.includes(deleteKey);
    if (!isDelete) {
      return res.status(404).json({
        msg: "Can not find object to delete",
        data: null,
        isDelete: false,
      });
    }
    try {
      Restaurant.findByIdAndUpdate(
        req.user._id,
        {
          $pull: { menu: { _id: req.body.menu } },
        },
        function (error, result) {
          res.status(200).json({
            msg: "Delete " + deleteKey,
            data: req.body,
            isDelete: true,
          });
        }
      );
    } catch (error) {
      res.status(200).json({ msg: "asd: " + error, isDelete: false });
    }
  },
  getSubmenu: async (req, res) => {
    const restaurant = await Restaurant.findById(req.user._id);
    const resData = restaurant.menu.filter((el) => el._id == req.body.id);
    res.json({ submenu: resData });
  },
  deleteSubMenu: async (req, res) => {
    const restaurant = await Restaurant.findById(req.user._id);
    restaurant.menu = restaurant.menu.map((el) => {
      if (el._id == req.body.id) {
        el.items = el.items.filter((item) => item._id != req.body.submenu);
      }
      return el;
    });
    await restaurant.save();
    res.send({ msg: "Deleted" });
  },
  getPaymanetDetail: async (req, res) => {
    const paymentId = req.body.paymentID;
    // const userID = req.user._id;
    const temp = querystring.stringify({
      grant_type: "client_credentials",
    });
    const resData = await axios.default.post(
      "https://api-m.sandbox.paypal.com/v1/oauth2/token",
      temp,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        auth: {
          username: CLIENT_ID,
          password: PAYAL_SECECTKEY,
        },
      }
    );
    const token = resData.data.access_token;
    const data = await axios.default.get(
      `https://api-m.sandbox.paypal.com/v1/payments/payment/${paymentId}`,
      {
        headers: {
          Accept: `application/json`,
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(data.data.transactions[0]);
  },
  loginWithGb: async (req, res) => {
    const a_token =
      "ya29.a0AfH6SMBO7EHE6t3FF8C5lWQ9hVmntVdks0K8vPjOvLzvsqQBRsnQhKRQUkrhtbwZj6MiQ2tGzeUOtDtUGLL-V_0NqUYGlWlzvh83yAwopbg8gqNRj6GLiMjoPWrRYf8HZidhXSLtL7rt3etvKprtctkwf0Jt";
    const data = await axios.default.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${a_token}`
    );
    console.log(data.data);
  },
  userGetNearLocation: async (req, res) => {
    const userLocation = req.body.userLocation[1];
    const listRestaurant = await Restaurant.find();
    const nearRestaurant = [];
    listRestaurant.forEach((el) => {
      if (
        Math.pow(Number(el.location[0]) - userLocation, 2) < Math.pow(0.01, 2)
      ) {
        nearRestaurant.push(el);
      }
    });
    res.status(200).json(nearRestaurant);
  },
  addAmount: async (req, res) => {
    const restaurant = await Restaurant.findById(req.user._id)
    if(req.body.addIndex == 0) {
      restaurant.setDailySales = req.body.data
    } else {
      restaurant.setMonthSales = req.body.data
    }
    await restaurant.save();
    console.log(restaurant);
  }
};
