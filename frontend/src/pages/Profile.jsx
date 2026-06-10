import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { User, Mail, Trash2, PlusCircle, CheckCircle2, Loader2, Award, FileText, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const Profile = () => {
  const { user, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [skills, setSkills] = useState([]);
  
  const [sessionCount, setSessionCount] = useState(0);
  const [resumeCount, setResumeCount] = useState(0);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setSkills(user.skills || []);
    }
  }, [user]);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const sRes = await api.get('/interviews/sessions');
        setSessionCount(sRes.data.count || 0);

        const rRes = await api.get('/resumes/history');
        setResumeCount(rRes.data.count || 0);
      } catch (err) {
        console.error('Failed to sync history counters:', err);
      }
    };
    fetchCounts();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Name cannot be empty');
      return;
    }

    try {
      setLoading(true);
      const res = await api.put('/auth/profile', {
        name,
        skills,
      });

      if (res.data.success) {
        toast.success('Profile updated successfully!');
        refreshProfile();
      }
    } catch (err) {
      console.error('Profile update error:', err);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    if (skills.includes(newSkill.trim())) {
      toast.error('Skill already exists!');
      return;
    }
    setSkills([...skills, newSkill.trim()]);
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const selectAvatar = async (url) => {
    try {
      setLoading(true);
      const res = await api.put('/auth/profile', {
        name,
        skills,
        profilePicture: url,
      });
      if (res.data.success) {
        toast.success('Avatar updated successfully!');
        refreshProfile();
      }
    } catch (err) {
      console.error('Avatar update failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const avatarsList = [
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100',
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=100&h=100',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=100&h=100',
  ];

  return (
    <div className="grid lg:grid-cols-12 gap-6 max-w-7xl mx-auto pb-12">
      {/* Left Column: Profile Summary (4 cols) */}
      <motion.div 
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="lg:col-span-4 glass-panel border p-6 sm:p-8 bg-white dark:bg-card-dark text-center space-y-6 h-fit rounded-2xl shadow-sm relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-br from-indigo-500/5 to-transparent blur-2xl pointer-events-none"></div>

        <div className="flex flex-col items-center relative z-10">
          <img
            src={user?.profilePicture}
            alt={user?.name}
            className="w-20 h-20 rounded-2xl object-cover border-2 border-indigo-500/20 shadow-md ring-4 ring-indigo-500/5"
          />
          <h2 className="text-base font-bold mt-4 text-slate-800 dark:text-white">{user?.name}</h2>
          <span className="inline-block px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-500 text-[9px] font-bold uppercase tracking-wider mt-1.5">
            {user?.role} Account
          </span>
        </div>

        {/* Dynamic counters */}
        <div className="grid grid-cols-2 gap-4 border-t pt-5 border-slate-100 dark:border-white/5 relative z-10">
          <div className="bg-slate-50/50 dark:bg-bg-dark/30 p-3 rounded-xl border border-slate-200/50 dark:border-white/5 text-center">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-center gap-1">
              <Award className="w-3.5 h-3.5 text-indigo-500" /> Mocks
            </span>
            <p className="text-lg font-black text-indigo-500 mt-1">{sessionCount}</p>
          </div>
          <div className="bg-slate-50/50 dark:bg-bg-dark/30 p-3 rounded-xl border border-slate-200/50 dark:border-white/5 text-center">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-center gap-1">
              <FileText className="w-3.5 h-3.5 text-pink-500" /> Audits
            </span>
            <p className="text-lg font-black text-pink-500 mt-1">{resumeCount}</p>
          </div>
        </div>

        {/* Avatar presets selection */}
        <div className="space-y-3 border-t pt-5 border-slate-100 dark:border-white/5 text-left relative z-10">
          <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Select Profile Avatar</label>
          <div className="flex justify-center gap-3">
            {avatarsList.map((av, idx) => (
              <button
                key={idx}
                onClick={() => selectAvatar(av)}
                className={`w-9 h-9 rounded-lg overflow-hidden border-2 transition-all ${
                  user?.profilePicture === av ? 'border-indigo-500 scale-105 shadow-sm' : 'border-transparent hover:scale-105'
                }`}
              >
                <img src={av} alt="Avatar option" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Right Column: Account Settings Form (8 cols) */}
      <motion.div 
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="lg:col-span-8 glass-panel border p-6 sm:p-8 bg-white dark:bg-card-dark space-y-6 rounded-2xl shadow-sm"
      >
        <h3 className="font-bold text-xs text-slate-800 dark:text-slate-100 uppercase tracking-wider border-b pb-3 border-slate-100 dark:border-white/5">
          Account Settings
        </h3>

        <form onSubmit={handleUpdateProfile} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Name input */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-indigo-500" /> Candidate Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-bg-dark/40 text-xs focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all font-medium"
              />
            </div>

            {/* Email input (read-only) */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-455 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-indigo-500" /> Email Address
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-100/50 dark:bg-bg-dark/15 text-slate-400 dark:text-slate-500 text-xs cursor-not-allowed font-medium"
              />
            </div>
          </div>

          {/* Skill Tagging Block */}
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Technical Skills Tags
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. Node.js, Docker, Kubernetes"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddSkill(e)}
                className="flex-grow px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-bg-dark/40 text-xs focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all font-medium placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-4 py-2.5 bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 rounded-xl transition-all font-bold text-xs"
              >
                Add
              </button>
            </div>

            {/* Render chips */}
            <div className="flex flex-wrap gap-2 pt-1">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-550/15 text-indigo-600 dark:text-indigo-400 font-bold tracking-wide"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="p-0.5 hover:bg-indigo-500/20 rounded text-indigo-400 hover:text-indigo-600 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-1.5 text-xs"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                Save Changes <CheckCircle2 className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Profile;
