const mongoose = require('mongoose');
// Load User Model
require('../models/User');

const User = mongoose.model('users');
module.exports = (req, res, next) => {
  User.findById(req.session.userId, (error, user) => {
    console.log(req.session.userId);
    if (error || !user) {
      return res.redirect('/');
    }
    next();
  });
};
