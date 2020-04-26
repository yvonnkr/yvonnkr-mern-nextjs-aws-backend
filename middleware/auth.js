const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const User = require("../models/user");

//option 1: using expressJwt  --for ref purposes
exports.requireSignin_expressJwt = expressJwt({
  secret: process.env.JWT_SECRET, // req.user
});

//option 2: using jwt  --prefered
exports.requireSignin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res
      .status(401)
      .json({ error: "No Authorization header, Authentication failed" });
  }

  try {
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ error: "No token provided, authentication failed" });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!decodedToken) {
      return res
        .status(401)
        .json({ error: "Invalid token, authentication failed" });
    }

    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.isAuth = async (req, res, next) => {
  const authUserId = req.user._id;
  try {
    const user = await User.findById({ _id: authUserId });
    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    req.profile = user;
    next();
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.isAdmin = async (req, res, next) => {
  const adminUserId = req.user._id;
  try {
    const user = await User.findById({ _id: adminUserId });
    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    //had option to use "admin" OR 1
    if (user.role !== "admin") {
      return res.status(400).json({
        error: "Admin resource. Access denied",
      });
    }

    req.profile = user;
    next();
  } catch (error) {
    res.status(500).json({ error });
  }
};
