const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  uId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  dish: [
    {
      rId: {
        type: mongoose.Types.ObjectId,
        ref: "Restaurant",
      },
      items: [
        {
          dId: {
            type: String,
          },
          qtn: {
            type: Number,
            default: 1,
          },
        },
      ],
    },
  ],
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
