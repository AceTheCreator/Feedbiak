const mongoose = require('mongoose');

const { Schema } = mongoose;

const voteSchema = Schema({
  _voters: [String],
  _boardPost: { type: Schema.Types.ObjectId, ref: 'BoardPost' },
});

module.exports = mongoose.model('Vote', voteSchema);
