import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { BarChart3, TrendingUp, Cpu, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
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
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Title */}
      <div className="border-b pb-4 border-slate-200/50 dark:border-white/5">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Performance Analytics</h1>
        <p className="text-slate-400 text-xs font-light mt-1">
          Review historical mock interview score comparisons and sub-metric stats.
        </p>
      </div>

      {history.length > 0 ? (
        <>
          {/* Stats widgets */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-card p-5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Average Grade</span>
              <h2 className="text-2xl font-black text-indigo-500 mt-1.5">{summary.avgScore}%</h2>
            </div>
            <div className="glass-card p-5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Highest Score</span>
              <h2 className="text-2xl font-black text-emerald-500 mt-1.5">{summary.highestScore}%</h2>
            </div>
            <div className="glass-card p-5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Technical Accuracy</span>
              <h2 className="text-2xl font-black text-purple-500 mt-1.5">{summary.avgTech}%</h2>
            </div>
            <div className="glass-card p-5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Avg Communication</span>
              <h2 className="text-2xl font-black text-orange-500 mt-1.5">{summary.avgComm}%</h2>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Progression Chart */}
            <div className="glass-card p-6 lg:col-span-2 space-y-6 bg-white dark:bg-card-dark">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4.5 h-4.5 text-indigo-500" />
                <h3 className="font-bold text-xs text-slate-800 dark:text-slate-100">Progressive Score Timelines</h3>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendsData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" className="stroke-slate-100 dark:stroke-white/5" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={9} domain={[0, 100]} tickLine={false} axisLine={false} />
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
                    <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '10px' }} />
                    <Area type="monotone" dataKey="Score" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorAvg)" />
                    <Area type="monotone" dataKey="Technical" stroke="#a855f7" strokeWidth={1.5} fill="none" />
                    <Area type="monotone" dataKey="Communication" stroke="#f97316" strokeWidth={1.5} fill="none" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Mocks by Role breakdown */}
            <div className="glass-card p-6 space-y-6 bg-white dark:bg-card-dark">
              <div className="flex items-center gap-2">
                <Cpu className="w-4.5 h-4.5 text-indigo-500" />
                <h3 className="font-bold text-xs text-slate-800 dark:text-slate-100 font-sans">Interviews by Job Role</h3>
              </div>
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={skillsData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" className="stroke-slate-100 dark:stroke-white/5" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={9} allowDecimals={false} tickLine={false} axisLine={false} />
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
                    <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="glass-panel border p-12 bg-white dark:bg-card-dark rounded-2xl shadow-sm text-center text-slate-400 space-y-4 max-w-lg mx-auto py-16">
          <BarChart3 className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto animate-pulse" />
          <h3 className="font-bold text-base text-slate-700 dark:text-slate-355">No Session Analytics Compiled</h3>
          <p className="text-xs max-w-xs mx-auto font-light leading-relaxed">
            Practice mock interviews to generate detailed progress metrics, score curves, and role breakdowns.
          </p>
        </div>
      )}
    </div>
  );
};

export default Analytics;
