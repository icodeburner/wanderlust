const User = require("../models/user");

module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.signupUsers = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ username, email });
    const registerdUser = await User.register(newUser, password);
    console.log(registerdUser);
    req.login(registerdUser, (err) => {
      if (err) {
        return next(err);
      } else {
        req.flash("success", "Welcome to WanderLust");
        res.redirect("/listings");
      }
    });
  } catch (err) {
    req.flash("error", "Some Error please try again letter");
    res.redirect("/signup");
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.loginUsers = async (req, res) => {
  try {
    req.flash("success", "Welcome to WanderLust");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
  } catch (error) {
    req.flash("error", "Some error please try again letter");
  }
};

module.exports.logoutUser = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next();
    }
    req.flash("success", "You logged out");
    res.redirect("/listings");
  });
};
