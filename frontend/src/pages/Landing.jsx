import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Logo from '../components/Logo';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  Terminal,
  Mic,
  Shield,
  BarChart3,
  Code2,
  Brain,
  Star,
  ChevronRight,
  Sun,
  Moon,
  CheckCircle2,
  ChevronDown
} from 'lucide-react';

const Landing = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqs = [
    {
      q: 'How does the AI evaluate my interview responses?',
      a: 'Once you submit a spoken or written response, our backend calls OpenAI endpoints using engineered prompts. It evaluates your answer for technical accuracy, grammar structure, communication pacing, and confidence cues, then outputs granular scores and explanations.',
    },
    {
      q: 'Can I use speech-to-text on any browser?',
      a: 'Yes! We use the browser-native Web Speech API, which is supported on Google Chrome, Microsoft Edge, and Safari. This allows real-time transcription without requiring external cloud accounts or third-party installations.',
    },
    {
      q: 'Is there a limit to the number of resumes I can scan?',
      a: 'The free tier includes up to 5 resume scans and 3 mock interviews. Premium plans offer unlimited evaluations, deeper system design questions, and advanced career path suggestions.',
    },
    {
      q: 'How does the DSA Progress and Streak count work?',
      a: 'When you mark a data structure or algorithm problem as completed in the DSA Practice dashboard, you earn points and trigger consecutive streak counters. Missing challenges resets your active study streak.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 selection:bg-blue-600 selection:text-white overflow-hidden relative">
      {/* Mesh/Grid Background */}
      <div className="absolute inset-0 grid-bg-dark opacity-30 pointer-events-none"></div>

      {/* Decorative Glow Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[50%] rounded-full bg-blue-600/10 blur-[130px] animate-glow-1"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[50%] rounded-full bg-cyan-500/10 blur-[130px] animate-glow-2"></div>

      {/* Header navbar */}
      <nav className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between border-b border-white/5 relative z-10">
        <div className="flex items-center gap-2.5">
          <Logo className="w-8 h-8 flex-shrink-0" />
          <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            TalentForge
          </span>
        </div>

        {/* Navigation Middle Links */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-xs text-slate-400 hover:text-white font-medium transition-colors">
            Features
          </a>
          <a href="#testimonials" className="text-xs text-slate-400 hover:text-white font-medium transition-colors">
            Testimonials
          </a>
        </div>

        <div className="flex items-center gap-4">
          {/* Theme Toggle icon */}
          <button
            onClick={toggleTheme}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4.5 h-4.5 text-blue-400" />
            ) : (
              <Moon className="w-4.5 h-4.5 text-slate-650" />
            )}
          </button>

          {user ? (
            <Link
              to="/dashboard"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-50 hover:to-blue-700 text-white font-semibold transition-all border border-blue-500/30 flex items-center gap-1 text-xs shadow-md shadow-blue-500/10"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-slate-400 hover:text-white transition-colors text-xs font-semibold px-2">
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-50 hover:to-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/15"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-16 lg:pt-24 pb-28 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Block */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-bold text-blue-300 uppercase tracking-wider">
              ✨ Powered by OpenAI GPT-4o-Mini
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight text-white leading-none">
              Nail Your Tech Interviews with{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-sky-400 to-cyan-400">
                TalentForge
              </span>
            </h1>
            <p className="text-base sm:text-lg text-slate-400 font-light leading-relaxed max-w-xl">
              The ultimate AI-powered preparation platform. Generate tailor-made questions, record speech-to-text answers, analyze your resume for ATS optimization, and master DSA tracking in one single premium platform.
            </p>

            <div className="flex flex-row items-center gap-4 pt-2">
              <Link
                to={user ? '/dashboard' : '/signup'}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-50 hover:to-blue-700 font-bold shadow-lg shadow-blue-500/25 transition-all text-xs text-white flex items-center gap-1.5 hover:shadow-blue-500/40"
              >
                Start Free Trial <ChevronRight className="w-4 h-4" />
              </Link>
              <Link
                to={user ? '/dashboard' : '/login'}
                className="px-6 py-3.5 rounded-xl bg-slate-900/40 border border-white/5 hover:bg-slate-850/40 font-bold transition-all text-xs text-slate-350 flex items-center justify-center"
              >
                Try Demo Interview
              </Link>
            </div>
          </div>

          {/* Right Terminal Mockup */}
          <div className="lg:col-span-5 relative mt-8 lg:mt-0">
            <div className="absolute inset-0 bg-blue-600/5 blur-3xl rounded-3xl pointer-events-none"></div>
            {/* Terminal Card */}
            <div className="glass-panel border bg-card-dark/65 border-white/10 p-5 rounded-2xl shadow-2xl relative overflow-hidden font-mono text-left leading-relaxed">
              {/* Window controls */}
              <div className="flex items-center gap-1.5 mb-5 border-b border-white/5 pb-3">
                <span className="w-3 h-3 rounded-full bg-[#EF4444]"></span>
                <span className="w-3 h-3 rounded-full bg-[#F59E0B]"></span>
                <span className="w-3 h-3 rounded-full bg-[#22C55E]"></span>
                <span className="ml-auto text-[10px] text-slate-500">ai-evaluation-terminal.sh</span>
              </div>
              
              {/* Terminal code outputs */}
              <div className="space-y-4 text-xs font-light">
                <div className="space-y-1">
                  <p className="text-[#06B6D4] font-medium">$ run analyze-resume --file resume.pdf</p>
                  <p className="text-[#22C55E] flex items-center gap-1.5">✓ Extracted Skills: React, Express, MongoDB</p>
                  <p className="text-[#3B82F6] flex items-center gap-1.5">★ ATS Score computed: 88%</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-[#06B6D4] font-medium">$ start mock-interview --role "Frontend"</p>
                  <p className="text-[#F59E0B] flex items-start gap-1">
                    <span>🤖 Question:</span>
                    <span>What is the React Event Loop?</span>
                  </p>
                  <p className="text-slate-400 flex items-center gap-1.5">
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
                    Recording user voice answer...
                  </p>
                </div>
              </div>
            </div>

            {/* Overlapping ATS success rate badge */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -bottom-6 -left-6 glass-panel border bg-[#0B1220]/95 dark:bg-card-dark/95 border-white/35 px-5.5 py-4 rounded-xl flex items-center gap-3.5 shadow-2xl z-20"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20">
                <CheckCircle2 className="w-5.5 h-5.5" />
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-medium">ATS Success Rate</p>
                <p className="text-sm font-extrabold text-emerald-500">+42% Higher</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-24 border-t border-white/5 relative z-10">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            Engineered for{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-sky-400 to-cyan-400">
              Interview Mastery
            </span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto font-light text-sm leading-relaxed">
            Everything you need to transform your technical preparation from unstructured cramming to a data-backed career booster.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="glass-card p-6 bg-card-dark/40 border-white/5 relative overflow-hidden flex flex-col justify-between min-h-[180px]">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-5 border border-blue-500/10">
              <Terminal className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white mb-2">AI Question Generator</h3>
              <p className="text-slate-400 text-xs leading-relaxed font-light">
                Get highly tailored technical interview questions based on role, stack, and difficulty level.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="glass-card p-6 bg-card-dark/40 border-white/5 relative overflow-hidden flex flex-col justify-between min-h-[180px]">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-5 border border-blue-500/10">
              <Mic className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white mb-2">Speech-to-Text Answers</h3>
              <p className="text-slate-400 text-xs leading-relaxed font-light">
                Answer questions naturally using Web Speech recognition. Practice oral clarity.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="glass-card p-6 bg-card-dark/40 border-white/5 relative overflow-hidden flex flex-col justify-between min-h-[180px]">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-5 border border-blue-500/10">
              <Shield className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white mb-2">ATS Resume Reviewer</h3>
              <p className="text-slate-400 text-xs leading-relaxed font-light">
                Upload your PDF resume to receive ATS scores, skill extractions, and actionable optimization feedback.
              </p>
            </div>
          </div>

          {/* Card 4 */}
          <div className="glass-card p-6 bg-card-dark/40 border-white/5 relative overflow-hidden flex flex-col justify-between min-h-[180px]">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-5 border border-blue-500/10">
              <BarChart3 className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white mb-2">Granular AI Evaluation</h3>
              <p className="text-slate-400 text-xs leading-relaxed font-light">
                Get precise scores, communication review, technical feedback, and suggestions for improvement.
              </p>
            </div>
          </div>

          {/* Card 5 */}
          <div className="glass-card p-6 bg-card-dark/40 border-white/5 relative overflow-hidden flex flex-col justify-between min-h-[180px]">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-5 border border-blue-500/10">
              <Code2 className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white mb-2">DSA Practice Sheets</h3>
              <p className="text-slate-400 text-xs leading-relaxed font-light">
                Track Arrays, Strings, Linked Lists, Trees, and Graphs completion percentages in real-time.
              </p>
            </div>
          </div>

          {/* Card 6 */}
          <div className="glass-card p-6 bg-card-dark/40 border-white/5 relative overflow-hidden flex flex-col justify-between min-h-[180px]">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-5 border border-blue-500/10">
              <Brain className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white mb-2">AI Chatbot Assistant</h3>
              <p className="text-slate-400 text-xs leading-relaxed font-light">
                Interact with an intelligent, conversational agent to clarify computer science concepts on the fly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="max-w-7xl mx-auto px-6 py-24 border-t border-white/5 relative z-10">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            Success Stories from{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-sky-400 to-cyan-400">
              Real Students
            </span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto font-light text-sm leading-relaxed">
            Hundreds of software development students and professionals have landed roles using TalentForge.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Rohan Testimonial */}
          <div className="glass-card p-6 bg-card-dark/40 border-white/5 relative overflow-hidden flex flex-col justify-between min-h-[220px]">
            <div>
              {/* Stars */}
              <div className="flex items-center gap-1.5 mb-4 text-[#F59E0B]">
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
              </div>
              <p className="text-slate-350 text-xs leading-relaxed font-light italic">
                "The speech recognition is highly accurate. Talking aloud while answering technical questions boosted my confidence before the final rounds."
              </p>
            </div>
            
            <div className="flex items-center gap-3 mt-6 pt-4 border-t border-white/5">
              <div className="w-9 h-9 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                RS
              </div>
              <div>
                <p className="text-xs font-bold text-white">Rohan Sharma</p>
                <p className="text-[10px] text-slate-500">Frontend Engineer @ Google</p>
              </div>
            </div>
          </div>

          {/* Aishwarya Testimonial */}
          <div className="glass-card p-6 bg-card-dark/40 border-white/5 relative overflow-hidden flex flex-col justify-between min-h-[220px]">
            <div>
              {/* Stars */}
              <div className="flex items-center gap-1.5 mb-4 text-[#F59E0B]">
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
              </div>
              <p className="text-slate-350 text-xs leading-relaxed font-light italic">
                "The resume ATS analyzer gave me concrete pointers. I updated my key experience sections and got shortlists within 2 weeks!"
              </p>
            </div>
            
            <div className="flex items-center gap-3 mt-6 pt-4 border-t border-white/5">
              <div className="w-9 h-9 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs">
                AP
              </div>
              <div>
                <p className="text-xs font-bold text-white">Aishwarya Patel</p>
                <p className="text-[10px] text-slate-500">Full Stack Dev @ Cred</p>
              </div>
            </div>
          </div>

          {/* Michael Testimonial */}
          <div className="glass-card p-6 bg-card-dark/40 border-white/5 relative overflow-hidden flex flex-col justify-between min-h-[220px]">
            <div>
              {/* Stars */}
              <div className="flex items-center gap-1.5 mb-4 text-[#F59E0B]">
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
              </div>
              <p className="text-slate-350 text-xs leading-relaxed font-light italic">
                "Saved questions and the DSA sheets are extremely handy. I could trace my progress and focus on weaker topics like Graphs and Trees."
              </p>
            </div>
            
            <div className="flex items-center gap-3 mt-6 pt-4 border-t border-white/5">
              <div className="w-9 h-9 rounded-full bg-[#06B6D4]/20 text-[#06B6D4] flex items-center justify-center font-bold text-xs">
                MC
              </div>
              <div>
                <p className="text-xs font-bold text-white">Michael Chen</p>
                <p className="text-[10px] text-slate-500">Java Developer @ Amazon</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-6 py-24 border-t border-white/5 relative z-10">
        <h2 className="text-3xl md:text-5xl font-black text-white text-center tracking-tight mb-16">Frequently Asked Questions</h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="glass-panel bg-card-dark/20 border-white/5 overflow-hidden transition-all duration-300 rounded-2xl"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full text-left px-6 py-5 flex items-center justify-between font-bold text-sm md:text-base text-white hover:bg-white/5 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${
                    activeFaq === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {activeFaq === index && (
                <div className="px-6 pb-5 pt-1 text-slate-450 leading-relaxed text-xs font-light">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Ready to Accelerate Your Prep? CTA section */}
      <section className="max-w-7xl mx-auto px-6 py-24 relative z-10 border-t border-white/5">
        <div className="glass-panel p-10 sm:p-14 bg-gradient-to-r from-card-dark via-blue-950/20 to-card-dark border-white/10 rounded-3xl relative overflow-hidden text-center max-w-4xl mx-auto">
          {/* Subtle glow backdrop overlay */}
          <div className="absolute top-0 left-0 w-full h-full bg-blue-600/5 blur-3xl pointer-events-none"></div>
          
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4 leading-tight">
            Ready to Accelerate Your Prep?
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm font-light max-w-md mx-auto mb-8 leading-relaxed">
            Create an account in minutes and get access to custom mock interviews, live voice evaluation, and ATS feedback.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={user ? '/dashboard' : '/signup'}
              className="w-full sm:w-auto px-7 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold transition-all text-xs shadow-lg"
            >
              Get Started for Free
            </Link>
            <Link
              to={user ? '/dashboard' : '/login'}
              className="w-full sm:w-auto px-7 py-3 rounded-xl border border-white/10 hover:bg-white/5 text-white font-bold transition-all text-xs"
            >
              Login to Account
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#0B1220] relative z-10 pt-16 pb-8 text-slate-400">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 pb-10">
          {/* Brand & Slogan */}
          <div className="space-y-3 max-w-sm text-left">
            <div className="flex items-center gap-2">
              <Logo className="w-6 h-6 flex-shrink-0" />
              <span className="text-base font-bold text-white tracking-tight">TalentForge</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed font-light">
              AI-driven preparation platform for standard technical interviews and DSA sheets.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-400 font-medium">
            <a href="#" className="hover:text-white transition-colors">Home</a>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#testimonials" className="hover:text-white transition-colors">Reviews</a>
            <a 
              href="https://github.com/Dev0ps404/TechForge" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-white transition-colors"
            >
              GitHub
            </a>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-3">
            <a 
              href="https://github.com/Dev0ps404/TechForge" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:border-white/10 hover:bg-slate-800 transition-all"
              aria-label="GitHub"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
            </a>
            <a 
              href="#" 
              className="w-8 h-8 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:border-white/10 hover:bg-slate-800 transition-all"
              aria-label="LinkedIn"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
            <a 
              href="#" 
              className="w-8 h-8 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:border-white/10 hover:bg-slate-800 transition-all"
              aria-label="Twitter"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Divider & Copyright */}
        <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-white/5 flex flex-col items-center justify-center text-center">
          <p className="text-[10px] text-slate-650 font-light">
            © 2026 TalentForge. All rights reserved. Built with passion for developers.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
