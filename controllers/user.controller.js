const User = require("../models/user");
const jwt = require("jsonwebtoken");
const userController = {};
const bcrypt = require("bcryptjs");

userController.register = async (req, res, next) => {
  try {
    let { name, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) return next(new Error(403, "User already exists"));
    user = await User.create({
      name,
      email,
      password,
    });

    res.status(200).json({
      status: true,
      data: user,
    });
  } catch (err) {
    console.log("error :", err);
    res.status(400).json({
      status: false,
      message: err.message,
    });
  }
};

userController.loginWithEmail = async (req, res, next) => {
  try {
    let { email, password } = req.body;

    console.log({ email, password });
    let user = await User.findOne({ email }, "+password");
    if (!user)
      return next(new Error(400, "Invalid credentials", "Login Error"));

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return next(new Error(400, "Wrong password", "Login Error"));

    accessToken = await user.generateToken();
    user = user.toJSON();

    res.status(200).json({
      status: true,
      data: { user, accessToken },
    });
  } catch (err) {
    console.log("error :", err);
    res.status(400).json({
      status: false,
      message: err.message,
    });
  }
};

userController.loginWithFacebook = async (req, res, next) => {
  try {
    let profile = req.user;
    profile.email = profile.email.toLowerCase();
    let user = await User.findOne({ email: profile.email });
    const randomPassword = "" + Math.floor(Math.random() * 10000000);
    const salt = await bcrypt.genSalt(10);
    const newPassword = await bcrypt.hash(randomPassword, salt);

    if (user) {
      if (!user.emailVerified) {
        user = await User.findByIdAndUpdate(
          user._id,
          {
            $set: { emailVerified: true, avatarUrl: profile.avatarUrl },
            $unset: { emailVerificationCode: 1 },
          },
          { new: true }
        );
      } else {
        user = await User.findByIdAndUpdate(
          user._id,
          { avatarUrl: profile.avatarUrl },
          { new: true }
        );
      }
    } else {
      user = await User.create({
        name: profile.name,
        email: profile.email,
        password: newPassword,
        avatarUrl: profile.avatarUrl,
      });
    }

    const accessToken = await user.generateToken();
    user = user.toJSON();

    res.status(200).json({
      status: true,
      data: { user, accessToken },
    });
  } catch (err) {
    console.log("error :", err);
    res.status(400).json({
      status: false,
      message: err.message,
    });
  }
};

module.exports = userController;
