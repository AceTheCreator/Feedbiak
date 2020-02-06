const express = require('express');
const router = express.Router();
const sgMail = require('@sendgrid/mail');

const { SENDGRID_API_KEY } = process.env;
sgMail.setApiKey(SENDGRID_API_KEY);

const msg = {
  to: 'leeliam199@gmail.com',
  from: 'devlopergene@gmail.com',
  subject: 'Sending with SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
};
sgMail.send(msg);

module.exports = router;
