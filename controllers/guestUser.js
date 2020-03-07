const passport = require('passport');
const router = require('express').Router();
const mongoose = require('mongoose');

// Import guest model
require('../models/GuestUser');

const Guest = mongoose.model('guests');

router.get('/invite', (req, res) => {
  res.render('auth/guestLogin.handlebars');
});

router.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));
router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    console.log('Hello');
    Guest.findById(req.session.passport.user)
      .then((user) => {
        console.log(user);
        req.session.guestAuthId = '5e623c0e5a53df3e6da6a95e';
        req.session.guestId = user.id;
        res.redirect('/admin');
        console.log(req.session.guestId);
      }).catch((err) => {
        console.error(err);
      });
  });

module.exports = router;
