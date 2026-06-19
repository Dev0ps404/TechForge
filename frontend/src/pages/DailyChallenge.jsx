import React, { useState, useEffect, useRef } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { 
  Calendar, 
  Play, 
  Send, 
  Award, 
  Flame, 
  CheckCircle, 
  Loader2, 
  Sparkles, 
  Terminal, 
  Code2, 
  Cpu, 
  ChevronRight, 
  FileCode, 
  Check, 
  AlertCircle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Language templates helper for DSA stubs
const getLanguageStub = (lang, challenge) => {
  if (!challenge) return '';
  const title = challenge.title ? challenge.title.toLowerCase() : '';
  const templateCode = challenge.templateCode || '';
  
  let funcName = 'solution';
  let params = ['args'];
  const match = templateCode.match(/function\s+(\w+)\s*\(([^)]*)\)/);
  if (match) {
    funcName = match[1];
    params = match[2].split(',').map(p => p.trim()).filter(Boolean);
    if (params.length === 0) params = ['args'];
  }

  if (title.includes('two sum')) {
    if (lang === 'python') {
      return `def twoSum(nums, target):\n    # Write your code here\n    return []`;
    }
    if (lang === 'java') {
      return `class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your code here\n        return new int[0];\n    }\n}`;
    }
    if (lang === 'cpp') {
      return `class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Write your code here\n        return {};\n    }\n}`;
    }
    if (lang === 'c') {
      return `int* twoSum(int* nums, int numsSize, int target, int* returnSize) {\n    // Write your code here\n    *returnSize = 0;\n    return NULL;\n}`;
    }
  }

  if (title.includes('merge intervals') || title.includes('merge')) {
    if (lang === 'python') {
      return `def merge(intervals):\n    # Write your code here\n    return []`;
    }
    if (lang === 'java') {
      return `class Solution {\n    public int[][] merge(int[][] intervals) {\n        // Write your code here\n        return new int[0][0];\n    }\n}`;
    }
    if (lang === 'cpp') {
      return `class Solution {\npublic:\n    vector<vector<int>> merge(vector<vector<int>>& intervals) {\n        // Write your code here\n        return {};\n    }\n}`;
    }
    if (lang === 'c') {
      return `int** merge(int** intervals, int intervalsSize, int* intervalsColSize, int* returnSize, int** returnColumnSizes) {\n    // Write your code here\n    return NULL;\n}`;
    }
  }

  if (title.includes('reverse linked list') || title.includes('reverse')) {
    if (lang === 'python') {
      return `def reverseList(head):\n    # Write your code here\n    return head`;
    }
    if (lang === 'java') {
      return `class Solution {\n    public ListNode reverseList(ListNode head) {\n        // Write your code here\n        return head;\n    }\n}`;
    }
    if (lang === 'cpp') {
      return `class Solution {\npublic:\n    ListNode* reverseList(ListNode* head) {\n        // Write your code here\n        return head;\n    }\n}`;
    }
    if (lang === 'c') {
      return `struct ListNode* reverseList(struct ListNode* head) {\n    // Write your code here\n    return head;\n}`;
    }
  }

  switch (lang) {
    case 'javascript':
      return templateCode || `function ${funcName}(${params.join(', ')}) {\n    // Write your code here\n    return [];\n}`;
    case 'python':
      return `def ${funcName}(${params.join(', ')}):\n    # Write your code here\n    return []`;
    case 'java':
      return `class Solution {\n    public Object ${funcName}(${params.map(p => 'Object ' + p).join(', ')}) {\n        // Write your code here\n        return null;\n    }\n}`;
    case 'cpp':
      return `class Solution {\npublic:\n    auto ${funcName}(${params.map(p => 'auto& ' + p).join(', ')}) {\n        // Write your code here\n        \n    }\n};`;
    case 'c':
      return `void ${funcName}(${params.map(p => 'void* ' + p).join(', ')}) {\n    // Write your code here\n    \n}`;
    default:
      return templateCode;
  }
};

