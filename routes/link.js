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
const {
  create,
  list,
  read,
  update,
  remove,
  clickCount,
} = require("../controllers/link");

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

router.put("/click-count", clickCount);

router.get("/link/:id", read);

router.put(
  "/link/:id",
  linkUpdateValidator,
  runValidation,
  requireSignin,
  isAuth,
  update
);
router.delete("/link/:id", requireSignin, isAuth, remove);

module.exports = router;
