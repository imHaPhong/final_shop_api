const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default: "https://iupac.org/wp-content/uploads/2018/05/default-avatar.png",
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    default: null,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  favs: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Post",
    },
  ],
  posts: {
    type: mongoose.Schema.ObjectId,
    ref: "Post",
  },
  role: {
    type: Number,
    default: 1,
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
