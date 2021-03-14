const router = require("express").Router();
const RestaurantController = require("../controller/RestaurantController");
const UserController = require("../controller/UserController");
const { check } = require("express-validator");

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
  check("password").isLength({ min: 3, max: 10 }),
  check("restaurantName").notEmpty(),
  RestaurantController.signUp
);

router.post("/check", UserController.isUserExist);
router.post("/restaurant/check", RestaurantController.checkField);

module.exports = router;
