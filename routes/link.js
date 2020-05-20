const express = require("express");
const router = express.Router();

// validators
const {
  linkCreateValidator,
  linkUpdateValidator,
} = require("../validators/link");
const { runValidation } = require("../validators/index");

//middleware
const {
  requireSignin,
  isAuth,
  isAdmin,
  canUpdateDeleteLink,
} = require("../middleware/auth");

// controllers
const {
  create,
  list,
  read,
  update,
  remove,
  clickCount,
  getPopularLinks,
  getPopularLinksInCategory,
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

//@get all links
router.get("/links", requireSignin, isAdmin, list);

//@get link click count
router.put("/click-count", clickCount);

//@get most popular links
router.get("/links/popular/", getPopularLinks);

//@get most popular links in category
router.get("/links/popular/:category", getPopularLinksInCategory);

//@read single link
router.get("/link/:id", read);

//@user can update their own link only
router.put(
  "/link/:id",
  linkUpdateValidator,
  runValidation,
  requireSignin,
  isAuth,
  canUpdateDeleteLink,
  update
);

//@admin only can update any link
router.put(
  "/link/admin/:id",
  linkUpdateValidator,
  runValidation,
  requireSignin,
  isAdmin,
  update
);

//@user can delete their own link only
router.delete("/link/:id", requireSignin, isAuth, canUpdateDeleteLink, remove);

//@admin only can delete any link
router.delete("/link/admin/:id", requireSignin, isAdmin, remove);

module.exports = router;
