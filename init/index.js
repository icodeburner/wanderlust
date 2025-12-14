if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: "../.env" });
}

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = process.env.ATLAS_DB_URL;

main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany();

  const userId = new mongoose.Types.ObjectId("693ea4569e276d483c2c0af1");

  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: userId,
  }));

  await Listing.insertMany(initData.data);
  console.log("Data was initialised");
};

initDB();
