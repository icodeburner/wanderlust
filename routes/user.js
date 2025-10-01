const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userContoller = require("../controllers/users.js");

router.get("/signup", userContoller.renderSignupForm);

router.post("/signup", wrapAsync(userContoller.signupUsers));

router.get("/login", userContoller.renderLoginForm);

router.post(
  "/login",
  saveRedirectUrl, //middleware.js
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userContoller.loginUsers
);

router.get("/logout", userContoller.logoutUser);

module.exports = router;
