const express = require('express');

const mongoose = require('mongoose');

const router = express.Router();
// Board Post model
require('../models/BoardPost');

const Post = mongoose.model('boardPost');

// Get Post
router.get('/board-post/:id', (req, res) => {
  Post.findOne({
    _id: req.params.id,
  })
    .then((post) => {
      res.render('routes/post.handlebars', {
        post,
      });
    });
});


module.exports = router;
