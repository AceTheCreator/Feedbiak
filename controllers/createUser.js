const User = require('../models/User');

module.exports = (req, res, next) => {
  // Server side validation
  const errors = [];
  if (req.body.password < 4) {
    errors.push({ text: 'passworded must be longer than 4 characters' });
  }
  // checking if there is error
  if (errors.length > 0) {
    res.render('users/register', {
      errors,
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2,
    });
  } else {
    User.findOne({
      email: req.body.email,
    })
      .then((user) => {
        if (user) {
          console.log('Email already exist');
        } else {
          User.create(req.body, (error, user) => {
            if (error) {
              return res.redirect('/signup');
            }
            res.redirect('/');
          });
        }
      });
  }
};
