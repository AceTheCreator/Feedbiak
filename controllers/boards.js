/* eslint-disable no-shadow */
const express = require('express');

const router = express.Router();
const mongoose = require('mongoose');
// Require Board model
require('../models/Board');

const Board = mongoose.model('boards');

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
          // eslint-disable-next-line no-unused-vars
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

// Get board route
router.get('/board/:id', async (req, res) => {
  Board.findOne({
    _id: req.params.id,
  })
    .then((board) => {
      res.render('routes/board.handlebars');
    });
});


module.exports = router;
