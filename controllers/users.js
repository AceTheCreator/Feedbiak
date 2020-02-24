/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
const express = require('express');

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// RedirectifAuthenticated Middleware
const redirectIfAuth = require('../middlewares/redirectIfAuth');

const router = express.Router();

// Signup route
router.get('/signup', redirectIfAuth, (req, res) => {
  res.render('auth/signup.handlebars');
});
// Login
router.get('/login', redirectIfAuth, (req, res) => {
  res.render('auth/login.handlebars');
});

// Load users model
require('../models/User');

const User = mongoose.model('users');

// User Login Form Post
router.post('/users/login', (req, res) => {
  const {
    email,
    password,
  } = req.body;
  // Try to find a user
  User.findOne({
    email,
  }, (error, user) => {
    if (user) {
      // Compare the passwords
      bcrypt.compare(password, user.password, (error, same) => {
        if (same) {
          req.session.userId = user.id;
          res.redirect(`/admin/${req.session.userId}`);
        } else {
          req.flash('error_msg', 'OOoops you entered a wrong password');
          res.redirect('/login');
        }
      });
    } else {
      console.log('wrong credentials');
      req.flash('error_msg', 'email or password not correct');
      res.redirect('/login');
    }
  });
});

// User Register Form Post
router.post('/users/signup', (req, res) => {
  const errors = [];
  if (req.body.password.length < 4) {
    errors.push({ text: 'Password must be at 4 characters' });
  }
  if (errors.length > 0) {
    res.render('/signup', {
      errors,
      fullname: req.body.fullname,
      email: req.body.email,
      organization: req.body.organization,
      url: req.body.url,
      password: req.body.password,
    });
  } else {
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (user) {
          req.flash('error_msg', 'Email already exist');
          res.redirect('/signup');
        } else {
          const newUser = new User({
            fullname: req.body.fullname,
            email: req.body.email,
            organization: req.body.organization,
            url: req.body.url,
            password: req.body.password,
          });
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              // Store hash in your password DB.
              newUser.password = hash;
              newUser.save()
                .then((user) => {
                  req.flash('success_msg', 'Your account has been created');
                  res.redirect('/login');
                })
                .catch((err) => {
                  console.log(err);
                });
            });
          });
        }
      });
  }
});
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});


module.exports = router;
