import { useEffect, useState, useRef } from 'react';
import { Bell, X, Check, Trash2 } from 'lucide-react';
import notificationService from '../../services/notificationService';
import { useAuth } from '../../context/AuthContext';

const NotificationBell = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await notificationService.getUserNotifications();
      const allNotifications = Array.isArray(res.data) ? res.data : (res.data?.notifications || []);
      setNotifications(allNotifications);
      const unread = allNotifications.filter(n => !n.isRead).length;
      setUnreadCount(unread);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen, user?.id]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(notifications.map(n => 
        n.id === notificationId ? { ...n, isRead: true } : n
      ));
      setUnreadCount(Math.max(0, unreadCount - 1));
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      await notificationService.deleteNotification(notificationId);
      setNotifications(notifications.filter(n => n.id !== notificationId));
    } catch (err) {
      console.error("Failed to delete notification:", err);
    }
  };

  const handleClearAll = async () => {
    if (window.confirm('Clear all notifications?')) {
      try {
        await notificationService.clearAll();
        setNotifications([]);
        setUnreadCount(0);
      } catch (err) {
        console.error("Failed to clear notifications:", err);
      }
    }
  };

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-white/5 rounded-lg transition-all"
        title="Notifications"
      >
        <Bell size={20} className="text-slate-300 hover:text-white" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl z-50 max-h-96 flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-white/10">
            <h3 className="font-bold text-white">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleClearAll}
                className="text-xs text-violet-400 hover:text-violet-300 transition-all"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="overflow-y-auto flex-1">
            {loading ? (
              <div className="p-4 text-center text-slate-400">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                <Bell size={32} className="mx-auto mb-2 opacity-50" />
                <p>No notifications yet</p>
              </div>
            ) : (
              <div className="space-y-1">
                {notifications.map(notif => (
                  <div
                    key={notif.id}
                    className={`flex gap-3 p-4 border-b border-white/5 hover:bg-slate-800/50 transition-all ${
                      !notif.isRead ? 'bg-violet-500/5' : ''
                    }`}
                  >
                    <div className="flex-1">
                      <p className={`text-sm ${notif.isRead ? 'text-slate-400' : 'text-white font-semibold'}`}>
                        {notif.message}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {notif.type && `[${notif.type}]` }
                        {notif.createdAt && ` ${new Date(notif.createdAt).toLocaleDateString()}`}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      {!notif.isRead && (
                        <button
                          onClick={() => handleMarkAsRead(notif.id)}
                          className="p-1 hover:bg-violet-500/20 rounded text-violet-400 hover:text-violet-300 transition-all"
                          title="Mark as read"
                        >
                          <Check size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(notif.id)}
                        className="p-1 hover:bg-red-500/20 rounded text-red-400 hover:text-red-300 transition-all"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
