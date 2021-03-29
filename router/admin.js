const AdminController = require("../controller/AdminController");

const Router = require("express").Router();

Router.post("/createVoucher", AdminController.createVoucher);

module.exports = Router;
