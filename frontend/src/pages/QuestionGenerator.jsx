import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { Video, Sparkles, CheckSquare, Loader2, ArrowRight } from 'lucide-react';

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
        
        // Pass session details to the mock interview page via state
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
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">AI Interview Generator</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-light mt-1">
          Configure your mock room details. Our AI will curate industry-aligned conceptual, coding, and behavioral prompts.
        </p>
      </div>

      <div className="glass-panel border p-8 rounded-3xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-indigo-500/10 blur-3xl"></div>

        <form onSubmit={handleGenerate} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Job Role select */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase">Target Job Role</label>
              <select
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-dark-800 bg-white dark:bg-dark-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 text-sm"
              >
                {roles.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            {/* Experience level select */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase">Experience Level</label>
              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-dark-800 bg-white dark:bg-dark-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 text-sm"
              >
                {experienceLevels.map((exp) => (
                  <option key={exp} value={exp}>
                    {exp}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tech Stack string */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase">Technology Stack / Core Skills</label>
            <input
              type="text"
              placeholder="e.g. React, Node.js, Express, MongoDB, Redux"
              value={techStack}
              onChange={(e) => setTechStack(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-dark-800 bg-white dark:bg-dark-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 text-sm"
            />
            <p className="text-[10px] text-slate-400 font-light">
              Separate with commas to ensure OpenAI focuses on these specific topics.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Difficulty select */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase">Room Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-dark-800 bg-white dark:bg-dark-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 text-sm"
              >
                {difficulties.map((diff) => (
                  <option key={diff} value={diff}>
                    {diff}
                  </option>
                ))}
              </select>
            </div>

            {/* Questions count select */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase">Number of Questions</label>
              <select
                value={numQuestions}
                onChange={(e) => setNumQuestions(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-dark-800 bg-white dark:bg-dark-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 text-sm"
              >
                {[3, 5, 7, 10].map((n) => (
                  <option key={n} value={n}>
                    {n} Questions
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Guidelines info */}
          <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 text-xs text-indigo-700 dark:text-indigo-400 space-y-2">
            <h4 className="font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Mock Room Rules:
            </h4>
            <ul className="list-disc pl-4 space-y-1 font-light">
              <li>You can record answers using speech-to-text voice controls.</li>
              <li>Toggle your web camera at any time for live feedback visual overlays.</li>
              <li>Do not leave or refresh the tab once the timer starts to maintain session integrity.</li>
              <li>A full AI performance report will be generated and emailed upon submission.</li>
            </ul>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-indigo-650/25 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Customizing Interview Room...
              </>
            ) : (
              <>
                Generate Mock Interview <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default QuestionGenerator;
