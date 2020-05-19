const express = require("express");

//validators
const { userUpdateValidator } = require("../validators/auth");
const { runValidation } = require("../validators/index");

//middleware
const { requireSignin, isAuth, isAdmin } = require("../middleware/auth");

//contrloller
const { getProfile, updateProfile } = require("../controllers/user");

const router = express.Router();

//routes
router.get("/user", requireSignin, isAuth, getProfile);
router.get("/admin", requireSignin, isAdmin, getProfile);
router.put(
  "/user",
  userUpdateValidator,
  runValidation,
  requireSignin,
  isAuth,
  updateProfile
);

module.exports = router;
