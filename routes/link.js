const express = require("express");
const router = express.Router();

// validators
const {
  linkCreateValidator,
  linkUpdateValidator,
} = require("../validators/link");
const { runValidation } = require("../validators/index");

//middleware
const { requireSignin, isAuth } = require("../middleware/auth");

// controllers
const { create, list, read, update, remove } = require("../controllers/link");

// routes
router.post(
  "/link",
  linkCreateValidator,
  runValidation,
  requireSignin,
  isAuth,
  create
);

router.get("/links", list);

router.get("/link/:slug", read);

router.put(
  "/link/:slug",
  linkUpdateValidator,
  runValidation,
  requireSignin,
  isAuth,
  create
);
router.delete("/link/:slug", requireSignin, isAuth, remove);

module.exports = router;
