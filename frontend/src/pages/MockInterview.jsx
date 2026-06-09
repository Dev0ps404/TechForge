import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Play,
  Pause,
  ArrowLeft,
  ArrowRight,
  Send,
  Loader2,
  CheckCircle,
  Clock,
} from 'lucide-react';

const MockInterview = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve state passed from generator
  const { session, questions } = location.state || { session: null, questions: [] };

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // Stores questionId -> typed/transcribed text
  const [submittingAnswer, setSubmittingAnswer] = useState(false);
  const [submittingSession, setSubmittingSession] = useState(false);

  // Timers
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes per question
  const [isPaused, setIsPaused] = useState(false);

  // Video feed state
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Speech Recognition state
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);

  // Redirect if no session exists in history
  useEffect(() => {
    if (!session || questions.length === 0) {
      toast.error('No active interview session found. Please configure a new session.');
      navigate('/mock-interview');
    }
  }, [session, questions, navigate]);

  // Handle Question Timer Countdown
  useEffect(() => {
    if (isPaused || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isPaused]);

  // Auto-next when timer hits 0
  useEffect(() => {
    if (timeLeft === 0) {
      toast.error('Time limit reached for this question! Saving response.');
      handleNext();
    }
  }, [timeLeft]);

  // Reset timer on question change
  useEffect(() => {
    setTimeLeft(120);
  }, [currentIndex]);

  // Clean up streams and recordings on unmount
  useEffect(() => {
    return () => {
      stopCamera();
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  // Web Speech API Initialization
  const startRecording = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error('Speech recognition is not supported in this browser. Please type your response.');
      return;
    }

    try {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'en-US';

      rec.onstart = () => {
        setIsRecording(true);
        toast.success('Recording started. Speak clearly.');
      };

      rec.onresult = (e) => {
        let transcriptText = '';
        for (let i = e.resultIndex; i < e.results.length; i++) {
          transcriptText += e.results[i][0].transcript;
        }
        
        // Append live transcribed text to current answer field
        const activeQ = questions[currentIndex];
        setAnswers((prev) => ({
          ...prev,
          [activeQ._id]: (prev[activeQ._id] || '') + ' ' + transcriptText,
        }));
      };

      rec.onerror = (err) => {
        console.error('Speech Recognition Error:', err);
        setIsRecording(false);
      };

      rec.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = rec;
      rec.start();
    } catch (e) {
      console.error('Speech setup error:', e);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
      toast.success('Recording saved.');
    }
  };

  // Camera Management
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 320, height: 240 },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
    } catch (err) {
      console.error('Webcam access failed:', err);
      toast.error('Could not access webcam. Please verify browser permissions.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const toggleCamera = () => {
    if (cameraActive) {
      stopCamera();
    } else {
      startCamera();
    }
  };

  // Submit Answer to Server
  const saveCurrentAnswer = async () => {
    const activeQ = questions[currentIndex];
    const answerText = answers[activeQ._id] || '';

    if (!answerText.trim()) {
      return true; // proceed even if answer is blank
    }

    try {
      setSubmittingAnswer(true);
      await api.post(`/interviews/sessions/${session._id}/submit-answer`, {
        questionId: activeQ._id,
        answerText: answerText.trim(),
      });
      return true;
    } catch (err) {
      console.error('Failed to submit answer:', err);
      toast.error('Failed to save answer progress.');
      return false;
    } finally {
      setSubmittingAnswer(false);
    }
  };

  const handleNext = async () => {
    // Save current answer first
    const saved = await saveCurrentAnswer();
    if (!saved) return;

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = async () => {
    const saved = await saveCurrentAnswer();
    if (!saved) return;

    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // Complete Interview & Evaluate
  const handleSubmitInterview = async () => {
    // Save final answer
    const saved = await saveCurrentAnswer();
    if (!saved) return;

    try {
      setSubmittingSession(true);
      toast.loading('Analyzing responses with OpenAI & generating report...');

      const res = await api.post(`/interviews/sessions/${session._id}/evaluate`);
      toast.dismiss();

      if (res.data.success) {
        toast.success('Interview evaluated! Loading scores.');
        navigate(`/evaluation/${session._id}`);
      }
    } catch (err) {
      toast.dismiss();
      const errMsg = err.response?.data?.message || 'Failed to complete evaluation.';
      toast.error(errMsg);
    } finally {
      setSubmittingSession(false);
    }
  };

  if (!session || questions.length === 0) {
    return null;
  }

  const activeQuestion = questions[currentIndex];
  const currentAnswer = answers[activeQuestion._id] || '';

  // Timer formatter
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Main Question Panel */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        {/* Header */}
        <div className="glass-panel border p-5 rounded-3xl flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-extrabold text-indigo-500 uppercase tracking-widest">
              {session.jobRole} Mock
            </span>
            <h3 className="font-bold text-sm">
              Question {currentIndex + 1} of {questions.length}
            </h3>
          </div>

          <div className="flex items-center gap-4">
            {/* Timer */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-dark-900 border text-xs font-bold">
              <Clock className="w-3.5 h-3.5 text-indigo-500" />
              <span>{formatTime(timeLeft)}</span>
            </div>

            {/* Pause controls */}
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="p-2 bg-slate-50 hover:bg-slate-100 dark:bg-dark-800 dark:hover:bg-dark-750 text-slate-500 dark:text-slate-200 rounded-xl transition-colors"
            >
              {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Question Panel */}
        <div className="glass-panel border p-8 rounded-3xl space-y-6 flex-grow flex flex-col justify-between">
          <div className="space-y-4">
            <span className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              {activeQuestion.category} Question
            </span>
            <h2 className="text-xl md:text-2xl font-extrabold leading-relaxed text-slate-800 dark:text-white">
              {activeQuestion.text}
            </h2>
          </div>

          {/* User Answer Textarea */}
          <div className="space-y-3 pt-6 border-t border-slate-100 dark:border-dark-800/60">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-400">
              <span>CANDIDATE RESPONSE</span>
              {isRecording && (
                <span className="flex items-center gap-1 text-pink-500 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-pink-500"></span> Transcribing Voice...
                </span>
              )}
            </div>

            <textarea
              placeholder="Record your answer using the microphone or type it here..."
              value={currentAnswer}
              onChange={(e) =>
                setAnswers((prev) => ({ ...prev, [activeQuestion._id]: e.target.value }))
              }
              className="w-full h-40 p-4 rounded-2xl border border-slate-200 dark:border-dark-800 bg-white dark:bg-dark-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 text-sm leading-relaxed transition-all"
            />
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between pt-6">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0 || submittingAnswer}
              className="px-4 py-2.5 rounded-xl border hover:bg-slate-50 dark:hover:bg-dark-800 text-xs font-bold transition-colors disabled:opacity-40 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Previous
            </button>

            {currentIndex === questions.length - 1 ? (
              <button
                onClick={handleSubmitInterview}
                disabled={submittingSession || submittingAnswer}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-colors shadow-lg shadow-emerald-650/15 flex items-center gap-1.5 animate-pulse"
              >
                {submittingSession ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Evaluating...
                  </>
                ) : (
                  <>
                    Submit Interview <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={submittingAnswer}
                className="px-6 py-2.5 bg-indigo-650 hover:bg-indigo-600 text-white font-bold rounded-xl text-xs transition-colors shadow-lg shadow-indigo-650/15 flex items-center gap-1.5"
              >
                {submittingAnswer ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    Next Question <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Video & Speech Controls Side column */}
      <div className="flex flex-col gap-6">
        {/* Camera stream */}
        <div className="glass-panel border p-6 rounded-3xl space-y-4 flex flex-col items-center">
          <div className="flex items-center justify-between w-full">
            <h3 className="font-bold text-sm">Webcam Monitor</h3>
            <button
              onClick={toggleCamera}
              className={`p-2 rounded-xl transition-colors ${
                cameraActive
                  ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-dark-800 dark:hover:bg-dark-750 text-slate-500'
              }`}
            >
              {cameraActive ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
            </button>
          </div>

          <div className="relative w-full aspect-video bg-slate-950 rounded-2xl overflow-hidden border border-white/5 flex items-center justify-center">
            {cameraActive ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover scale-x-[-1]"
              />
            ) : (
              <VideoOff className="w-8 h-8 text-slate-700 animate-pulse" />
            )}
          </div>
          <p className="text-[10px] text-slate-400 font-light text-center">
            We stream video locally to simulate a real recruiter setting. Video is NOT uploaded or saved.
          </p>
        </div>

        {/* Speech Recognition Controls */}
        <div className="glass-panel border p-6 rounded-3xl space-y-4 text-center">
          <h3 className="font-bold text-sm text-left">Speech Recorder</h3>
          <p className="text-xs text-slate-400 font-light text-left leading-relaxed">
            Record your answer verbally. The system will convert your voice into editable text.
          </p>

          <div className="flex justify-center pt-2">
            {isRecording ? (
              <button
                onClick={stopRecording}
                className="w-20 h-20 rounded-full bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-pink-500 transition-all shadow-lg shadow-pink-500/10 relative"
              >
                <span className="absolute inset-0 rounded-full border border-pink-500 animate-ping opacity-25"></span>
                <MicOff className="w-8 h-8" />
              </button>
            ) : (
              <button
                onClick={startRecording}
                className="w-20 h-20 rounded-full bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-500 transition-all shadow-lg shadow-indigo-500/10"
              >
                <Mic className="w-8 h-8" />
              </button>
            )}
          </div>

          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            {isRecording ? 'TAP TO STOP RECORDING' : 'TAP TO RECORD VOICE'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MockInterview;
