const mongoose = require('mongoose');

const { Schema } = mongoose;

const BoardPost = Schema({
  boardId: {
    type: String,
  },
  boardOwner: {
    type: String,
  },
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  status: {
    type: String,
    default: 'Open',
  },
  date: { type: Date, default: Date.now },
  upvote: {
    type: Number,
    default: 0,
  },
  comments: [{ type: Schema.Types.ObjectId, ref: 'comment' }],
});
const CommentSchema = Schema({
  postId: { type: String },
  username: { type: String },
  text: { type: String },
  date: { type: Date },
  avater: { type: String },
});

const Comment = mongoose.model('comment', CommentSchema);
const Post = mongoose.model('boardPost', BoardPost);
module.exports = (Comment, Post);
