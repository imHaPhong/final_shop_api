const mongoose = require("mongoose");

const postsChema = new mongoose.Schema({
  rId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Restaurant",
  },
  uId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
  },
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  tag: {
    type: String,
    required: true,
  },
  image: [{ type: String, default: null }],
  originalImage: [{ type: String, default: null }],
  vote: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
    },
  ],
  comment: [
    {
      uId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
      },
      content: {
        type: String,
        required: true,
      },
    },
  ],
  date: {
    type: Date,
    default: new Date(),
  },
});

const Posts = mongoose.model("Posts", postsChema);

module.exports = Posts;
