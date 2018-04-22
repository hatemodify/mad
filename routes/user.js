const express = require('express');
const router = express.Router();
const User = require("../models/User");
const util = require('../util');

router.get("/", function (req, res) {
  User.find({})
    .sort({ username: 1 })
    .exec(function (err, users) {
      if (err) return res.json(err);
      res.render("users/index", { users: users });
    });
});

// signup
router.get("/signup", function (req, res) {
  var user = req.flash("user")[0] || {};
  var errors = req.flash("errors")[0] || {};
  res.render("users/signup", { user: user, errors: errors });
});

// create
router.post("/", function (req, res) {
  User.create(req.body, function (err, user) {
    if (err) return res.json(err);
    res.redirect("/users");
  });
});

// show
router.get("/:username", function (req, res) {
  User.findOne({ username: req.params.username }, function (err, user) {
    if (err) return res.json(err);
    res.render("users/show", { user: user });
  });
});

// edit
router.get("/:username/edit", function (req, res) {
  User.findOne({ username: req.params.username }, function (err, user) {
    if (err) return res.json(err);
    res.render("users/edit", { user: user });
  });
});

// update // 2
router.put("/:username", function (req, res, next) {
  User.findOne({ username: req.params.username }) // 2-1
    .select("password") // 2-2
    .exec(function (err, user) {
      if (err) return res.json(err);

      // update user object
      user.originalPassword = user.password;
      user.password = req.body.signupPassword ? req.body.signupPassword : user.password; // 2-3
      for (var p in req.body) { // 2-4
        user[p] = req.body[p];
      }

      // save updated user
      user.save(function (err, user) {
        if (err) return res.json(err);
        res.redirect("/users/" + req.params.username);
      });
    });
});

module.exports = router;


// Functions
function parseError(errors) {
  var parsed = {};
  if (errors.name == 'ValidationError') {
    for (var name in errors.errors) {
      var validationError = errors.errors[name];
      parsed[name] = { message: validationError.message };
    }
  } else if (errors.code == "11000" && errors.errmsg.indexOf("username") > 0) {
    parsed.username = { message: "This username already exists!" };
  } else {
    parsed.unhandled = JSON.stringify(errors);
  }
  return parsed;
}