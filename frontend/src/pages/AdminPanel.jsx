import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import {
  Users,
  ShieldCheck,
  Megaphone,
  Calendar,
  Send,
  Loader2,
  Lock,
} from 'lucide-react';
import { motion } from 'framer-motion';

const AdminPanel = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [usersList, setUsersList] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalResumesScanned: 0,
    totalMockInterviews: 0,
    averagePlatformScore: 0,
  });

  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcasting, setBroadcasting] = useState(false);

  const [challengeTitle, setChallengeTitle] = useState('');
  const [challengeDesc, setChallengeDesc] = useState('');
  const [challengeType, setChallengeType] = useState('coding');
  const [challengeDate, setChallengeDate] = useState('');
  const [creatingChallenge, setCreatingChallenge] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      toast.error('Access Denied. Admin credentials required.');
      navigate('/dashboard');
      return;
    }

    const fetchAdminData = async () => {
      try {
        setLoading(true);
        const uRes = await api.get('/admin/users');
        if (uRes.data.success) {
          setUsersList(uRes.data.data);
        }

        const aRes = await api.get('/admin/analytics');
        if (aRes.data.success) {
          setStats(aRes.data.analytics);
        }
      } catch (err) {
        console.error('Failed to load administrative logs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [user, navigate]);

  const handleBroadcast = async (e) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastMessage.trim()) {
      toast.error('Title and message are required');
      return;
    }

    try {
      setBroadcasting(true);
      const res = await api.post('/admin/broadcast', {
        title: broadcastTitle,
        message: broadcastMessage,
        type: 'system',
      });

      if (res.data.success) {
        toast.success(res.data.message);
        setBroadcastTitle('');
        setBroadcastMessage('');
      }
    } catch (err) {
      console.error('Broadcast failed:', err);
      toast.error('Failed to dispatch notice.');
    } finally {
      setBroadcasting(false);
    }
  };

  const handleCreateChallenge = async (e) => {
    e.preventDefault();
    if (!challengeTitle.trim() || !challengeDesc.trim() || !challengeDate) {
      toast.error('Title, description, and date are required');
      return;
    }

    try {
      setCreatingChallenge(true);
      const res = await api.post('/admin/challenges', {
        title: challengeTitle,
        type: challengeType,
        description: challengeDesc,
        date: challengeDate,
        rewardPoints: 20,
      });

      if (res.data.success) {
        toast.success('Daily Challenge created successfully!');
        setChallengeTitle('');
        setChallengeDesc('');
        setChallengeDate('');
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to generate challenge.';
      toast.error(errMsg);
    } finally {
      setCreatingChallenge(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-7xl mx-auto pb-12"
    >
      {/* Title */}
      <div className="flex items-center gap-2 border-b pb-4 border-slate-200/50 dark:border-white/5">
        <ShieldCheck className="w-6 h-6 text-indigo-500" />
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Admin Dashboard</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5">
          <span className="text-[10px] font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider">Total Users</span>
          <h2 className="text-2xl font-black mt-1.5 text-slate-805 dark:text-white">{stats.totalUsers}</h2>
        </div>
        <div className="glass-card p-5">
          <span className="text-[10px] font-bold text-slate-455 dark:text-slate-400 uppercase tracking-wider">Resumes Scanned</span>
          <h2 className="text-2xl font-black mt-1.5 text-slate-805 dark:text-white">{stats.totalResumesScanned}</h2>
        </div>
        <div className="glass-card p-5">
          <span className="text-[10px] font-bold text-slate-455 dark:text-slate-400 uppercase tracking-wider">Mocks Conducted</span>
          <h2 className="text-2xl font-black mt-1.5 text-slate-805 dark:text-white">{stats.totalMockInterviews}</h2>
        </div>
        <div className="glass-card p-5">
          <span className="text-[10px] font-bold text-slate-455 dark:text-slate-400 uppercase tracking-wider">Avg Platform score</span>
          <h2 className="text-2xl font-black mt-1.5 text-indigo-550 dark:text-indigo-400">{stats.averagePlatformScore}%</h2>
        </div>
      </div>

      {/* Main Forms Layout */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Broadcast Form */}
        <div className="glass-panel border p-6 bg-white dark:bg-card-dark rounded-2xl shadow-sm space-y-4">
          <h3 className="font-bold text-xs flex items-center gap-1.5 border-b pb-3 border-slate-100 dark:border-white/5 uppercase tracking-wider text-slate-800 dark:text-slate-100">
            <Megaphone className="w-4 h-4 text-indigo-500" /> Broadcast System Alert
          </h3>
          <p className="text-xs text-slate-400 font-light">
            Send a notification alert to all registered candidate dashboards on the platform.
          </p>

          <form onSubmit={handleBroadcast} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider">Alert Title</label>
              <input
                type="text"
                placeholder="System Maintenance, New Features, etc."
                value={broadcastTitle}
                onChange={(e) => setBroadcastTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-bg-dark/40 text-xs focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all font-medium placeholder:text-slate-400"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider">Alert Message</label>
              <textarea
                placeholder="Write message content details..."
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                className="w-full h-24 p-4 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-bg-dark/40 text-xs focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all font-light placeholder:text-slate-400 resize-none leading-relaxed"
              />
            </div>

            <button
              type="submit"
              disabled={broadcasting}
              className="w-full py-2.5 bg-indigo-650 hover:bg-indigo-600 text-white font-bold rounded-xl text-xs transition-colors shadow-lg shadow-indigo-500/15 flex items-center justify-center gap-1.5"
            >
              {broadcasting ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <>
                  Broadcast Notice <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Daily Challenge Form */}
        <div className="glass-panel border p-6 bg-white dark:bg-card-dark rounded-2xl shadow-sm space-y-4">
          <h3 className="font-bold text-xs flex items-center gap-1.5 border-b pb-3 border-slate-100 dark:border-white/5 uppercase tracking-wider text-slate-800 dark:text-slate-100">
            <Calendar className="w-4 h-4 text-orange-500" /> Create Daily Challenge
          </h3>
          <p className="text-xs text-slate-400 font-light">
            Deploy a new coding or behavioral task for users to solve on their dashboard.
          </p>

          <form onSubmit={handleCreateChallenge} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider">Challenge Title</label>
                <input
                  type="text"
                  placeholder="e.g. Reverse Linked List"
                  value={challengeTitle}
                  onChange={(e) => setChallengeTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-bg-dark/40 text-xs focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all font-medium placeholder:text-slate-400"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider">Target Date</label>
                <input
                  type="date"
                  value={challengeDate}
                  onChange={(e) => setChallengeDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-bg-dark/40 text-xs focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all font-medium placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-455 dark:text-slate-400 uppercase tracking-wider">Task Type</label>
                <select
                  value={challengeType}
                  onChange={(e) => setChallengeType(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-bg-dark/40 text-xs focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all font-medium"
                >
                  <option value="coding" className="dark:bg-card-dark">Algorithm Coding</option>
                  <option value="interview" className="dark:bg-card-dark">Behavioral Scenario</option>
                </select>
              </div>
              <div className="flex flex-col justify-end">
                <p className="text-[9px] text-slate-400 font-light leading-relaxed">
                  Coding type requires functional JavaScript output. Scenario type takes text reviews.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider">Description & Prompt Details</label>
              <textarea
                placeholder="Challenge prompt text details..."
                value={challengeDesc}
                onChange={(e) => setChallengeDesc(e.target.value)}
                className="w-full h-20 p-4 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-bg-dark/40 text-xs focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all font-light placeholder:text-slate-400 resize-none leading-relaxed"
              />
            </div>

            <button
              type="submit"
              disabled={creatingChallenge}
              className="w-full py-2.5 bg-indigo-650 hover:bg-indigo-600 text-white font-bold rounded-xl text-xs transition-colors shadow-lg shadow-indigo-500/15 flex items-center justify-center gap-1.5"
            >
              {creatingChallenge ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <>
                  Create Challenge <Calendar className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Users table list */}
      <div className="glass-panel border p-6 bg-white dark:bg-card-dark rounded-2xl shadow-sm space-y-4">
        <h3 className="font-bold text-xs flex items-center gap-1.5 border-b pb-3 border-slate-100 dark:border-white/5 uppercase tracking-wider text-slate-800 dark:text-slate-100">
          <Users className="w-4.5 h-4.5 text-indigo-500" /> Platform Registrants
        </h3>

        <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-white/5">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-bg-dark-sec/40 border-b border-slate-100 dark:border-white/5 text-slate-400 font-bold uppercase tracking-wider text-[9px]">
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4 text-center">Platform Role</th>
                <th className="p-4 text-center">XP Points</th>
                <th className="p-4 text-right">Join Date</th>
              </tr>
            </thead>
            <tbody>
              {usersList.map((usr) => (
                <tr
                  key={usr._id}
                  className="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors"
                >
                  <td className="p-4 flex items-center gap-3">
                    <img
                      src={usr.profilePicture}
                      alt={usr.name}
                      className="w-7 h-7 rounded-lg object-cover border border-slate-200 dark:border-white/10"
                    />
                    <span className="font-bold text-slate-705 dark:text-slate-250">
                      {usr.name}
                    </span>
                  </td>
                  <td className="p-4 text-slate-500">{usr.email}</td>
                  <td className="p-4 text-center">
                    <span
                      className={`text-[8px] font-bold px-2 py-0.5 rounded uppercase ${
                        usr.role === 'admin'
                          ? 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/10'
                          : 'bg-slate-100 text-slate-500 dark:bg-white/5 dark:text-slate-400'
                      }`}
                    >
                      {usr.role}
                    </span>
                  </td>
                  <td className="p-4 text-center font-extrabold text-slate-700 dark:text-slate-300">
                    {usr.points || 0} XP
                  </td>
                  <td className="p-4 text-right text-slate-400 font-light">
                    {new Date(usr.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminPanel;
