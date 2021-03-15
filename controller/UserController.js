var cloudinary = require("cloudinary").v2;
const sharp = require("sharp");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/User");
const Posts = require("../model/Posts");
const Restaurant = require("../model/Restaurant");
const fs = require("fs");
const io = require("../socketio");
const Cart = require("../model/Cart");
const Oder = require("../model/Oder");

cloudinary.config({
  cloud_name: "dmqpxd3wh",
  api_key: "919963567122112",
  api_secret: "A21cvkKY9KhIL5imN06zpnE_ZLY",
});

module.exports = {
  getUploadUrl: async (req, res) => {
    console.log(req.file);
    let query = req.body;
    if (!req.body && !req.files) {
      res.json({ success: false });
    } else {
      sharp(req.file.path)
        .resize(262, 317)
        .toFile("./uploads/" + "262x317-" + req.file.filename, function (err) {
          cloudinary.uploader.upload(
            "./uploads/" + "262x317-" + req.file.filename,
            async (err, result) => {
              const user = await User.findById(req.user._id);
              user.avatar = result.url;
              await user.save();
              return res.send(user);
            }
          );
        });
    }
  },
  createAccount: async (req, res) => {
    const errors = validationResult(req);
    try {
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const salt = await bcrypt.genSalt(10);
      const hassedPass = await bcrypt.hash(req.body.password, salt);
      req.body = { ...req.body, password: hassedPass };
      const user = User(req.body);
      await user.save();
      res.status(200).json({ msg: "Login sucess", isLogin: true });
    } catch (error) {
      res.status(200).json({ msg: error, isLogin: true });
    }
  },
  login: async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      const validPass = await bcrypt.compare(req.body.password, user.password);
      if (!validPass) return res.send("Can not login");
      const token = jwt.sign({ _id: user._id, role: 1 }, "asbdasd");
      res.header("auth-token", token).json({ token: token, user: user });
    } catch (error) {
      res.status(401).json({
        error: "Unknown username. Check again or try your email address.",
      });
    }
  },
  getProfile: async (req, res) => {
    const user = await User.findById(req.user._id);
    res.send(user);
  },
  updateProfile: async (req, res) => {
    if (req.file) {
      sharp(req.file.path)
        .resize(262, 317)
        .toFile("./uploads/" + "262x317-" + req.file.filename, function (err) {
          cloudinary.uploader.upload(
            "./uploads/" + "262x317-" + req.file.filename,
            async (err, result) => {
              req.body.avatar = result.url;
              const user = await User.updateOne(
                { _id: req.user._id },
                req.body
              );
              return res.send(user);
            }
          );
        });
    } else {
      var user = await User.updateOne({ _id: req.user._id }, req.body);
      res.status(200).json(user);
    }
  },
  searchRestaurant: async (req, res) => {
    const restaurant = await Restaurant.find({
      restaurantName: { $regex: req.query.rName },
    });
    res.send(restaurant);
  },
  createPosts: async (req, res) => {
    const restaurant = await Restaurant.findOne({
      restaurantName: req.body.rName,
    });
    delete req.body["rName"];
    let image = [];
    if (req.file || req.files) {
      const pro = Promise.all(
        req.files.map(async (el) => {
          const semiTransparentRedPng = await sharp(el.path)
            .resize(200, 200)
            .toFile("./uploads/" + "262x317-" + el.filename);
          const data = await cloudinary.uploader.upload(
            "./uploads/" + "262x317-" + el.filename
          );
          fs.unlinkSync(el.path);
          fs.unlinkSync("./uploads/" + "262x317-" + el.filename);
          image = image.concat(data.url);
        })
      );

      pro.then(async () => {
        const post = Posts({
          ...req.body,
          uId: req.user._id,
          image: image,
          tag: req.body.tag,
          rId: req.body.rId,
        });
        await post.save();
        io.getIO().emit("newPosts", { action: "newPosts", posts: post });
        return res.send(post);
      });
    } else {
      const post = Posts({
        ...req.body,
        uId: req.user._id,
        rId: req.body.rId,
        tag: req.body.tag,
      });
      await post.save();
      res.send(post);
    }
  },
  vote: async (req, res) => {
    try {
      const posts = await Posts.findById(req.body.vote);
      if (posts.vote.includes(req.user._id)) {
        posts.vote = posts.vote.filter((post) => {
          return req.user._id != post;
        });
      } else {
        posts.vote = posts.vote.concat(req.user);
      }
      const updateVote = await Posts.updateOne(
        { _id: req.body.vote },
        { vote: posts.vote }
      );
      io.getIO().emit("voted", {
        action: "vote",
        votes: posts.vote,
        _id: req.body.vote,
      });
      res.status(200).json(updateVote);
    } catch (err) {
      res.send(err + "");
    }
  },
  getAllPosts: async (req, res) => {
    const { page = 0, limit = 3 } = req.query;
    const myPost = await Posts.find({ uId: req.user._id })
      .sort({ date: -1 })
      .skip(page * limit)
      .limit(Number(limit));
    res.status(200).json({ myPost });
  },
  getNewPosts: async (req, res) => {
    const { page = 0, limit = 3 } = req.query;
    console.log(page);
    const newPost = await Posts.find()
      .skip(page * limit)
      .limit(Number(limit))
      .sort({ date: -1 });
    res.status(200).json({
      nextUrl: `https://tuanna-final.herokuapp.com/user/home?page=${
        page + 1
      }&limit=${limit}`,
      message: "Success",
      newPost,
    });
  },
  isUserExist: async (req, res) => {
    const check = ["email", "userName"];
    const checkField = Object.keys(req.body)[0];
    if (check.includes(checkField)) {
      const user = await User.find({ [checkField]: req.body[checkField] });
      if (user.length != [0]) {
        return res.status(200).json({ isExist: true });
      }
      return res.status(200).json({ isExist: false });
    }
    res.json({ message: "undified url" });
  },
  addTocart: async (req, res) => {
    const cart = await Cart.findOne({ uId: req.user._id });
    if (cart) {
      cart.dish.map((el) => {
        if (el.rId == req.body.rId) {
          var itemExist;
          itemExist = el.items.map((it) => {
            if (it.dId == req.body.dId) {
              return (it.qtn += 1);
            }
            return false;
          });
          if (itemExist.every((el) => el === false)) {
            return (el.items = el.items.concat({ dId: req.body.dId }));
          }
          return;
        } else {
          return (cart.dish = cart.dish.concat(req.body.rId));
        }
      });
      const temp = cart.dish.map((el) => {
        if (el.rId == req.body.rId) {
          return true;
        }
        return false;
      });
      const isNew = temp.every((el) => el === false);
      console.log(isNew);
      if (isNew) {
        cart.dish = cart.dish.concat({
          rId: req.body.rId,
          items: [{ dId: req.body.dId }],
        });
      }
      await cart.save();
      res.status(200).json(cart);
    } else {
      const newCart = Cart({ uId: req.user._id });
      newCart.dish = newCart.dish.concat({
        rId: req.body.rId,
        items: [{ dId: req.body.dId }],
      });
      await newCart.save();
      return res.send(newCart);
    }
  },
  createOder: async (req, res) => {
    try {
      const oder = await Oder({
        rId: req.body.rId,
        uId: req.user._id,
        dish: req.body.dish,
        total: req.body.total,
        logs: [{ msg: "Doi nha hang xac nhan", time: Date.now() }],
      }).save();
      io.getIO().emit("userCreateOder", { action: "createOder", oder: oder });
      res.send(oder);
    } catch (error) {
      res.send(error);
    }
  },
  loadOder: async (req, res) => {
    // const userOder = await Cart.findOne({ uId: req.user._id });
    const test = await Cart.findOne({ uId: req.user._id })
      .populate({
        path: "dish",
        populate: {
          path: "rId",
          populate: {
            path: "items",
            populate: {
              path: "dId",
              model: "Restaurant",
            },
          },
        },
      })
      .exec();
    const listItem = test.dish[0].items;
    var getOderInfo = listItem.map((item) => {
      return test.dish[0].rId.menu.map((el) => {
        if (item.dId.includes(el._id)) {
          var x = el.items.map((dish) => {
            if (dish._id == item.dId.split("/")[1]) {
              return {
                _id: dish._id,
                name: dish.name,
                img: dish.img,
                price: dish.price,
                qtn: item.qtn,
              };
            }
          });
          return x;
        }
      });
    });
    getOderInfo = getOderInfo.map((oder) => [
      ...oder.filter((el) => el != null),
    ]);
    getOderInfo = getOderInfo.map((el) => el[0]);
    getOderInfo = getOderInfo.map((el) => el[0]);
    res.status(200).json({ data: getOderInfo });
  },
  getBill: async (req, res) => {
    const userOder = await Oder.findOne({ uId: req.user._id });
    const total = [...userOder.dish.map((el) => el.price * el.qtn)].reduce(
      (a, b) => a + b
    );
    res.status(200).json({ dishs: userOder.dish, logs: userOder.logs, total });
  },
  getAllRestaurant: async (req, res) => {
    const restaurant = await Restaurant.find();
    res.json({ listRestaurant: restaurant });
  },
  getRestaurantInfo: async (req, res) => {
    const restaurant = await Restaurant.findById(req.params.id);
    delete restaurant.email;
    delete restaurant.password;
    delete restaurant.role;
    res.json({ restaurantInfo: restaurant });
  },
  getOder: async (req, res) => {
    const oders = await Oder.find({ uId: req.user._id });
    res.status(200).json({ oders });
  },
  getListRestaurant: async (req, res) => {
    const restaurant = await Restaurant.find();

    const listRestaurantName = restaurant.filter((el) => {
      if (
        el.restaurantName.toLowerCase().includes(req.params.rName.toLowerCase())
      ) {
        return el;
      }
    });
    res.json({ listRestaurantName });
  },
};
