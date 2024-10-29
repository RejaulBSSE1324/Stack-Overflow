import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await api.get('/notifications');
        setNotifications(response.data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };
    fetchNotifications();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Notifications</h2>
      {notifications.length === 0 ? (
        <p>No notifications available</p>
      ) : (
        <ul>
          {notifications.map(notification => (
            <li key={notification._id} style={{ padding: '10px', border: '1px solid #ddd', marginBottom: '10px' }}>
              <h4>New Post Notification</h4>
              <p><strong>Title:</strong> {notification.post.title}</p>
              <p><strong>Content:</strong> {notification.post.content}</p>
              <p><strong>Code Snippet:</strong></p>
              <pre style={{ backgroundColor: '#f8f8f8', padding: '10px' }}>
                {notification.post.snippet}
              </pre>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
