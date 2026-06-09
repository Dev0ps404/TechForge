import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { BarChart3, TrendingUp, Cpu, MessageSquare, Flame, Loader } from 'lucide-react';
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
  Legend,
} from 'recharts';

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);
  const [summary, setSummary] = useState({
    avgScore: 0,
    avgTech: 0,
    avgComm: 0,
    avgConf: 0,
    avgGrammar: 0,
    highestScore: 0,
  });
  const [trendsData, setTrendsData] = useState([]);
  const [skillsData, setSkillsData] = useState([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await api.get('/interviews/sessions');
        const sessions = res.data.data || [];
        const completed = sessions.filter((s) => s.status === 'completed');
        setHistory(completed);

        if (completed.length > 0) {
          let sumOverall = 0;
          let sumTech = 0;
          let sumComm = 0;
          let sumConf = 0;
          let sumGrammar = 0;
          const scores = completed.map((s) => s.overallScore.overall);

          completed.forEach((s) => {
            sumOverall += s.overallScore.overall || 0;
            sumTech += s.overallScore.technical || 0;
            sumComm += s.overallScore.communication || 0;
            sumConf += s.overallScore.confidence || 0;
            sumGrammar += s.overallScore.grammar || 0;
          });

          const count = completed.length;
          setSummary({
            avgScore: Math.round(sumOverall / count),
            avgTech: Math.round(sumTech / count),
            avgComm: Math.round(sumComm / count),
            avgConf: Math.round(sumConf / count),
            avgGrammar: Math.round(sumGrammar / count),
            highestScore: Math.max(...scores),
          });

          // Format Recharts line trends
          const trends = completed
            .slice()
            .reverse()
            .map((s, idx) => ({
              name: `Mock #${idx + 1}`,
              Score: s.overallScore.overall,
              Technical: s.overallScore.technical,
              Communication: s.overallScore.communication,
            }));
          setTrendsData(trends);

          // Group by job roles or stacks
          const rolesCount = {};
          completed.forEach((s) => {
            rolesCount[s.jobRole] = (rolesCount[s.jobRole] || 0) + 1;
          });
          const skills = Object.keys(rolesCount).map((role) => ({
            name: role,
            count: rolesCount[role],
          }));
          setSkillsData(skills);
        }
      } catch (err) {
        console.error('Failed to retrieve analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

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
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Performance Analytics</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-light mt-1">
          Review historical mock interview score comparisons and sub-metric stats.
        </p>
      </div>

      {history.length > 0 ? (
        <>
          {/* Stats widgets */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-panel border p-5 rounded-3xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Average Grade</span>
              <h2 className="text-3xl font-extrabold text-indigo-500 mt-1">{summary.avgScore}%</h2>
            </div>
            <div className="glass-panel border p-5 rounded-3xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Highest Score</span>
              <h2 className="text-3xl font-extrabold text-emerald-500 mt-1">{summary.highestScore}%</h2>
            </div>
            <div className="glass-panel border p-5 rounded-3xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Avg Technical accuracy</span>
              <h2 className="text-3xl font-extrabold text-purple-500 mt-1">{summary.avgTech}%</h2>
            </div>
            <div className="glass-panel border p-5 rounded-3xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Avg Communication</span>
              <h2 className="text-3xl font-extrabold text-orange-500 mt-1">{summary.avgComm}%</h2>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Progression Chart */}
            <div className="glass-panel border p-6 rounded-3xl lg:col-span-2 space-y-6">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-500" />
                <h3 className="font-bold text-base">Progressive Score Timelines</h3>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendsData}>
                    <defs>
                      <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-dark-800" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 100]} tickLine={false} />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="Score" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorAvg)" />
                    <Area type="monotone" dataKey="Technical" stroke="#a855f7" strokeWidth={1.5} fill="none" />
                    <Area type="monotone" dataKey="Communication" stroke="#f97316" strokeWidth={1.5} fill="none" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Mocks by Role breakdown */}
            <div className="glass-panel border p-6 rounded-3xl space-y-6">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-indigo-500" />
                <h3 className="font-bold text-base">Interviews by Job Role</h3>
              </div>
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={skillsData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-dark-800" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} allowDecimals={false} tickLine={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="glass-panel border p-12 rounded-3xl text-center text-slate-400 space-y-4">
          <BarChart3 className="w-12 h-12 text-slate-300 mx-auto animate-pulse" />
          <h3 className="font-bold text-lg text-slate-700 dark:text-slate-300">No session analytics compiled</h3>
          <p className="text-sm max-w-sm mx-auto font-light leading-relaxed">
            Practice mock interviews to generate detailed progress metrics, score curves, and role breakdowns.
          </p>
        </div>
      )}
    </div>
  );
};

export default Analytics;
