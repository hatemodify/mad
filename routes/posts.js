// const Post = require('../models/Post');

// module.exports = function (app){
//     app.get('/posts', (req, res) => {
//         Post.find({})
//             .sort('-createdAt')
//             .exec((err, posts) => {
//                 if (err) return res.json(err);
//                 res.render('posts/index', { posts: posts });
//             });
//     });
    
//     app.get('/posts/new', (req, res) => {
//         res.render('posts/new');
//     });
    
//     app.post('/posts', (req, res) => {
//         Post.created(req.body, (err, post) => {
//             if (err) return res.json(err);
//             res.redirect('/posts');
//         });
//     });
    
//     app.get('/:id', (req, res) => {
//         Post.findOne({ _id: req.params.id }, (err, post) => {
//             if (err) return res.json(err);
//             res.render('posts/show', { post: post });
//         });
//     });
    
//     // edit
//     app.get("/:id/edit", function (req, res) {
//         Post.findOne({ _id: req.params.id }, function (err, post) {
//             if (err) return res.json(err);
//             res.render("posts/edit", { post: post });
//         });
//     });
    
//     // update
//     app.put("/:id", function (req, res) {
//         req.body.updatedAt = Date.now(); // 2
//         Post.findOneAndUpdate({ _id: req.params.id }, req.body, function (err, post) {
//             if (err) return res.json(err);
//             res.redirect("/posts/" + req.params.id);
//         });
//     });
    
//     // destroy
//     app.delete("/:id", function (req, res) {
//         Post.remove({ _id: req.params.id }, function (err) {
//             if (err) return res.json(err);
//             res.redirect("/posts");
//         });
//     });
    
// }


var express  = require("express");
var router   = express.Router();
var Post     = require("../models/Post");

// Index
router.get("/", function(req, res){
  Post.find({})
  .sort("-createdAt")
  .exec(function(err, posts){
    if(err) return res.json(err);
    res.render("posts/index", {posts:posts});
  });
});

// New
router.get("/new", function(req, res){
  res.render("posts/new");
});

// create
router.post("/", function(req, res){
  Post.create(req.body, function(err, post){
    if(err) return res.json(err);
    res.redirect("/posts");
  });
});

// show
router.get("/:id", function(req, res){
  Post.findOne({_id:req.params.id}, function(err, post){
    if(err) return res.json(err);
    res.render("posts/show", {post:post});
  });
});

// edit
router.get("/:id/edit", function(req, res){
  Post.findOne({_id:req.params.id}, function(err, post){
    if(err) return res.json(err);
    res.render("posts/edit", {post:post});
  });
});

// update
router.put("/:id", function(req, res){
  req.body.updatedAt = Date.now();
  Post.findOneAndUpdate({_id:req.params.id}, req.body, function(err, post){
    if(err) return res.json(err);
    res.redirect("/posts/"+req.params.id);
  });
});

// destroy
router.delete("/:id", function(req, res){
  Post.remove({_id:req.params.id}, function(err){
    if(err) return res.json(err);
    res.redirect("/posts");
  });
});

module.exports = router;