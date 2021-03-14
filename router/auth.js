const jwt = require("jsonwebtoken");

module.exports.auth = async (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.send("Access dined");
  try {
    const verify = await jwt.verify(token, "asbdasd");
    req.user = verify;
    next();
  } catch (error) {
    res.send("invalid token");
  }
};

module.exports.userAuth = (req, res, next) => {
  if (req.user.role != 1) {
    return res.status(401).json("Authorization user");
  }
  next();
};
module.exports.restaurantAuth = (req, res, next) => {
  if (req.user.role != 2) {
    return res.status(401).json("Authorization restaurant");
  }
  next();
};
// module.exports.restaurant = async (req, res, next) => {
//   const token = req.header("Auth-token");
//   if (!token) return res.send("Access dined");
//   try {
//     const verify = await jwt.verify(token, "asbdasd");
//     if (verify.role != 2) {
//       console.log("dasd");
//       return res.send("Authorization");
//     }
//     req.user = verify;
//     next();
//   } catch (error) {
//     res.send("invalid token");
//   }
// };
// module.exports.adminAuth = (req, res, next) => {};
