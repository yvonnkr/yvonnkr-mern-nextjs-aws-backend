const shortId = require("shortid");
const jwt = require("jsonwebtoken");
const { registerEmailParams, sendEmailOnRegister } = require("../aws/email");

const User = require("../models/user");

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

//FIXME:
exports.logout = (req, res) => {
  res.json({ message: "Signout success" });
};
