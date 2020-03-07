const router = require('express').Router();
const mongoose = require('mongoose');

// Model requirement
require('../models/Vote');
require('../models/User');
require('../models/BoardPost');

const Vote = mongoose.model('Vote');
const BoardPost = mongoose.model('BoardPost');

// router.post('/upvote/:id', (req, res) => {
//   BoardPost.findById(req.param.id)
//     .then((post) => {
//       console.log(post);
//     }).catch((err) => {
//       console.error(err);
//     });
//   // BoardPost.findOne({ _id: req.params.id }, (err, vote) => {
//   //   if (vote) {
//   //     let dummy;
//   //     dummy = vote.voter;
//   //     for (let i = 0; i < dummy.length; i++) {
//   //       if (dummy[i] == req.session.userId || '5e623c49df3f963ec10eb805') {
//   //         dummy.pop(req.session.userId);
//   //         console.log(dummy);
//   //       } else {
//   //         dummy.push(req.session.userId || '5e623c49df3f963ec10eb805');
//   //         console.log(`clone${dummy}`);
//   //         break;
//   //       }
//   //     }
//   //     // if (vote._voter = req.session.userId || req.session.guestId) {
//   //     //   vote.remove(req.session.userId || req.session.guestId);
//   //     //   BoardPost.findById(req.params.id).then((upvoted) => {
//   //     //     const upvote = upvoted.voteCount - 1;
//   //     //     upvoted.voteCount = upvote;
//   //     //     upvoted.save();
//   //     //     console.log(upvoted);
//   //     //     res.redirect('/admin');
//   //     //   });
//   //     // }
//   //   }
//   // });
// });

module.exports = router;
