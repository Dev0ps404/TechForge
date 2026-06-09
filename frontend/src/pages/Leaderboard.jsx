import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Trophy, Flame, ShieldAlert, Award, Loader2, Sparkles, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const Leaderboard = () => {
  const [scope, setScope] = useState('global');
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/leaderboard?scope=${scope}`);
        if (res.data.success) {
          setRankings(res.data.rankings || []);
        }
      } catch (err) {
        console.error('Failed to retrieve rankings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRankings();
  }, [scope]);

  const podiumUsers = rankings.slice(0, 3);
  const tableUsers = rankings.slice(3);

  const getOrderedPodium = () => {
    if (podiumUsers.length === 0) return [];
    const ordered = [];
    if (podiumUsers[1]) ordered.push({ ...podiumUsers[1], pos: '2nd' });
    if (podiumUsers[0]) ordered.push({ ...podiumUsers[0], pos: '1st' });
    if (podiumUsers[2]) ordered.push({ ...podiumUsers[2], pos: '3rd' });
    return ordered;
  };

  const orderedPodium = getOrderedPodium();

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4 border-slate-200/50 dark:border-white/5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Rankings Leaderboard</h1>
          <p className="text-slate-400 text-xs font-light">
            Compare points and streaks earned through mock sessions and DSA practice.
          </p>
        </div>

        {/* Scope toggler */}
        <div className="flex bg-slate-100 dark:bg-bg-dark-sec p-1 rounded-xl border border-slate-200/50 dark:border-white/5 max-w-max">
          {['global', 'weekly', 'monthly'].map((sc) => (
            <button
              key={sc}
              onClick={() => setScope(sc)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold capitalize tracking-wider transition-all ${
                scope === sc
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm font-extrabold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {sc}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-7 h-7 text-primary animate-spin" />
        </div>
      ) : rankings.length === 0 ? (
        <div className="text-center py-16 text-slate-450 space-y-2 max-w-md mx-auto">
          <ShieldAlert className="w-10 h-10 text-slate-350 mx-auto" />
          <p className="text-xs font-light">No leaderboard rankings recorded yet.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Visual Podium for Top 3 */}
          {orderedPodium.length > 0 && (
            <div className="flex items-end justify-center gap-4 sm:gap-6 pt-10 pb-4 max-w-lg mx-auto">
              {orderedPodium.map((user) => {
                const isFirst = user.pos === '1st';
                const isSecond = user.pos === '2nd';
                
                const podiumHeightClass = isFirst
                  ? 'h-36 bg-gradient-to-t from-indigo-500/20 to-indigo-500/5 border-indigo-500/20'
                  : isSecond
                  ? 'h-28 bg-gradient-to-t from-slate-300/15 to-slate-300/5 border-slate-300/15'
                  : 'h-24 bg-gradient-to-t from-orange-500/15 to-orange-500/5 border-orange-500/15';

                return (
                  <div
                    key={user.userId}
                    className="flex flex-col items-center text-center w-28 sm:w-32 group"
                  >
                    {/* User profile picture */}
                    <div className="relative">
                      {isFirst && (
                        <Trophy className="absolute -top-6 left-1/2 -translate-x-1/2 w-5 h-5 text-yellow-500 animate-bounce" />
                      )}
                      <img
                        src={user.profilePicture}
                        alt={user.name}
                        className={`w-12 h-12 rounded-xl object-cover border shadow-md ${
                          isFirst
                            ? 'border-yellow-500 ring-4 ring-yellow-500/10'
                            : isSecond
                            ? 'border-slate-300'
                            : 'border-orange-500'
                        }`}
                      />
                      <span
                        className={`absolute -bottom-2 left-1/2 -translate-x-1/2 text-[9px] font-extrabold px-1.5 py-0.5 rounded-full ${
                          isFirst
                            ? 'bg-yellow-500 text-slate-900'
                            : isSecond
                            ? 'bg-slate-300 text-slate-900'
                            : 'bg-orange-500 text-white'
                        }`}
                      >
                        {user.pos}
                      </span>
                    </div>

                    <h4 className="font-bold text-xs truncate w-full mt-4 text-slate-800 dark:text-slate-200">{user.name}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">{user.points} XP</p>

                    <div
                      className={`w-full mt-3 rounded-t-xl border border-b-0 flex flex-col justify-end p-2 ${podiumHeightClass}`}
                    >
                      <div className="flex items-center justify-center gap-0.5 text-orange-500 text-[10px] font-bold">
                        <Flame className="w-3.5 h-3.5" />
                        <span>{user.streak}d</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Rankings Table */}
          <div className="glass-panel border rounded-2xl overflow-hidden bg-white dark:bg-card-dark shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-bg-dark-sec/40 border-b border-slate-100 dark:border-white/5 text-slate-400 font-bold uppercase tracking-wider text-[9px]">
                    <th className="p-4 w-16 text-center">Rank</th>
                    <th className="p-4">Candidate Profile</th>
                    <th className="p-4 text-center">Streak Status</th>
                    <th className="p-4 text-right">XP Points</th>
                  </tr>
                </thead>
                <tbody>
                  {tableUsers.map((user) => (
                    <tr
                      key={user.userId}
                      className="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors"
                    >
                      <td className="p-4 text-center font-bold text-slate-400">#{user.rank}</td>
                      <td className="p-4 flex items-center gap-3">
                        <img
                          src={user.profilePicture}
                          alt={user.name}
                          className="w-7 h-7 rounded-lg object-cover border border-slate-200 dark:border-white/10"
                        />
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-700 dark:text-slate-250">
                            {user.name}
                          </span>
                          {user.role === 'admin' && (
                            <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-500 uppercase tracking-wider">
                              Admin
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-center font-bold text-orange-500">
                        <div className="flex items-center justify-center gap-1">
                          <Flame className="w-3.5 h-3.5" />
                          <span>{user.streak} Days</span>
                        </div>
                      </td>
                      <td className="p-4 text-right font-extrabold text-slate-800 dark:text-slate-200">
                        {user.points} XP
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
