const express = require('express');

const router = express.Router();
const mongoose = require('mongoose');
// Require Board model
require('../models/Board');
// Require User model
require('../models/User');

const Board = mongoose.model('boards');
const User = mongoose.model('users');


router.get('/create-board', (req, res) => {
  res.render('routes/createBoard.handlebars');
});

// Create board
router.post('/boards', (req, res) => {
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
          .then((board) => {
            console.log('added a new board');
            res.redirect('/admin');
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
});


module.exports = router;
