
const express = require('express');

const router = express.Router();

const sgMail = require('@sendgrid/mail');

const SENDGRID_API_KEY = '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';
sgMail.setApiKey(SENDGRID_API_KEY);

const msg = {
  to: 'leeliam199@gmail.com',
  from: 'devlopergene@gmail.com',
  subject: 'Sending with SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
};
sgMail.send(msg);
