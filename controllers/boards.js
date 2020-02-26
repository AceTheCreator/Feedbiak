/* eslint-disable no-shadow */
const express = require('express');

const router = express.Router();
const mongoose = require('mongoose');
// Require the Auth middleware
const Auth = require('../middlewares/auth');
// Require Board model
require('../models/Board');
// Require Board Post Model
require('../models/BoardPost');
// Require Votes model
require('../models/Vote');

const Board = mongoose.model('Board');
const Post = mongoose.model('BoardPost');
const Vote = mongoose.model('Vote');

// Global Variables
let postidentifier;
let admin;
let voteCount;

router.get('/create-board', Auth, (req, res) => {
  if (req.session.userId || req.session.guestId) {
    admin = 'T';
    res.render('routes/createBoard.handlebars', {
      admin,
    });
  } else {
    res.render('routes/createBoard.handlebars');
  }
});

// Create board
router.post('/boards', Auth, (req, res) => {
  const {
    boardName,
    boardUrl,
  } = req.body;
  // Try to find a board
  Board.findOne({ boardName, boardUrl })
    .then((board) => {
      if (board) {
        console.log('board already exist');
        res.redirect('/create-board');
      } else {
        const newBoard = new Board({
          _creator: req.session.userId,
          boardName: req.body.boardName,
          boardUrl: req.body.boardUrl,
        });
        newBoard.save()
          // eslint-disable-next-line no-unused-vars
          .then((board) => {
            res.redirect(`/admin/${req.session.userId}`);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
});

// Get board route
router.get('/board/:id', async (req, res) => {
  postidentifier = req.params.id;
  if (req.session.userId) {
    admin = 'T';
    return Post.find({ boardId: req.params.id })
      .sort({ date: 'desc' })
      .then((posts) => {
        const a = [];
        posts.map((post) => {
          a.push(post);
        });
        Vote.find().then((votes) => {
          for (let i = 0; i < a.length; i++) {
            for (let j = 0; j < votes.length; j++) {
              console.log(votes[j])
              console.log(a[i].id)
              if (votes[j].id === a[i].id) {
                console.log('found one');
              }
            }
          }
        });
        // for (let i = 0; i < a.length; i++) {
        //   Vote.find({ _boardPost: a[i] })
        //     .then((votes) => {
        //       console.log(votes.length);
        //     });
        // }
        res.render('routes/board.handlebars', {
          posts,
          admin,
        });
      });
  }
});

// Create board post
router.post('/create-post', Auth, async (req, res) => {
  const newPost = new Post({
    _creator: req.session.userId,
    boardId: postidentifier,
    title: req.body.postTitle,
    description: req.body.postDescription,
  });
  newPost.save()
    .then((post) => {
      res.redirect(`/board/${postidentifier}`);
    })
    .catch((err) => {
      throw err;
    });
});

module.exports = router;
