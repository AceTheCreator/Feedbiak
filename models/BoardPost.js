const mongoose = require('mongoose');

const { Schema } = mongoose;

const BoardPost = Schema({
  boardId: {
    type: String,
  },
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  date: { type: Date, default: Date.now },
  upvote: {
    type: Number,
    default: 0,
  },
  comment: [{
    body: String,
    date: Date,
  }],
});

module.exports = mongoose.model('boardPost', BoardPost);
