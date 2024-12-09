import Notification from '../models/notificationModel.js';
import User from '../models/userModel.js';

// @desc    Get unread notifications count for the logged-in user
// @route   GET /api/notifications/unread-count
// @access  Private
export const getUnreadNotificationCount = async (req, res) => {
    try {
        // Count only unread notifications for the logged-in user
        const unreadCount = await Notification.countDocuments({ user: req.user._id, read: false });
        res.json({ count: unreadCount });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all notifications for the logged-in user
// @route   GET /api/notifications
// @access  Private
export const getNotifications = async (req, res) => {
    try {
        // Retrieve notifications specific to the logged-in user, sorted by creation date
        const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Mark all notifications as read for the logged-in user
// @route   POST /api/notifications/mark-as-read
// @access  Private
export const markNotificationsAsRead = async (req, res) => {
    try {
        // Update notifications to mark them as read for the logged-in user
        await Notification.updateMany({ user: req.user._id, read: false }, { read: true });
        res.status(200).json({ message: 'Notifications marked as read' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create notifications for all users except the post creator
export const createPostNotification = async (post) => {
    try {
        // Find all users except the post creator
        const users = await User.find({ _id: { $ne: post.user._id } });
        const notifications = users.map((user) => ({
            user: user._id,
            post: post._id, // Reference to the post ID
            message: `${post.user.name} uploaded a new post: "${post.title}"`,
            read: false, // Unread status by default
        }));

        // Insert notifications for other users in bulk
        await Notification.insertMany(notifications);
    } catch (error) {
        console.error('Error creating notifications:', error);
    }
};

// @desc    Delete a single notification for the logged-in user
// @route   DELETE /api/notifications/:id
// @access  Private
export const deleteNotification = async (req, res) => {
    try {
        // Delete notification if it belongs to the logged-in user
        const notification = await Notification.findOneAndDelete({ _id: req.params.id, user: req.user._id });
        
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }
        
        res.json({ message: 'Notification deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Clean up notifications older than seven days
export const cleanOldNotifications = async () => {
    try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        // Delete notifications older than 7 days
        const result = await Notification.deleteMany({ createdAt: { $lt: sevenDaysAgo } });
        console.log(`Deleted ${result.deletedCount} old notifications`);
    } catch (error) {
        console.error('Error cleaning old notifications:', error);
    }
};
