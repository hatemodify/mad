const express = require('express');
const router   = express.Router();
const User     = require("../models/User");


router.get("/", function(req, res){
    User.find({})
    .sort({username:1})
    .exec(function(err, users){
     if(err) return res.json(err);
     res.render("users/index", {users:users});
    });
   });
   
   // signup
   router.get("/signup", function(req, res){
    res.render("users/signup", {user:{}});
   });
   
   // create
   router.post("/", function(req, res){
    User.create(req.body, function(err, user){
     if(err) return res.json(err);
     res.redirect("/users");
    });
   });
   
   // show
   router.get("/:username", function(req, res){
    User.findOne({username:req.params.username}, function(err, user){
     if(err) return res.json(err);
     res.render("users/show", {user:user});
    });
   });
   
   // edit
   router.get("/:username/edit", function(req, res){
    User.findOne({username:req.params.username}, function(err, user){
     if(err) return res.json(err);
     res.render("users/edit", {user:user});
    });
   });
   
   // update // 2
   router.put("/:username",function(req, res, next){
    User.findOne({username:req.params.username}) // 2-1
    .select("password") // 2-2
    .exec(function(err, user){
     if(err) return res.json(err);
   
     // update user object
     user.originalPassword = user.password;
     user.password = req.body.signupPassword? req.body.signupPassword : user.password; // 2-3
     for(var p in req.body){ // 2-4
      user[p] = req.body[p];
     }
   
     // save updated user
     user.save(function(err, user){
      if(err) return res.json(err);
      res.redirect("/users/"+req.params.username);
     });
    });
   });
   
   module.exports = router;