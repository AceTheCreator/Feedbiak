const express = require('express');

const mongoose = require('mongoose');
const moment = require('moment');

const router = express.Router();
// Board Post model
require('../models/BoardPost');
require('../models/User');
require('../models/GuestUser');
require('../models/Vote');


const Post = mongoose.model('BoardPost');
const Comment = mongoose.model('Comment');
const User = mongoose.model('User');
const Guest = mongoose.model('guests');
const Votes = mongoose.model('Vote');

// Get Post
let postsId;
let admin;
router.get('/board-post/:id', (req, res, next) => {
  postsId = req.params.id;
  if (req.session.userId || req.session.guestAuthId) {
    admin = 'T';
    return Post.findByIdAndUpdate(req.params.id)
      .populate({
        path: '_votes',
      })
      .populate({
        path: '_comments',
      })
      .then((post) => {
        const voteCount = post.voter.length;
        Comment.find({ postId: req.params.id })
          .then((comment) => {
            res.render('routes/post.handlebars', {
              voteCount,
              post,
              admin,
              comment,
            });
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
let commentUser;
router.post('/post-comment/:id', (req, res) => {
  const getDate = moment().format('MMM Do YY');
  const currentUser = req.session.userId || req.session.guestId;
  if (currentUser === req.session.userId) {
    User.findOne({
      _id: currentUser,
    })
      .then((user) => {
        commentUser = user.fullname;
      });
  } else if (currentUser === req.session.guestId) {
    Guest.findOne({
      _id: currentUser,
    }).then((guest) => {
      commentUser = guest.fullname;
    });
  }
  const newComment = new Comment({
    postId: postsId,
    username: commentUser,
    text: req.body.commentText,
    date: getDate,
    avater: 'https://www.shareicon.net/data/512x512/2016/05/24/770139_man_512x512.png',
  });
  newComment.save()
    .then((newComment) => {
      Post.findById(req.params.id).then((comment) => {
        const countComment = comment.commentCount + 1;
        comment.commentCount = countComment;
        comment.save();
      });
      res.redirect(`/board-post/${postsId}`);
    })
    .catch((err) => {
      throw err;
    });
});

// Voting Implementation
router.post('/upvote/:id', (req, res) => {
  Post.findOne({ _id: req.params.id })
    .then((post) => {
      if (post) {
        const authVote = req.session.userId || req.session.guestId;
        console.log(authVote);
        let voteCount;
        voteCount = post.voter;
        for (let i = 0, voteLength = voteCount.length; i <= voteLength; i++) {
          if (voteCount[i] == authVote) {
            voteCount.pop(authVote);
            post.voter.pop(authVote);
            break;
          } else {
            voteCount.push(authVote);
            post.voter.push(authVote);
            console.log(post.voter);
            post.save();
          }
        }
        req.flash('success_msg', 'vote implemented successfully');
        res.redirect('/admin');
      }
    }).catch((err) => {
      console.error(err);
    });
});
module.exports = router;
