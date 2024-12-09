import minioClient from '../config/minioClient.js';
import Post from '../models/postModel.js';
import { v4 as uuidv4 } from 'uuid';
import multer from 'multer';
import { createPostNotification } from './notificationController.js';

// Configure multer for file uploads
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // limit file size to 5MB
});

// Helper function to ensure the bucket exists in MinIO
const ensureBucketExists = async (bucketName) => {
    return new Promise((resolve, reject) => {
        minioClient.bucketExists(bucketName, (err, exists) => {
            if (err) {
                return reject(new Error('Error checking bucket existence: ' + err.message));
            }
            if (!exists) {
                minioClient.makeBucket(bucketName, (err) => {
                    if (err) {
                        return reject(new Error('Error creating bucket: ' + err.message));
                    }
                    resolve();
                });
            } else {
                resolve();
            }
        });
    });
};

// Helper function to get the appropriate file extension based on the programming language
const getFileExtension = (language) => {
    switch (language) {
        case 'C++': return 'cpp';
        case 'Python': return 'py';
        case 'JavaScript': return 'js';
        case 'Java': return 'java';
        default: return 'txt';
    }
};

// Helper function to upload to MinIO and get a public URL
const uploadToMinIO = async (bucketName, fileName, content, metaData) => {
    return new Promise((resolve, reject) => {
        minioClient.putObject(bucketName, fileName, content, metaData, (err) => {
            if (err) return reject('Error uploading to MinIO: ' + err);

            // Generate a presigned URL with long expiration for public access
            minioClient.presignedUrl('GET', bucketName, fileName, 7 * 24 * 60 * 60, (err, presignedUrl) => {
                if (err) return reject('Error generating presigned URL: ' + err);
                resolve(presignedUrl);
            });
        });
    });
};

// @desc Get all posts with public code snippet URLs for each post
// @route GET /api/posts
// @access Private
export const getPosts = async (req, res) => {
    try {
        const posts = await Post.find({}).populate('user', 'name').sort({ createdAt: -1 });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc Create a new post with either a code snippet or file uploaded to MinIO and send notifications
// @route POST /api/posts
// @access Private
export const createPost = [
    upload.single('file'),  // Middleware to handle file upload
    async (req, res) => {
        const { title, content, codeSnippet, language } = req.body;

        if (!title || !content || (!codeSnippet && !req.file)) {
            return res.status(400).json({ message: 'Title, content, and either a code snippet or file are required' });
        }

        try {
            let codeSnippetUrl = null;

            // Ensure the bucket exists
            await ensureBucketExists(process.env.MINIO_BUCKET);

            if (req.file) {
                // Handle file upload
                const fileName = uuidv4() + `_${req.file.originalname}`;
                const metaData = { 'Content-Type': req.file.mimetype };

                // Upload file to MinIO
                codeSnippetUrl = await uploadToMinIO(process.env.MINIO_BUCKET, fileName, req.file.buffer, metaData);
            } else if (codeSnippet && language) {
                // Handle code snippet upload
                const fileExtension = getFileExtension(language);
                const fileName = uuidv4() + `.${fileExtension}`;
                const metaData = { 'Content-Type': 'text/plain' };

                // Convert the codeSnippet to a buffer
                const buffer = Buffer.from(codeSnippet, 'utf-8');
                codeSnippetUrl = await uploadToMinIO(process.env.MINIO_BUCKET, fileName, buffer, metaData);
            }

            // Create the post in MongoDB
            const post = new Post({
                user: req.user._id,
                title,
                content,
                codeSnippet: codeSnippetUrl,
                language: language || null,
            });

            const createdPost = await post.save();

            // Populate the user's name for notification
            await createdPost.populate('user', 'name');

            await createPostNotification(createdPost);

            res.status(201).json(createdPost);
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ message: 'Server Error' });
        }
    }
];

// @desc Get a single post by ID
// @route GET /api/posts/:id
// @access Private
export const getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('user', 'name');
        if (post) {
            res.json(post);
        } else {
            res.status(404).json({ message: 'Post not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export const getCodeSnippetContent = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post || !post.codeSnippet) {
            return res.status(404).json({ message: 'Post or code snippet not found' });
        }

        // Extract the filename from the code snippet URL
        const fileName = post.codeSnippet.split('/').pop();

        // Get the object from MinIO
        minioClient.getObject(process.env.MINIO_BUCKET, fileName, (err, dataStream) => {
            if (err) {
                return res.status(500).json({ message: 'Error fetching file from MinIO' });
            }

            let data = '';
            dataStream.on('data', (chunk) => {
                data += chunk; // Concatenate chunks of data
            });

            dataStream.on('end', () => {
                res.json({ content: data }); // Send the content back
            });

            dataStream.on('error', (error) => {
                res.status(500).json({ message: 'Error reading file stream' });
            });
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

