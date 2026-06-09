import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Code, CheckSquare, Square, Flame, Loader2, Sparkles, PlusCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const DsaPractice = () => {
  const { user, refreshProfile } = useAuth();
  const [progressList, setProgressList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(null);
  const [filterDifficulty, setFilterDifficulty] = useState('All');

  const problemsBank = {
    'Arrays': [
      { id: 'arr1', name: 'Two Sum', difficulty: 'Easy' },
      { id: 'arr2', name: 'Container With Most Water', difficulty: 'Medium' },
      { id: 'arr3', name: 'Merge Intervals', difficulty: 'Medium' },
      { id: 'arr4', name: 'First Missing Positive', difficulty: 'Hard' }
    ],
    'Strings': [
      { id: 'str1', name: 'Valid Palindrome', difficulty: 'Easy' },
      { id: 'str2', name: 'Longest Substring Without Repeating Characters', difficulty: 'Medium' },
      { id: 'str3', name: 'Group Anagrams', difficulty: 'Medium' },
      { id: 'str4', name: 'Minimum Window Substring', difficulty: 'Hard' }
    ],
    'Linked List': [
      { id: 'll1', name: 'Reverse Linked List', difficulty: 'Easy' },
      { id: 'll2', name: 'Merge Two Sorted Lists', difficulty: 'Easy' },
      { id: 'll3', name: 'Remove Nth Node From End of List', difficulty: 'Medium' },
      { id: 'll4', name: 'Linked List Cycle II', difficulty: 'Medium' }
    ],
    'Stack': [
      { id: 'st1', name: 'Valid Parentheses', difficulty: 'Easy' },
      { id: 'st2', name: 'Evaluate Reverse Polish Notation', difficulty: 'Medium' },
      { id: 'st3', name: 'Largest Rectangle in Histogram', difficulty: 'Hard' }
    ],
    'Queue': [
      { id: 'qu1', name: 'Implement Stack using Queues', difficulty: 'Easy' },
      { id: 'qu2', name: 'Design Circular Queue', difficulty: 'Medium' },
      { id: 'qu3', name: 'Sliding Window Maximum', difficulty: 'Hard' }
    ],
    'Trees': [
      { id: 'tr1', name: 'Maximum Depth of Binary Tree', difficulty: 'Easy' },
      { id: 'tr2', name: 'Invert Binary Tree', difficulty: 'Easy' },
      { id: 'tr3', name: 'Binary Tree Level Order Traversal', difficulty: 'Medium' }
    ],
    'Binary Trees': [
      { id: 'bt1', name: 'Diameter of Binary Tree', difficulty: 'Easy' },
      { id: 'bt2', name: 'Lowest Common Ancestor of a Binary Tree', difficulty: 'Medium' }
    ],
    'BST': [
      { id: 'bst1', name: 'Convert Sorted Array to Binary Search Tree', difficulty: 'Easy' },
      { id: 'bst2', name: 'Validate Binary Search Tree', difficulty: 'Medium' }
    ],
    'Graphs': [
      { id: 'gr1', name: 'Number of Islands', difficulty: 'Medium' },
      { id: 'gr2', name: 'Clone Graph', difficulty: 'Medium' },
      { id: 'gr3', name: 'Course Schedule', difficulty: 'Medium' },
      { id: 'gr4', name: 'Word Ladder', difficulty: 'Hard' }
    ],
    'Dynamic Programming': [
      { id: 'dp1', name: 'Climbing Stairs', difficulty: 'Easy' },
      { id: 'dp2', name: 'Coin Change', difficulty: 'Medium' },
      { id: 'dp3', name: 'Longest Common Subsequence', difficulty: 'Medium' },
      { id: 'dp4', name: 'Edit Distance', difficulty: 'Hard' }
    ],
    'Greedy': [
      { id: 'gy1', name: 'Assign Cookies', difficulty: 'Easy' },
      { id: 'gy2', name: 'Jump Game', difficulty: 'Medium' },
      { id: 'gy3', name: 'Gas Station', difficulty: 'Medium' }
    ],
    'Recursion': [
      { id: 'rec1', name: 'Fibonacci Number', difficulty: 'Easy' },
      { id: 'rec2', name: 'Pow(x, n)', difficulty: 'Medium' }
    ],
    'Backtracking': [
      { id: 'bk1', name: 'Subsets', difficulty: 'Medium' },
      { id: 'bk2', name: 'Permutations', difficulty: 'Medium' },
      { id: 'bk3', name: 'N-Queens', difficulty: 'Hard' }
    ]
  };

  const fetchDsaProgress = async () => {
    try {
      setLoading(true);
      const res = await api.get('/dsa/progress');
      if (res.data.success) {
        setProgressList(res.data.data);
      }
    } catch (err) {
      console.error('Failed to retrieve DSA logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDsaProgress();
  }, []);

  const handleToggle = async (topic, problemName, difficulty, currentCompleted) => {
    const key = `${topic}-${problemName}`;
    try {
      setToggling(key);
      const res = await api.post('/dsa/progress', {
        topic,
        problemName,
        difficulty,
        completed: !currentCompleted,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        fetchDsaProgress();
        refreshProfile();
      }
    } catch (err) {
      console.error('Failed to modify DSA progress:', err);
      toast.error('Could not modify completion status.');
    } finally {
      setToggling(null);
    }
  };

  const isCompleted = (topic, problemName) => {
    return progressList.some(
      (p) => p.topic === topic && p.problemName === problemName && p.completed
    );
  };

  const getDiffColor = (diff) => {
    if (diff === 'Easy') return 'text-emerald-500 bg-emerald-550/10';
    if (diff === 'Medium') return 'text-amber-500 bg-amber-550/10';
    return 'text-rose-500 bg-rose-550/10';
  };

  const getCompletionPercentage = (topic) => {
    const categoryProblems = problemsBank[topic] || [];
    if (categoryProblems.length === 0) return 0;
    
    const completedCount = categoryProblems.filter((p) =>
      isCompleted(topic, p.name)
    ).length;

    return Math.round((completedCount / categoryProblems.length) * 100);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header and Streaks */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4 border-slate-200/50 dark:border-white/5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">DSA Practice & Streaks</h1>
          <p className="text-slate-400 text-xs font-light">
            Stay consistent. Practice essential conceptual coding templates across 13 core categories.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-card-dark border border-slate-200/60 dark:border-white/5 text-xs font-bold shadow-sm">
            <Flame className="w-4.5 h-4.5 text-orange-500 animate-pulse" />
            <span className="text-slate-700 dark:text-slate-250">{user?.dsaStreak || 0} Day Streak</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20 text-xs font-bold text-emerald-600 dark:text-emerald-450">
            <Code className="w-4.5 h-4.5" />
            <span>{progressList.length} Solved</span>
          </div>
        </div>
      </div>

      {/* Filter Options */}
      <div className="flex flex-wrap gap-2">
        {['All', 'Easy', 'Medium', 'Hard'].map((diff) => (
          <button
            key={diff}
            onClick={() => setFilterDifficulty(diff)}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-wider uppercase transition-all ${
              filterDifficulty === diff
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10'
            }`}
          >
            {diff} Problems
          </button>
        ))}
      </div>

      {/* Topics Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-7 h-7 text-primary animate-spin" />
        </div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {Object.keys(problemsBank).map((topic) => {
            const allProblems = problemsBank[topic];
            const filteredProblems =
              filterDifficulty === 'All'
                ? allProblems
                : allProblems.filter((p) => p.difficulty === filterDifficulty);

            if (filteredProblems.length === 0) return null;

            const completionRate = getCompletionPercentage(topic);

            return (
              <motion.div 
                key={topic} 
                variants={itemVariants}
                className="glass-card p-6 bg-white dark:bg-card-dark border-slate-200/50 dark:border-white/5 rounded-2xl flex flex-col justify-between shadow-sm relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-500/5 to-transparent blur-2xl pointer-events-none"></div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-2.5 border-slate-100 dark:border-white/5">
                    <h3 className="font-bold text-xs text-slate-800 dark:text-slate-205">{topic}</h3>
                    <span className="text-[10px] font-extrabold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                      {completionRate}%
                    </span>
                  </div>

                  {/* Problems list */}
                  <div className="flex flex-col gap-2">
                    {filteredProblems.map((prob) => {
                      const completed = isCompleted(topic, prob.name);
                      const key = `${topic}-${prob.name}`;
                      const isToggling = toggling === key;

                      return (
                        <div
                          key={prob.id}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/50 dark:bg-bg-dark/40 border border-slate-100 dark:border-white/5 hover:border-indigo-500/10 transition-colors"
                        >
                          <button
                            onClick={() =>
                              handleToggle(topic, prob.name, prob.difficulty, completed)
                            }
                            disabled={toggling !== null}
                            className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300"
                          >
                            {isToggling ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                            ) : completed ? (
                              <CheckSquare className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                            ) : (
                              <Square className="w-4 h-4 text-slate-300 dark:text-slate-700 flex-shrink-0" />
                            )}
                            <span className="text-[11px] font-medium text-left line-clamp-1">{prob.name}</span>
                          </button>

                          <span
                            className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded ${getDiffColor(
                              prob.difficulty
                            )}`}
                          >
                            {prob.difficulty}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-4">
                  <div className="w-full bg-slate-150 dark:bg-bg-dark/50 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${completionRate}%` }}
                    ></div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
};

export default DsaPractice;
