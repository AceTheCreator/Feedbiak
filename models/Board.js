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
});

module.exports = mongoose.model('boards', boardSchema);
