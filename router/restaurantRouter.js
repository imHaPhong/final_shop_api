const router = require("express").Router();
const restaurantRouter = require("../controller/RestaurantController");
const multer = require("multer");
const RestaurantController = require("../controller/RestaurantController");

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
router.get("/checkToken", restaurantRouter.checkToken)
router.get("/", restaurantRouter.getAll);
router.post("/addMenu", upload.single("dish-img"), restaurantRouter.addMenu);
router.post(
  "/upload",
  upload.single("restaurant-avt"),
  restaurantRouter.updateAvatar
);
router.post("/addMenuTitle", restaurantRouter.addMenuTitle);

router.post("/editProfile", restaurantRouter.updateProfile);
router.get("/oders", restaurantRouter.getOder);
router.post("/oderProcess", restaurantRouter.change2Processing);

router.delete("/delete", RestaurantController.deleteMenu);
router.delete("/deleteSubmenu", RestaurantController.deleteSubMenu);
router.put("/editMenu", RestaurantController.editMenuTitle);
router.put(
  "/editSubMenu",
  upload.single("dish-img"),
  RestaurantController.editMenu
);
router.post("/getSubmenu", RestaurantController.getSubmenu);
router.post("/getpayment", RestaurantController.getPaymanetDetail);
router.get("/info", RestaurantController.getProfile);
router.post("/info", upload.single("avatar"), RestaurantController.editProfile);
router.post("/addAmount", RestaurantController.addAmount);

module.exports = router;
