import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { Bell, Check, Loader2, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

  const getNotificationColor = (type) => {
    if (type === 'challenge') return 'bg-orange-500/10 text-orange-500 border-orange-500/10';
    if (type === 'alert') return 'bg-rose-500/10 text-rose-500 border-rose-500/10';
    return 'bg-indigo-500/10 text-indigo-500 border-indigo-500/10';
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-2xl mx-auto space-y-6 pb-12"
    >
      {/* Title */}
      <div className="flex items-center justify-between border-b pb-4 border-slate-200/50 dark:border-white/5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Notifications Feed</h1>
          <p className="text-slate-405 dark:text-slate-400 text-xs font-light mt-1">
            Stay updated with challenge releases, review updates, and study alerts.
          </p>
        </div>

        <button
          onClick={fetchNotifications}
          className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-500 dark:text-slate-300 rounded-xl transition-all border border-transparent dark:border-white/5"
          aria-label="Refresh Feed"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-7 h-7 text-primary animate-spin" />
        </div>
      ) : notifications.length > 0 ? (
        <div className="flex flex-col gap-3">
          <AnimatePresence initial={false}>
            {notifications.map((notif) => (
              <motion.div
                key={notif._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                className={`glass-panel border p-4 bg-white dark:bg-card-dark rounded-xl transition-all flex items-start gap-4 ${
                  !notif.isRead
                    ? 'border-l-4 border-l-indigo-655 dark:bg-card-dark shadow-sm'
                    : 'opacity-60'
                }`}
              >
                {/* Category Icon */}
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 border ${getNotificationColor(
                    notif.type
                  )}`}
                >
                  <Bell className="w-4 h-4" />
                </div>

                {/* Title description */}
                <div className="flex-grow space-y-1">
                  <div className="flex items-baseline justify-between gap-4">
                    <h4 className="font-bold text-xs text-slate-800 dark:text-white">
                      {notif.title}
                    </h4>
                    <span className="text-[9px] text-slate-400 font-bold uppercase">
                      {new Date(notif.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-505 dark:text-slate-400 font-light leading-relaxed">
                    {notif.message}
                  </p>
                </div>

                {/* Mark as read */}
                {!notif.isRead && (
                  <button
                    onClick={() => handleMarkAsRead(notif._id)}
                    className="p-1.5 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 hover:text-indigo-650 rounded-lg transition-colors flex-shrink-0"
                    title="Mark as read"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="glass-panel border p-12 bg-white dark:bg-card-dark rounded-2xl shadow-sm text-center text-slate-400 py-16 max-w-sm mx-auto">
          <Bell className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-3 animate-pulse" />
          <h3 className="font-bold text-sm text-slate-700 dark:text-slate-300">All caught up!</h3>
          <p className="text-xs text-slate-400 font-light mt-1">Your notifications feed is clear.</p>
        </div>
      )}
    </motion.div>
  );
};

export default Notifications;
