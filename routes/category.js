const express = require("express");
const router = express.Router();

//validators
const { runValidation } = require("../validators");
const {
  categoryCreateValidator,
  categoryUpdateValidator,
} = require("../validators/category");

//middleware
const { requireSignin, isAdmin } = require("../middleware/auth");

//controllers
const {
  create,
  list,
  read,
  update,
  remove,
} = require("../controllers/category");

// routes
router.post(
  "/category",
  categoryCreateValidator,
  runValidation,
  requireSignin,
  isAdmin,
  create
);

router.get("/categories", list);

router.get("/category/:slug", read);

// router.put('/category/:slug', categoryUpdateValidator, runValidation, requireSignin, isAdmin, create);
router.put(
  "/category/:slug",
  categoryUpdateValidator,
  runValidation,
  requireSignin,
  isAdmin,
  update
);

router.delete("/category/:slug", requireSignin, isAdmin, remove);

module.exports = router;
