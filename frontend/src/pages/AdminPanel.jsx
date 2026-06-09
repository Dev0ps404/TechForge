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
  BarChart,
  User,
  Loader,
  Send,
  Loader2,
  Lock,
} from 'lucide-react';

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

  // Broadcast Notification form states
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcasting, setBroadcasting] = useState(false);

  // Daily Challenge creation states
  const [challengeTitle, setChallengeTitle] = useState('');
  const [challengeDesc, setChallengeDesc] = useState('');
  const [challengeType, setChallengeType] = useState('coding');
  const [challengeDate, setChallengeDate] = useState('');
  const [creatingChallenge, setCreatingChallenge] = useState(false);

  useEffect(() => {
    // Guards access immediately
    if (!user || user.role !== 'admin') {
      toast.error('Access Denied. Admin credentials required.');
      navigate('/dashboard');
      return;
    }

    const fetchAdminData = async () => {
      try {
        setLoading(true);
        // Fetch users
        const uRes = await api.get('/admin/users');
        if (uRes.data.success) {
          setUsersList(uRes.data.data);
        }

        // Fetch stats analytics
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
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-dark-950">
        <Loader className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center gap-2">
        <ShieldCheck className="w-6 h-6 text-indigo-500" />
        <h1 className="text-3xl font-extrabold tracking-tight">Administrative Control Panel</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel border p-5 rounded-3xl">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Platform Registrants</span>
          <h2 className="text-3xl font-extrabold mt-1">{stats.totalUsers}</h2>
        </div>
        <div className="glass-panel border p-5 rounded-3xl">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Resumes Analyzed</span>
          <h2 className="text-3xl font-extrabold mt-1">{stats.totalResumesScanned}</h2>
        </div>
        <div className="glass-panel border p-5 rounded-3xl">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Mocks Conducted</span>
          <h2 className="text-3xl font-extrabold mt-1">{stats.totalMockInterviews}</h2>
        </div>
        <div className="glass-panel border p-5 rounded-3xl">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Avg Platform Rating</span>
          <h2 className="text-3xl font-extrabold mt-1">{stats.averagePlatformScore}%</h2>
        </div>
      </div>

      {/* Main Forms Layout */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Broadcast Form */}
        <div className="glass-panel border p-6 rounded-3xl space-y-4">
          <h3 className="font-bold text-base flex items-center gap-1.5 border-b pb-2">
            <Megaphone className="w-4 h-4 text-indigo-500" /> Broadcast System Alert
          </h3>
          <p className="text-xs text-slate-400 font-light">
            Send a notification alert to all registered candidate dashboards on the platform.
          </p>

          <form onSubmit={handleBroadcast} className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Alert Title</label>
              <input
                type="text"
                placeholder="System Maintenance, New Features, etc."
                value={broadcastTitle}
                onChange={(e) => setBroadcastTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-dark-800 bg-white dark:bg-dark-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 text-xs transition-all"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Alert Message Description</label>
              <textarea
                placeholder="Write message content detail..."
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                className="w-full h-28 p-4 rounded-2xl border border-slate-200 dark:border-dark-800 bg-white dark:bg-dark-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 text-xs transition-all resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={broadcasting}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition-colors shadow-lg shadow-indigo-650/15 flex items-center justify-center gap-1.5"
            >
              {broadcasting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Broadcast Notice <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Daily Challenge Form */}
        <div className="glass-panel border p-6 rounded-3xl space-y-4">
          <h3 className="font-bold text-base flex items-center gap-1.5 border-b pb-2">
            <Calendar className="w-4 h-4 text-orange-500" /> Create Daily Challenge
          </h3>
          <p className="text-xs text-slate-400 font-light">
            Deploy a new coding or behavioral task for users to solve on their dashboard.
          </p>

          <form onSubmit={handleCreateChallenge} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Challenge Title</label>
                <input
                  type="text"
                  placeholder="e.g. Reverse Linked List"
                  value={challengeTitle}
                  onChange={(e) => setChallengeTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-dark-800 bg-white dark:bg-dark-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 text-xs transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Target Date</label>
                <input
                  type="date"
                  value={challengeDate}
                  onChange={(e) => setChallengeDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-dark-800 bg-white dark:bg-dark-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 text-xs transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Task Type</label>
                <select
                  value={challengeType}
                  onChange={(e) => setChallengeType(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-dark-800 bg-white dark:bg-dark-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 text-xs transition-all"
                >
                  <option value="coding">Algorithm Coding</option>
                  <option value="interview">Behavioral Scenario</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5 justify-end">
                <p className="text-[9px] text-slate-400 font-light leading-relaxed">
                  Coding type requires functional JavaScript output. Scenario type takes text reviews.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Description & Test cases</label>
              <textarea
                placeholder="Challenge prompt text details..."
                value={challengeDesc}
                onChange={(e) => setChallengeDesc(e.target.value)}
                className="w-full h-20 p-4 rounded-2xl border border-slate-200 dark:border-dark-800 bg-white dark:bg-dark-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 text-xs transition-all resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={creatingChallenge}
              className="w-full py-3 bg-indigo-650 hover:bg-indigo-600 text-white font-bold rounded-xl text-xs transition-colors shadow-lg shadow-indigo-650/15 flex items-center justify-center gap-1.5"
            >
              {creatingChallenge ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Create Challenge <Calendar className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Users table list */}
      <div className="glass-panel border p-6 rounded-3xl space-y-4">
        <h3 className="font-bold text-base flex items-center gap-1.5 border-b pb-2">
          <Users className="w-5 h-5 text-indigo-500" /> Platform Registrants
        </h3>

        <div className="overflow-x-auto rounded-2xl border border-slate-100 dark:border-dark-850">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-dark-900 border-b border-slate-100 dark:border-dark-850 text-slate-400 font-bold uppercase tracking-wider">
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4 text-center">Platform Role</th>
                <th className="p-4 text-center">DSA Points</th>
                <th className="p-4 text-right">Join Date</th>
              </tr>
            </thead>
            <tbody>
              {usersList.map((usr) => (
                <tr
                  key={usr._id}
                  className="border-b border-slate-100 dark:border-dark-850 hover:bg-slate-50/50 dark:hover:bg-dark-900/10 transition-colors"
                >
                  <td className="p-4 flex items-center gap-3">
                    <img
                      src={usr.profilePicture}
                      alt={usr.name}
                      className="w-8 h-8 rounded-xl object-cover border"
                    />
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {usr.name}
                    </span>
                  </td>
                  <td className="p-4 text-slate-500">{usr.email}</td>
                  <td className="p-4 text-center">
                    <span
                      className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                        usr.role === 'admin'
                          ? 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20'
                          : 'bg-slate-100 text-slate-500 dark:bg-dark-800 dark:text-slate-400'
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
    </div>
  );
};

export default AdminPanel;
