const mongoose = require("mongoose");
const Schema = mongoose;
const Review = require("./review");

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  image: {
    filename: {
      type: String,
    },
    url: {
      type: String,
    },
  },
  price: {
    type: Number,
  },
  location: {
    type: String,
  },
  country: {
    type: String,
  },
  reviews: [
    {
      type: Schema.Types.ObjectId, // it only store the id and we have to import schema after that it will run
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  category: {
    type: String,
    enum: [
      "trending",
      "rooms",
      "iconic_cities",
      "mountains",
      "castles",
      "amazing_pools",
      "camping",
      "farms",
      "artics",
    ],
    required: true,
  },
});

// it is a middle ware for deleting review after delete the listing and it will automatic run after deleting any listing
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

// create model
const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;