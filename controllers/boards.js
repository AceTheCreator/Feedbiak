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

const Board = mongoose.model('boards');
const Post = mongoose.model('boardPost');

router.get('/create-board', Auth, (req, res) => {
  res.render('routes/createBoard.handlebars');
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
          boardOwner: req.session.userId,
          boardName: req.body.boardName,
          boardUrl: req.body.boardUrl,
        });
        newBoard.save()
          // eslint-disable-next-line no-unused-vars
          .then((board) => {
            console.log('added a new board');
            req.session.boardId = board.id;
            res.redirect('/admin');
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
});

// Create board post
router.post('/create-post', Auth, async (req, res) => {
  const newPost = new Post({
    boardId: req.session.boardId,
    title: req.body.postTitle,
    description: req.body.postDescription,
  });
  newPost.save()
    .then((post) => {
      res.redirect(`board/${req.session.boardId}`);
    })
    .catch((err) => {
      throw err;
    });
});

// Get board route
router.get('/board/:id', Auth, async (req, res) => {
  Post.find({
    boardId: req.params.id,
  })
  // Post.find({ boardId: req.session.boardId })
  //   .sort({ date: 'desc' })
    .then((posts) => {
      res.render('routes/board.handlebars', {
        posts,
      });
    });
});

module.exports = router;
