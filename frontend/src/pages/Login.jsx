import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import BackgroundParticles from '../components/BackgroundParticles';
import { GoogleLogin } from '@react-oauth/google';
import { Mail, Lock, ArrowRight, AlertCircle, Loader2, Sparkles, Eye, EyeOff, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import './Auth.css';

const Login = () => {
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setError('');
    setLoading(true);
    
    const success = await login(email, password);
    setLoading(false);
    if (success) {
      navigate('/dashboard');
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    if (!credentialResponse.credential) {
      toast.error('Google login failed: no credential returned');
      return;
    }
    
    setLoading(true);
    const success = await googleLogin(credentialResponse.credential);
    setLoading(false);
    if (success) {
      navigate('/dashboard');
    }
  };

  const handleMockGoogleLogin = async () => {
    setLoading(true);
    toast.loading('Logging in with simulated Google credentials...');
    setTimeout(async () => {
      toast.dismiss();
      const mockCredential = 'mock_token_' + Math.random().toString(36).substring(7);
      const success = await googleLogin(mockCredential);
      setLoading(false);
      if (success) {
        navigate('/dashboard');
      }
    }, 1200);
  };

  // Framer Motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.06, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 260, damping: 20 }
    }
  };

  return (
    <div className="auth-portal-container">
      {/* Decorative Dark SaaS Background */}
      <div className="auth-bg-grid"></div>
      <BackgroundParticles />
      <div className="auth-bg-noise"></div>
      <div className="auth-glow-blob auth-glow-1"></div>
      <div className="auth-glow-blob auth-glow-2"></div>

      <div className="auth-split-layout">
        {/* ==========================================
            Left Side: Centered Card Form Panel
            ========================================== */}
        <section className="auth-form-panel">
          <motion.div 
            className="auth-card-wrapper"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* Header */}
            <header className="auth-card-header">
              <Link to="/" className="auth-logo-group">
                <Logo className="w-8 h-8 flex-shrink-0" />
                <span className="auth-logo-text">
                  Tech<span className="auth-logo-accent">Forge</span>
                </span>
              </Link>
              <button 
                type="button" 
                className="auth-help-link"
                onClick={() => toast('Support portal link can be requested via email.')}
              >
                NEED HELP?
              </button>
            </header>

            {/* Intro */}
            <div className="auth-form-intro">
              <h2 className="auth-card-title">Welcome Back!</h2>
              <p className="auth-card-subtitle">
                Continue your journey toward technical mastery.
              </p>
            </div>
 
            {/* Form */}
            <form onSubmit={handleEmailLogin}>
              <motion.div 
                className="auth-inputs-stack"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {error && (
                  <motion.div className="auth-error-box" variants={itemVariants}>
                    <AlertCircle className="w-4 h-4" />
                    <span>{error}</span>
                  </motion.div>
                )}
 
                {/* Email Address */}
                <motion.div className="auth-input-wrapper" variants={itemVariants}>
                  <span className="auth-input-icon-left">
                    <Mail />
                  </span>
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="auth-input-field"
                    required
                    disabled={loading}
                  />
                </motion.div>
 
                {/* Password Input */}
                <motion.div className="auth-input-wrapper" variants={itemVariants}>
                  <span className="auth-input-icon-left">
                    <Lock />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="auth-input-field"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="auth-password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </motion.div>
 
                {/* Options Controls */}
                <motion.div className="auth-control-row" variants={itemVariants}>
                  <label className="remember-checkbox">
                    <input type="checkbox" disabled={loading} />
                    <span className="custom-checkbox"></span>
                    <span className="checkbox-lbl">Remember Me</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => toast('Account recovery links can be requested via email support.')}
                    className="auth-forgot-btn"
                  >
                    Forgot Password?
                  </button>
                </motion.div>
 
                {/* Submit Action */}
                <motion.div variants={itemVariants}>
                  <button
                    type="submit"
                    className="auth-submit-btn"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="auth-spinner"></span>
                    ) : (
                      <>
                        <span>Log In</span>
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </motion.div>
 
                {/* Social Divider */}
                <motion.div className="auth-social-divider" variants={itemVariants}>
                  <span className="auth-social-divider-text">OR CONTINUE WITH</span>
                </motion.div>
 
                {/* Social Buttons */}
                <motion.div className="auth-social-row" variants={itemVariants}>
                  <div className="auth-social-btn-inner-google">
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={() => {
                        toast.error('Google Sign-In failed');
                      }}
                      theme="outline"
                      shape="rectangular"
                      width="200"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleMockGoogleLogin}
                    disabled={loading}
                    className="auth-social-btn"
                  >
                    <svg className="social-icon-svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.22.67-2.94 1.51-.64.74-1.2 1.88-1.05 3 .16.03.32.05.49.05.88 0 2.05-.58 2.51-1.5z"/>
                    </svg>
                    <span>iOS Apple</span>
                  </button>
                </motion.div>
              </motion.div>
            </form>

            {/* Toggle View Switch */}
            <div className="auth-switch-footer">
              <span>Don't have an account?</span>
              <Link to="/signup" className="auth-switch-link">
                Create Account
              </Link>
            </div>

            {/* Legal */}
            <footer className="auth-legal-footer">
              <span>&copy; 2026 TECHFORGE.</span>
              <div className="auth-legal-links">
                <a href="#" onClick={() => toast('Opening Privacy Policy...')}>PRIVACY</a>
                <a href="#" onClick={() => toast('Opening Terms of Service...')}>TERMS</a>
              </div>
            </footer>
          </motion.div>
        </section>

        {/* ==========================================
            Right Side: Showcase View Display
            ========================================== */}
        <section className="auth-showcase-panel">
          <div className="auth-showcase-grid"></div>

          <div className="auth-showcase-art">
            <div className="auth-art-orb"></div>
            <div className="auth-art-orb-secondary"></div>
          </div>

          {/* Floating Glass Quote Card */}
          <motion.div 
            className="auth-glass-card"
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="auth-card-accent-line"></div>
            <blockquote className="auth-showcase-quote">
              &ldquo;Empowering your technical growth.&rdquo;
            </blockquote>
            <div className="auth-user-proof">
              <div className="auth-avatar-stack">
                <div className="auth-avatar-circle auth-av-1">JD</div>
                <div className="auth-avatar-circle auth-av-2">MI</div>
                <div className="auth-avatar-circle auth-av-3">+12k</div>
              </div>
              <span className="auth-proof-text">JOIN 12,000+ USERS TODAY</span>
            </div>
          </motion.div>

          {/* Floating Glass Stats card */}
          <motion.div 
            className="auth-glass-stats-card"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          >
            <div className="auth-stat-icon-box">
              <TrendingUp />
            </div>
            <div className="auth-stat-info">
              <span className="auth-stat-lbl">PLACEMENT RATE</span>
              <div className="auth-stat-val-flex">
                <span className="auth-stat-val">94.8%</span>
                <span className="auth-stat-change">+12%</span>
              </div>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
};

export default Login;
