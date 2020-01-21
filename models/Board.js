const mongoose = require('mongoose');

const { Schema } = mongoose;

const boardSchema = Schema({
  boardOwner: {
    type: String,
  },
  boardName: {
    type: String,
  },
  boardUrl: {
    type: String,
  },
  boardPost: {
    boardPostTitle: {
      type: String,
    },
    boardPostDescription: {
      type: String,
    },
    boardPostProgress: {
      type: Array,
    },
  },
});

module.exports = mongoose.model('boards', boardSchema);
