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
    res.render('routes/inviteIdInput');
  });

router.put('/invite-access', (req, res) => {
  Guest.findById(req.session.passport.user)
    .then((user) => {
      req.session.guestAuthId = req.body.inputInviteId;
      req.session.guestId = user.id;
      user.companyIds = req.body.inputInviteId;
      user.save()
        .then((success) => {
          res.redirect('/admin');
        })
        .catch((failure) => {
          console.error(failure);
        });
    }).catch((err) => {
      console.error(err);
    });
});

module.exports = router;
