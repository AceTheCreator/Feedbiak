const mongoose = require('mongoose');

const { Schema } = mongoose;

const boardSchema = Schema({
  _creator: { type: Schema.Types.ObjectId, ref: "User" },
  boardName: {
    type: String,
  },
  boardUrl: {
    type: String,
  },
});

module.exports = mongoose.model('Board', boardSchema);
