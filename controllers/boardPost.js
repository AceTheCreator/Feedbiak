const express = require('express');

const mongoose = require('mongoose');

const router = express.Router();
// Board Post model
require('../models/BoardPost');
require('../models/User');

const Post = mongoose.model('boardPost');
const Comment = mongoose.model('comment');
const User = mongoose.model('users');

// Get Post
let postsId;
let admin;
router.get('/board-post/:id', (req, res, next) => {
  postsId = req.params.id;
  if (req.session.userId) {
    admin = 'T';
    return Post.findOne({
      _id: req.params.id,
    })
      .then((post) => {
        console.log(post.comments.username);
        res.render('routes/post.handlebars', {
          post,
          admin,
        });
      });
  }
  return Post.findOne({
    _id: req.params.id,
  })
    .then((post) => {
      res.render('routes/post.handlebars', {
        post,
      });
    });
});
// Edit Board Post
router.put('/board-post/edit/:id', (req, res) => {
  Post.findOne({
    _id: req.params.id,
  })
    .then((post) => {
    // set new values
      post.title = req.body.title;
      post.description = req.body.description;
      post.save()
        .then(() => {
          res.redirect(`/board-post/${postsId}`);
        });
    });
});
// Board Post Votes
router.put('/vote', (req, res) => {
  Post.findOne({ _id: postsId })
    .then((post) => {
      // add a vote
      post.save()
        .then((post) => {
          res.redirect(`/board-post/${postsId}`);
        });
    });
});
// Set Board Post Status
router.put('/post/edit/:id', (req, res) => {
  Post.findOne({
    _id: req.params.id,
  })
    .then((post) => {
    // new values
      post.status = req.body.progress;
      post.save()
        .then((post) => {
          res.redirect(`/board-post/${postsId}`);
        });
    });
  console.log('HELLO');
});

// Delete Board Post
router.delete('/post/:id', (req, res) => {
  Post.remove({
    _id: req.params.id,
  })
    .then((post) => {
      req.flash('success_msg', 'Post successfully deleted');
      res.redirect('/admin');
    });
});
// Put Comment
let commentuser;
router.post('/post-comment', (req, res) => {
  User.findOne({
    _id: req.session.userId,
  })
    .then((user) => {
      commentuser = user.fullname;
      console.log(commentuser);
    });
  const newComment = new Comment({
    postId: postsId,
    username: commentuser,
    text: req.body.commentText,
    date: Date.now(),
    avater: 'https://www.shareicon.net/data/512x512/2016/05/24/770139_man_512x512.png',
  });
  newComment.save()
    .then((comment) => {
      res.redirect(`/board-post/${postsId}`);
    })
    .catch((err) => {
      throw err;
    });
  console.log('A new request has been made');
});


module.exports = router;
