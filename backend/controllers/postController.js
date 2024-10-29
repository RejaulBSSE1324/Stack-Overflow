// controllers/postController.js
const Post = require('../models/Post');
const minioClient = require('../config/minioClient');


exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve posts', details: error.message });
  }
};

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');


const writeFileAsync = promisify(fs.writeFile);
const unlinkAsync = promisify(fs.unlink);

exports.createPost = async (req, res) => {
    const { userId, snippet } = req.body;
    const snippetFile = req.file;

    let snippetFileName = null;

    if (snippetFile) {
        snippetFileName = `${userId}-${Date.now()}-${snippetFile.originalname}`;
        try {
            await new Promise((resolve, reject) => {
                minioClient.putObject(
                    'code-storage',
                    snippetFileName,
                    snippetFile.buffer,
                    snippetFile.size,
                    (err) => {
                        if (err) return reject(err);
                        resolve();
                    }
                );
            });
        } catch (err) {
            return res.status(500).json({ error: 'Error uploading file', details: err.message });
        }
    } else if (snippet) {
        // Generate a file from the snippet text
        snippetFileName = `${userId}-${Date.now()}-snippet.txt`;
        const tempFilePath = path.join(__dirname, snippetFileName);

        try {
            await writeFileAsync(tempFilePath, snippet);

            const fileBuffer = fs.readFileSync(tempFilePath);
            await new Promise((resolve, reject) => {
                minioClient.putObject(
                    'code-storage',
                    snippetFileName,
                    fileBuffer,
                    fileBuffer.length,
                    (err) => {
                        if (err) return reject(err);
                        resolve();
                    }
                );
            });

            await unlinkAsync(tempFilePath);
        } catch (err) {
            return res.status(500).json({ error: 'Error creating file from snippet', details: err.message });
        }
    }

    // Create a new post and save it to the database
    try {
        const newPost = new Post({
            user: userId,
            snippetFileName: snippetFileName || null,
            snippet: snippet || null,
        });
        const savedPost = await newPost.save();

        return res.status(201).json(savedPost);
    } catch (err) {
        return res.status(500).json({ error: 'Error saving post', details: err.message });
    }
};

