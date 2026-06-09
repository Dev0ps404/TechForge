import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import {
  UploadCloud,
  FileText,
  AlertCircle,
  CheckCircle2,
  ListRestart,
  TrendingUp,
  Download,
  Loader2,
  ListCollapse,
  ChevronRight,
  BookOpen,
  Calendar,
} from 'lucide-react';
import { motion } from 'framer-motion';

const ResumeAnalysis = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const fetchHistory = async () => {
    try {
      setLoadingHistory(true);
      const res = await api.get('/resumes/history');
      if (res.data.success) {
        setHistory(res.data.data);
        if (res.data.data.length > 0 && !selectedAnalysis) {
          setSelectedAnalysis(res.data.data[0]);
        }
      }
    } catch (err) {
      console.error('Failed to retrieve resume logs:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please select a resume file first');
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);

    try {
      setUploading(true);
      toast.loading('Analyzing resume with OpenAI (ATS scanning)...');
      
      const res = await api.post('/resumes/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.dismiss();
      if (res.data.success) {
        toast.success('Resume analysed successfully!');
        setSelectedAnalysis(res.data.data);
        setFile(null);
        fetchHistory();
      }
    } catch (err) {
      toast.dismiss();
      const errMsg = err.response?.data?.message || 'Failed to scan resume.';
      toast.error(errMsg);
    } finally {
      setUploading(false);
    }
  };

  const downloadReport = () => {
    if (!selectedAnalysis) return;
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(selectedAnalysis, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `ats_report_${selectedAnalysis._id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const getScoreColorClass = (score) => {
    if (score >= 80) return 'text-emerald-500 stroke-emerald-500';
    if (score >= 60) return 'text-amber-500 stroke-amber-500';
    return 'text-rose-500 stroke-rose-500';
  };

  return (
    <div className="grid lg:grid-cols-12 gap-6 max-w-7xl mx-auto pb-12">
      {/* Left Column: Upload Zone & History list (4 cols) */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        {/* Upload panel */}
        <div className="glass-panel border p-6 bg-white dark:bg-card-dark rounded-2xl shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">Upload Resume</h3>
          <p className="text-slate-400 text-xs font-light">
            Upload your PDF/Text resume. Our AI parses and compares it against developer profiles.
          </p>

          <form onSubmit={handleUpload} className="space-y-4">
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="border border-dashed border-slate-200 dark:border-white/5 hover:border-indigo-500/50 rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2.5 bg-slate-50/30 dark:bg-bg-dark/20"
              onClick={() => document.getElementById('resume-file-input').click()}
            >
              <input
                id="resume-file-input"
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileChange}
              />
              <UploadCloud className="w-8 h-8 text-slate-400 dark:text-slate-500" />
              <p className="text-xs font-bold text-slate-700 dark:text-slate-250 truncate max-w-full">
                {file ? file.name : 'Select or drop resume'}
              </p>
              <p className="text-[10px] text-slate-400 font-light">
                Supports PDF, DOC, DOCX up to 10MB
              </p>
            </div>

            {file && (
              <button
                type="submit"
                disabled={uploading}
                className="w-full py-2.5 bg-indigo-650 hover:bg-indigo-600 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-indigo-500/15"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Scanning Resume...
                  </>
                ) : (
                  <>Start Resume Scan</>
                )}
              </button>
            )}
          </form>
        </div>

        {/* History panel */}
        <div className="glass-panel border p-6 bg-white dark:bg-card-dark rounded-2xl shadow-sm flex flex-col gap-4 max-h-[350px] lg:max-h-[400px]">
          <h3 className="font-bold text-xs flex items-center gap-2 text-slate-800 dark:text-slate-100 border-b pb-2 border-slate-100 dark:border-white/5">
            <ListRestart className="w-4 h-4 text-indigo-500" /> Previous Audits
          </h3>

          <div className="flex flex-col gap-2 overflow-y-auto no-scrollbar pr-1">
            {loadingHistory ? (
              <p className="text-xs text-slate-450 font-light">Loading history...</p>
            ) : history.length > 0 ? (
              history.map((scan) => (
                <button
                  key={scan._id}
                  onClick={() => setSelectedAnalysis(scan)}
                  className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between ${
                    selectedAnalysis?._id === scan._id
                      ? 'bg-indigo-500/10 border-indigo-550/30 text-indigo-600 dark:text-indigo-400 font-semibold'
                      : 'border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-bg-dark/40 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileText className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <div className="truncate pr-2">
                      <p className="font-bold truncate text-[11px]">{scan.fileName}</p>
                      <p className="text-[9px] text-slate-400 mt-0.5 font-light">
                        {new Date(scan.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <span className="font-extrabold text-[11px] flex-shrink-0">{scan.atsScore}%</span>
                </button>
              ))
            ) : (
              <p className="text-[11px] text-slate-400 text-center py-8 font-light">No resumes audited yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Right Column: Detailed analysis (8 cols) */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        {selectedAnalysis ? (
          <div className="glass-panel border p-6 bg-white dark:bg-card-dark rounded-2xl shadow-sm flex flex-col gap-6 min-h-[500px]">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b pb-4 border-slate-100 dark:border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">{selectedAnalysis.fileName}</h2>
                  <p className="text-[10px] text-slate-400 font-light mt-0.5">
                    Analyzed on {new Date(selectedAnalysis.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <button
                onClick={downloadReport}
                className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-white/5 dark:hover:bg-white/10 text-slate-600 dark:text-slate-350 rounded-lg text-xs font-bold transition-all border border-slate-200/60 dark:border-white/5 flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Download Report
              </button>
            </div>

            {/* Score circle gauge */}
            <div className="flex flex-col sm:flex-row items-center gap-6 p-5 rounded-2xl bg-slate-50/50 dark:bg-bg-dark/30 border border-slate-200/60 dark:border-white/5">
              <div className="relative w-24 h-24 flex items-center justify-center flex-shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    className="stroke-slate-200 dark:stroke-white/5"
                    strokeWidth="6"
                    fill="transparent"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    className={`transition-all duration-1000 ${getScoreColorClass(
                      selectedAnalysis.atsScore
                    )}`}
                    strokeWidth="6"
                    fill="transparent"
                    strokeDasharray={251.2}
                    strokeDashoffset={251.2 - (251.2 * selectedAnalysis.atsScore) / 100}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-xl font-black text-slate-800 dark:text-white leading-none">
                    {selectedAnalysis.atsScore}%
                  </span>
                  <span className="text-[8px] text-slate-450 dark:text-slate-400 font-bold uppercase mt-1">
                    ATS Grade
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 text-center sm:text-left flex-grow">
                <h4 className="font-bold text-xs text-slate-850 dark:text-slate-100 flex items-center justify-center sm:justify-start gap-1">
                  <TrendingUp className="w-4 h-4 text-indigo-500" /> ATS Match Analysis
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-light">
                  {selectedAnalysis.atsScore >= 80
                    ? 'Outstanding! Your resume structure exhibits correct density of standard keywords and project matrices.'
                    : selectedAnalysis.atsScore >= 60
                    ? 'Foundational content looks correct. However, you are missing relevant domain skills and quantified metrics.'
                    : 'The resume structure lacks required industry keywords and action metrics. Review details to expand.'}
                </p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-100 dark:border-white/5">
              {['overview', 'weaknesses', 'keywords', 'suggestions'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 border-b-2 text-xs font-semibold capitalize transition-all duration-200 ${
                    activeTab === tab
                      ? 'border-indigo-500 text-indigo-650 dark:text-indigo-400 font-bold'
                      : 'border-transparent text-slate-450 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                  }`}
                >
                  {tab === 'keywords' ? 'Missing Keywords' : tab}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="flex-grow pt-2">
              {activeTab === 'overview' && (
                <div className="space-y-5">
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-750 dark:text-slate-200">Skills Detected in Document</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedAnalysis.skillsDetected.length > 0 ? (
                        selectedAnalysis.skillsDetected.map((skill) => (
                          <span
                            key={skill}
                            className="text-[10px] px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-semibold"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <p className="text-xs text-slate-450 font-light">No technical skills detected.</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <h4 className="text-xs font-bold text-slate-750 dark:text-slate-200">Parsed Metadata Metrics</h4>
                    <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50/50 dark:bg-bg-dark/30 p-4 rounded-xl border border-slate-200/50 dark:border-white/5">
                      <div className="space-y-1">
                        <p className="text-slate-400 font-bold text-[9px] uppercase tracking-wider flex items-center gap-1">
                          <BookOpen className="w-3 h-3 text-indigo-500" /> Academic Summary
                        </p>
                        <p className="font-semibold text-slate-750 dark:text-slate-350">
                          {selectedAnalysis.parsedData?.education || 'Not detected'}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-slate-400 font-bold text-[9px] uppercase tracking-wider flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-indigo-500" /> Working Experience
                        </p>
                        <p className="font-semibold text-slate-755 dark:text-slate-350">
                          {selectedAnalysis.parsedData?.experienceYears !== undefined
                            ? `${selectedAnalysis.parsedData.experienceYears} Years`
                            : 'Not detected'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'weaknesses' && (
                <div className="flex flex-col gap-3">
                  {selectedAnalysis.weakAreas.length > 0 ? (
                    selectedAnalysis.weakAreas.map((weak, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2.5 p-3 rounded-xl border border-rose-500/10 bg-rose-500/5 text-slate-700 dark:text-slate-300 text-xs font-light"
                      >
                        <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{weak}</span>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center gap-2 text-emerald-500 text-xs font-bold py-4">
                      <CheckCircle2 className="w-4 h-4" /> No weaknesses detected! Outstanding.
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'keywords' && (
                <div className="space-y-3">
                  <p className="text-[11px] text-slate-450 dark:text-slate-400 font-light">
                    These target developer keywords were not detected in your resume, but are commonly required for your role:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedAnalysis.missingKeywords.length > 0 ? (
                      selectedAnalysis.missingKeywords.map((kw) => (
                        <span
                          key={kw}
                          className="text-[10px] px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/15 text-rose-500 font-semibold"
                        >
                          {kw}
                        </span>
                      ))
                    ) : (
                      <div className="flex items-center gap-2 text-emerald-500 text-xs font-bold py-4">
                        <CheckCircle2 className="w-4 h-4" /> All critical keywords match perfectly!
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'suggestions' && (
                <div className="flex flex-col gap-3">
                  {selectedAnalysis.improvementSuggestions.length > 0 ? (
                    selectedAnalysis.improvementSuggestions.map((sug, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-200/50 dark:border-white/5 bg-slate-50/50 dark:bg-bg-dark/10 text-slate-705 dark:text-slate-350 text-xs font-light"
                      >
                        <span className="w-5 h-5 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="leading-relaxed">{sug}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 font-light">No improvements suggested.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="glass-panel border p-12 bg-white dark:bg-card-dark rounded-2xl shadow-sm flex-grow flex flex-col items-center justify-center text-center text-slate-400 space-y-4 min-h-[500px]">
            <FileText className="w-12 h-12 text-slate-300 dark:text-slate-700 animate-pulse" />
            <h3 className="font-bold text-base text-slate-700 dark:text-slate-300">No Resume Report Selected</h3>
            <p className="text-xs max-w-sm font-light text-slate-500">
              Drag & drop a new resume file on the left panel, or pick an existing scan log from the audit sidebar.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeAnalysis;
