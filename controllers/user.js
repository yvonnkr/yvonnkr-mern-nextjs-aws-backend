const User = require("../models/user");
const Link = require("../models/link");

exports.getProfile = async (req, res) => {
  //when requireSignIn middleware is checked the req.user should be set with user id from token
  //when isAuth/isAdmin middleware is checked the req.profile should be set with user details
  const userId = req.user;
  const profile = req.profile;

  try {
    //check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    //find all user links
    const userLinks = await Link.find({ postedBy: userId })
      .populate("categories", "name slug")
      .populate("postedBy", "name")
      .sort({ createdAt: -1 });

    res.json({ profile, userLinks });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  const userId = req.user._id;
  const { name, password, categories } = req.body;

  //if password validate
  switch (true) {
    case password && password.length < 6:
      return res
        .status(422)
        .json({ error: "Password must be atleast 6 characters long" });
  }

  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { name, password, categories },
      { new: true }
    );

    updatedUser.salt = undefined;
    updatedUser.hashed_password = undefined;

    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
