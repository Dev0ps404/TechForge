import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { Bell, Check, Loader2, RefreshCw } from 'lucide-react';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.get('/notifications');
      if (res.data.success) {
        setNotifications(res.data.data);
      }
    } catch (err) {
      console.error('Failed to retrieve alarms:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      const res = await api.put(`/notifications/${id}/read`);
      if (res.data.success) {
        setNotifications((prev) =>
          prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
        );
        toast.success('Notification marked as read');
      }
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  // Helper to color notification categories
  const getNotificationColor = (type) => {
    if (type === 'challenge') return 'bg-orange-500/10 text-orange-500';
    if (type === 'alert') return 'bg-pink-500/10 text-pink-500';
    return 'bg-indigo-500/10 text-indigo-500';
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between border-b pb-4 border-slate-100 dark:border-dark-800">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Notifications Feed</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-light mt-1">
            Stay updated with challenge releases, review updates, and study alerts.
          </p>
        </div>

        <button
          onClick={fetchNotifications}
          className="p-2.5 bg-slate-50 hover:bg-slate-100 dark:bg-dark-800 dark:hover:bg-dark-750 text-slate-500 dark:text-slate-300 rounded-xl transition-colors"
          aria-label="Refresh Feed"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        </div>
      ) : notifications.length > 0 ? (
        <div className="flex flex-col gap-3">
          {notifications.map((notif) => (
            <div
              key={notif._id}
              className={`glass-panel border p-4 rounded-3xl transition-all flex items-start gap-4 ${
                !notif.isRead
                  ? 'border-l-4 border-l-indigo-650 bg-indigo-500/5 shadow-sm'
                  : 'opacity-75'
              }`}
            >
              {/* Category Icon */}
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${getNotificationColor(
                  notif.type
                )}`}
              >
                <Bell className="w-4.5 h-4.5" />
              </div>

              {/* Title description */}
              <div className="flex-grow space-y-1">
                <div className="flex items-baseline justify-between gap-4">
                  <h4 className="font-bold text-sm text-slate-800 dark:text-white">
                    {notif.title}
                  </h4>
                  <span className="text-[9px] text-slate-400 font-bold uppercase">
                    {new Date(notif.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-light leading-relaxed">
                  {notif.message}
                </p>
              </div>

              {/* Mark as read */}
              {!notif.isRead && (
                <button
                  onClick={() => handleMarkAsRead(notif._id)}
                  className="p-1.5 hover:bg-slate-100 dark:hover:bg-dark-800 text-slate-400 hover:text-indigo-600 rounded-lg transition-colors flex-shrink-0"
                  title="Mark as read"
                >
                  <Check className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-slate-400">
          <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-sm">Your notifications feed is clear!</p>
        </div>
      )}
    </div>
  );
};

export default Notifications;
