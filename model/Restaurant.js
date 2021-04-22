const mongoose = require("mongoose");

const restaurantChema = new mongoose.Schema({
  avatar: {
    type: String,
    default:
      "https://lh3.googleusercontent.com/proxy/NiPpvWW3eW6mDz8ch9gYjV0OHgYFFJqkN0PO4R45cOJeZP3ktMn0Hd5eXJK2hikhc6cr2dgLh_PsBgKqEtnqTN68dTxhkq6MbKiO382bbBSOfg",
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  restaurantName: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  timeAcitve: [{ type: String, default: null }],
  menu: [
    {
      menuTitle: {
        type: String,
        required: true,
      },
      items: [
        {
          name: {
            type: String,
            required: true,
          },
          img: {
            type: String,
            required: true,
          },
          price: {
            type: Number,
            required: true,
          },
        },
      ],
    },
  ],
  rating: {
    type: Number,
    default: 5,
  },
  numberRating: {
    type: Number,
    default: 0,
  },
  types: [
    {
      type: String,
      required: true,
    },
  ],
  role: {
    type: Number,
    default: 2,
  },
  location: []
});

const restaurant = mongoose.model("Restaurant", restaurantChema);

module.exports = restaurant;
