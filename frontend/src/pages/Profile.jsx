import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { User, Mail, Award, Trash2, PlusCircle, CheckCircle2, Loader2, Sparkles } from 'lucide-react';

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
        refreshProfile(); // sync updated state
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
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Profile summary details */}
      <div className="glass-panel border p-8 rounded-3xl text-center space-y-6 h-fit">
        <div className="flex flex-col items-center">
          <img
            src={user?.profilePicture}
            alt={user?.name}
            className="w-24 h-24 rounded-3xl object-cover border-4 border-indigo-500/20 shadow-xl"
          />
          <h2 className="text-xl font-bold mt-4">{user?.name}</h2>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-500 capitalize mt-1.5">
            {user?.role} Account
          </span>
        </div>

        {/* Dynamic counters */}
        <div className="grid grid-cols-2 gap-4 border-t pt-6 border-slate-100 dark:border-dark-800">
          <div className="bg-slate-50 dark:bg-dark-900/20 p-3 rounded-2xl border">
            <span className="text-[9px] font-bold text-slate-400 uppercase">Mock Sessions</span>
            <p className="text-xl font-extrabold text-indigo-500 mt-1">{sessionCount}</p>
          </div>
          <div className="bg-slate-50 dark:bg-dark-900/20 p-3 rounded-2xl border">
            <span className="text-[9px] font-bold text-slate-400 uppercase">Resumes Scanned</span>
            <p className="text-xl font-extrabold text-pink-500 mt-1">{resumeCount}</p>
          </div>
        </div>

        {/* Avatar presets selection */}
        <div className="space-y-2 border-t pt-6 border-slate-100 dark:border-dark-800 text-left">
          <label className="text-xs font-semibold text-slate-400">SELECT PROFILE AVATAR</label>
          <div className="flex justify-center gap-3">
            {avatarsList.map((av, idx) => (
              <button
                key={idx}
                onClick={() => selectAvatar(av)}
                className={`w-10 h-10 rounded-xl overflow-hidden border-2 transition-all ${
                  user?.profilePicture === av ? 'border-indigo-500 scale-105 shadow-md' : 'border-transparent hover:scale-105'
                }`}
              >
                <img src={av} alt="Avatar option" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Editing Form Panel */}
      <div className="lg:col-span-2 glass-panel border p-8 rounded-3xl space-y-6">
        <h3 className="font-bold text-lg border-b pb-3 border-slate-100 dark:border-dark-850">
          Account Settings
        </h3>

        <form onSubmit={handleUpdateProfile} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Name input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase">Candidate Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-dark-800 bg-white dark:bg-dark-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 text-xs transition-all"
                />
              </div>
            </div>

            {/* Email input (read-only) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-dark-800 bg-slate-100 dark:bg-dark-900/60 text-slate-400 text-xs focus:outline-none cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Skill Tagging Block */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-400 uppercase">Technical Skills Tags</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. Node.js, Docker, Kubernetes"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddSkill(e)}
                className="flex-grow px-4 py-3 rounded-xl border border-slate-200 dark:border-dark-800 bg-white dark:bg-dark-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 text-xs transition-all"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="p-3 bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 rounded-xl transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
              </button>
            </div>

            {/* Render chips */}
            <div className="flex flex-wrap gap-2 pt-1">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-semibold"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="p-0.5 hover:bg-indigo-500/20 rounded text-indigo-400 hover:text-indigo-600"
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
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-indigo-650/20 flex items-center justify-center gap-1.5"
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
      </div>
    </div>
  );
};

export default Profile;
