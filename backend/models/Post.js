// models/Post.js
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  snippetFileName: String, // Name of the code snippet file stored in MinIO
  snippet: String, // Text content of the code snippet
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Post', postSchema);
