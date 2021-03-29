const express = require("express");
const app = express();
const port = process.env.PORT || 8080;

var bodyParser = require("body-parser");

const mongoose = require("mongoose");
const verify = require("./router/auth");
var cors = require("cors");

const publicRouter = require("./router/publicRouter");
const userRouter = require("./router/userRouter");
const restaurantRouter = require("./router/restaurantRouter");
const adminRouter = require("./router/admin");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use("/", publicRouter);
app.use("/user", verify.auth, verify.userAuth, userRouter);
app.use("/restaurant", verify.auth, verify.restaurantAuth, restaurantRouter);
app.use("/admin", verify.auth, verify.admintAuth, adminRouter);

mongoose.connect(
  "mongodb+srv://anhtuan:123@cluster0.vpuly.mongodb.net/test?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("connect");
  }
);
const connection = mongoose.connection;

connection.once("open", function () {
  console.log("MongoDB database connection established successfully");
});

const server = app.listen(port, () => console.log(`running in ${port}`));
const io = require("./socketio").init(server);
