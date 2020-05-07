const shortId = require("shortid");
const jwt = require("jsonwebtoken");
const _ = require("lodash");

const User = require("../models/user");
const {
  registerEmailParams,
  sendEmailOnRegister,
  forgotPasswordEmailParams,
  sendEmailOnforgotPassword,
} = require("../aws/email");

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    //check if user exists already
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: "Email is taken." });
    }

    //generate- account activation token with {name,email,password}
    const token = jwt.sign(
      { name, email, password },
      process.env.JWT_ACCOUNT_ACTIVATION,
      {
        expiresIn: "2d",
      }
    );

    //aws --ses params
    const params = registerEmailParams(email, token);

    // //send activation email
    await sendEmailOnRegister(params);

    res.json({
      message: `Email has been sent to ${email},follow the intruction to complete your registration.`,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.registerActivate = async (req, res) => {
  const { token } = req.body;
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION);

    if (!decodedToken) {
      return res
        .status(401)
        .json({ error: "Invalid token, activation failed" });
    }

    const { name, email, password } = decodedToken;

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: "User already activated." });
    }

    const newUser = new User({
      username: shortId.generate(),
      name,
      email,
      password,
    });

    await newUser.save();

    res.json({ message: "Registration Success! Please signin." });
  } catch (error) {
    console.log(error);

    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
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
      expiresIn: "7d",
    });

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

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    //check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ error: "User with given email does not exist." });
    }

    //generate- account activation token with {name,email,password}
    const token = jwt.sign(
      { name: user.name },
      process.env.JWT_RESET_PASSWORD,
      { expiresIn: "2d" }
    );

    //aws email params
    const params = forgotPasswordEmailParams(email, token);

    // populate the db > user > resetPasswordLink
    await user.updateOne({ resetPasswordLink: token });

    // send activation email
    await sendEmailOnforgotPassword(params);

    res.json({
      message: `Email has been sent to ${email},Click on the link to reset your password`,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  const { newPassword, resetPasswordLink } = req.body; //resetPasswordLink == token set on forgot-password

  try {
    //verify token
    const decodedToken = jwt.verify(
      resetPasswordLink,
      process.env.JWT_RESET_PASSWORD
    );

    if (!decodedToken) {
      return res
        .status(401)
        .json({ error: "Invalid token, reset-password failed" });
    }

    let user = await User.findOne({ resetPasswordLink });
    if (!user) {
      return res.status(400).json({ error: "Invalid token. Try again" });
    }

    const updatedFields = {
      password: newPassword,
      resetPasswordLink: "",
    };

    user = _.extend(user, updatedFields); //using lodash.extend()

    await user.save();

    res.json({
      message: `Great! Now you can login with your new password`,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
