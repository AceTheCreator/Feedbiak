const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();
// User model
require('../models/User');

const User = mongoose.model('users');
const sgMail = require('@sendgrid/mail');

router.get('/send-invitation', (req, res) => {
  // const SENDGRID_API_KEY = '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';
  // sgMail.setApiKey(SENDGRID_API_KEY);
  // const msg = {
  //   to: 'leeliam199@gmail.com',
  //   from: 'devlopergene@gmail.com',
  //   subject: 'Sending with SendGrid is Fun',
  //   text: 'and easy to do anywhere, even with Node.js',
  //   html: '<strong>and easy to do anywhere, even with Node.js</strong>',
  // };
  // sgMail.send(msg);
  res.render('routes/invite.handlebars');
});

router.post('/send-invite', (req, res) => {
  const SENDGRID_API_KEY = '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';
  sgMail.setApiKey(SENDGRID_API_KEY);
  User.findOne({ _id: req.session.userId })
    .then((user) => {
      const msg = {
        to: req.body.emailAddresses,
        from: user.email,
        subject: 'You have been invited to join a team on Feebiak',
        text: 'Feedbiak is a simple, organized place to keep track of feedback from customers and teammates.',
        html: '<div class="email-body"> <h1>Feebiak</h1><br><p>Canny is a simple, organized place to keep track of feedback from customers and teammates.</p> <br> <button>Join Team</button> </div>',
      };
      sgMail.send(msg);
    });
  res.redirect('/send-invitation');
});
// router.post('/send-invite', (req, res) => {
//   const SENDGRID_API_KEY = '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';
//   sgMail.setApiKey(SENDGRID_API_KEY);
//   const msg = {
//     to: req.body.emailAddresses,
//     from: 'devaze007@gmail.com',
//     subject: 'Sending with SendGrid is Fun',
//     text: 'and easy to do anywhere, even with Node.js',
//     html: '<strong>and easy to do anywhere, even with Node.js</strong> <br> <button>Join Team</button>',
//   };
//   sgMail.send(msg);
//   res.render('routes/invite.handlebars');
// });

module.exports = router;
