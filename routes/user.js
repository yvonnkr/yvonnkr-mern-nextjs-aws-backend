const express = require("express");

const { requireSignin, isAuth, isAdmin } = require("../middleware/auth");
const { getProfile } = require("../controllers/user");

const router = express.Router();

router.get("/user", requireSignin, isAuth, getProfile);
router.get("/admin", requireSignin, isAdmin, getProfile);

module.exports = router;
