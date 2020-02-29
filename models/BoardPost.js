const mongoose = require('mongoose');

const { Schema } = mongoose;

const BoardPost = Schema({
  boardId: {
    type: Schema.Types.ObjectId, ref: 'Board',
  },
  _creator: {
    type: Schema.Types.ObjectId, ref: 'User',
  },
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  voteCount: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    default: 'Open',
  },
  date: { type: Date, default: Date.now },
  _comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
});
const CommentSchema = Schema({
  postId: { type: String },
  username: { type: String },
  text: { type: String },
  date: { type: String },
  avater: { type: String },
});

const Comment = mongoose.model('Comment', CommentSchema);
const Post = mongoose.model('BoardPost', BoardPost);
module.exports = (Comment, Post);
