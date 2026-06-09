import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  FileText,
  Video,
  Code,
  MessageSquare,
  Trophy,
  Calendar,
  BarChart3,
  Bell,
  User,
  Settings,
  ShieldCheck,
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  const links = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Mock Interview', path: '/mock-interview', icon: Video },
    { name: 'Resume Scanning', path: '/resume-upload', icon: FileText },
    { name: 'DSA Progress', path: '/dsa-practice', icon: Code },
    { name: 'AI Chat Assistant', path: '/ai-chat', icon: MessageSquare },
    { name: 'Leaderboard', path: '/leaderboard', icon: Trophy },
    { name: 'Daily Challenges', path: '/daily-challenge', icon: Calendar },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Notifications', path: '/notifications', icon: Bell },
    { name: 'My Profile', path: '/profile', icon: User },
  ];

  // Append Admin link if role is admin
  if (user && user.role === 'admin') {
    links.push({ name: 'Admin Panel', path: '/admin', icon: ShieldCheck });
  }

  const activeClass =
    'flex items-center gap-3 px-4 py-3 rounded-2xl bg-indigo-600 text-white font-medium shadow-md shadow-indigo-600/20 transition-all';
  const inactiveClass =
    'flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-dark-800/60 transition-colors';

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar Sidebar */}
      <aside
        className={`fixed top-[61px] bottom-0 left-0 w-64 glass-panel border-r p-4 z-30 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <nav className="flex flex-col gap-1.5 h-full overflow-y-auto no-scrollbar pb-10">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={onClose}
              className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
            >
              <link.icon className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{link.name}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
