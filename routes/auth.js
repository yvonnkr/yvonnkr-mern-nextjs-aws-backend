const express = require("express");
const router = express.Router();

const {
  userRegisterValidator,
  userSigninValidator,
} = require("../validators/auth");
const { runValidation } = require("../validators/index");
const { register, signin, signout } = require("../controllers/auth");
const { requireSignin, isAuth, isAdmin } = require("../middleware/auth");

router.post("/register", userRegisterValidator, runValidation, register);
router.post("/signin", userSigninValidator, runValidation, signin);
router.get("/signout", signout);

// test
router.get("/secret", requireSignin, isAuth, isAdmin, (req, res) => {
  res.json({
    user: req.user,
  });
});

module.exports = router;
