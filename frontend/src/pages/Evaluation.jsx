import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import {
  Award,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Printer,
  ChevronDown,
  ChevronUp,
  Loader2,
  ListCollapse,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';

const Evaluation = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/interviews/sessions/${id}`);
        if (res.data.success) {
          setSession(res.data.session);
          setAnswers(res.data.answers);
          if (res.data.answers.length > 0) {
            setExpandedQuestion(res.data.answers[0]._id);
          }
        }
      } catch (err) {
        console.error('Failed to retrieve mock evaluations:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="text-center py-16 text-slate-400 space-y-4 max-w-md mx-auto">
        <AlertCircle className="w-12 h-12 text-slate-350 mx-auto" />
        <h3 className="font-bold text-lg text-slate-800 dark:text-white">Report not found</h3>
        <p className="text-xs text-slate-400 font-light">The specified interview session does not contain an evaluation record.</p>
        <Link to="/dashboard" className="inline-block mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-550 text-white font-bold rounded-xl text-xs">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const radarData = [
    { subject: 'Technical Accuracy', A: session.overallScore.technical, fullMark: 100 },
    { subject: 'Communication', A: session.overallScore.communication, fullMark: 100 },
    { subject: 'Confidence', A: session.overallScore.confidence, fullMark: 100 },
    { subject: 'Grammar Accuracy', A: session.overallScore.grammar, fullMark: 100 },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 max-w-5xl mx-auto pb-12 print:p-0"
    >
      {/* Header actions */}
      <div className="flex items-center justify-between border-b pb-4 border-slate-200/50 dark:border-white/5 print:hidden">
        <Link
          to="/dashboard"
          className="flex items-center gap-1.5 text-xs font-bold text-slate-550 hover:text-slate-800 dark:text-slate-450 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
        </Link>

        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 rounded-xl text-xs font-bold transition-all border border-transparent dark:border-white/5 flex items-center gap-1.5"
        >
          <Printer className="w-3.5 h-3.5" /> Print Report
        </button>
      </div>

      {/* Main Score Report Card */}
      <div className="grid md:grid-cols-3 gap-6 items-stretch">
        {/* Total Score box */}
        <div className="glass-panel border p-8 rounded-2xl text-center flex flex-col justify-center items-center h-full bg-gradient-to-br from-indigo-500/5 via-transparent to-pink-500/5">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-550 mb-5">
            <Award className="w-7 h-7" />
          </div>
          <span className="text-[10px] font-bold text-slate-450 dark:text-slate-400 uppercase tracking-widest">
            Overall Rating
          </span>
          <h1 className="text-6xl font-black text-indigo-500 mt-2 tracking-tight">
            {session.overallScore.overall}%
          </h1>
          <p className="text-[10px] text-slate-400 mt-3 max-w-[190px] leading-relaxed font-light">
            Calculated across Technical accuracy, Confidence, and Grammar metrics.
          </p>
        </div>

        {/* Radar chart breakdown */}
        <div className="glass-panel border p-6 rounded-2xl md:col-span-2 h-full flex flex-col justify-center">
          <h3 className="font-bold text-xs text-slate-400 uppercase tracking-widest mb-4">
            Performance Breakdown
          </h3>

          <div className="h-60 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.03)" className="stroke-slate-200 dark:stroke-white/5" />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={9} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#94a3b8" fontSize={7} />
                <Radar
                  name="Candidate"
                  dataKey="A"
                  stroke="#6366f1"
                  fill="#6366f1"
                  fillOpacity={0.15}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="glass-panel border p-6 bg-white dark:bg-card-dark rounded-2xl space-y-4 shadow-sm">
          <h3 className="font-bold text-xs text-emerald-500 uppercase tracking-widest border-b pb-2.5 border-slate-100 dark:border-white/5">
            Key Strengths
          </h3>
          <ul className="flex flex-col gap-3">
            {session.feedback.strengths.map((str, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-350 font-light leading-relaxed">
                <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className="glass-panel border p-6 bg-white dark:bg-card-dark rounded-2xl space-y-4 shadow-sm">
          <h3 className="font-bold text-xs text-rose-500 uppercase tracking-widest border-b pb-2.5 border-slate-100 dark:border-white/5">
            Weaknesses & Suggestions
          </h3>
          <ul className="flex flex-col gap-3">
            {session.feedback.weaknesses.map((weak, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-350 font-light leading-relaxed">
                <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                <span>{weak}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Question breakdown list */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center gap-2">
          <ListCollapse className="w-4.5 h-4.5 text-indigo-500" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Detailed Evaluations</h2>
        </div>

        <div className="flex flex-col gap-4">
          {answers.map((ans, index) => {
            const isExpanded = expandedQuestion === ans._id;
            return (
              <div
                key={ans._id}
                className="glass-panel border rounded-2xl bg-white dark:bg-card-dark overflow-hidden transition-all duration-300"
              >
                {/* Accordion header */}
                <button
                  onClick={() => setExpandedQuestion(isExpanded ? null : ans._id)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-bg-dark/40 transition-colors"
                >
                  <div className="flex items-center gap-3.5 pr-4 overflow-hidden">
                    <span className="w-6.5 h-6.5 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold text-xs flex-shrink-0">
                      {index + 1}
                    </span>
                    <div className="overflow-hidden">
                      <p className="font-bold text-xs md:text-sm text-slate-800 dark:text-white truncate">
                        {ans.question.text}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1 font-light">
                        {ans.question.category} • Score Achieved: <span className="font-semibold text-indigo-500">{ans.evaluation.score}%</span>
                      </p>
                    </div>
                  </div>

                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  )}
                </button>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="px-6 pb-6 pt-1 border-t border-slate-100 dark:border-white/5 space-y-4 text-xs font-light">
                    {/* User answer */}
                    <div className="space-y-1.5 bg-slate-50/50 dark:bg-bg-dark/40 p-4 rounded-xl border border-slate-200/50 dark:border-white/5">
                      <p className="font-bold text-slate-400 uppercase text-[9px] tracking-wider">YOUR TRANSCRIBED ANSWER</p>
                      <p className="text-slate-800 dark:text-slate-250 mt-1.5 leading-relaxed italic font-medium">
                        "{ans.answerText}"
                      </p>
                    </div>

                    {/* AI Scoring breakdown */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-indigo-500/5 p-4 rounded-xl border border-indigo-550/10">
                      <div>
                        <p className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">TECHNICAL SCORE</p>
                        <p className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">
                          {ans.evaluation.technicalScore}/100
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">COMMUNICATION</p>
                        <p className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">
                          {ans.evaluation.communicationScore}/100
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">CONFIDENCE</p>
                        <p className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">
                          {ans.evaluation.confidenceScore}/100
                        </p>
                      </div>
                    </div>

                    {/* AI Specific Feedback */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <p className="font-bold text-indigo-605 dark:text-indigo-400 uppercase text-[9px] tracking-wider">TECHNICAL CRITIQUE</p>
                        <p className="text-slate-705 dark:text-slate-350 leading-relaxed bg-slate-50/50 dark:bg-bg-dark/20 p-4 rounded-xl border border-slate-200/50 dark:border-white/5">
                          {ans.evaluation.technicalFeedback}
                        </p>
                      </div>
                      <div className="space-y-1.5">
                        <p className="font-bold text-indigo-605 dark:text-indigo-400 uppercase text-[9px] tracking-wider">COMMUNICATION CRITIQUE</p>
                        <p className="text-slate-705 dark:text-slate-350 leading-relaxed bg-slate-50/50 dark:bg-bg-dark/20 p-4 rounded-xl border border-slate-200/50 dark:border-white/5">
                          {ans.evaluation.communicationFeedback}
                        </p>
                      </div>
                    </div>

                    {/* Grammar analysis */}
                    {ans.evaluation.grammarErrors && ans.evaluation.grammarErrors.length > 0 && (
                      <div className="space-y-1.5">
                        <p className="font-bold text-rose-500 uppercase text-[9px] tracking-wider">GRAMMAR OR ENUNCIATION ADJUSTMENTS</p>
                        <div className="flex flex-wrap gap-2">
                          {ans.evaluation.grammarErrors.map((err, eIdx) => (
                            <span
                              key={eIdx}
                              className="px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/10 text-rose-500 leading-none text-[10px] font-medium"
                            >
                              {err}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default Evaluation;
