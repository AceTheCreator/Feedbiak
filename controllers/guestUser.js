/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
const express = require('express');

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const router = express.Router();

// Load users model
require('../models/User');
require('../models/GuestUser');

const User = mongoose.model('users');
const Guest = mongoose.model('guests');

// Signup route
router.get('/invite/:id', (req, res) => {
  User.findOne({ _id: req.params.id })
    .then((invite) => {
      res.render('auth/guestSignup.handlebars');
    })
    .catch(err => {
      res.redirect('/');
      throw err;
    });
});
// Login
router.get('/invite/login', (req, res) => {
  res.render('auth/guestLogin.handlebars');
});

// User Login Form Post
router.post('/invite/login', (req, res) => {
  const {
    email,
    password,
  } = req.body;
  // Try to find a user
  Guest.findOne({
    email,
  }, (error, guest) => {
    if (guest) {
      // Compare the passwords
      bcrypt.compare(password, guest.password, (error, same) => {
        if (same) {
          req.session.guestId = guest.companyId;
          res.redirect(`/admin/${guest.companyId}`);
        } else {
          req.flash('error_msg', 'OOoops you entered a wrong password');
          res.redirect('/invite/login');
        }
      });
    } else {
      req.flash('error_msg', 'email or password not correct');
      res.redirect('/invite/login');
    }
  });
});

// User Register Form Post
router.post('/invite/signup', (req, res) => {
  const errors = [];
  if (req.body.password.length < 4) {
    errors.push({ text: 'Password must be at 4 characters' });
  }
  if (errors.length > 0) {
    res.render('/invite/signup', {
      errors,
      fullname: req.body.fullname,
      email: req.body.email,
      companyId: req.body.companyId,
      password: req.body.password,
    });
  } else {
    Guest.findOne({ email: req.body.email })
      .then((user) => {
        if (user) {
          req.flash('error_msg', 'Email already exist');
          res.redirect('/invite/signup');
        } else {
          const newGuest = new Guest({
            fullname: req.body.fullname,
            email: req.body.email,
            companyId: req.body.companyId,
            password: req.body.password,
          });
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newGuest.password, salt, (err, hash) => {
              if (err) throw err;
              // Store hash in your password DB.
              newGuest.password = hash;
              newGuest.save()
                .then((user) => {
                  req.flash('success_msg', 'Your account has been created');
                  res.redirect('/invite/login');
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
