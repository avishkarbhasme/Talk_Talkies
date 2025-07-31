const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');

// Get all comments
router.get('/', async (req, res) => {
  const comments = await Comment.find().sort({ createdAt: -1 });
  res.json(comments);
});

// Post new comment
router.post('/', async (req, res) => {
  const { text, parentId } = req.body;
  const newComment = new Comment({ text, parentId: parentId || null });
  await newComment.save();
  res.status(201).json(newComment);
});

// Delete comment and its replies
router.delete('/:id', async (req, res) => {
  const commentId = req.params.id;

  try {
    await Comment.deleteMany({ parentId: commentId }); // delete replies
    await Comment.findByIdAndDelete(commentId);        // delete comment
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting comment' });
  }
});

module.exports = router;
