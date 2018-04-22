const express = require('express');
const router = express.Router();
const passport = require("../config/passport");
const flash = require("connect-flash");

router.get('/', (req, res) => {
  res.render('index', { title: 'MAD' });
});

router.get('/about', (req, res) => {
  res.render('about', { title: 'ABOUT' });
});

router.get('/portfolio', (req, res) => {
  res.render('portfolio');
});

router.get('/contact', (req, res) => {
  res.render('contact', { title: 'CONTACT' });
});


// Login // 2
router.get("/login", function (req, res) {
  var username = req.flash("username")[0];
  var errors = req.flash("errors")[0] || {};
  res.render("login", {
    username: username,
    errors: errors
  });
});

// Post Login // 3
router.post("/login",
  function (req, res, next) {
    var errors = {};
    var isValid = true;
    if (!req.body.username) {
      isValid = false;
      errors.username = "Username is required!";
    }
    if (!req.body.password) {
      isValid = false;
      errors.password = "Password is required!";
    }

    if (isValid) {
      next();
    } else {
      req.flash("errors", errors);
      res.redirect("/login");
    }
  },
  passport.authenticate("local-login", {
    successRedirect: "/",
    failureRedirect: "/login"
  }
  ));

// Logout // 4
router.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});



module.exports = router;
// module.exports = function (app) {
//     app.get('/', function (req, res) {
//         res.render('index', {
//             title: 'MAD'
//         });
//     });
//     app.get('/about', function (req, res) {
//         res.render('about', {
//             title: 'About'
//         });
//     });
//     app.get('/project', function (req, res) {
//         res.render('project', {
//             title: 'Project'
//         });
//     });
//     app.get('/user', function (req, res) {
//         res.render('user.ejs', {
//             title: 'user'
//         });
//     });
// }