import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
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
      <div className="auth-bg-dots"></div>
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
                <div className="auth-logo-box">
                  <Logo className="w-5 h-5 text-white" />
                </div>
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
                Enter your details or continue with social provider profiles.
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
                    placeholder="name@company.com"
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
                    placeholder="••••••••"
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
                        <span>Sign In</span>
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
                      theme="filled_blue"
                      shape="rectangular"
                      width="384"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleMockGoogleLogin}
                    disabled={loading}
                    className="auth-social-btn"
                  >
                    <svg className="social-icon-svg" viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                    </svg>
                    <span>Mock Google Account</span>
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
