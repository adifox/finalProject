/*jshint esversion:6*/
const express           = require("express");
const authController    = express.Router();
const passport          = require("passport");

// the user model
const User           = require("../models/user");

// Bcrypt for encrypting passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;

// authController.get("/signup", (req, res, next)=>{
//     res.render("signup");
// });

authController.post("/signup", (req, res, next) => {
  var email = req.body.email;
  var password = req.body.password;
  // console.log(req.body);
  if (!email || !password) {
    res.status(400).json({ message: "Provide email and password" });
    return;
  }

  User.findOne({ email }, "email", (err, user) => {
    if (user !== null) {
      res.status(400).json({ message: "The username already exists" });
      return;
    }

    var salt     = bcrypt.genSaltSync(bcryptSalt);
    var hashPass = bcrypt.hashSync(password, salt);

    var newUser = User({
      email,
      password: hashPass
    });

    newUser.save((err) => {
      if (err) {
        res.status(400).json({ message: "Something went wrong" });
      } else {
        req.login(newUser, function(err) {
          if (err) {
            return res.status(500).json({
              message: 'something went wrong :('
            });
          }
          res.status(200).json(req.user);
        });
      }
    });
  });
});

authController.get("/login" ,function(req, res, next) {
    if(req.isAuthenticated()){
        console.log('Returning user here TEST: ', req.user);
      return res.status(200).json(req.user);
    }
    return res.status(403).json({ message: 'Unauthorized' });});



authController.post("/login", function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }

    if (!user) { return res.status(401).json(info); }

    req.login(user, function(err) {
      if (err) {
        return res.status(500).json({
          message: 'something went wrong :('
        });
      }
      res.status(200).json(req.user);
    });
  })(req, res, next);
});


authController.post("/logout", function(req, res, next) {
  req.logout();
  res.status(200).json({ message: 'Success' });
});


authController.get("/loggedin" ,function(req, res, next) {
    if(req.isAuthenticated()){
      return res.status(200).json(req.user);
    }
    return res.status(403).json({ message: 'Unauthorized' });});


authController.get("/private", (req, res, next) => {
  if(req.isAuthenticated()) {
    return res.json({ message: 'This is a private message' });
  }

  return res.status(403).json({ message: 'Unauthorized' });
});


module.exports = authController;
