import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  codeSnippet: {
    type: String,  // Store the MinIO URL of the uploaded code snippet
    default: null,
  },
  language: {
    type: String,  // Store the programming language of the code snippet
    default: null, // Make language optional
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Post = mongoose.model('Post', postSchema);

export default Post;