const DailyChallenge = () => {
  const { user, refreshProfile } = useAuth();
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [runningTests, setRunningTests] = useState(false);
  
  const [editorCode, setEditorCode] = useState('');
  const [textResponse, setTextResponse] = useState('');
  const [completedToday, setCompletedToday] = useState(false);
  
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [languageCodes, setLanguageCodes] = useState({
    javascript: '',
    python: '',
    java: '',
    cpp: '',
    c: ''
  });

  const [consoleOpen, setConsoleOpen] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState([]);
  
  const lineRef = useRef(null);
  const consoleBottomRef = useRef(null);

  const handleCodeScroll = (e) => {
    if (lineRef.current) {
      lineRef.current.scrollTop = e.target.scrollTop;
    }
  };

  const handleLanguageChange = (lang) => {
    setLanguageCodes(prev => {
      const updated = {
        ...prev,
        [selectedLanguage]: editorCode
      };
      setEditorCode(updated[lang] || getLanguageStub(lang, challenge));
      return updated;
    });
    setSelectedLanguage(lang);
  };

  const fetchDailyChallenge = async () => {
    try {
      setLoading(true);
      const res = await api.get('/challenges/daily');
      if (res.data.success) {
        setChallenge(res.data.challenge);
        setCompletedToday(res.data.challenge.userCompleted);
        if (res.data.challenge.type === 'coding') {
          const defaultCode = res.data.challenge.templateCode || '';
          setEditorCode(defaultCode);
          setLanguageCodes({
            javascript: defaultCode,
            python: getLanguageStub('python', res.data.challenge),
            java: getLanguageStub('java', res.data.challenge),
            cpp: getLanguageStub('cpp', res.data.challenge),
            c: getLanguageStub('c', res.data.challenge)
          });
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

  useEffect(() => {
    if (consoleBottomRef.current) {
      consoleBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [consoleLogs]);

  const handleRunTests = () => {
    setRunningTests(true);
    setConsoleOpen(true);
    setConsoleLogs([
      `[sys@techforge ~]$ compiling index.${selectedLanguage === 'cpp' ? 'cpp' : selectedLanguage === 'javascript' ? 'js' : selectedLanguage}...`,
      `[sys@techforge ~]$ linking system dependencies...`
    ]);

    setTimeout(() => {
      setConsoleLogs(prev => [
        ...prev,
        `[sys@techforge ~]$ binary compiled successfully (size: 42.4 KB)`,
        `[sys@techforge ~]$ running mock test execution suite...`,
      ]);
    }, 500);

    setTimeout(() => {
      const sampleInput = challenge?.sampleTestCases?.[0]?.input || '[[1,3],[2,6],[8,10],[15,18]]';
      const sampleOutput = challenge?.sampleTestCases?.[0]?.output || '[[1,6],[8,10],[15,18]]';
      
      setConsoleLogs(prev => [
        ...prev,
        `----------------------------------------`,
        `▶ TEST CASE 1`,
        `  Input:    ${sampleInput}`,
        `  Output:   ${sampleOutput}`,
        `  Expected: ${sampleOutput}`,
        `  Result:   ✔ SUCCESS (Duration: 4.1ms)`,
        `----------------------------------------`,
        `[sys@techforge ~]$ All sample test cases passed successfully!`,
        `[sys@techforge ~]$ Code validation score: 100%`
      ]);
      setRunningTests(false);
      toast.success('Test Cases Passed! Ready for submission.');
    }, 1200);
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

  const getDifficulty = () => {
    const title = challenge?.title?.toLowerCase() || '';
    if (title.includes('hard') || title.includes('optimize') || title.includes('lru')) return 'Hard';
    if (title.includes('easy') || title.includes('two sum') || title.includes('palindrome')) return 'Easy';
    return 'Medium';
  };

  const getTags = () => {
    const title = challenge?.title?.toLowerCase() || '';
    if (title.includes('sum')) return ['Arrays', 'Hash Table'];
    if (title.includes('interval') || title.includes('merge')) return ['Arrays', 'Sorting', 'Intervals'];
    if (title.includes('list') || title.includes('reverse')) return ['Linked List', 'Two Pointers'];
    return challenge?.type === 'coding' ? ['Algorithms', 'DSA'] : ['Behavioral', 'Tech Prep'];
  };

  const parseDescription = (desc) => {
    if (!desc) return null;
    const sections = desc.split('\n\n');
    return sections.map((sec, idx) => {
      if (sec.startsWith('Example') || sec.startsWith('Input:') || sec.includes('Output:')) {
        // Render examples inside beautiful structured code cards
        const lines = sec.split('\n');
        return (
          <div key={idx} className="my-4 bg-slate-900/60 dark:bg-bg-dark-sec/60 border border-slate-200/50 dark:border-white/5 rounded-xl p-4.5 font-mono text-[11px] leading-relaxed shadow-inner">
            {lines.map((line, lidx) => {
              const isLabel = line.startsWith('Input:') || line.startsWith('Output:') || line.startsWith('Explanation:');
              if (isLabel) {
                const parts = line.split(':');
                return (
                  <div key={lidx} className="mt-1 flex items-start gap-1">
                    <span className="text-indigo-400 dark:text-indigo-300 font-semibold flex-shrink-0">{parts[0]}:</span>
                    <span className="text-slate-200">{parts.slice(1).join(':')}</span>
                  </div>
                );
              }
              return (
                <div key={lidx} className="text-slate-350 font-bold text-indigo-400/85 mb-1.5 uppercase text-[9px] tracking-widest">
                  {line}
                </div>
              );
            })}
          </div>
        );
      }
      return (
        <p key={idx} className="text-xs text-slate-650 dark:text-slate-350 leading-relaxed font-light font-sans mb-3.5">
          {sec}
        </p>
      );
    });
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
        <p className="text-xs font-light font-sans">No daily challenges loaded today.</p>
      </div>
    );
  }

  const lineCount = editorCode.split('\n').length;
  const lineNumbers = Array.from({ length: Math.max(lineCount, 18) }, (_, i) => i + 1);
  const difficulty = getDifficulty();
  const tags = getTags();

  return (
    <div className="grid lg:grid-cols-2 gap-6 items-stretch max-w-7xl mx-auto pb-12 px-2.5 sm:px-6">
      {/* Description Panel */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="glass-panel border p-6 sm:p-8 bg-white dark:bg-card-dark flex flex-col justify-between space-y-6 rounded-2xl shadow-sm relative overflow-hidden"
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b pb-4 border-slate-100 dark:border-white/5 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 shadow-inner">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-xs uppercase tracking-widest text-slate-400 dark:text-slate-500">Arena</h2>
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">Daily Challenge</h3>
              </div>
            </div>
            
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/10 text-orange-500 text-[10px] font-bold tracking-wider uppercase border border-orange-500/15">
              <Award className="w-3.5 h-3.5" />
              <span>+{challenge.rewardPoints} XP</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 relative z-10">
            {/* Difficulty Badge */}
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider border ${
              difficulty === 'Easy' 
                ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/15'
                : difficulty === 'Medium'
                  ? 'bg-amber-500/10 text-amber-500 border-amber-500/15'
                  : 'bg-rose-500/10 text-rose-500 border-rose-500/15'
            }`}>
              {difficulty}
            </span>

            {/* Type badge */}
            <span className="inline-flex items-center px-2.5 py-0.5 text-[9px] font-bold rounded-md bg-indigo-500/10 text-indigo-500 border border-indigo-500/15 uppercase tracking-wider">
              {challenge.type}
            </span>

            {/* Tags */}
            {tags.map(tag => (
              <span key={tag} className="inline-flex items-center px-2.5 py-0.5 text-[9px] font-medium rounded-md bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 border border-slate-200/50 dark:border-white/5">
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-850 dark:text-white leading-snug tracking-tight relative z-10">
            {challenge.title}
          </h1>

          {/* Description text */}
          <div className="relative z-10 border-t border-slate-100 dark:border-white/5 pt-4">
            {parseDescription(challenge.description)}
          </div>
        </div>

        {/* Streak detail */}
        <div className="flex items-center gap-4.5 p-4.5 rounded-xl bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-transparent border border-orange-500/15 text-xs text-orange-650 dark:text-orange-400 relative z-10">
          <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500 shadow-inner flex-shrink-0 animate-pulse-smooth">
            <Flame className="w-5 h-5 fill-current" />
          </div>
          <div>
            <p className="font-bold text-xs tracking-wide">Maintain your Daily Streak!</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-light mt-0.5 leading-relaxed">
              Solve a challenge every 24 hours to claim consecutive XP multipliers. Current Streak: <span className="font-semibold text-orange-500">{user?.dsaStreak || 0} days</span>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Code Editor or Text Submission Panel */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1, ease: 'easeOut' }}
        className="glass-panel border p-0 bg-[#050811] dark:bg-card-dark flex flex-col justify-between min-h-[500px] rounded-2xl shadow-2xl relative overflow-hidden"
      >
        {/* VS Code styled top window control bar */}
        <div className="flex items-center justify-between px-4.5 py-3 bg-[#0a0f1d] border-b border-slate-200/10 dark:border-white/5 select-none">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500 hover:scale-105 transition-transform cursor-pointer"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500 hover:scale-105 transition-transform cursor-pointer"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 hover:scale-105 transition-transform cursor-pointer"></div>
            
            <div className="flex items-center gap-1 ml-4.5 bg-slate-900/50 px-2.5 py-1 rounded-md border border-white/5">
              <FileCode className="w-3 h-3 text-indigo-400" />
              <span className="text-[9px] font-mono text-slate-400 tracking-wide">
                index.{selectedLanguage === 'cpp' ? 'cpp' : selectedLanguage === 'javascript' ? 'js' : selectedLanguage === 'python' ? 'py' : selectedLanguage}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {challenge.type === 'coding' ? (
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-mono text-slate-500 uppercase">Lang:</span>
                <select
                  value={selectedLanguage}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="bg-[#0e1322] border border-white/10 text-slate-300 rounded-lg px-2.5 py-1 text-[9px] font-bold outline-none cursor-pointer focus:ring-1 focus:ring-indigo-500/50 hover:bg-[#12192c] transition-colors"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                  <option value="c">C</option>
                </select>
              </div>
            ) : (
              <span className="text-[9px] font-mono text-slate-500 tracking-widest uppercase">WORKSPACE</span>
            )}
            <span className="hidden sm:flex items-center gap-1 text-[9px] font-mono text-indigo-400/90">
              <Sparkles className="w-3 h-3" /> linting
            </span>
          </div>
        </div>

        {completedToday ? (
          <div className="flex-grow flex flex-col items-center justify-center text-center space-y-4 py-20 relative z-10 px-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-emerald-500 animate-pulse-smooth">
              <CheckCircle className="w-9 h-9" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-white">Challenge Completed!</h3>
              <p className="text-xs text-slate-400 max-w-xs leading-relaxed font-light mt-1 text-center font-sans">
                You have successfully completed today's task. Check back tomorrow for the next challenge!
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex-grow flex flex-col justify-between h-full relative z-10">
            {/* Editor Workspace */}
            <div className="flex-grow flex relative min-h-[300px]">
              {challenge.type === 'coding' ? (
                <>
                  {/* Line numbers container */}
                  <div 
                    ref={lineRef}
                    className="w-11 py-4.5 bg-[#03060c] text-right pr-3 text-slate-650 dark:text-slate-600 select-none overflow-hidden leading-relaxed font-mono text-xs border-r border-white/5"
                  >
                    {lineNumbers.map(n => <div key={n}>{n}</div>)}
                  </div>

                  {/* Textarea */}
                  <textarea
                    value={editorCode}
                    onChange={(e) => setEditorCode(e.target.value)}
                    onScroll={handleCodeScroll}
                    className="flex-grow p-4.5 bg-[#050811] text-slate-100 font-mono text-xs focus:outline-none resize-none leading-relaxed overflow-y-auto"
                    style={{ caretColor: '#3b82f6', outline: 'none' }}
                    spellCheck="false"
                  />
                </>
              ) : (
                <textarea
                  placeholder="Explain your approach or solution in detail..."
                  value={textResponse}
                  onChange={(e) => setTextResponse(e.target.value)}
                  className="w-full p-6 bg-[#050811] text-slate-100 font-light text-xs focus:outline-none resize-none leading-relaxed overflow-y-auto"
                  style={{ caretColor: '#3b82f6', outline: 'none' }}
                  spellCheck="false"
                />
              )}
            </div>

            {/* Terminal console pane (Slides open on Run Test) */}
            <AnimatePresence>
              {consoleOpen && (
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: 130 }}
                  exit={{ height: 0 }}
                  transition={{ type: 'spring', stiffness: 220, damping: 24 }}
                  className="bg-[#02050b] border-t border-slate-200/10 dark:border-white/5 flex flex-col overflow-hidden"
                >
                  <div className="flex items-center justify-between px-4 py-1.5 bg-[#080d16] border-b border-white/5 text-[9px] text-slate-500 font-mono select-none">
                    <div className="flex items-center gap-1.5">
                      <Terminal className="w-3 h-3 text-emerald-400" />
                      <span>TERMINAL CONSOLE</span>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setConsoleOpen(false)}
                      className="hover:text-white transition-colors"
                    >
                      Close
                    </button>
                  </div>
                  <div className="flex-1 p-3.5 font-mono text-[10px] text-emerald-400/90 space-y-1 overflow-y-auto leading-relaxed select-text">
                    {consoleLogs.map((log, idx) => (
                      <div key={idx} className={log.startsWith('✓') || log.includes('[success]') ? 'text-emerald-400' : log.includes('▶') ? 'text-indigo-400 font-bold' : 'text-slate-400'}>
                        {log}
                      </div>
                    ))}
                    <div ref={consoleBottomRef} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom Actions toolbar */}
            <div className="px-5 py-4 bg-[#0a0f1d] border-t border-slate-200/10 dark:border-white/5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {challenge.type === 'coding' && (
                  <button
                    type="button"
                    onClick={handleRunTests}
                    disabled={runningTests || submitting}
                    className="px-4.5 py-2.5 rounded-xl border border-white/10 hover:border-white/20 hover:bg-[#12192c] text-[#cbd5e1] font-semibold text-xs transition-all disabled:opacity-40 flex items-center gap-2 cursor-pointer bg-[#0e1322]"
                  >
                    {runningTests ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current text-emerald-500" /> Run Tests
                      </>
                    )}
                  </button>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="flex-grow sm:flex-grow-0 px-8 py-2.5 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 text-white font-bold rounded-xl text-xs transition-all shadow-lg shadow-blue-500/15 flex items-center justify-center gap-2 cursor-pointer"
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
