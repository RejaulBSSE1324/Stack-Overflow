// routes/postRoutes.js
const express = require('express');
const multer = require('multer');
const { createPost, getAllPosts } = require('../controllers/postController');
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Route to create a new post
router.post('/', upload.single('snippetFile'), createPost);

// Route to get all posts
router.get('/', getAllPosts);

module.exports = router;
