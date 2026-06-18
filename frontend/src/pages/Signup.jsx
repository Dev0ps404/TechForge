import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import BackgroundParticles from '../components/BackgroundParticles';
import { GoogleLogin } from '@react-oauth/google';
import { User, Mail, Lock, ArrowRight, AlertCircle, Loader2, Sparkles, Eye, EyeOff, Trophy } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import './Auth.css';

const Signup = () => {
  const { register, googleLogin, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('token', token);
      setLoading(true);
      refreshProfile().then(() => {
        setLoading(false);
        toast.success('Logged in successfully via Google!');
        navigate('/dashboard');
      }).catch(err => {
        setLoading(false);
        toast.error('Google login sync failed.');
      });
    }
  }, [navigate, refreshProfile]);

  const handleGoogleRedirectLogin = () => {
    const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const targetUrl = backendUrl.replace(/\/+$/, '') + '/auth/google';
    window.location.href = targetUrl;
  };

  const handleEmailSignup = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    setError('');
    setLoading(true);

    const success = await register(name, email, password);
    setLoading(false);
    if (success) {
      navigate('/dashboard');
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    if (!credentialResponse.credential) {
      toast.error('Google Sign-Up failed: no credential returned');
      return;
    }
    setLoading(true);
    const success = await googleLogin(credentialResponse.credential);
    setLoading(false);
    if (success) {
      navigate('/dashboard');
    }
  };

  const handleMockGoogleSignup = async () => {
    setLoading(true);
    toast.loading('Registering with simulated Google OAuth credentials...');
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
              <h2 className="auth-card-title">Create Account</h2>
              <p className="auth-card-subtitle">
                Get started for free. Start your engineering streak.
              </p>
            </div>
 
            {/* Form */}
            <form onSubmit={handleEmailSignup}>
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
 
                {/* Full Name */}
                <motion.div className="auth-input-wrapper" variants={itemVariants}>
                  <span className="auth-input-icon-left">
                    <User />
                  </span>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="auth-input-field"
                    required
                    disabled={loading}
                  />
                </motion.div>
 
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
 
                {/* Terms and conditions */}
                <motion.div className="auth-control-row" variants={itemVariants}>
                  <label className="remember-checkbox">
                    <input 
                      type="checkbox" 
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      required
                      disabled={loading} 
                    />
                    <span className="custom-checkbox"></span>
                    <span className="checkbox-lbl">I agree to the Terms & Privacy Policy</span>
                  </label>
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
                        <span>Create Account</span>
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
                  <button
                    type="button"
                    onClick={handleGoogleRedirectLogin}
                    disabled={loading}
                    className="auth-social-btn flex-grow justify-center"
                  >
                    <svg className="social-icon-svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    <span>Google OAuth</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleMockGoogleSignup}
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
              <span>Already have an account?</span>
              <Link to="/login" className="auth-switch-link">
                Sign In
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
              &ldquo;Scale your preparation streak.&rdquo;
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
              <Trophy />
            </div>
            <div className="auth-stat-info">
              <span className="auth-stat-lbl">DAILY CHALLENGES COMPLETED</span>
              <div className="auth-stat-val-flex">
                <span className="auth-stat-val">34,200+</span>
                <span className="auth-stat-change">+18%</span>
              </div>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
};

export default Signup;
