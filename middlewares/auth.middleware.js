const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const verifyJWT = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
  
    if (!token) {
      return res.status(401).json({ Message: "Unauthorized request" });
    }
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  
    const user = await User.findById(decodedToken._id).select("-password");
    if (!user) {
      return res.status(404).json({ Message: "User not found" });
    }
    req.user = user;

    next();
  } catch (error) {
    return res.status(500).json({Message: error})
  }
};

module.exports = { verifyJWT };