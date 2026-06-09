import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import {
  Video,
  FileText,
  Code,
  Flame,
  Award,
  ChevronRight,
  TrendingUp,
  Brain,
  Calendar,
  Loader,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    mocksCount: 0,
    bestScore: 0,
    resumeScore: 0,
    dsaSolved: 0,
    streak: 0,
    points: 0,
  });
  const [recentSessions, setRecentSessions] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [dsaChartData, setDsaChartData] = useState([]);
  const [dailyChallenge, setDailyChallenge] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // 1. Fetch sessions
        const sessionRes = await api.get('/interviews/sessions');
        const sessions = sessionRes.data.data || [];
        setRecentSessions(sessions.slice(0, 3));
        
        // 2. Fetch DSA progress
        const dsaRes = await api.get('/dsa/progress');
        const dsaList = dsaRes.data.data || [];

        // 3. Fetch Resumes
        const resumeRes = await api.get('/resumes/history');
        const resumes = resumeRes.data.data || [];
        const latestResumeScore = resumes.length > 0 ? resumes[0].atsScore : 0;

        // 4. Fetch Daily Challenge status
        const challengeRes = await api.get('/challenges/daily');
        if (challengeRes.data.success) {
          setDailyChallenge(challengeRes.data.challenge);
        }

        // Calculate statistics
        const completedSessions = sessions.filter(s => s.status === 'completed');
        const mocksCount = completedSessions.length;
        const bestScore = mocksCount > 0 
          ? Math.max(...completedSessions.map(s => s.overallScore.overall)) 
          : 0;

        setStats({
          mocksCount,
          bestScore,
          resumeScore: latestResumeScore,
          dsaSolved: dsaList.length,
          streak: user ? user.dsaStreak : 0,
          points: user ? user.points : 0,
        });

        // Format charts data
        // Interview score trends
        const scoreTrends = completedSessions
          .slice()
          .reverse()
          .map((s, idx) => ({
            name: `Mock #${idx + 1}`,
            score: s.overallScore.overall,
          }));

        // Fill empty scores with default guidelines if none completed
        setChartData(scoreTrends.length > 0 ? scoreTrends : [
          { name: 'Mock 1', score: 0 },
          { name: 'Mock 2', score: 0 },
          { name: 'Mock 3', score: 0 }
        ]);

        // DSA progress grouped by topic categories
        const dsaCategories = [
          { name: 'Arrays', count: 0 },
          { name: 'Strings', count: 0 },
          { name: 'Lists', count: 0 },
          { name: 'Trees', count: 0 },
          { name: 'Graphs', count: 0 },
          { name: 'DP', count: 0 }
        ];

        dsaList.forEach(dsa => {
          if (dsa.topic.includes('Arrays')) dsaCategories[0].count += 1;
          else if (dsa.topic.includes('Strings')) dsaCategories[1].count += 1;
          else if (dsa.topic.includes('Linked List')) dsaCategories[2].count += 1;
          else if (dsa.topic.includes('Trees') || dsa.topic.includes('BST')) dsaCategories[3].count += 1;
          else if (dsa.topic.includes('Graphs')) dsaCategories[4].count += 1;
          else if (dsa.topic.includes('Dynamic Programming')) dsaCategories[5].count += 1;
        });

        setDsaChartData(dsaCategories);

      } catch (err) {
        console.error('Failed to load dashboard statistics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-dark-950">
        <Loader className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Greeting */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Welcome back, <span className="text-gradient">{user?.name}</span> 👋
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-light mt-1">
            Analyze your preparation metrics, attempt daily coding intervals, and check rankings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-4 py-2 rounded-2xl glass-panel border">
            <Flame className="w-5 h-5 text-orange-500 animate-pulse" />
            <span className="font-bold text-sm">{stats.streak} Day Streak</span>
          </div>
          <div className="flex items-center gap-1.5 px-4 py-2 rounded-2xl glass-panel border bg-indigo-500/5 border-indigo-500/20">
            <Award className="w-5 h-5 text-indigo-500" />
            <span className="font-bold text-sm text-indigo-600 dark:text-indigo-400">
              {stats.points} Points
            </span>
          </div>
        </div>
      </div>

      {/* Stats Widgets Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel border p-5 rounded-3xl relative overflow-hidden group">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 mb-3">
            <Video className="w-5 h-5" />
          </div>
          <p className="text-xs font-semibold text-slate-400 uppercase">Mock Interviews</p>
          <h3 className="text-2xl font-extrabold mt-1">{stats.mocksCount}</h3>
          <p className="text-xs text-slate-400 mt-2">Best Score: {stats.bestScore}%</p>
        </div>

        <div className="glass-panel border p-5 rounded-3xl relative overflow-hidden group">
          <div className="w-10 h-10 rounded-2xl bg-pink-500/10 flex items-center justify-center text-pink-500 mb-3">
            <FileText className="w-5 h-5" />
          </div>
          <p className="text-xs font-semibold text-slate-400 uppercase">ATS Resume Score</p>
          <h3 className="text-2xl font-extrabold mt-1">{stats.resumeScore}%</h3>
          <p className="text-xs text-slate-400 mt-2">Latest scanned results</p>
        </div>

        <div className="glass-panel border p-5 rounded-3xl relative overflow-hidden group">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-3">
            <Code className="w-5 h-5" />
          </div>
          <p className="text-xs font-semibold text-slate-400 uppercase">DSA Problems</p>
          <h3 className="text-2xl font-extrabold mt-1">{stats.dsaSolved}</h3>
          <p className="text-xs text-slate-400 mt-2">Completed questions</p>
        </div>

        <div className="glass-panel border p-5 rounded-3xl relative overflow-hidden group">
          <div className="w-10 h-10 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 mb-3">
            <Flame className="w-5 h-5" />
          </div>
          <p className="text-xs font-semibold text-slate-400 uppercase">Study Streak</p>
          <h3 className="text-2xl font-extrabold mt-1">{stats.streak} Days</h3>
          <p className="text-xs text-slate-400 mt-2">Active daily tracking</p>
        </div>
      </div>

      {/* Main Charts & Daily Widget Layout */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Score Trends Chart */}
        <div className="glass-panel border p-6 rounded-3xl lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-500" />
              <h3 className="font-bold text-lg">Interview Score Trends</h3>
            </div>
            <span className="text-xs text-slate-400 font-semibold uppercase">Overall evaluation</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-dark-800" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 100]} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Challenge Widget */}
        <div className="glass-panel border p-6 rounded-3xl flex flex-col justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-dark-800">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-orange-500" />
                <h3 className="font-bold text-base">Daily Challenge</h3>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-500">
                Active
              </span>
            </div>

            {dailyChallenge ? (
              <div className="space-y-2">
                <p className="text-xs text-slate-400 font-bold uppercase">{dailyChallenge.type} CHALLENGE</p>
                <h4 className="font-extrabold text-lg">{dailyChallenge.title}</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                  {dailyChallenge.description}
                </p>
              </div>
            ) : (
              <p className="text-sm text-slate-400">Loading daily challenges...</p>
            )}
          </div>

          <Link
            to="/daily-challenge"
            className="w-full py-3.5 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 transition-colors font-bold text-center text-sm flex items-center justify-center gap-1.5"
          >
            Solve Today's Challenge <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* DSA Progress bar chart & Recent Activity */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* DSA Chart */}
        <div className="glass-panel border p-6 rounded-3xl space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code className="w-5 h-5 text-emerald-500" />
              <h3 className="font-bold text-lg">DSA Progress Breakdown</h3>
            </div>
            <span className="text-xs text-slate-400 font-semibold">Completed problems</span>
          </div>

          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dsaChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-dark-800" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} allowDecimals={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity List */}
        <div className="glass-panel border p-6 rounded-3xl lg:col-span-2 space-y-4">
          <h3 className="font-bold text-lg">Recent Interview Sessions</h3>
          <div className="flex flex-col gap-3">
            {recentSessions.length > 0 ? (
              recentSessions.map((session) => (
                <div
                  key={session._id}
                  className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-dark-900 border border-slate-100 dark:border-dark-850 hover:border-indigo-500/25 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                      <Brain className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">{session.jobRole}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {session.techStack} • {session.difficulty}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {session.status === 'completed' ? (
                      <div className="text-right">
                        <span className="text-sm font-extrabold text-indigo-500">
                          {session.overallScore.overall}%
                        </span>
                        <p className="text-[10px] text-slate-400 uppercase">SCORE</p>
                      </div>
                    ) : (
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-500">
                        In Progress
                      </span>
                    )}

                    <Link
                      to={
                        session.status === 'completed'
                          ? `/evaluation/${session._id}`
                          : `/mock-interview` // continue/resume session
                      }
                      className="p-2 bg-slate-50 dark:bg-dark-800 hover:bg-slate-100 dark:hover:bg-dark-700 rounded-xl text-slate-500 dark:text-slate-300 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-slate-400 space-y-4">
                <p className="text-sm">You haven't completed any mock interviews yet.</p>
                <Link
                  to="/mock-interview"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs shadow-md shadow-indigo-650/15"
                >
                  Start First Mock Interview
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
