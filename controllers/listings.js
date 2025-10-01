const Listing = require("../models/listing");

// index
module.exports.index = async (req, res) => {
  const { category } = req.query; // get category from query string
  let allListings;

  // filter
  if (category) {
    // console.log("Category query:", category);
    allListings = await Listing.find({ category: category });
  } else {
    allListings = await Listing.find({});
  }
  res.render("listings/index.ejs", { allListings, category });
};

// new
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

// show
module.exports.showListings = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } }) // we are use nested populate for review ke sath author ka bhi naam aa print ho jaye
    .populate("owner"); // use populate for show everything from object like from comment -> review, comment, data and time
  if (!listing) {
    req.flash("error", "Your Listings does not exist");
    res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

// create
module.exports.createListings = async (req, res, next) => {
  // let {title, description, price, location, country} = req.body; // this is old syntax
  let url = req.file.path;
  let filename = req.file.filename;
  let newListing = new Listing(req.body.listing); // only using this syntax we can find all info
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  await newListing.save();
  req.flash("success", "Listing created");
  res.redirect("/listings");
};

// update
module.exports.UpdateListings = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }); //we are deconstructing the values jo form se aa rhi hai
  if (typeof req.file != "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

// delete
module.exports.deleteListings = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id); // after this code a middleware will run for delete all the reviews after deleting listing and the middleware located id models/listing
  req.flash("success", "Listing Deleted");
  res.redirect("/listings");
};
