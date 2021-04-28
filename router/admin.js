const AdminController = require("../controller/AdminController");

const Router = require("express").Router();

Router.post("/createVoucher", AdminController.createVoucher);
Router.get("/posts", AdminController.getAllReport);
Router.post("/deletePosts", AdminController.deletePost);
Router.post("/ingore", AdminController.ignoreReport);

module.exports = Router;
