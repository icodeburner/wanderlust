const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing");
const Review = require("../models/review");
const {isLoggedin, validateReview, isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");


// reviews
// post route
router.post(
  "/",
  isLoggedin, //we are using isloggedin here to prevent API request taaki koi unauthorised person cannot send any request using API
  validateReview,
  wrapAsync(reviewController.postReview)
);

// delete route for reviews
router.delete(
  "/:reviewId",
  isReviewAuthor,
  wrapAsync(reviewController.deleteReview)
);

module.exports = router;