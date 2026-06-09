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
  Clock,
  Volume2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MockInterview = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { session, questions } = location.state || { session: null, questions: [] };

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submittingAnswer, setSubmittingAnswer] = useState(false);
  const [submittingSession, setSubmittingSession] = useState(false);

  const [timeLeft, setTimeLeft] = useState(120);
  const [isPaused, setIsPaused] = useState(false);

  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!session || questions.length === 0) {
      toast.error('No active interview session found. Please configure a new session.');
      navigate('/mock-interview');
    }
  }, [session, questions, navigate]);

  useEffect(() => {
    if (isPaused || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isPaused]);

  useEffect(() => {
    if (timeLeft === 0) {
      toast.error('Time limit reached for this question! Saving response.');
      handleNext();
    }
  }, [timeLeft]);

  useEffect(() => {
    setTimeLeft(120);
  }, [currentIndex]);

  useEffect(() => {
    return () => {
      stopCamera();
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

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

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 480, height: 360 },
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

  const saveCurrentAnswer = async () => {
    const activeQ = questions[currentIndex];
    const answerText = answers[activeQ._id] || '';

    if (!answerText.trim()) {
      return true;
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

  const handleSubmitInterview = async () => {
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

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="grid lg:grid-cols-12 gap-6 max-w-7xl mx-auto pb-12">
      {/* Left panel: Questions and Input (8 cols) */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        
        {/* Progress header bar */}
        <div className="glass-panel border p-5 bg-white dark:bg-card-dark flex items-center justify-between rounded-2xl shadow-sm">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">
              {session.jobRole} Interview
            </span>
            <h3 className="font-bold text-xs text-slate-800 dark:text-slate-200">
              Question {currentIndex + 1} of {questions.length}
            </h3>
          </div>

          <div className="flex items-center gap-3">
            {/* Timer widget */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-bg-dark border border-slate-200/60 dark:border-white/5 text-xs font-bold text-slate-700 dark:text-slate-350">
              <Clock className="w-3.5 h-3.5 text-indigo-500" />
              <span>{formatTime(timeLeft)}</span>
            </div>

            {/* Play/Pause Button */}
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-650 dark:text-slate-300 rounded-xl transition-all border border-transparent dark:border-white/5"
            >
              {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Focus question & Answer writing box */}
        <div className="glass-panel border p-6 sm:p-8 bg-white dark:bg-card-dark flex flex-col justify-between min-h-[450px] rounded-2xl shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-indigo-500/5 to-transparent blur-3xl pointer-events-none"></div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 text-[9px] font-bold rounded-md bg-indigo-550/10 text-indigo-500 uppercase tracking-wider">
                {activeQuestion.category || 'Technical'} Question
              </span>
            </div>
            
            <AnimatePresence mode="wait">
              <motion.h2 
                key={currentIndex}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3 }}
                className="text-lg md:text-xl font-bold leading-relaxed text-slate-800 dark:text-white"
              >
                {activeQuestion.text}
              </motion.h2>
            </AnimatePresence>
          </div>

          {/* User Answer Textarea */}
          <div className="space-y-2.5 pt-6 border-t border-slate-100 dark:border-white/5 mt-8">
            <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 tracking-wider">
              <span>CANDIDATE RESPONSE</span>
              {isRecording && (
                <span className="flex items-center gap-1.5 text-rose-500 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span> Transcribing voice...
                </span>
              )}
            </div>

            <textarea
              placeholder="Record your response using the voice controls on the right, or type your answer here..."
              value={currentAnswer}
              onChange={(e) =>
                setAnswers((prev) => ({ ...prev, [activeQuestion._id]: e.target.value }))
              }
              className="w-full h-36 p-4 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-bg-dark/40 text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all font-medium"
            />
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-100 dark:border-white/5">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0 || submittingAnswer}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 text-xs font-bold transition-all disabled:opacity-40 flex items-center gap-1.5 text-slate-700 dark:text-slate-300"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Previous
            </button>

            {currentIndex === questions.length - 1 ? (
              <button
                onClick={handleSubmitInterview}
                disabled={submittingSession || submittingAnswer}
                className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-550 hover:to-teal-650 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-emerald-500/15 flex items-center gap-1.5"
              >
                {submittingSession ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Submitting...
                  </>
                ) : (
                  <>
                    Finish Interview <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={submittingAnswer}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-550 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-indigo-500/15 flex items-center gap-1.5"
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

      {/* Right panel: Webcam & Voice Stream controls (4 cols) */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        
        {/* Webcam feed box */}
        <div className="glass-panel border p-6 bg-white dark:bg-card-dark flex flex-col items-center gap-4 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between w-full border-b pb-3 border-slate-100 dark:border-white/5">
            <h3 className="font-bold text-xs text-slate-800 dark:text-slate-100">Webcam Overlay</h3>
            <button
              onClick={toggleCamera}
              className={`p-1.5 rounded-lg border transition-all ${
                cameraActive
                  ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20'
                  : 'bg-slate-100 dark:bg-white/5 dark:hover:bg-white/10 text-slate-500 border-transparent dark:border-white/5'
              }`}
            >
              {cameraActive ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
            </button>
          </div>

          <div className="relative w-full aspect-video bg-slate-950 rounded-xl overflow-hidden border border-white/5 flex items-center justify-center shadow-inner">
            {cameraActive ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover scale-x-[-1]"
              />
            ) : (
              <div className="text-center p-6 space-y-2">
                <VideoOff className="w-6 h-6 text-slate-700 mx-auto animate-pulse" />
                <p className="text-[10px] text-slate-500 font-light">Camera feedback off</p>
              </div>
            )}
          </div>
          
          <p className="text-[9px] text-slate-400 font-light text-center leading-relaxed">
            Camera streams locally on your device to practice eye contact. Data is never sent to servers.
          </p>
        </div>

        {/* Voice Speech Recognition controls */}
        <div className="glass-panel border p-6 bg-white dark:bg-card-dark flex flex-col gap-4 text-center rounded-2xl shadow-sm">
          <h3 className="font-bold text-xs text-slate-800 dark:text-slate-100 text-left border-b pb-3 border-slate-100 dark:border-white/5">Speech-to-Text</h3>
          <p className="text-xs text-slate-450 dark:text-slate-400 font-light text-left leading-relaxed">
            Record answers verbally using Web Speech translation. Speak directly into your microphone.
          </p>

          <div className="flex justify-center py-4">
            {isRecording ? (
              <button
                onClick={stopRecording}
                className="w-16 h-16 rounded-full bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 flex items-center justify-center text-rose-500 transition-all shadow-lg shadow-rose-500/5 relative"
              >
                <span className="absolute inset-0 rounded-full border border-rose-500 animate-ping opacity-20"></span>
                <MicOff className="w-6 h-6" />
              </button>
            ) : (
              <button
                onClick={startRecording}
                className="w-16 h-16 rounded-full bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 flex items-center justify-center text-indigo-500 transition-all shadow-lg shadow-indigo-500/5"
              >
                <Mic className="w-6 h-6" />
              </button>
            )}
          </div>

          <div className="inline-flex items-center gap-1.5 justify-center px-3 py-1 rounded-full bg-slate-50 dark:bg-bg-dark border border-slate-200/60 dark:border-white/5 text-[9px] font-bold text-slate-450 dark:text-slate-400 uppercase tracking-widest max-w-max mx-auto">
            <Volume2 className="w-3 h-3 text-indigo-500" />
            <span>{isRecording ? 'Click to Stop voice' : 'Click to Speak voice'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockInterview;
