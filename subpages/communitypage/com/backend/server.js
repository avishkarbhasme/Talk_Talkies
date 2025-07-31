const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const commentsRoute = require('./routes/comments');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/youtube-comments');

app.use('/api/comments', commentsRoute);

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
