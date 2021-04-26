const router = require("express").Router();
const RestaurantController = require("../controller/RestaurantController");
const UserController = require("../controller/UserController");
const { check } = require("express-validator");
const AdminController = require("../controller/AdminController");

router.post("/cAdmin", AdminController.createAccount);
router.post("/admin/login", AdminController.login);

router.post("/login", UserController.login);

//User
router.post("/signup", UserController.createAccount);

//Restaurant
router.post(
  "/restaurant/signin",
  check("email").isEmail().notEmpty(),
  check("password").isLength({ min: 3, max: 10 }),
  check("restaurantName").notEmpty(),
  RestaurantController.signIn
);
router.post(
  "/restaurant/signup",
  check("email").isEmail().notEmpty(),
  check("password").isLength({ min: 6, max: 20 }),
  check("restaurantName").notEmpty(),
  RestaurantController.signUp
);

router.post("/check", UserController.isUserExist);
router.post("/restaurant/check", RestaurantController.checkField);
router.get("/user/loadVoucher", UserController.useLoadVoucher);
router.post("/loginWith", UserController.loginWithGb);
router.get("/getAllRestaurant", UserController.getAllRestaurant);
router.get("/getRestaurantInfo/:id", UserController.getRestaurantInfo);
router.post("/search", UserController.userSearch);
module.exports = router;
