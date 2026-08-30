import React, { useState, useEffect } from 'react';
import { Bell, X, CheckCheck, AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react';
import api from '../../services/api';
import { getSocket } from '../../services/socket';
import { useAuthStore } from '../../store/authStore';

export default function NotificationDrawer({ isOpen, onClose }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuthStore();

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.get('/notifications');
      setNotifications(res.data.data || []);
    } catch (e) {
      console.error('Failed to load notifications:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  useEffect(() => {
    const socket = getSocket();
    if (socket && user?.id) {
      socket.emit('join_user', user.id);

      const handleNewNotification = (notif) => {
        setNotifications((prev) => [notif, ...prev]);
      };

      socket.on('notification', handleNewNotification);
      return () => {
        socket.off('notification', handleNewNotification);
      };
    }
  }, [user]);

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (e) {
      console.error('Failed to mark all as read:', e);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
      case 'warning':
      case 'escalation':
        return <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />;
      default:
        return <Info className="w-5 h-5 text-cyan-400 shrink-0" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 backdrop-blur">
            <div className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-cyan-400" />
              <h2 className="text-base font-semibold text-slate-100">Live Agent Notifications</h2>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={markAllAsRead}
                title="Mark all as read"
                className="p-1.5 text-xs text-slate-400 hover:text-slate-200 bg-slate-800/60 hover:bg-slate-800 rounded-md transition-colors flex items-center gap-1"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-md transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {loading && notifications.length === 0 ? (
              <div className="text-center py-10 text-slate-500 text-sm">Loading alerts...</div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-16 text-slate-500">
                <Bell className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm font-medium">No alerts in your queue</p>
                <p className="text-xs text-slate-600 mt-1">Multi-agent execution updates will appear here in real time.</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id || n.id}
                  className={`p-3.5 rounded-lg border transition-all ${
                    n.isRead
                      ? 'bg-slate-900/40 border-slate-800/80 text-slate-400'
                      : 'bg-slate-850 border-cyan-500/30 text-slate-200 shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {getIcon(n.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-semibold text-slate-100 truncate">{n.title}</p>
                        <span className="text-[10px] text-slate-500 shrink-0">
                          {n.createdAt ? new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1 line-clamp-3">{n.message}</p>
                      {n.executionId && (
                        <a
                          href={`/executions/${n.executionId._id || n.executionId}`}
                          className="inline-block mt-2 text-[11px] text-cyan-400 hover:text-cyan-300 font-medium"
                        >
                          View Execution Timeline &rarr;
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
