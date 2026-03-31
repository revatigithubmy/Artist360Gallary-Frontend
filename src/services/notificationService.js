import api from './api';

const notificationService = {
  // Get current user's notifications
  getUserNotifications: () => {
    return api.get('/notifications');
  },
  
  // Get unread notifications count
  getUnreadCount: (userId) => {
    return api.get(`/notifications/unread/${userId}`);
  },
  
  // Mark notification as read
  markAsRead: (notificationId) => {
    return api.put(`/notifications/${notificationId}/read`);
  },
  
  // Delete notification
  deleteNotification: (notificationId) => {
    return api.delete(`/notifications/${notificationId}`);
  },
  
  // Clear all notifications
  clearAll: () => {
    return api.delete(`/notifications/clear`);
  }
};

export default notificationService;
