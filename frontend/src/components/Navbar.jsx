import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Menu, LogOut, User, Bell, ChevronDown, Search, X, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Logo from './Logo';

const Navbar = ({ onMenuToggle }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchInputRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const searchItems = [
    { name: 'Dashboard', path: '/dashboard', category: 'Navigation', desc: 'Overview of stats & analytics' },
    { name: 'Mock Interview Room', path: '/mock-interview-room', category: 'Prep Tools', desc: 'Start an AI voice interview' },
    { name: 'Generate Questions', path: '/mock-interview', category: 'Prep Tools', desc: 'Create custom technical questions' },
    { name: 'Resume Scanning', path: '/resume-upload', category: 'Resume', desc: 'Analyze ATS score & feedback' },
    { name: 'DSA Progress', path: '/dsa-practice', category: 'DSA', desc: 'Track Leetcode-style coding prep' },
    { name: 'AI Chat Assistant', path: '/ai-chat', category: 'AI Tools', desc: 'Chat with TalentForge AI advisor' },
    { name: 'Leaderboard', path: '/leaderboard', category: 'Community', desc: 'Check global ranks and scores' },
    { name: 'Daily Challenges', path: '/daily-challenge', category: 'Community', desc: 'Solve daily coding challenges' },
    { name: 'Analytics', path: '/analytics', category: 'Metrics', desc: 'Deep dive into performance history' },
    { name: 'Notifications', path: '/notifications', category: 'Account', desc: 'View alerts and activity updates' },
    { name: 'My Profile', path: '/profile', category: 'Account', desc: 'Manage skills, avatar, & account' },
  ];

  if (user && user.role === 'admin') {
    searchItems.push({ name: 'Admin Panel', path: '/admin', category: 'Admin', desc: 'Manage challenges & users' });
  }

  const filteredItems = searchItems.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
      setSearchQuery('');
      setSelectedIndex(0);
    }
  }, [searchOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      } else if (e.key === 'Escape') {
        setSearchOpen(false);
      } else if (searchOpen) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex(prev => (prev + 1) % filteredItems.length);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex(prev => (prev - 1 + filteredItems.length) % filteredItems.length);
        } else if (e.key === 'Enter') {
          e.preventDefault();
          if (filteredItems[selectedIndex]) {
            navigate(filteredItems[selectedIndex].path);
            setSearchOpen(false);
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen, filteredItems, selectedIndex, navigate]);

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
          <Logo className="w-8 h-8 flex-shrink-0" />
          <span className="text-lg font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">
            TalentForge
          </span>
        </Link>
      </div>

      {/* Modern Finder / Search bar */}
      <div 
        onClick={() => setSearchOpen(true)}
        className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100/60 dark:bg-bg-dark-sec/60 border border-slate-200/60 dark:border-white/5 text-slate-400 dark:text-dark-400 text-xs cursor-pointer hover:border-primary/40 dark:hover:border-primary/30 transition-all duration-200 w-64 shadow-[0_2px_8px_rgba(0,0,0,0.01)]"
      >
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
              <span className="hidden sm:block text-xs font-semibold text-slate-700 dark:text-slate-350 max-w-28 truncate">
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

      {/* Dynamic Command Menu Modal */}
      <AnimatePresence>
        {searchOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSearchOpen(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -8 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="w-full max-w-lg bg-white dark:bg-card-dark border border-slate-200/80 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden relative z-10 flex flex-col max-h-[440px]"
            >
              {/* Search Header */}
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-bg-dark/15">
                <Search className="w-4.5 h-4.5 text-slate-400 dark:text-slate-500" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Type a command or search prep paths..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-sm text-slate-800 dark:text-slate-100 focus:outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  className="p-1 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg text-slate-400 hover:text-slate-650 dark:hover:text-white transition-colors"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Suggestions / Results */}
              <div className="flex-1 overflow-y-auto no-scrollbar p-2.5 space-y-1">
                {filteredItems.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400 dark:text-slate-500">
                    No results found for "{searchQuery}"
                  </div>
                ) : (
                  filteredItems.map((item, idx) => {
                    const isSelected = idx === selectedIndex;
                    return (
                      <div
                        key={item.path}
                        onClick={() => {
                          navigate(item.path);
                          setSearchOpen(false);
                        }}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-primary text-white shadow-md shadow-primary/15'
                            : 'text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-white/5'
                        }`}
                      >
                        <div className="flex flex-col gap-0.5">
                          <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-800 dark:text-slate-200'}`}>
                            {item.name}
                          </span>
                          <span className={`text-[10px] ${isSelected ? 'text-purple-100' : 'text-slate-400 dark:text-slate-500'}`}>
                            {item.desc}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[9px] px-2 py-0.5 rounded-md font-semibold border ${
                            isSelected
                              ? 'bg-white/10 border-white/20 text-white'
                              : 'bg-slate-100 dark:bg-white/5 border-slate-200/50 dark:border-white/10 text-slate-400 dark:text-slate-400'
                          }`}>
                            {item.category}
                          </span>
                          {isSelected && <ArrowRight className="w-3.5 h-3.5 text-white" />}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Status Footer */}
              <div className="px-4 py-2 bg-slate-50 dark:bg-bg-dark-sec/40 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-[9px] text-slate-400 dark:text-slate-500">
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-0.5"><kbd className="bg-slate-200/60 dark:bg-white/5 px-1 py-0.2 rounded border border-slate-300/20 dark:border-white/10">↑↓</kbd> navigate</span>
                  <span className="flex items-center gap-0.5"><kbd className="bg-slate-200/60 dark:bg-white/5 px-1 py-0.2 rounded border border-slate-300/20 dark:border-white/10">↵</kbd> select</span>
                  <span className="flex items-center gap-0.5"><kbd className="bg-slate-200/60 dark:bg-white/5 px-1 py-0.2 rounded border border-slate-300/20 dark:border-white/10">esc</kbd> close</span>
                </div>
                <div className="flex items-center gap-1 font-mono">
                  <span className="text-[10px] font-bold">TalentForge</span> finder
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
