const express = require("express");
const router = express.Router();

const { runValidation } = require("../validators/index");
const {
  userRegisterValidator,
  userLoginValidator,
} = require("../validators/auth");
const {
  register,
  registerActivate,
  login,
  logout,
} = require("../controllers/auth");

router.post("/register", userRegisterValidator, runValidation, register);
router.post("/register/activate", registerActivate);
router.post("/login", userLoginValidator, runValidation, login);
router.get("/logout", logout);

module.exports = router;
