const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const passport = require("../helpers/passport");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

/**
 * @route POST api/users
 * @description Register new user
 * @access Public
 */
router.post("/", userController.register);

/**
 * @route POST api/users/login
 * @description login
 * @access Public
 */
router.post("/login", userController.loginWithEmail);

/**
 * @route POST api/users/login/facebook/
 * @description login with facebook
 * @access Public
 */
router.post(
  "/login/facebook",
  passport.authenticate("facebook-token"),
  userController.loginWithFacebook
);

module.exports = router;
