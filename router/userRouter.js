const router = require("express").Router();
const { check } = require("express-validator");

const UserController = require("../controller/UserController");

const multer = require("multer");

var upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, "./uploads");
    },
    filename: function (req, file, callback) {
      callback(null, Date.now() + file.originalname);
    },
  }),
});

router.post("/upload", upload.single("avatar"), UserController.getUploadUrl);
router.get(
  "/",
  check("email").notEmpty().isEmail(),
  check("userName").notEmpty().isLength({ min: 3, max: 15 }).isAlpha(),
  check("password").notEmpty().isLength({ min: 3, max: 5 }),
  UserController.createAccount
);

router.get("/getListRestaurant/:rName", UserController.getListRestaurant);
router.post("/login", UserController.login);
// router.post("/loginWithGg", UserController.loginWithGb);
router.get("/profile", UserController.getProfile);
router.post("/profile", upload.single("avatar"), UserController.updateProfile);
router.get("/newPost", UserController.searchRestaurant);
router.post("/newPost", upload.array("avatar", 10), UserController.createPosts);
router.get("/home", UserController.getNewPosts);
router.post("/vote", UserController.vote);
router.get("/myPost", UserController.getAllPosts);
router.post("/createOder", UserController.createOder);
router.post("/add", UserController.addTocart);
router.get("/oder", UserController.loadOder);
router.get("/oders", UserController.getOder);
router.get("/bill", UserController.getBill);
router.get("/getAllRestaurant", UserController.getAllRestaurant);
router.get("/getRestaurantInfo/:id", UserController.getRestaurantInfo);
router.get("/tags", UserController.getHashTag);
router.get("/filter/:tag", UserController.postFilter);
router.post("/addAddress", UserController.useAddAddress);
router.get("/oderInfo/:id", UserController.userGetOderInfo);
router.post("/getvoucher", UserController.useGetVoucher);
router.get("/ownVoucher", UserController.ownVoucher);
router.post("/getLocation", UserController.userGetNearResutaurant);
router.get("/populateRestaurant", UserController.getPoplateRestaurant);
router.post("/near", UserController.userGetNearResutaurant);
router.post("/reportPost", UserController.reportPost);

module.exports = router;
