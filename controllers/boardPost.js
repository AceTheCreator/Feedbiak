const express = require('express');

const router = express.Router();

// Get Post
router.get('/board-post/123', (req, res) => {
  res.send('Hello');
});


module.exports = router;
