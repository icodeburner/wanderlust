const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
});

userSchema.plugin(passportLocalMongoose); // we use this line for `passport-local-mongoose` add username, salt password, hashing, hash password;
module.exports = mongoose.model("User", userSchema);
