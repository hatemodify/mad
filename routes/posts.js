const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const util = require("../util");

// Index
router.get("/", function (req, res) {
  Post.find({})
    .populate("author") // 1
    .sort("-createdAt")
    .exec(function (err, posts) {
      if (err) return res.json(err);
      res.render("posts/index", { posts: posts, title: 'Posts', 'category': 'all posts' });
    });
});

// New
router.get("/new", util.isLoggedin, function (req, res) {
  const post = req.flash("post")[0] || {};
  const errors = req.flash("errors")[0] || {};
  res.render("posts/new", { post: post, errors: errors });
});

// create
router.post("/", util.isLoggedin, function (req, res) {
  req.body.author = req.user._id;  
  Post.create(req.body, function (err, post) {
    if (err) {
      req.flash("post", req.body);
      req.flash("errors", util.parseError(err));
      return res.redirect("/posts/new");
    }
    res.redirect("/posts");
  });
});

// router.get("/:category", function (req, res) {
//   Post.find({
//     "category": req.params.category
//   })
//     .sort("-createdAt")
//     .exec(function (err, posts) {
//       if (err) return res.json(err);
//       res.render("posts/index", { posts: posts, title: `${req.params.category}`, 'category': req.params.category });
//     });
// });

router.get("/javascript", function(req, res){
  Post.find({
    "category":"javascript"
  })
  .sort("-createdAt")
  .exec(function(err, posts){
    if(err) return res.json(err);
    res.render("posts/index", {posts:posts, title:'Posts', 'category' : 'javascript'});
  });
});

router.get("/vue", function(req, res){
  Post.find({
    "category":"vue"
  })
  .sort("-createdAt")
  .exec(function(err, posts){
    if(err) return res.json(err);
    res.render("posts/index", {posts:posts, title:'Posts', category:'vue'});
  });
});




// create
router.post("/", function (req, res) {  
  req.body.author = req.user._id; // 2
  Post.create(req.body, function (err, post) {
    if (err) {
      req.flash("post", req.body);
      req.flash("errors", util.parseError(err));
      return res.redirect("/posts/new");
    }
    res.redirect("/posts");
  });
});

// show

router.get("/:title", function (req, res) {
  Post.findOne({ title: req.params.title }) // 3
    .populate("author")               // 3
    .exec(function (err, post) {        // 3
      if (err) return res.json(err);
      res.render("posts/show", { 
        post: post 
      });
    });
});


// edit
router.get("/:id/edit", function (req, res) {
  Post.findOne({ _id: req.params.id }, function (err, post) {
    if (err) return res.json(err);
    res.render("posts/edit", { post: post });
  });
});

// update
router.put("/:id", function (req, res) {
  req.body.updatedAt = Date.now();
  Post.findOneAndUpdate({ _id: req.params.id }, req.body, function (err, post) {
    if (err) return res.json(err);
    res.redirect("/posts/" + req.params.id);
  });
});

// destroy
router.delete("/:id", function (req, res) {
  Post.remove({ _id: req.params.id }, function (err) {
    if (err) return res.json(err);
    res.redirect("/posts");
  });
});

module.exports = router;