const mongoose = require('mongoose');
// Load User Model
require('../models/User');

const User = mongoose.model('User');
module.exports = (req, res, next) => {
  User.findById(req.session.userId, (error, user) => {
    if (error || !user) {
      console.log('OOops weve got an error');
      return res.redirect('/');
    }
    next();
  });
};
