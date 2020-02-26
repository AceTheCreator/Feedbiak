const mongoose = require('mongoose');

const { Schema } = mongoose;

const voteSchema = Schema({
  _voters: { type: Schema.Types.ObjectId, ref: 'User' },
  _board: { type: Schema.Types.ObjectId, ref: 'Board' },
  _boardPost: { type: Schema.Types.ObjectId, ref: 'BoardPost' },
});

module.exports = mongoose.model('Vote', voteSchema);
