import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Cpu,
  Video,
  FileText,
  Code,
  CheckCircle,
  MessageSquare,
  Trophy,
  ChevronRight,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Landing = () => {
  const { user } = useAuth();
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const features = [
    {
      icon: Cpu,
      title: 'AI Question Generation',
      description: 'Instantly generate role-specific questions for MERN, Java, Python, System Design, and behavioral criteria.',
    },
    {
      icon: Video,
      title: 'Video Mock Interviews',
      description: 'Practice with a live camera overlay and timer. Record and transcribe your answers in real time.',
    },
    {
      icon: FileText,
      title: 'ATS Resume Scanners',
      description: 'Upload your PDF resume to receive ATS scores, missing keywords detection, and optimization advice.',
    },
    {
      icon: Code,
      title: 'DSA Practice & Tracking',
      description: 'Maintain study streaks across 13 major computer science concepts. Track completion rates visually.',
    },
    {
      icon: MessageSquare,
      title: 'AI Career Mentor',
      description: 'Engage with our career chatbot for placement tips, salary talks, code reviews, and resume updates.',
    },
    {
      icon: Trophy,
      title: 'Rankings Leaderboard',
      description: 'Earn platform points by completing mocks and challenges. Compare progress against global candidate logs.',
    },
  ];

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
      a: 'When you mark a data structure or algorithm problem as completed in the DSA Practice dashboard, you earn points and trigger consecutive streak counters. Missing challenges for more than 48 hours resets your active study streak.',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="min-h-screen bg-[#0B1220] text-slate-100 selection:bg-indigo-500 selection:text-white overflow-hidden relative">
      {/* Mesh/Grid Background */}
      <div className="absolute inset-0 grid-bg-dark opacity-40 pointer-events-none"></div>

      {/* Decorative Glow Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[50%] rounded-full bg-indigo-500/10 blur-[130px] animate-glow-1"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[50%] rounded-full bg-cyan-500/10 blur-[130px] animate-glow-2"></div>

      {/* Header navbar */}
      <nav className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between border-b border-white/5 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="font-black text-white text-lg">T</span>
          </div>
          <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            TalentForge
          </span>
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <Link
              to="/dashboard"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-550 text-white font-semibold transition-all border border-indigo-500/30 flex items-center gap-1.5 shadow-[0_0_20px_rgba(99,102,241,0.2)]"
            >
              Go to Dashboard <ChevronRight className="w-4 h-4" />
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-slate-400 hover:text-white font-medium transition-colors text-sm">
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-5 py-2.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-bold transition-all text-sm shadow-md"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-24 pb-28 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-300">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" /> AI-Powered Interview Prep
          </div>
          <h1 className="text-5xl md:text-8xl font-black tracking-tight max-w-4xl mx-auto leading-none text-white">
            Ace Your Next Tech Interview with{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">AI Mentorship</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
            Generate custom mock interviews, get instant grading on verbal answers, audit your resume against ATS systems, and trace your DSA progress.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to={user ? '/dashboard' : '/signup'}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 font-bold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all flex items-center justify-center gap-2 text-sm text-white"
            >
              Start Free Trial <ChevronRight className="w-4 h-4" />
            </Link>
            <a
              href="#features"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 font-bold transition-all flex items-center justify-center text-sm"
            >
              Explore Features
            </a>
          </div>
        </motion.div>

        {/* Dashboard Mockup Preview */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mt-20 rounded-3xl border border-white/5 bg-slate-900/40 p-2.5 backdrop-blur-xl shadow-2xl relative max-w-5xl mx-auto"
        >
          <div className="absolute inset-0 bg-indigo-500/5 blur-3xl rounded-3xl pointer-events-none"></div>
          <img
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80"
            alt="TalentForge Dashboard Mockup"
            className="w-full h-auto rounded-2xl border border-white/5 shadow-inner"
          />
        </motion.div>
      </section>

      {/* Features Grid */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-28 border-t border-white/5 relative z-10">
        <div className="text-center space-y-4 mb-20">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">Unmatched AI Prep Features</h2>
          <p className="text-slate-400 max-w-xl mx-auto font-light text-sm">
            Everything you need to build confidence and excel in technical and behavioral interviews.
          </p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feat, index) => (
            <motion.div
              key={feat.title}
              variants={itemVariants}
              className="glass-card p-8 bg-card-dark/40 hover:bg-card-dark/70 hover:border-indigo-500/30 group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-500/5 to-transparent blur-xl pointer-events-none"></div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300 mb-6">
                <feat.icon className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold mb-3 text-white">{feat.title}</h3>
              <p className="text-slate-400 text-xs leading-relaxed font-light">{feat.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Pricing Section */}
      <section className="max-w-7xl mx-auto px-6 py-28 border-t border-white/5 relative z-10">
        <div className="text-center space-y-4 mb-20">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">Simple, Transparent Pricing</h2>
          <p className="text-slate-400 max-w-xl mx-auto font-light text-sm">
            Choose a timeline that works for you. Get started in minutes.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Free Tier */}
          <div className="glass-panel p-8 bg-card-dark/20 border-white/5 flex flex-col justify-between hover:border-white/10 transition-all rounded-2xl">
            <div>
              <h3 className="text-sm font-semibold tracking-wider uppercase text-slate-400">Basic Tier</h3>
              <div className="flex items-baseline gap-1 mt-5">
                <span className="text-4xl font-black text-white">$0</span>
                <span className="text-slate-500 text-xs font-semibold">/ month</span>
              </div>
              <p className="text-slate-400 text-xs font-light mt-3">Great for exploring the platform features.</p>
              <ul className="mt-8 space-y-4 text-xs font-light text-slate-300">
                <li className="flex items-center gap-2.5"><CheckCircle className="w-4 h-4 text-indigo-400" /> 3 AI Mock Mocks</li>
                <li className="flex items-center gap-2.5"><CheckCircle className="w-4 h-4 text-indigo-400" /> 5 ATS Resume Scans</li>
                <li className="flex items-center gap-2.5"><CheckCircle className="w-4 h-4 text-indigo-400" /> Basic DSA trackers</li>
                <li className="flex items-center gap-2.5"><CheckCircle className="w-4 h-4 text-indigo-400" /> Limited Chat Advisor</li>
              </ul>
            </div>
            <Link
              to="/signup"
              className="mt-8 w-full py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold transition-all text-center text-xs block"
            >
              Sign Up Free
            </Link>
          </div>

          {/* Premium Tier */}
          <div className="glass-panel p-8 bg-card-dark/60 border-2 border-indigo-500 flex flex-col justify-between relative shadow-indigo-500/10 shadow-2xl rounded-2xl">
            <div className="absolute top-0 right-6 -translate-y-1/2 px-3 py-1 rounded-full bg-indigo-500 text-white text-[10px] font-bold uppercase tracking-wider">
              Most Popular
            </div>
            <div>
              <h3 className="text-sm font-semibold tracking-wider uppercase text-indigo-300">Premium Pro</h3>
              <div className="flex items-baseline gap-1 mt-5">
                <span className="text-4xl font-black text-white">$19</span>
                <span className="text-slate-500 text-xs font-semibold">/ month</span>
              </div>
              <p className="text-slate-400 text-xs font-light mt-3">Perfect for active job seekers.</p>
              <ul className="mt-8 space-y-4 text-xs font-light text-slate-200">
                <li className="flex items-center gap-2.5"><CheckCircle className="w-4 h-4 text-indigo-400" /> Unlimited AI Mock Mocks</li>
                <li className="flex items-center gap-2.5"><CheckCircle className="w-4 h-4 text-indigo-400" /> Unlimited ATS Resume Scans</li>
                <li className="flex items-center gap-2.5"><CheckCircle className="w-4 h-4 text-indigo-400" /> Speech-to-text Transcription</li>
                <li className="flex items-center gap-2.5"><CheckCircle className="w-4 h-4 text-indigo-400" /> Full DSA Streak & Leaderboards</li>
                <li className="flex items-center gap-2.5"><CheckCircle className="w-4 h-4 text-indigo-400" /> Unlimited AI Chat Advisor</li>
              </ul>
            </div>
            <Link
              to="/signup"
              className="mt-8 w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-bold transition-all text-center text-xs block shadow-md shadow-indigo-500/20"
            >
              Get Premium Access
            </Link>
          </div>

          {/* Enterprise Tier */}
          <div className="glass-panel p-8 bg-card-dark/20 border-white/5 flex flex-col justify-between hover:border-white/10 transition-all rounded-2xl">
            <div>
              <h3 className="text-sm font-semibold tracking-wider uppercase text-slate-400">Institutional</h3>
              <div className="flex items-baseline gap-1 mt-5">
                <span className="text-4xl font-black text-white">$79</span>
                <span className="text-slate-500 text-xs font-semibold">/ month</span>
              </div>
              <p className="text-slate-400 text-xs font-light mt-3">Designed for colleges and bootcamps.</p>
              <ul className="mt-8 space-y-4 text-xs font-light text-slate-300">
                <li className="flex items-center gap-2.5"><CheckCircle className="w-4 h-4 text-indigo-400" /> Up to 50 active students</li>
                <li className="flex items-center gap-2.5"><CheckCircle className="w-4 h-4 text-indigo-400" /> Custom Admin reports panel</li>
                <li className="flex items-center gap-2.5"><CheckCircle className="w-4 h-4 text-indigo-400" /> API key integration options</li>
                <li className="flex items-center gap-2.5"><CheckCircle className="w-4 h-4 text-indigo-400" /> 24/7 dedicated support</li>
              </ul>
            </div>
            <Link
              to="/signup"
              className="mt-8 w-full py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold transition-all text-center text-xs block"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-6 py-28 border-t border-white/5 relative z-10">
        <h2 className="text-3xl md:text-5xl font-extrabold text-white text-center tracking-tight mb-20">Frequently Asked Questions</h2>

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
                <div className="px-6 pb-5 pt-1 text-slate-400 leading-relaxed text-xs font-light">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Footer */}
      <section className="max-w-7xl mx-auto px-6 py-24 text-center relative z-10 border-t border-white/5">
        <div className="glass-panel p-12 bg-card-dark/40 border-white/5 max-w-4xl mx-auto relative overflow-hidden rounded-3xl">
          <div className="absolute top-0 left-0 w-full h-full bg-indigo-500/5 blur-3xl pointer-events-none"></div>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
            Ready to Forge Your Career?
          </h2>
          <p className="text-slate-450 max-w-md mx-auto mb-8 font-light text-sm leading-relaxed">
            Create an account today and experience how our AI evaluations help you stand out. No credit card required.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-550 text-white font-bold transition-all shadow-lg shadow-indigo-650/20"
          >
            Get Started For Free <ChevronRight className="w-4.5 h-4.5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-12 text-center border-t border-white/5 text-slate-500 text-xs font-light relative z-10">
        <p>© {new Date().getFullYear()} TalentForge Inc. All rights reserved. Google and OpenAI are trademarks of their respective owners.</p>
      </footer>
    </div>
  );
};

export default Landing;
