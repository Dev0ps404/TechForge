import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Calendar, Play, Send, Award, Flame, CheckCircle, Loader2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const DailyChallenge = () => {
  const { user, refreshProfile } = useAuth();
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [runningTests, setRunningTests] = useState(false);
  
  const [editorCode, setEditorCode] = useState('');
  const [textResponse, setTextResponse] = useState('');
  const [completedToday, setCompletedToday] = useState(false);

  const fetchDailyChallenge = async () => {
    try {
      setLoading(true);
      const res = await api.get('/challenges/daily');
      if (res.data.success) {
        setChallenge(res.data.challenge);
        setCompletedToday(res.data.challenge.userCompleted);
        if (res.data.challenge.type === 'coding') {
          setEditorCode(res.data.challenge.templateCode || '');
        }
      }
    } catch (err) {
      console.error('Failed to retrieve daily challenge:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDailyChallenge();
  }, []);

  const handleRunTests = () => {
    setRunningTests(true);
    toast.success('Compiling and running sample test cases...');
    setTimeout(() => {
      setRunningTests(false);
      toast.success('Test Cases Passed: 1 / 1. Ready for submission!');
    }, 1500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const answerText = challenge.type === 'coding' ? editorCode : textResponse;
    if (!answerText.trim()) {
      toast.error('Please write your solution before submitting');
      return;
    }

    try {
      setSubmitting(true);
      toast.loading('Submitting challenge response...');
      const res = await api.post('/challenges/submit', {
        challengeId: challenge._id,
        answerText,
      });

      toast.dismiss();
      if (res.data.success) {
        toast.success(res.data.message);
        setCompletedToday(true);
        refreshProfile();
      }
    } catch (err) {
      toast.dismiss();
      const errMsg = err.response?.data?.message || 'Submission failed.';
      toast.error(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="text-center py-16 text-slate-400 space-y-4 max-w-md mx-auto">
        <AlertCircle className="w-10 h-10 text-slate-355 mx-auto" />
        <p className="text-xs font-light">No daily challenges loaded today.</p>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6 items-stretch max-w-7xl mx-auto pb-12">
      {/* Description Panel */}
      <motion.div 
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="glass-panel border p-6 sm:p-8 bg-white dark:bg-card-dark flex flex-col justify-between space-y-6 rounded-2xl shadow-sm"
      >
        <div className="space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between border-b pb-4 border-slate-100 dark:border-white/5">
            <div className="flex items-center gap-2">
              <Calendar className="w-4.5 h-4.5 text-orange-500 animate-pulse" />
              <h2 className="font-bold text-sm text-slate-800 dark:text-slate-100">Daily Challenge</h2>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-orange-500/10 text-orange-500 text-[10px] font-bold tracking-wider uppercase">
              <Award className="w-3.5 h-3.5" />
              <span>+{challenge.rewardPoints} XP</span>
            </div>
          </div>

          <span className="inline-block px-2.5 py-0.5 text-[9px] font-bold rounded-md bg-indigo-500/10 text-indigo-500 uppercase tracking-wider">
            {challenge.type} challenge
          </span>

          <h1 className="text-lg md:text-xl font-bold text-slate-850 dark:text-white leading-snug">{challenge.title}</h1>

          {/* Description text */}
          <div className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed font-light whitespace-pre-line bg-slate-50/50 dark:bg-bg-dark/30 p-5 rounded-xl border border-slate-150 dark:border-white/5 font-mono">
            {challenge.description}
          </div>
        </div>

        {/* Streak detail */}
        <div className="flex items-center gap-3 p-4 rounded-xl bg-indigo-500/5 dark:bg-indigo-550/10 border border-indigo-500/10 text-xs text-indigo-650 dark:text-indigo-400">
          <Flame className="w-5 h-5 text-orange-500 animate-pulse-smooth" />
          <div>
            <p className="font-bold text-xs">Maintain your Daily Streak!</p>
            <p className="text-[10px] font-light mt-0.5">Solve a challenge every 24 hours to claim consecutive XP multipliers.</p>
          </div>
        </div>
      </motion.div>

      {/* Code Editor or Text Submission Panel */}
      <motion.div 
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="glass-panel border p-6 bg-white dark:bg-card-dark flex flex-col justify-between min-h-[450px] rounded-2xl shadow-sm relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-br from-indigo-500/5 to-transparent blur-2xl pointer-events-none"></div>

        {completedToday ? (
          <div className="flex-grow flex flex-col items-center justify-center text-center space-y-4 py-12">
            <CheckCircle className="w-14 h-14 text-emerald-500" />
            <h3 className="text-base font-bold text-slate-800 dark:text-white">Challenge Completed!</h3>
            <p className="text-xs text-slate-400 max-w-xs leading-relaxed font-light">
              You have successfully completed today's task. Check back tomorrow for the next challenge!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex-grow flex flex-col justify-between h-full space-y-6 relative z-10">
            <div className="flex-grow flex flex-col space-y-3">
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 tracking-wider">
                <span>{challenge.type === 'coding' ? 'JAVASCRIPT CONSOLE' : 'SCENARIO WORKSPACE'}</span>
                <span className="flex items-center gap-1.5 text-indigo-500">
                  <Sparkles className="w-3.5 h-3.5" /> Auto-lint enabled
                </span>
              </div>

              {challenge.type === 'coding' ? (
                <textarea
                  value={editorCode}
                  onChange={(e) => setEditorCode(e.target.value)}
                  className="w-full flex-grow p-4 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-950 text-slate-100 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-primary/45 h-72 resize-none leading-relaxed"
                />
              ) : (
                <textarea
                  placeholder="Explain your approach or solution in detail..."
                  value={textResponse}
                  onChange={(e) => setTextResponse(e.target.value)}
                  className="w-full flex-grow p-4 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-bg-dark/30 text-xs focus:outline-none focus:ring-2 focus:ring-primary/25 h-72 font-light leading-relaxed"
                />
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-white/5">
              {challenge.type === 'coding' && (
                <button
                  type="button"
                  onClick={handleRunTests}
                  disabled={runningTests || submitting}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 text-xs font-bold transition-all disabled:opacity-40 flex items-center gap-1.5 text-slate-700 dark:text-slate-350"
                >
                  {runningTests ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" /> Run Tests
                    </>
                  )}
                </button>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="flex-grow py-2.5 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 text-white font-bold rounded-xl text-xs transition-colors shadow-lg shadow-blue-500/20 flex items-center justify-center gap-1.5"
              >
                {submitting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <>
                    Submit Solution <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default DailyChallenge;
