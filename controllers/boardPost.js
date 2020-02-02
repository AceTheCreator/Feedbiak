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
// router.get('/board-post/:id', (req, res) => {
//   postsId = req.params.id;
//   Post.findOne({
//     _id: req.params.id,
//   })
//     .then((post) => {
//       res.render('routes/post.handlebars', {
//         post,
//       });
//     });
// });
router.get('/board-post/:id', (req, res) => {
  postsId = req.params.id;
  Post.findOne({
    _id: req.params.id,
  }, (error, post) => {
    if (post) {
      Comment.find({
        postId: req.params.id,
      })
        .sort({ date: 'desc' })
        .then((comment) => {
          res.render('routes/post.handlebars', {
            comment,
          });
        });
    } else {
      console.log('Something went wrong');
    }
  });
});

// Set Board Status
router.put('/post/edit/:id', (req, res) => {
  Post.findOne({
    _id: req.params.id,
  })
    .then((post) => {
    // new values
      post.boardStatus = 'Completed';
      post.save()
        .then((post) => {
          res.redirect('/admin');
        });
    });
  console.log('HELLO');
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
