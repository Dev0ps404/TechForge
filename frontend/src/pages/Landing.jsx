import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Logo from '../components/Logo';
import BackgroundParticles from '../components/BackgroundParticles';
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
  ChevronDown,
  Cpu
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
    <div className="min-h-screen bg-white dark:bg-[#030712] text-slate-800 dark:text-slate-100 selection:bg-blue-600 selection:text-white overflow-hidden relative transition-colors duration-300">
      {/* Mesh/Grid Background */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <BackgroundParticles />
      </div>

      {/* Decorative Glow Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[50%] rounded-full bg-blue-400/10 dark:bg-blue-600/10 blur-[130px] animate-glow-1"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[50%] rounded-full bg-cyan-400/10 dark:bg-cyan-500/10 blur-[130px] animate-glow-2"></div>

      {/* Header navbar */}
      <nav className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between border-b border-slate-200/60 dark:border-white/5 relative z-10">
        <div className="flex items-center gap-2.5">
          <Logo className="w-8 h-8 flex-shrink-0" />
          <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
            TechForge
          </span>
        </div>

        {/* Navigation Middle Links */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium transition-colors">
            Features
          </a>
          <a href="#testimonials" className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium transition-colors">
            Testimonials
          </a>
        </div>

        <div className="flex items-center gap-4">
          {/* Theme Toggle icon */}
          <button
            onClick={toggleTheme}
            className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-all"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4.5 h-4.5 text-blue-400" />
            ) : (
              <Moon className="w-4.5 h-4.5 text-slate-600" />
            )}
          </button>

          {user ? (
            <Link
              to="/dashboard"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 text-white font-semibold transition-all border border-blue-500/30 flex items-center gap-1 text-xs shadow-md shadow-blue-500/10"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors text-xs font-semibold px-2">
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/15"
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
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-bold text-blue-600 dark:text-blue-300 uppercase tracking-wider">
              ✨ Next-Gen AI Engine
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight text-slate-900 dark:text-white leading-none">
              Nail Your Tech Interviews with{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-sky-500 to-cyan-500 dark:from-blue-400 dark:via-sky-400 dark:to-cyan-400">
                TechForge
              </span>
            </h1>
            <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 font-light leading-relaxed max-w-xl">
              The ultimate AI-powered preparation platform. Generate tailor-made questions, record speech-to-text answers, analyze your resume for ATS optimization, and master DSA tracking in one single premium platform.
            </p>

            <div className="flex flex-row items-center gap-4 pt-2">
              <Link
                to={user ? '/dashboard' : '/signup'}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 font-bold shadow-lg shadow-blue-500/25 transition-all text-xs text-white flex items-center gap-1.5 hover:shadow-blue-500/40"
              >
                Start Free Trial <ChevronRight className="w-4 h-4" />
              </Link>
              <Link
                to={user ? '/dashboard' : '/login'}
                className="px-6 py-3.5 rounded-xl bg-slate-100 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 hover:bg-slate-200 dark:hover:bg-slate-850/40 font-bold transition-all text-xs text-slate-600 dark:text-slate-350 flex items-center justify-center"
              >
                Try Demo Interview
              </Link>
            </div>
          </div>

          {/* Right Terminal Mockup — stays dark always (design element) */}
          <div className="lg:col-span-5 relative mt-8 lg:mt-0">
            <div className="absolute inset-0 bg-blue-600/5 blur-3xl rounded-3xl pointer-events-none"></div>
            
            {/* Floating Mockup Container containing both Card & Badge */}
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative"
            >
              {/* Gradient Border Wrapper */}
              <div className="p-[2.5px] rounded-2xl bg-gradient-to-tr from-[#3b82f6] via-[#06b6d4] to-[#7c3aed] animate-border-flow relative shadow-2xl">
                {/* Terminal Card */}
                <div className="bg-[#0E131F]/90 backdrop-blur-2xl p-5 rounded-[14px] relative overflow-hidden font-mono text-left leading-relaxed">
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
                      <p className="text-[#a78bfa] flex items-center gap-1.5">★ ATS Score computed: 88%</p>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-[#06B6D4] font-medium">$ start mock-interview --role "Frontend"</p>
                      <p className="text-[#F59E0B] flex items-center gap-1.5">
                        <span>🤖</span>
                        <span>Question: What is the React Event Loop?</span>
                      </p>
                      <p className="text-slate-400 flex items-center gap-1.5">
                        <span>🎤</span>
                        <span>Recording user voice answer...</span>
                      </p>
                    </div>

                    <div className="pt-3 border-t border-white/5 text-[11px] text-sky-400/50">
                      // Platform loading completed. Ready to deploy!
                    </div>
                  </div>
                </div>
              </div>

              {/* Overlapping ATS success rate badge */}
              <div className="absolute -bottom-8 -left-8 bg-white dark:bg-[#0E131F]/90 backdrop-blur-xl border border-slate-200 dark:border-white/20 px-5.5 py-4.5 rounded-2xl flex items-center gap-3.5 shadow-2xl z-20">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20">
                  <Cpu className="w-5.5 h-5.5" />
                </div>
                <div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-450 font-medium">ATS Success Rate</p>
                  <p className="text-sm font-extrabold text-slate-900 dark:text-white">+42% Higher</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-24 border-t border-slate-200/60 dark:border-white/5 relative z-10">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Engineered for{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-sky-500 to-cyan-500 dark:from-blue-400 dark:via-sky-400 dark:to-cyan-400">
              Interview Mastery
            </span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto font-light text-sm leading-relaxed">
            Everything you need to transform your technical preparation from unstructured cramming to a data-backed career booster.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="glass-card p-6 relative overflow-hidden flex flex-col justify-between min-h-[180px]">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-500 dark:text-blue-400 flex items-center justify-center mb-5 border border-blue-500/10">
              <Terminal className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">AI Question Generator</h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed font-light">
                Get highly tailored technical interview questions based on role, stack, and difficulty level.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="glass-card p-6 relative overflow-hidden flex flex-col justify-between min-h-[180px]">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-500 dark:text-blue-400 flex items-center justify-center mb-5 border border-blue-500/10">
              <Mic className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Speech-to-Text Answers</h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed font-light">
                Answer questions naturally using Web Speech recognition. Practice oral clarity.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="glass-card p-6 relative overflow-hidden flex flex-col justify-between min-h-[180px]">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-500 dark:text-blue-400 flex items-center justify-center mb-5 border border-blue-500/10">
              <Shield className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">ATS Resume Reviewer</h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed font-light">
                Upload your PDF resume to receive ATS scores, skill extractions, and actionable optimization feedback.
              </p>
            </div>
          </div>

          {/* Card 4 */}
          <div className="glass-card p-6 relative overflow-hidden flex flex-col justify-between min-h-[180px]">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-500 dark:text-blue-400 flex items-center justify-center mb-5 border border-blue-500/10">
              <BarChart3 className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Granular AI Evaluation</h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed font-light">
                Get precise scores, communication review, technical feedback, and suggestions for improvement.
              </p>
            </div>
          </div>

          {/* Card 5 */}
          <div className="glass-card p-6 relative overflow-hidden flex flex-col justify-between min-h-[180px]">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-500 dark:text-blue-400 flex items-center justify-center mb-5 border border-blue-500/10">
              <Code2 className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">DSA Practice Sheets</h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed font-light">
                Track Arrays, Strings, Linked Lists, Trees, and Graphs completion percentages in real-time.
              </p>
            </div>
          </div>

          {/* Card 6 */}
          <div className="glass-card p-6 relative overflow-hidden flex flex-col justify-between min-h-[180px]">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-500 dark:text-blue-400 flex items-center justify-center mb-5 border border-blue-500/10">
              <Brain className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">AI Chatbot Assistant</h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed font-light">
                Interact with an intelligent, conversational agent to clarify computer science concepts on the fly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="max-w-7xl mx-auto px-6 py-24 border-t border-slate-200/60 dark:border-white/5 relative z-10">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Success Stories from{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-sky-500 to-cyan-500 dark:from-blue-400 dark:via-sky-400 dark:to-cyan-400">
              Real Students
            </span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto font-light text-sm leading-relaxed">
            Hundreds of software development students and professionals have landed roles using TechForge.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Rohan Testimonial */}
          <div className="glass-card p-6 relative overflow-hidden flex flex-col justify-between min-h-[220px]">
            <div>
              {/* Stars */}
              <div className="flex items-center gap-1.5 mb-4 text-[#F59E0B]">
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
              </div>
              <p className="text-slate-500 dark:text-slate-350 text-xs leading-relaxed font-light italic">
                "The speech recognition is highly accurate. Talking aloud while answering technical questions boosted my confidence before the final rounds."
              </p>
            </div>
            
            <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-200 dark:border-white/5">
              <div className="w-9 h-9 rounded-full bg-blue-500/20 text-blue-500 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
                RS
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Rohan Sharma</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500">Frontend Engineer @ Google</p>
              </div>
            </div>
          </div>

          {/* Aishwarya Testimonial */}
          <div className="glass-card p-6 relative overflow-hidden flex flex-col justify-between min-h-[220px]">
            <div>
              {/* Stars */}
              <div className="flex items-center gap-1.5 mb-4 text-[#F59E0B]">
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
              </div>
              <p className="text-slate-500 dark:text-slate-350 text-xs leading-relaxed font-light italic">
                "The resume ATS analyzer gave me concrete pointers. I updated my key experience sections and got shortlists within 2 weeks!"
              </p>
            </div>
            
            <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-200 dark:border-white/5">
              <div className="w-9 h-9 rounded-full bg-cyan-500/20 text-cyan-500 dark:text-cyan-400 flex items-center justify-center font-bold text-xs">
                AP
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Aishwarya Patel</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500">Full Stack Dev @ Cred</p>
              </div>
            </div>
          </div>

          {/* Michael Testimonial */}
          <div className="glass-card p-6 relative overflow-hidden flex flex-col justify-between min-h-[220px]">
            <div>
              {/* Stars */}
              <div className="flex items-center gap-1.5 mb-4 text-[#F59E0B]">
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
              </div>
              <p className="text-slate-500 dark:text-slate-350 text-xs leading-relaxed font-light italic">
                "Saved questions and the DSA sheets are extremely handy. I could trace my progress and focus on weaker topics like Graphs and Trees."
              </p>
            </div>
            
            <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-200 dark:border-white/5">
              <div className="w-9 h-9 rounded-full bg-[#06B6D4]/20 text-[#06B6D4] flex items-center justify-center font-bold text-xs">
                MC
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Michael Chen</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500">Java Developer @ Amazon</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-6 py-24 border-t border-slate-200/60 dark:border-white/5 relative z-10">
        <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white text-center tracking-tight mb-16">Frequently Asked Questions</h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="glass-panel overflow-hidden transition-all duration-300 rounded-2xl"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full text-left px-6 py-5 flex items-center justify-between font-bold text-sm md:text-base text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${
                    activeFaq === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {activeFaq === index && (
                <div className="px-6 pb-5 pt-1 text-slate-500 dark:text-slate-450 leading-relaxed text-xs font-light">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Ready to Accelerate Your Prep? CTA section */}
      <section className="max-w-7xl mx-auto px-6 py-24 relative z-10 border-t border-slate-200/60 dark:border-white/5">
        <div className="glass-panel p-10 sm:p-14 bg-gradient-to-r from-slate-50 via-blue-50/30 to-slate-50 dark:from-card-dark dark:via-blue-950/20 dark:to-card-dark border-slate-200/60 dark:border-white/10 rounded-3xl relative overflow-hidden text-center max-w-4xl mx-auto">
          {/* Subtle glow backdrop overlay */}
          <div className="absolute top-0 left-0 w-full h-full bg-blue-600/5 blur-3xl pointer-events-none"></div>
          
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-4 leading-tight">
            Ready to Accelerate Your Prep?
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-light max-w-md mx-auto mb-8 leading-relaxed">
            Create an account in minutes and get access to custom mock interviews, live voice evaluation, and ATS feedback.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={user ? '/dashboard' : '/signup'}
              className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 text-white font-bold transition-all text-xs shadow-lg shadow-blue-500/15"
            >
              Get Started for Free
            </Link>
            <Link
              to={user ? '/dashboard' : '/login'}
              className="w-full sm:w-auto px-7 py-3 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-white font-bold transition-all text-xs"
            >
              Login to Account
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200/30 dark:border-white/5 bg-slate-50/50 dark:bg-[#080d19]/80 relative z-10 pt-12 pb-6 text-slate-500 dark:text-slate-400 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-8 pb-8">
          {/* Column 1: Brand & Tagline & Socials */}
          <div className="md:col-span-6 space-y-3.5 text-left">
            <div className="flex items-center gap-2">
              <Logo className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">TechForge</span>
            </div>
            <p className="text-xs text-slate-450 dark:text-slate-500 leading-relaxed font-light max-w-sm">
              AI-powered interview intelligence for modern developers.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-2.5 pt-1">
              <a 
                href="https://github.com/Dev0ps404/TechForge" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-all duration-200"
                aria-label="GitHub"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.11.82-.26.82-.577v-2.234c-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.82 1.102.82 2.222v3.293c0 .319.22.694.825.576C20.565 21.795 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-all duration-200"
                aria-label="LinkedIn"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.23 0H1.77C.8 0 0 .77 0 1.72v20.56C0 23.23.8 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.2 0 22.23 0zM7.12 20.45H3.56V9h3.56v11.45zM5.34 7.43c-1.14 0-2.06-.92-2.06-2.06 0-1.14.92-2.06 2.06-2.06 1.14 0 2.06.92 2.06 2.06 0 1.14-.92 2.06-2.06 2.06zm15.11 13.02h-3.56v-5.6c0-1.34-.03-3.05-1.86-3.05-1.86 0-2.14 1.45-2.14 2.95v5.7h-3.56V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29z" />
                </svg>
              </a>
              <a 
                href="https://x.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-all duration-200"
                aria-label="X (Twitter)"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Product */}
          <div className="md:col-span-3 space-y-3.5 text-left">
            <h4 className="text-[11px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Product</h4>
            <ul className="space-y-2.5 text-xs font-light">
              <li>
                <a href="#features" className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors duration-200">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors duration-200">
                  Pricing
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div className="md:col-span-3 space-y-3.5 text-left">
            <h4 className="text-[11px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Company</h4>
            <ul className="space-y-2.5 text-xs font-light">
              <li>
                <a href="#" className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors duration-200">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors duration-200">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors duration-200">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider & Copyright */}
        <div className="max-w-7xl mx-auto px-6 pt-6 border-t border-slate-200/30 dark:border-white/5 flex flex-col items-center justify-center text-center">
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-light">
            © 2025 TechForge. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

