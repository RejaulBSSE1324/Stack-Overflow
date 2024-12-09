import express from 'express';
import { 
    getNotifications, 
    deleteNotification, 
    markNotificationsAsRead, 
    getUnreadNotificationCount 
} from '../controllers/notificationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all notifications for the user
router.route('/').get(protect, getNotifications);

// Get the count of unread notifications for badge display
router.route('/unread-count').get(protect, getUnreadNotificationCount);

// Mark all notifications as read
router.route('/mark-as-read').post(protect, markNotificationsAsRead);

// Delete a specific notification by ID
router.route('/:id').delete(protect, deleteNotification);

export default router;
