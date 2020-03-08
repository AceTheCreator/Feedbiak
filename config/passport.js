
const mongoose = require('mongoose');
const passport = require('passport');

// Guest user data model
require('../models/GuestUser');

const GuestUser = mongoose.model('guests');

// Passport serialization and decerialization
passport.serializeUser((user, cb) => {
  cb(null, user.id);
});
passport.deserializeUser((obj, cb) => {
  GuestUser.findOne({ providerId: obj })
    .then((user) => {
      cb(null, obj);
    });
});

const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLECLIENTID,
  clientSecret: process.env.GOOGLECLIENTSECRET,
  callbackURL: '/auth/google/callback',
},
((token, tokenSecret, profile, done) => {
  GuestUser.findOne({ providerId: profile.id }, (err, user) => {
    if (err) throw new Error();
    if (!user) {
      const newGuestUser = new GuestUser({
        providerId: profile.id,
        fullname: profile.displayName,
      });
      newGuestUser.save()
        .then((user) => {
        });
    }

    return done(err, user);
  });
}
)));
