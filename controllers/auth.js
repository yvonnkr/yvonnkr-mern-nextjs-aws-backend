const shortId = require("shortid");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: "Email is taken." });
    }

    const newUser = new User({
      username: shortId.generate(),
      name,
      email,
      password,
    });

    await newUser.save();

    res.json({
      message: "Signup success! Please signin.",
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    //check pswrd --.authenticate is defined as a userSchema method
    const isAuth = user.authenticate(password);
    if (!isAuth) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    //generate-token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    //set-cookie
    res.cookie("token", token, { expiresIn: "1d" });

    //response
    const { _id, username, name, role } = user;
    res.json({
      token,
      user: { _id, username, name, role },
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.signout = (req, res) => {
  res.clearCookie("token");

  res.json({ message: "Signout success" });
};
