if (!process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate"); //EJS Mate ek npm library hai jo EJS (Embedded JavaScript Templates) ke sath kaam karti hai.
// Ye mainly layouts, partials aur reusable templates banane ke liye use hoti hai.
const ExpressError = require("./utils/expressError.js");
const listingsRoute = require("./routes/listings.js");
const reviewRoute = require("./routes/reviews.js");
const session = require("express-session");
const MongoStore = require("connect-mongo"); // this is used for when we deployed our application on the server.
const flash = require("connect-flash");
const passport = require("passport"); //It provides a framework to handle user login, logout, and session management.
const LocalStrategy = require("passport-local"); //This strategy lets users log in using a username and password stored in your database.
const User = require("./models/user.js");
const UserRoute = require("./routes/user.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.engine("ejs", ejsMate);
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderLust";
const dbUrl = process.env.ATLAS_DB_URL;

// this is used for when we deployed our application on the server.
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", () => {
  console.log("ERROR in MONGO SESSION STORE", err);
});

const sessionOption = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expire: 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

const port = 8080;

main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

// app.use((req, res, next) => {
//   console.log('>>> REQUEST:', req.method, req.originalUrl);
//   console.log('   params:', req.params);
//   console.log('   query:', req.query);
//   console.log('   body:', req.body);
//   next();
// });

app.get("/", (req, res) => {
  res.redirect("/listings");
});

// session
app.use(session(sessionOption));
app.use(flash());

// we use passport after session because we dont want to relogin again and again so the passport use session isiliye hum session k baad passport use kr rhe hain
app.use(passport.initialize()); // Activates Passport for handling auth.
app.use(passport.session()); // mere browser ko pata hona chiaye ki jo request ek page se alag page se aa rhi hai vo same user bhej rha hai ya different.
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); //Runs when a user logs in successfully. and It decides what user data (usually the user’s ID) should be stored in the session cookie.
passport.deserializeUser(User.deserializeUser()); //Runs on every request after login. It uses the stored ID from the session to fetch the full user object from the database.

// flash middleware
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user; // this code store current user information which user loggedin
  next();
});

// // demo user login
// app.get("/demouser", async (req, res) => {
//   let fakeUser = new User({
//     email: "student@gmail.com",
//     username: "Ansh",
//   });
//   let registerdUser = await User.register(fakeUser, "Helloworld"); // You don’t need to manually hash passwords or handle salts. It integrates smoothly with Passport’s local strategy for authentication.
//   res.send(registerdUser);
// });

// this is using listing route
app.use("/listings", listingsRoute);
// review route
app.use("/listings/:id/reviews", reviewRoute);
// user --> signup/login route
app.use("/", UserRoute);

// npm install express@4 use this command for run this code or latest version
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("listings/error.ejs", { message });
});

app.listen(port, () => {
  console.log(`app is listning ${port}`);
});
