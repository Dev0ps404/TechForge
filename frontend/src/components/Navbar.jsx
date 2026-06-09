import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Menu, LogOut, User, Bell, ChevronDown, Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ onMenuToggle }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-white/70 dark:bg-bg-dark/70 backdrop-blur-xl border-b border-slate-200/50 dark:border-white/5 px-6 py-3 flex items-center justify-between transition-colors duration-300">
      {/* Brand Logo & Mobile Menu Trigger */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 hover:bg-slate-100 dark:hover:bg-dark-800/40 rounded-xl transition-colors"
          aria-label="Toggle Menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="w-8.5 h-8.5 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <span className="font-black text-white text-base">T</span>
          </div>
          <span className="text-lg font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">
            TalentForge
          </span>
        </Link>
      </div>

      {/* Modern Finder / Search bar */}
      <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100/60 dark:bg-bg-dark-sec/60 border border-slate-200/60 dark:border-white/5 text-slate-400 dark:text-dark-400 text-xs cursor-pointer hover:border-indigo-500/40 dark:hover:border-indigo-500/30 transition-all duration-200 w-64 shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
        <Search className="w-3.5 h-3.5 text-slate-400" />
        <span className="font-light">Search dashboard...</span>
        <kbd className="ml-auto font-sans font-semibold text-[9px] bg-slate-250 dark:bg-white/5 px-1.5 py-0.5 rounded border border-slate-300/40 dark:border-white/10 text-slate-500 dark:text-slate-400">⌘K</kbd>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-dark-800/40 rounded-xl transition-all duration-200"
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-4.5 h-4.5 text-indigo-400" />
          ) : (
            <Moon className="w-4.5 h-4.5 text-slate-600" />
          )}
        </button>

        {/* Notifications Icon Link */}
        {user && (
          <Link
            to="/notifications"
            className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-dark-800/40 rounded-xl transition-all duration-200 relative"
          >
            <Bell className="w-4.5 h-4.5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500 ring-2 ring-white dark:ring-bg-dark"></span>
          </Link>
        )}

        {/* User Dropdown */}
        {user && (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 p-1 hover:bg-slate-100 dark:hover:bg-dark-800/40 rounded-xl transition-all duration-200 border border-transparent hover:border-slate-200/50 dark:hover:border-white/5"
            >
              <img
                src={user.profilePicture}
                alt={user.name}
                className="w-7.5 h-7.5 rounded-lg object-cover ring-2 ring-indigo-500/10"
              />
              <span className="hidden sm:block text-xs font-semibold text-slate-700 dark:text-slate-300 max-w-28 truncate">
                {user.name}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {dropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setDropdownOpen(false)}
                ></div>
                <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-white dark:bg-card-dark shadow-2xl border border-slate-200/60 dark:border-white/5 p-2 z-20 flex flex-col gap-1 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-white/5">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Account</p>
                    <p className="text-xs font-medium truncate text-slate-700 dark:text-slate-350 mt-0.5">
                      {user.email}
                    </p>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-650 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/5 transition-colors font-medium"
                  >
                    <User className="w-4 h-4 text-slate-400" />
                    My Profile
                  </Link>
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-xl text-xs text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors font-semibold"
                  >
                    <LogOut className="w-4 h-4" />
                    Log Out
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
