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
  ChevronRight,
} from 'lucide-react';

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
          setSelectedAnalysis(res.data.data[0]); // load latest by default
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
        fetchHistory(); // refresh list
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

  // Helper to color circular gauges
  const getScoreColorClass = (score) => {
    if (score >= 80) return 'text-emerald-500 stroke-emerald-500';
    if (score >= 60) return 'text-amber-500 stroke-amber-500';
    return 'text-pink-500 stroke-pink-500';
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Upload Zone & History column */}
      <div className="flex flex-col gap-6">
        {/* Upload panel */}
        <div className="glass-panel border p-6 rounded-3xl space-y-4">
          <h3 className="font-bold text-lg">Upload Resume</h3>
          <p className="text-slate-400 text-xs font-light">
            Upload your PDF/Text resume. Our AI parses and compares it against developer profiles.
          </p>

          <form onSubmit={handleUpload} className="space-y-4">
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="border-2 border-dashed border-slate-200 dark:border-dark-800 hover:border-indigo-500/50 rounded-2xl p-6 text-center cursor-pointer transition-colors flex flex-col items-center justify-center gap-2 group bg-white dark:bg-dark-900/20"
              onClick={() => document.getElementById('resume-file-input').click()}
            >
              <input
                id="resume-file-input"
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileChange}
              />
              <UploadCloud className="w-10 h-10 text-slate-400 group-hover:text-indigo-500 transition-colors" />
              <p className="text-sm font-semibold">
                {file ? file.name : 'Drag & drop file here'}
              </p>
              <p className="text-xs text-slate-400 font-light">
                Supports PDF, DOC, DOCX up to 10MB
              </p>
            </div>

            {file && (
              <button
                type="submit"
                disabled={uploading}
                className="w-full py-3 bg-indigo-650 hover:bg-indigo-600 text-white font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-650/15"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Analyzing...
                  </>
                ) : (
                  <>Start Resume Scanning</>
                )}
              </button>
            )}
          </form>
        </div>

        {/* History panel */}
        <div className="glass-panel border p-6 rounded-3xl flex-grow flex flex-col gap-4 max-h-[400px] lg:max-h-[500px]">
          <h3 className="font-bold text-base flex items-center gap-2">
            <ListRestart className="w-4 h-4 text-indigo-500" /> Previous Scans
          </h3>

          <div className="flex flex-col gap-2 overflow-y-auto no-scrollbar flex-grow pr-1">
            {loadingHistory ? (
              <p className="text-sm text-slate-400">Loading scan logs...</p>
            ) : history.length > 0 ? (
              history.map((scan) => (
                <button
                  key={scan._id}
                  onClick={() => setSelectedAnalysis(scan)}
                  className={`w-full text-left p-3.5 rounded-2xl border text-sm transition-all flex items-center justify-between hover:border-indigo-500/30 ${
                    selectedAnalysis?._id === scan._id
                      ? 'bg-indigo-50/20 border-indigo-500/40 text-indigo-700 dark:text-indigo-400'
                      : 'border-slate-100 dark:border-dark-850 hover:bg-slate-100 dark:hover:bg-dark-900/40'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <FileText className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <div className="truncate">
                      <p className="font-bold truncate text-xs">{scan.fileName}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {new Date(scan.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <span className="font-extrabold text-xs ml-2">{scan.atsScore}%</span>
                </button>
              ))
            ) : (
              <p className="text-xs text-slate-400 text-center py-8">No resumes scanned yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Detailed Analysis Output */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        {selectedAnalysis ? (
          <div className="glass-panel border p-6 rounded-3xl space-y-6 flex-grow flex flex-col">
            {/* Report Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b pb-5 border-slate-100 dark:border-dark-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{selectedAnalysis.fileName}</h2>
                  <p className="text-xs text-slate-400">
                    Analyzed on {new Date(selectedAnalysis.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <button
                onClick={downloadReport}
                className="px-4 py-2 bg-slate-50 hover:bg-slate-100 dark:bg-dark-800 dark:hover:bg-dark-750 text-slate-600 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Download Report
              </button>
            </div>

            {/* Score Metric Circular Gauge */}
            <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-3xl bg-slate-50 dark:bg-dark-900/20 border">
              {/* Circular Gauge */}
              <div className="relative w-28 h-28 flex items-center justify-center flex-shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="56"
                    cy="56"
                    r="48"
                    className="stroke-slate-200 dark:stroke-dark-800"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="56"
                    cy="56"
                    r="48"
                    className={`transition-all duration-1000 ${getScoreColorClass(
                      selectedAnalysis.atsScore
                    )}`}
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={301.6}
                    strokeDashoffset={301.6 - (301.6 * selectedAnalysis.atsScore) / 100}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-2xl font-extrabold leading-none">
                    {selectedAnalysis.atsScore}%
                  </span>
                  <span className="text-[9px] text-slate-400 font-bold uppercase mt-1">
                    ATS Score
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-center sm:text-left">
                <h4 className="font-extrabold text-base flex items-center justify-center sm:justify-start gap-1">
                  <TrendingUp className="w-4 h-4 text-indigo-500" /> Overall Score Analysis
                </h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-light">
                  {selectedAnalysis.atsScore >= 80
                    ? 'Your resume is highly optimized with standard keywords and metrics. You have strong formatting alignment with industry guidelines.'
                    : selectedAnalysis.atsScore >= 60
                    ? 'Your resume shows good foundational content, but misses key technical vocabulary and fails to quantify project details.'
                    : 'Your resume lacks critical industry keywords and formatting details. Review our recommendations to update your content.'}
                </p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-100 dark:border-dark-800 pb-px">
              {['overview', 'weaknesses', 'keywords', 'suggestions'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 border-b-2 text-xs font-semibold capitalize transition-all ${
                    activeTab === tab
                      ? 'border-indigo-650 text-indigo-600 dark:text-indigo-400'
                      : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                  }`}
                >
                  {tab === 'keywords' ? 'Missing Keywords' : tab}
                </button>
              ))}
            </div>

            {/* Tab content panel */}
            <div className="flex-grow pt-4">
              {activeTab === 'overview' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold">Detected Tech Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedAnalysis.skillsDetected.length > 0 ? (
                        selectedAnalysis.skillsDetected.map((skill) => (
                          <span
                            key={skill}
                            className="text-xs px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 font-medium"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <p className="text-xs text-slate-400">No skills parsed.</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <h4 className="text-sm font-bold">Resume Profile Metadata</h4>
                    <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 dark:bg-dark-900/20 p-4 rounded-2xl border">
                      <div>
                        <p className="text-slate-400 font-semibold uppercase">Education Summary</p>
                        <p className="font-semibold text-slate-700 dark:text-slate-300 mt-1">
                          {selectedAnalysis.parsedData?.education || 'Not detected'}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-400 font-semibold uppercase">Estimated Experience</p>
                        <p className="font-semibold text-slate-700 dark:text-slate-300 mt-1">
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
                        className="flex items-start gap-2.5 p-3 rounded-2xl border border-pink-500/20 bg-pink-500/5 text-slate-700 dark:text-slate-300 text-xs"
                      >
                        <AlertCircle className="w-4 h-4 text-pink-500 flex-shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{weak}</span>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center gap-2 text-emerald-500 text-xs font-semibold py-4">
                      <CheckCircle2 className="w-4 h-4" /> No major weak areas detected! Excellent work.
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'keywords' && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-400 font-light">
                    These keywords are commonly found in related developer profiles but missing in yours:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedAnalysis.missingKeywords.length > 0 ? (
                      selectedAnalysis.missingKeywords.map((kw) => (
                        <span
                          key={kw}
                          className="text-xs px-2.5 py-1 rounded-lg bg-pink-500/10 border border-pink-500/25 text-pink-500 font-semibold"
                        >
                          {kw}
                        </span>
                      ))
                    ) : (
                      <div className="flex items-center gap-2 text-emerald-500 text-xs font-semibold py-4">
                        <CheckCircle2 className="w-4 h-4" /> All critical keywords are present!
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
                        className="flex items-start gap-2.5 p-3 rounded-2xl border bg-slate-50 dark:bg-dark-900/30 text-slate-700 dark:text-slate-300 text-xs font-light"
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
          <div className="glass-panel border p-12 rounded-3xl flex-grow flex flex-col items-center justify-center text-center text-slate-400 space-y-4">
            <FileText className="w-12 h-12 text-slate-300 animate-pulse" />
            <h3 className="font-bold text-lg text-slate-700 dark:text-slate-300">No report selected</h3>
            <p className="text-sm max-w-sm font-light">
              Upload a resume PDF on the left panel or click a previous scan log to load your ATS feedback.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeAnalysis;
