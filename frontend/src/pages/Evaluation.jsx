import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import {
  Award,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  User,
  Activity,
  ArrowLeft,
  Printer,
  ChevronDown,
  ChevronUp,
  Loader,
} from 'lucide-react';
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
            setExpandedQuestion(res.data.answers[0]._id); // expand first by default
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
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-dark-950">
        <Loader className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="text-center py-16 text-slate-400 space-y-4">
        <AlertCircle className="w-12 h-12 text-slate-300 mx-auto" />
        <h3 className="font-bold text-lg">Report not found</h3>
        <Link to="/dashboard" className="text-indigo-500 hover:underline">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  // Format Recharts Radar Data
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
    <div className="space-y-6 max-w-5xl mx-auto print:p-0">
      {/* Header actions */}
      <div className="flex items-center justify-between border-b pb-4 border-slate-100 dark:border-dark-800 print:hidden">
        <Link
          to="/dashboard"
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
        </Link>

        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-dark-800 dark:hover:bg-dark-750 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
        >
          <Printer className="w-3.5 h-3.5" /> Print Report
        </button>
      </div>

      {/* Main Score Report Card */}
      <div className="grid md:grid-cols-3 gap-6 items-center">
        {/* Total Score box */}
        <div className="glass-panel border p-8 rounded-3xl text-center flex flex-col justify-center items-center h-full bg-gradient-to-br from-indigo-500/5 via-transparent to-pink-500/5">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 mb-4">
            <Award className="w-8 h-8" />
          </div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Overall Rating
          </span>
          <h1 className="text-6xl font-extrabold text-indigo-500 mt-2">
            {session.overallScore.overall}%
          </h1>
          <p className="text-xs text-slate-400 mt-3 max-w-[180px] leading-relaxed">
            Based on average ratings of technical, communication, and confidence indices.
          </p>
        </div>

        {/* Radar chart breakdown */}
        <div className="glass-panel border p-6 rounded-3xl md:col-span-2 h-full flex flex-col justify-center">
          <h3 className="font-bold text-sm text-slate-400 uppercase tracking-widest mb-2">
            Performance Breakdown
          </h3>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#cbd5e1" className="dark:stroke-dark-800" />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={10} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#94a3b8" fontSize={8} />
                <Radar
                  name="Candidate"
                  dataKey="A"
                  stroke="#6366f1"
                  fill="#6366f1"
                  fillOpacity={0.25}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="glass-panel border p-6 rounded-3xl space-y-4">
          <h3 className="font-bold text-sm text-emerald-500 uppercase tracking-widest border-b pb-2">
            Key Strengths
          </h3>
          <ul className="flex flex-col gap-2.5">
            {session.feedback.strengths.map((str, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300 font-light">
                <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className="glass-panel border p-6 rounded-3xl space-y-4">
          <h3 className="font-bold text-sm text-pink-500 uppercase tracking-widest border-b pb-2">
            Weaknesses & Suggestions
          </h3>
          <ul className="flex flex-col gap-2.5">
            {session.feedback.weaknesses.map((weak, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300 font-light">
                <AlertCircle className="w-4 h-4 text-pink-500 flex-shrink-0 mt-0.5" />
                <span>{weak}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Question breakdown list */}
      <div className="space-y-4 pt-4">
        <h2 className="text-xl font-bold">Question-by-Question Evaluation</h2>

        <div className="flex flex-col gap-4">
          {answers.map((ans, index) => {
            const isExpanded = expandedQuestion === ans._id;
            return (
              <div
                key={ans._id}
                className="glass-panel border rounded-3xl overflow-hidden transition-all duration-300"
              >
                {/* Accordion header */}
                <button
                  onClick={() => setExpandedQuestion(isExpanded ? null : ans._id)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-dark-900/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold text-xs">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-bold text-sm text-slate-800 dark:text-white line-clamp-1">
                        {ans.question.text}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {ans.question.category} • Grade Score: {ans.evaluation.score}%
                      </p>
                    </div>
                  </div>

                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </button>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="px-6 pb-6 pt-1 border-t border-slate-100 dark:border-dark-800/60 space-y-4 text-xs font-light">
                    {/* User answer */}
                    <div className="space-y-1 bg-slate-50 dark:bg-dark-900/40 p-4 rounded-2xl border">
                      <p className="font-bold text-slate-400 uppercase text-[9px]">YOUR TRANSCRIBED ANSWER</p>
                      <p className="text-slate-800 dark:text-slate-200 mt-1 leading-relaxed italic">
                        "{ans.answerText}"
                      </p>
                    </div>

                    {/* AI Scoring breakdown */}
                    <div className="grid grid-cols-3 gap-4 bg-indigo-500/5 p-4 rounded-2xl border border-indigo-500/10">
                      <div>
                        <p className="text-slate-400 font-bold uppercase text-[9px]">TECHNICAL SCORE</p>
                        <p className="text-base font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">
                          {ans.evaluation.technicalScore}/100
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-400 font-bold uppercase text-[9px]">COMMUNICATION</p>
                        <p className="text-base font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">
                          {ans.evaluation.communicationScore}/100
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-400 font-bold uppercase text-[9px]">CONFIDENCE</p>
                        <p className="text-base font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">
                          {ans.evaluation.confidenceScore}/100
                        </p>
                      </div>
                    </div>

                    {/* AI Specific Feedback */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <p className="font-bold text-indigo-600 dark:text-indigo-400 uppercase text-[9px]">TECHNICAL ANALYSIS</p>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed bg-white dark:bg-dark-900 p-3.5 rounded-xl border border-slate-100 dark:border-dark-850">
                          {ans.evaluation.technicalFeedback}
                        </p>
                      </div>
                      <div className="space-y-1.5">
                        <p className="font-bold text-indigo-600 dark:text-indigo-400 uppercase text-[9px]">COMMUNICATION ANALYSIS</p>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed bg-white dark:bg-dark-900 p-3.5 rounded-xl border border-slate-100 dark:border-dark-850">
                          {ans.evaluation.communicationFeedback}
                        </p>
                      </div>
                    </div>

                    {/* Grammar analysis */}
                    {ans.evaluation.grammarErrors && ans.evaluation.grammarErrors.length > 0 && (
                      <div className="space-y-1.5">
                        <p className="font-bold text-pink-500 uppercase text-[9px]">GRAMMAR AND PRONUNCIATION SLIPS</p>
                        <div className="flex flex-wrap gap-2">
                          {ans.evaluation.grammarErrors.map((err, eIdx) => (
                            <span
                              key={eIdx}
                              className="px-2.5 py-1 rounded-lg bg-pink-500/10 border border-pink-500/20 text-pink-500 leading-none"
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
    </div>
  );
};

export default Evaluation;
