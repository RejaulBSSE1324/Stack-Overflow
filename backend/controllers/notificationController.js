const Notification = require('../models/Notification');
const Post = require('../models/Post');

// Fetch all notifications for the logged-in user
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id }).populate('post');
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Server error while fetching notifications' });
  }
};

// Create a notification when a post is made
exports.createNotification = async (req, res) => {
  const { postId, userId } = req.body;

  try {
    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const newNotification = new Notification({
      user: userId, // User who will receive the notification
      post: postId,
    });

    await newNotification.save();
    res.status(201).json(newNotification);
  } catch (error) {
    res.status(500).json({ error: 'Error creating notification' });
  }
};
