const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing");
const { isLoggedin, isOwner, validateListing } = require("../middleware");
const listingController = require("../controllers/listings.js");
const multer = require("multer"); // multer is an npm library used in Node.js for handling file uploads in web applications
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage }); // Configure destination folder, it will create a folder with name wanderLust_DEV and store image in that folder

// listings
// we are using router.route coz there are 2 request come same route so we can do this

// index route
router.get("/", wrapAsync(listingController.index));

// new route
router.get("/new", isLoggedin, listingController.renderNewForm);

// create route
router.post(
  "/",
  isLoggedin,
  upload.single("listing[image]"),
  validateListing,
  wrapAsync(listingController.createListings)
);

// show route
router.get("/:id", wrapAsync(listingController.showListings));

// edit route
router.get(
  "/:id/edit",
  isLoggedin,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    req.flash("success", "Listing Edited!");
    res.render("listings/edit.ejs", { listing });
  })
);

// update route
router.put(
  "/:id",
  isLoggedin,
  isOwner,
  upload.single("listing[image]"),
  validateListing,
  wrapAsync(listingController.UpdateListings)
);

// router.get("/listning", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "Villa",
//     description: "By the beach",
//     price: 1200,
//     location: "Calangute, Goa",
//     country: "India",
//   });
//   await sampleListing.save();
//   res.send("Sent");
// });

// delete route for listing
router.delete(
  "/:id",
  isLoggedin,
  isOwner,
  wrapAsync(listingController.deleteListings)
);

module.exports = router;
