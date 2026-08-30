import React, { useState, useEffect } from 'react';
import Link from 'next/router';
import { useRouter } from 'next/router';
import { Bot, Bell, Shield, LogOut, User, Sparkles, Activity } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import api from '../../services/api';

export default function Navbar({ onOpenNotifications }) {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await api.get('/notifications');
        const count = (res.data.data || []).filter((n) => !n.isRead).length;
        setUnreadCount(count);
      } catch (e) {
        // silent
      }
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40 px-6 flex items-center justify-between">
      {/* Brand */}
      <div className="flex items-center space-x-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-emerald-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
            Agentflow<span className="text-cyan-400">_AI</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-medium">v1.0</span>
          </span>
          <span className="text-[11px] text-slate-400 font-mono">Agentic Operations Engine</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-4">
        {/* LangGraph Live Substrate Indicator */}
        <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-850 border border-slate-700/60 text-xs text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-[11px]">LangGraph: Active</span>
        </div>

        {/* Notifications Button */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-cyan-500 text-slate-950 font-bold text-[10px] flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* User Profile */}
        <div className="flex items-center space-x-3 pl-2 border-l border-slate-800">
          <div className="flex flex-col text-right hidden md:block">
            <span className="text-xs font-semibold text-slate-200">{user?.name || 'Operator'}</span>
            <span className="text-[10px] text-slate-400 font-mono capitalize">{user?.role || 'operator'} role</span>
          </div>

          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-sm">
            {user?.name ? user.name[0].toUpperCase() : 'O'}
          </div>

          <button
            onClick={handleLogout}
            title="Sign Out"
            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
