const router = require('express').Router();
const mongoose = require('mongoose');

// Model requirement
require('../models/Vote');
require('../models/User');
require('../models/BoardPost');

const Vote = mongoose.model('Vote');
const BoardPost = mongoose.model('BoardPost');

router.post('/upvote/:id', (req, res) => {
  Vote.findOne({ _boardPost: req.params.id }, (err, vote) => {
    if (vote) {
      Vote.findOne({ _voters: req.session.userId }, (err, voter) => {
        if (err) throw Error;
        if (voter) {
          voter.remove(req.session.userId);
          BoardPost.findById(req.params.id).then((upvoted) => {
            const upvote = upvoted.voteCount - 1;
            upvoted.voteCount = upvote;
            upvoted.save();
            console.log(upvoted);
          });
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
          BoardPost.findById(req.params.id).then((upvoted) => {
            const upvote = upvoted.voteCount + 1;
            upvoted.voteCount = upvote;
            upvoted.save();
            console.log(upvoted);
          });
          res.redirect('/admin');
        })
        .catch((err) => {
          throw new Error();
        });
    }
  });
});

module.exports = router;
