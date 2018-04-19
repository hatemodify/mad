const http = require('http');
const path = require('path');
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const sass = require('node-sass');
const save = require('summernote-nodejs');
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("./config/passport"); // 1

// const output = save(summernoteContents);

const app = express();


// const views = require("./routes/index")(app);
// const posts = require("./routes/posts")(app); 

mongoose.connect("mongodb://admin:asdasd12@ds145299.mlab.com:45299/maaadb"); // 1
const db = mongoose.connection; // 2

db.once("open", function () {
  console.log("DB connected");
});

db.on("error", function (err) {
  console.log("DB ERROR : ", err);
});


app.set('port', process.env.PORT || 3000);
app.set("view engine", "ejs");


app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(flash());
app.use(session({secret:"MySecret"}));

app.use(passport.initialize());
app.use(passport.session());

// Custom Middlewares // 3
app.use(function (req, res, next) {
  res.locals.isAuthenticated = req.isAuthenticated();
  res.locals.currentUser = req.user;
  next();
});



// const router = express.Router();
app.use("/", require("./routes/index"));
app.use("/posts", require("./routes/posts"));
app.use("/users", require("./routes/user"));




http.createServer(app).listen(app.get('port'), function () {
  console.log('server started' + app.get('port'));
  // connectionDb();
});
