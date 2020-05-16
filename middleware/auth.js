const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const User = require("../models/user");
const Link = require("../models/link");

//option 1: using expressJwt  --for ref purposes
exports.requireSignin_expressJwt = expressJwt({
  secret: process.env.JWT_SECRET,

  //#region more about express-jwt
  /* 
   The default behavior of the module is to extract the JWT from the Authorization header as an OAuth2 Bearer token.
   Then will set req.user
   */
  //#endregion
});

//option 2: using jwt  --prefered
exports.requireSignin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res
      .status(401)
      .json({ error: "No Authorization header, authentication failed" });
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

    req.user = { _id: decodedToken._id };
    next();
  } catch (error) {
    res.status(500).json({ error });
  }
};

//prettier-ignore
exports.isAuth = async (req, res, next) => {
  const authUserId = req.user._id;
  try {
    const user = await User.findById({ _id: authUserId }, "-hashed_password -salt");
    if (!user) {
      return res.status(401).json({
        error: "User not found",
      });
    }

    req.profile = user;
    next();
  } catch (error) {
    res.status(500).json({ error });
  }
};

//prettier-ignore
exports.isAdmin = async (req, res, next) => {
  const adminUserId = req.user._id;
  try {
    const user = await User.findById({ _id: adminUserId }, "-hashed_password -salt");
    if (!user) {
      return res.status(401).json({
        error: "User not found",
      });
    }

    //had option to use "admin" OR 1
    if (user.role !== "admin") {
      return res.status(401).json({
        error: "Admin resource. Access denied",
      });
    }

    req.profile = user;
    next();
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.canUpdateDeleteLink = async (req, res, next) => {
  const linkId = req.params.id;
  const userId = req.user._id;

  try {
    const link = await Link.findById(linkId);

    if (!link) {
      return res.status(404).json({ error: "Link not found." });
    }

    const userIsLinkCreator = link.postedBy.toString() === userId.toString();

    if (!userIsLinkCreator) {
      return res.status(400).json({
        error: "Forbidden, User cannot update/delete other user's link",
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ error });
  }
};
