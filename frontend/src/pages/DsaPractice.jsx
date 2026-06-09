import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Code, CheckSquare, Square, Flame, Award, Loader2, Sparkles } from 'lucide-react';

const DsaPractice = () => {
  const { user, refreshProfile } = useAuth();
  const [progressList, setProgressList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(null);
  const [filterDifficulty, setFilterDifficulty] = useState('All');

  // Hardcoded problems bank categorized by topic
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
        fetchDsaProgress(); // reload progress list
        refreshProfile(); // sync updated points and streaks
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

  // Helper to color difficulty text
  const getDiffColor = (diff) => {
    if (diff === 'Easy') return 'text-emerald-500 bg-emerald-500/10';
    if (diff === 'Medium') return 'text-amber-500 bg-amber-500/10';
    return 'text-pink-500 bg-pink-500/10';
  };

  // Calculates completion rates per category
  const getCompletionPercentage = (topic) => {
    const categoryProblems = problemsBank[topic] || [];
    if (categoryProblems.length === 0) return 0;
    
    const completedCount = categoryProblems.filter((p) =>
      isCompleted(topic, p.name)
    ).length;

    return Math.round((completedCount / categoryProblems.length) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Header and Streaks */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Data Structures & Algorithms</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-light mt-1">
            Maintain consistency. Practice essential conceptual coding templates across 13 core categories.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-4 py-2 rounded-2xl glass-panel border">
            <Flame className="w-5 h-5 text-orange-500" />
            <span className="font-bold text-sm">{user?.dsaStreak || 0} Streak</span>
          </div>
          <div className="flex items-center gap-1.5 px-4 py-2 rounded-2xl glass-panel border bg-emerald-500/5 border-emerald-500/20">
            <Code className="w-5 h-5 text-emerald-500" />
            <span className="font-bold text-sm text-emerald-600 dark:text-emerald-400">
              {progressList.length} Solved
            </span>
          </div>
        </div>
      </div>

      {/* Filter Options */}
      <div className="flex gap-2 border-b border-slate-100 dark:border-dark-800 pb-3">
        {['All', 'Easy', 'Medium', 'Hard'].map((diff) => (
          <button
            key={diff}
            onClick={() => setFilterDifficulty(diff)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filterDifficulty === diff
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                : 'bg-slate-100 dark:bg-dark-900 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-dark-800'
            }`}
          >
            {diff} Problems
          </button>
        ))}
      </div>

      {/* Topics grid */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.keys(problemsBank).map((topic) => {
            // Filter category list based on selected difficulty
            const allProblems = problemsBank[topic];
            const filteredProblems =
              filterDifficulty === 'All'
                ? allProblems
                : allProblems.filter((p) => p.difficulty === filterDifficulty);

            if (filteredProblems.length === 0) return null;

            const completionRate = getCompletionPercentage(topic);

            return (
              <div key={topic} className="glass-panel border p-6 rounded-3xl space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-dark-800/60">
                    <h3 className="font-bold text-base">{topic}</h3>
                    <span className="text-xs font-bold text-emerald-500">
                      {completionRate}%
                    </span>
                  </div>

                  {/* Problems list */}
                  <div className="flex flex-col gap-2 mt-3">
                    {filteredProblems.map((prob) => {
                      const completed = isCompleted(topic, prob.name);
                      const key = `${topic}-${prob.name}`;
                      const isToggling = toggling === key;

                      return (
                        <div
                          key={prob.id}
                          className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-dark-900 border border-slate-100 dark:border-dark-850"
                        >
                          <button
                            onClick={() =>
                              handleToggle(topic, prob.name, prob.difficulty, completed)
                            }
                            disabled={toggling !== null}
                            className="flex items-center gap-2 text-slate-700 dark:text-slate-200"
                          >
                            {isToggling ? (
                              <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
                            ) : completed ? (
                              <CheckSquare className="w-4.5 h-4.5 text-indigo-500 flex-shrink-0" />
                            ) : (
                              <Square className="w-4.5 h-4.5 text-slate-300 dark:text-dark-700 flex-shrink-0" />
                            )}
                            <span className="text-xs font-medium text-left line-clamp-1">{prob.name}</span>
                          </button>

                          <span
                            className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${getDiffColor(
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
                <div className="w-full bg-slate-100 dark:bg-dark-800 h-1.5 rounded-full overflow-hidden mt-2">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${completionRate}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DsaPractice;
