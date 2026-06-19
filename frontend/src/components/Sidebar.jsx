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
  ShieldCheck,
  ChevronRight
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

  if (user && user.role === 'admin') {
    links.push({ name: 'Admin Panel', path: '/admin', icon: ShieldCheck });
  }

  const activeClass =
    'relative flex items-center gap-3 px-4 py-3 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 font-semibold border-l-4 border-indigo-500 transition-all';
  const inactiveClass =
    'flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-dark-800/40 transition-all duration-200 border-l-4 border-transparent';

  return (
    <>
      {/* Mobile Backdrop Drawer */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/40 backdrop-blur-md z-35 lg:hidden transition-opacity duration-300"
          onClick={onClose}
        ></div>
      )}

      {/* Floating Collapsible Sidebar */}
      <aside
        className={`fixed top-18 bottom-4 left-4 w-60 glass-panel border shadow-2xl p-4 z-40 transition-all duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col justify-between h-full">
          <nav className="flex flex-col gap-1 h-[calc(100vh-160px)] overflow-y-auto no-scrollbar pr-1">
            {links.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={onClose}
                className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
              >
                <link.icon className="w-4.5 h-4.5 flex-shrink-0" />
                <span className="text-xs tracking-wide">{link.name}</span>
                <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </NavLink>
            ))}
          </nav>

          {/* User Status at Bottom */}
          {user && (
            <div className="mt-auto pt-3 border-t border-slate-100 dark:border-white/5 flex items-center gap-2">
              <img
                src={user.profilePicture}
                alt={user.name}
                className="w-8 h-8 rounded-lg object-cover ring-2 ring-indigo-500/20"
              />
              <div className="overflow-hidden">
                <p className="text-xs font-semibold truncate text-slate-800 dark:text-slate-200">{user.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
