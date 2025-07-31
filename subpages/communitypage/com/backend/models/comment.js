const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  text: String,
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
    ref: 'Comment'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Comment', commentSchema);
