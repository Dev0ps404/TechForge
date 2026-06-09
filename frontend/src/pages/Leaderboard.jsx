import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Trophy, Flame, ShieldAlert, Award, Loader2, Sparkles } from 'lucide-react';

const Leaderboard = () => {
  const [scope, setScope] = useState('global'); // global, weekly, monthly
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

  // Extract top 3 for the podium
  const podiumUsers = rankings.slice(0, 3);
  const tableUsers = rankings.slice(3);

  // Helper to reorder podium for visual correctness (2nd, 1st, 3rd)
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
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Candidate Leaderboard</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-light mt-1">
            Compare points and streaks earned through mock sessions and DSA practice.
          </p>
        </div>

        {/* Scope toggler */}
        <div className="flex bg-slate-100 dark:bg-dark-900 p-1.5 rounded-2xl border">
          {['global', 'weekly', 'monthly'].map((sc) => (
            <button
              key={sc}
              onClick={() => setScope(sc)}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                scope === sc
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {sc}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        </div>
      ) : rankings.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <ShieldAlert className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-sm">No leaderboard rankings recorded yet.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Visual Podium for Top 3 */}
          {orderedPodium.length > 0 && (
            <div className="flex items-end justify-center gap-4 sm:gap-8 pt-12 pb-6 max-w-xl mx-auto border-b border-slate-100 dark:border-dark-850">
              {orderedPodium.map((user) => {
                const isFirst = user.pos === '1st';
                const isSecond = user.pos === '2nd';
                
                // Height styling based on podium placement
                const podiumHeightClass = isFirst
                  ? 'h-36 bg-gradient-to-t from-indigo-500/20 to-indigo-500/5 border-indigo-500/30'
                  : isSecond
                  ? 'h-28 bg-gradient-to-t from-slate-300/20 to-slate-300/5 border-slate-200/30'
                  : 'h-24 bg-gradient-to-t from-orange-500/20 to-orange-500/5 border-orange-500/20';

                return (
                  <div
                    key={user.userId}
                    className="flex flex-col items-center text-center w-28 sm:w-32 group"
                  >
                    {/* User profile picture */}
                    <div className="relative">
                      {isFirst && (
                        <Trophy className="absolute -top-6 left-1/2 -translate-x-1/2 w-6 h-6 text-yellow-500 animate-bounce" />
                      )}
                      <img
                        src={user.profilePicture}
                        alt={user.name}
                        className={`w-14 h-14 rounded-2xl object-cover border-2 shadow-md ${
                          isFirst
                            ? 'border-yellow-500 ring-4 ring-yellow-500/20'
                            : isSecond
                            ? 'border-slate-300'
                            : 'border-orange-500'
                        }`}
                      />
                      <span
                        className={`absolute -bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
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

                    <h4 className="font-extrabold text-sm truncate w-full mt-4">{user.name}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">{user.points} Points</p>

                    {/* Styled column */}
                    <div
                      className={`w-full mt-3 rounded-t-2xl border border-b-0 flex flex-col justify-end p-3 ${podiumHeightClass}`}
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
          <div className="glass-panel border rounded-3xl overflow-hidden shadow-md">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-dark-900 border-b border-slate-100 dark:border-dark-800 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="p-4 w-16 text-center">Rank</th>
                  <th className="p-4">Candidate Name</th>
                  <th className="p-4 text-center">DSA Streak</th>
                  <th className="p-4 text-right">Total Points</th>
                </tr>
              </thead>
              <tbody>
                {tableUsers.map((user) => (
                  <tr
                    key={user.userId}
                    className="border-b border-slate-100 dark:border-dark-850 hover:bg-slate-50/50 dark:hover:bg-dark-900/10 transition-colors"
                  >
                    <td className="p-4 text-center font-bold text-slate-400">#{user.rank}</td>
                    <td className="p-4 flex items-center gap-3">
                      <img
                        src={user.profilePicture}
                        alt={user.name}
                        className="w-8 h-8 rounded-xl object-cover border"
                      />
                      <div>
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {user.name}
                        </span>
                        {user.role === 'admin' && (
                          <span className="ml-1.5 text-[8px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-500 uppercase">
                            Admin
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-center font-bold text-orange-500">
                      <div className="flex items-center justify-center gap-1">
                        <Flame className="w-4 h-4" />
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
      )}
    </div>
  );
};

export default Leaderboard;
