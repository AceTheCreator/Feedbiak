const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();
// User model
require('../models/User');

const User = mongoose.model('User');
const sgMail = require('@sendgrid/mail');

router.get('/send-invitation', (req, res) => {
  res.render('routes/invite.handlebars');
});

router.post('/send-invite', (req, res) => {
  sgMail.setApiKey(process.env.SENDGRIDAPIKEY);
  User.findOne({ _id: req.session.userId })
    .then((user) => {
      const msg = {
        to: req.body.emailAddresses,
        from: user.email,
        subject: 'You have been invited to join a team on Feebiak',
        text: `invitation id ${user.id}`,
        html: `<div class="email-body"> <h1>Feebiak</h1><br><p>Canny is a simple, organized place to keep track of feedback from customers and teammates.</p> <br> <a href="localhost:8081/invite/${user.id}"><button style="background:green">Join Team</button></a> </div>`,
      };
      sgMail.send(msg);
      req.flash('success_msg', 'Succesfully sent invitations to emails');
      res.redirect('/send-invitation');
    });
});

module.exports = router;
