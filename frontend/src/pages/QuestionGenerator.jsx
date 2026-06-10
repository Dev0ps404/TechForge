import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { Video, Sparkles, Loader2, ArrowRight, BookOpen, Clock, Settings, UserCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const QuestionGenerator = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [jobRole, setJobRole] = useState('Frontend Developer');
  const [techStack, setTechStack] = useState('React, Tailwind CSS, JavaScript');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [experience, setExperience] = useState('Mid-Level (2-5 years)');
  const [numQuestions, setNumQuestions] = useState(5);

  const roles = [
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'React Developer',
    'Node.js Developer',
    'Java Developer',
    'Python Developer',
    'MERN Developer',
    'DevOps Engineer',
    'Data Analyst',
    'Data Scientist',
  ];

  const difficulties = ['Beginner', 'Intermediate', 'Advanced'];
  const experienceLevels = [
    'Junior (0-2 years)',
    'Mid-Level (2-5 years)',
    'Senior (5-8 years)',
    'Lead (8+ years)',
  ];

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!techStack.trim()) {
      toast.error('Please specify your technology stack');
      return;
    }

    try {
      setLoading(true);
      toast.loading('Generating customized mock interview questions using OpenAI...');

      const res = await api.post('/interviews/generate', {
        jobRole,
        techStack,
        difficulty,
        experience,
        numQuestions: parseInt(numQuestions),
      });

      toast.dismiss();
      if (res.data.success) {
        toast.success('Questions generated successfully! Launching interview room.');
        
        navigate('/mock-interview-room', {
          state: {
            session: res.data.session,
            questions: res.data.questions,
          },
        });
      }
    } catch (err) {
      toast.dismiss();
      const errMsg = err.response?.data?.message || 'Failed to generate questions. Please try again.';
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-3xl mx-auto space-y-8 pb-12"
    >
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">AI Interview Room Setup</h1>
        <p className="text-slate-400 text-xs font-light">
          Configure your mock room details. Our AI will curate industry-aligned conceptual, coding, and behavioral prompts.
        </p>
      </div>

      <div className="glass-panel border p-6 sm:p-8 relative overflow-hidden bg-white dark:bg-card-dark">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none"></div>

        <form onSubmit={handleGenerate} className="space-y-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Job Role select */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-indigo-550" /> Target Job Role
              </label>
              <select
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-bg-dark/40 text-xs focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all font-medium"
              >
                {roles.map((r) => (
                  <option key={r} value={r} className="dark:bg-card-dark">
                    {r}
                  </option>
                ))}
              </select>
            </div>

            {/* Experience level select */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-indigo-550" /> Experience Level
              </label>
              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-bg-dark/40 text-xs focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all font-medium"
              >
                {experienceLevels.map((exp) => (
                  <option key={exp} value={exp} className="dark:bg-card-dark">
                    {exp}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tech Stack string */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Settings className="w-3.5 h-3.5 text-indigo-550" /> Tech Stack & Skills
            </label>
            <input
              type="text"
              placeholder="e.g. React, Node.js, Express, MongoDB, Redux"
              value={techStack}
              onChange={(e) => setTechStack(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-bg-dark/40 text-xs focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all font-medium"
            />
            <p className="text-[10px] text-slate-400 font-light">
              Separate with commas to ensure OpenAI focuses on these specific topics.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Difficulty select */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-550" /> Room Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-bg-dark/40 text-xs focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all font-medium"
              >
                {difficulties.map((diff) => (
                  <option key={diff} value={diff} className="dark:bg-card-dark">
                    {diff}
                  </option>
                ))}
              </select>
            </div>

            {/* Questions count select */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-550" /> Number of Questions
              </label>
              <select
                value={numQuestions}
                onChange={(e) => setNumQuestions(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-bg-dark/40 text-xs focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all font-medium"
              >
                {[3, 5, 7, 10].map((n) => (
                  <option key={n} value={n} className="dark:bg-card-dark">
                    {n} Questions
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Guidelines info */}
          <div className="p-4 rounded-xl bg-indigo-500/5 dark:bg-indigo-500/10 border border-indigo-500/10 text-xs text-indigo-655 dark:text-indigo-400 space-y-2">
            <h4 className="font-bold flex items-center gap-1 text-xs">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-pulse" /> Mock Room Guidelines:
            </h4>
            <ul className="list-disc pl-4 space-y-1 font-light text-[11px] leading-relaxed">
              <li>Record spoken answers directly via Speech-to-Text triggers in browser.</li>
              <li>Optional visual camera overlay is supported for eye-tracking simulation.</li>
              <li>Avoid reloading or exiting the interview room during live intervals.</li>
              <li>A full scorecard report will be automatically calculated and emailed to your address.</li>
            </ul>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 text-xs"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Curating Questions with GPT...
              </>
            ) : (
              <>
                Generate Mock Interview <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default QuestionGenerator;
