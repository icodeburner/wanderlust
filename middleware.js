const Listing = require("./models/listing");
const Review = require("./models/review");
const { reviewSchema, listingSchema } = require("./schema.js"); //validate the review and listing schema
const ExpressError = require("./utils/expressError.js");

// login middle ware
module.exports.isLoggedin = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl; //This is the request object in Express, which holds all the details of the current HTTP request.
    req.flash("error", "You must be loggedin to create listings");
    return res.redirect("/login");
  }
  next();
};

// we used this middleware because passport always reset all the req.session after login but locals ko reset krne ka acess nhi hota isilie redirect url ko locals me safe kraya hai and call this middleware in routes/user.js
module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

// validation for review schema
module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, msg);
  } else {
    next();
  }
};

// validation for listing schema
module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, msg);
  } else {
    next();
  }
};

// permission middleware for edit update only autherised user can update, delete;
module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner.equals(res.locals.currUser._id)) {
    req.flash("error", "You dont have permission to edit");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

// permission middleware for  delete  only autherised user can ;
module.exports.isReviewAuthor = async (req, res, next) => {
  // this `reviewId` is a path in routes/review.js so we are using same as a variable
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);

  if (!review) {
    req.flash("error", "Review not found");
    return res.redirect(`/listings/${id}`);
  }

  // `req.user `It contains the current logged-in user’s data
  if (!req.user || !review.author.equals(req.user._id)) {
    req.flash("error", "You are not the author of this review");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
