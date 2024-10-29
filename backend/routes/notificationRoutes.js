const express = require('express');
const { getNotifications, createNotification } = require('../controllers/notificationController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Fetch all notifications for the authenticated user
router.get('/', authMiddleware, getNotifications);

// Create a notification (you might want to call this when a post is made)
router.post('/', authMiddleware, createNotification);

module.exports = router;
