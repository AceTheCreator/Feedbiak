const express = require('express');

const router = express.Router();


router.get('/guestauth/:id', (req, res) => {
  console.log('Hello world');
});
