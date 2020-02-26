const router = require('express').Router();
const mongoose = require('mongoose');

// Model requirement
require('../models/Vote');
require('../models/User');
require('../models/BoardPost');

const Vote = mongoose.model('Vote');

router.post('/upvote/:id', (req, res) => {
  Vote.findOne({ _boardPost: req.params.id }, (err, vote) => {
    if (vote) {
      Vote.findOne({ _voters: req.session.userId }, (err, voter) => {
        if (err) throw Error;
        if (voter) {
          voter.remove(req.session.userId);
          res.redirect('/admin');
        }
      });
    } else {
      const newVote = new Vote({
        _voters: req.session.userId,
        _boardPost: req.params.id,
      });
      newVote.save()
        .then((vote) => {
          res.redirect('/admin');
        })
        .catch((err) => {
          throw new Error();
        });
    }
  });
});

module.exports = router;
