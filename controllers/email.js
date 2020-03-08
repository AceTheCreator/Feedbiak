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
        text: `${user.fullname} has invited you to join their team to improve their product, Your invitation id is ${user.id}. Note: The invitation id will be used to access the platform`,
        html: '<div class="email-body" style="text-align:center;"> <h1>Feebiak</h1><br><p> is a simple, organized place to keep track of feedback from customers and teammates.</p> <br>  <a href="https://feedbiak.herokuapp.com/invite"> click here to get started</a> </div>',
      };
      sgMail.send(msg);
      req.flash('success_msg', 'Succesfully sent invitations to emails');
      res.redirect('/send-invitation');
    });
});

module.exports = router;
