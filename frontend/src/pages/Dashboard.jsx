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
  Loader2,
  Sparkles,
  ArrowUpRight,
  Zap,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
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
        const scoreTrends = completedSessions
          .slice()
          .reverse()
          .map((s, idx) => ({
            name: `Mock #${idx + 1}`,
            score: s.overallScore.overall,
          }));

        setChartData(scoreTrends.length > 0 ? scoreTrends : [
          { name: 'Mock 1', score: 0 },
          { name: 'Mock 2', score: 0 },
          { name: 'Mock 3', score: 0 }
        ]);

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
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.08 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  };

  const arraysCount = dsaChartData[0]?.count || 0;
  const stringsCount = dsaChartData[1]?.count || 0;
  const listsCount = dsaChartData[2]?.count || 0;
  const treesCount = dsaChartData[3]?.count || 0;
  const graphsCount = dsaChartData[4]?.count || 0;

  const arraysPercent = Math.min(100, Math.round((arraysCount / 4) * 100));
  const stringsPercent = Math.min(100, Math.round((stringsCount / 4) * 100));
  const listsPercent = Math.min(100, Math.round((listsCount / 4) * 100));
  const treesPercent = Math.min(100, Math.round((treesCount / 7) * 100));
  const graphsPercent = Math.min(100, Math.round((graphsCount / 4) * 100));

  const totalSolved = arraysCount + stringsCount + listsCount + treesCount + graphsCount;
  const overallPercent = Math.min(100, Math.round((totalSolved / 23) * 100));

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 max-w-7xl mx-auto pb-12"
    >
      {/* Welcome Greeting Header Card */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/50 dark:border-white/5 bg-white dark:bg-card-dark p-6 sm:p-8 shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent blur-3xl pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 dark:bg-indigo-500/15 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
              <Sparkles className="w-3 h-3" /> Candidate Dashboard
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Welcome back, <span className="text-gradient font-black">{user?.name}</span> 👋
            </h1>
            <p className="text-slate-400 text-xs font-light max-w-xl">
              Track your daily intervals, audit resume matrices, solve challenges, and trace mock session progress.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-bg-dark border border-slate-200/60 dark:border-white/5 shadow-inner">
              <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
              <span className="font-bold text-xs text-slate-700 dark:text-slate-250">{stats.streak} Day Streak</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/15 border border-indigo-500/20 shadow-sm">
              <Award className="w-4 h-4 text-indigo-500" />
              <span className="font-bold text-xs text-indigo-600 dark:text-indigo-400">
                {stats.points} XP Points
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Widgets Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div variants={cardVariants} className="glass-card p-5 relative overflow-hidden group">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 mb-4">
            <Video className="w-4.5 h-4.5" />
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Interviews Mocked</p>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1.5">{stats.mocksCount}</h3>
          <div className="flex items-center justify-between text-[10px] text-slate-400 mt-3 border-t border-slate-100 dark:border-white/5 pt-2">
            <span>High Score</span>
            <span className="font-semibold text-indigo-500">{stats.bestScore}%</span>
          </div>
        </motion.div>

        <motion.div variants={cardVariants} className="glass-card p-5 relative overflow-hidden group">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-500 mb-4">
            <FileText className="w-4.5 h-4.5" />
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ATS Resume Audit</p>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1.5">{stats.resumeScore}%</h3>
          <div className="flex items-center justify-between text-[10px] text-slate-400 mt-3 border-t border-slate-100 dark:border-white/5 pt-2">
            <span>Scan History</span>
            <Link to="/resume-upload" className="font-semibold text-cyan-500 flex items-center gap-0.5 hover:underline">
              View <ArrowUpRight className="w-2.5 h-2.5" />
            </Link>
          </div>
        </motion.div>

        <motion.div variants={cardVariants} className="glass-card p-5 relative overflow-hidden group">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-4">
            <Code className="w-4.5 h-4.5" />
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">DSA Progress</p>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1.5">{stats.dsaSolved}</h3>
          <div className="flex items-center justify-between text-[10px] text-slate-400 mt-3 border-t border-slate-100 dark:border-white/5 pt-2">
            <span>Concept Hub</span>
            <Link to="/dsa-practice" className="font-semibold text-emerald-500 flex items-center gap-0.5 hover:underline">
              Solve <ArrowUpRight className="w-2.5 h-2.5" />
            </Link>
          </div>
        </motion.div>

        <motion.div variants={cardVariants} className="glass-card p-5 relative overflow-hidden group">
          <div className="w-9 h-9 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 mb-4">
            <Zap className="w-4.5 h-4.5" />
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Performance Rating</p>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1.5">{stats.bestScore > 0 ? `${stats.bestScore}%` : 'N/A'}</h3>
          <div className="flex items-center justify-between text-[10px] text-slate-400 mt-3 border-t border-slate-100 dark:border-white/5 pt-2">
            <span>Overall rating</span>
            <span className="font-semibold text-orange-500">
              {stats.bestScore >= 80 ? 'Excellent' : stats.bestScore >= 60 ? 'Above Avg' : stats.bestScore > 0 ? 'Needs Practice' : 'None'}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Main Charts & Daily Widget Layout */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Score Trends Chart */}
        <motion.div variants={cardVariants} className="glass-card p-6 lg:col-span-2 space-y-6 bg-white dark:bg-card-dark">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4.5 h-4.5 text-indigo-500" />
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">Mock Performance Curve</h3>
            </div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Overall Grade Metrics</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" className="stroke-slate-100 dark:stroke-white/5" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} domain={[0, 100]} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(22, 31, 51, 0.8)', 
                    borderColor: 'rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '11px',
                    backdropFilter: 'blur(10px)'
                  }} 
                />
                <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Daily Challenge Widget */}
        <motion.div variants={cardVariants} className="glass-card p-6 flex flex-col justify-between gap-6 bg-white dark:bg-card-dark">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-white/5">
              <div className="flex items-center gap-2">
                <Calendar className="w-4.5 h-4.5 text-orange-500" />
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">Daily Challenge</h3>
              </div>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-500 tracking-wider uppercase">
                Active
              </span>
            </div>

            {dailyChallenge ? (
              <div className="space-y-2">
                <span className="inline-block px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-500 text-[9px] font-bold uppercase tracking-wider">
                  {dailyChallenge.difficulty || 'Medium'}
                </span>
                <h4 className="font-bold text-base text-slate-800 dark:text-slate-100">{dailyChallenge.title}</h4>
                <p className="text-xs text-slate-500 dark:text-text-secondary-dark line-clamp-3 leading-relaxed font-light">
                  {dailyChallenge.description}
                </p>
              </div>
            ) : (
              <p className="text-xs text-slate-400 font-light">Retrieving today's code intervals...</p>
            )}
          </div>

          <Link
            to="/daily-challenge"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-650 hover:to-purple-650 text-white font-bold transition-all text-xs text-center flex items-center justify-center gap-1.5 shadow-md shadow-indigo-500/15"
          >
            Solve Challenge <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>
      </div>

      {/* DSA Progress bar chart & Recent Activity */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* DSA Progress Checklist Card */}
        <motion.div variants={cardVariants} className="glass-card p-6 lg:col-span-2 space-y-6 bg-white dark:bg-card-dark flex flex-col justify-between">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 tracking-tight">
                DSA Progress Checklist
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 text-[9px] font-bold border border-emerald-500/10">
                Overall: {overallPercent}% Completed
              </span>
            </div>

            {/* Description */}
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-light leading-relaxed">
              Prepare step-by-step for FAANG/SaaS technical coding rounds. Review core concepts across basic and advanced structural topics:
            </p>

            {/* Progress Checklist Rows */}
            <div className="space-y-3.5 pt-1">
              {/* Row 1: Arrays */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium text-slate-700 dark:text-slate-350">Arrays Sheet</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">Mastery Level</span>
                </div>
                <div className="w-full h-1 bg-slate-100 dark:bg-slate-800/80 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                    style={{ width: `${arraysPercent}%` }}
                  ></div>
                </div>
              </div>

              {/* Row 2: Strings */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium text-slate-700 dark:text-slate-350">Strings Sheet</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">Mastery Level</span>
                </div>
                <div className="w-full h-1 bg-slate-100 dark:bg-slate-800/80 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                    style={{ width: `${stringsPercent}%` }}
                  ></div>
                </div>
              </div>

              {/* Row 3: Linked List */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium text-slate-700 dark:text-slate-350">Linked List Sheet</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">Mastery Level</span>
                </div>
                <div className="w-full h-1 bg-slate-100 dark:bg-slate-800/80 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                    style={{ width: `${listsPercent}%` }}
                  ></div>
                </div>
              </div>

              {/* Row 4: Trees */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium text-slate-700 dark:text-slate-350">Trees Sheet</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">Mastery Level</span>
                </div>
                <div className="w-full h-1 bg-slate-100 dark:bg-slate-800/80 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                    style={{ width: `${treesPercent}%` }}
                  ></div>
                </div>
              </div>

              {/* Row 5: Graphs */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium text-slate-700 dark:text-slate-350">Graphs Sheet</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">Mastery Level</span>
                </div>
                <div className="w-full h-1 bg-slate-100 dark:bg-slate-800/80 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                    style={{ width: `${graphsPercent}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Link Button */}
          <Link
            to="/dsa-practice"
            className="w-full py-2.5 rounded-xl border border-dashed border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 font-semibold transition-all text-xs text-center flex items-center justify-center gap-1"
          >
            Open Topic Sheets & Mark Problems →
          </Link>
        </motion.div>

        {/* Recent Activity List */}
        <motion.div variants={cardVariants} className="glass-card p-6 space-y-4 bg-white dark:bg-card-dark flex flex-col justify-between">
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">Recent Interview Rounds</h3>
          <div className="flex flex-col gap-3">
            {recentSessions.length > 0 ? (
              recentSessions.map((session) => (
                <div
                  key={session._id}
                  className="flex items-center justify-between p-4 rounded-xl bg-slate-50/50 dark:bg-bg-dark/40 border border-slate-150 dark:border-white/5 hover:border-indigo-500/25 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                      <Brain className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-850 dark:text-slate-200">{session.jobRole}</h4>
                      <p className="text-[10px] text-slate-450 dark:text-slate-400 mt-0.5">
                        {session.techStack} • {session.difficulty}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {session.status === 'completed' ? (
                      <div className="text-right">
                        <span className="text-xs font-bold text-indigo-500">
                          {session.overallScore.overall}%
                        </span>
                        <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Score</p>
                      </div>
                    ) : (
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-500 uppercase tracking-wider">
                        Active
                      </span>
                    )}

                    <Link
                      to={
                        session.status === 'completed'
                          ? `/evaluation/${session._id}`
                          : `/mock-interview`
                      }
                      className="p-1.5 bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg text-slate-500 dark:text-slate-350 transition-colors border border-slate-200/50 dark:border-white/5"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-slate-400 space-y-4">
                <p className="text-xs font-light">You have no interview sessions yet.</p>
                <Link
                  to="/mock-interview"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs shadow-md shadow-indigo-650/15"
                >
                  Start First Mock Interview
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
