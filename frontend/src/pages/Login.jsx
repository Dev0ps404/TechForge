import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import { GoogleLogin } from '@react-oauth/google';
import { Mail, Lock, ArrowRight, AlertCircle, Loader2, Sparkles, Code2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

  return (
    <div className="min-h-screen grid lg:grid-cols-12 bg-white dark:bg-bg-dark text-slate-800 dark:text-slate-100 transition-colors duration-300">
      
      {/* Left Pane: Login Form */}
      <div className="lg:col-span-5 flex flex-col justify-between p-8 sm:p-12 relative z-10 bg-white dark:bg-bg-dark-sec/20">
        
        {/* Brand Banner */}
        <div className="mb-8 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <Logo className="w-9 h-9 flex-shrink-0" />
            <span className="text-lg font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-350">
              TalentForge
            </span>
          </Link>
        </div>

        {/* Center Card */}
        <div className="w-full max-w-sm mx-auto my-auto py-8">
          <div className="space-y-2 mb-8">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Welcome back
            </h2>
            <p className="text-xs text-slate-405 dark:text-text-secondary-dark font-light">
              Enter your details or continue with social provider profiles.
            </p>
          </div>

          <div className="space-y-6">
            {error && (
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Email Form */}
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-dark-400" />
                  <input
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-bg-dark/40 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Password</label>
                  <button
                    type="button"
                    onClick={() => toast('Standard account password resets can be requested via email support.')}
                    className="text-[10px] font-semibold text-indigo-500 hover:underline"
                  >
                    Forgot?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-dark-400" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-bg-dark/40 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-indigo-650 hover:bg-indigo-600 text-white font-bold transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 text-xs"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Sign In <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative flex items-center justify-center my-4">
              <div className="absolute w-full border-t border-slate-200/60 dark:border-white/5"></div>
              <span className="relative z-10 px-3 text-[10px] bg-white dark:bg-bg-dark text-slate-400 dark:text-dark-400 font-bold uppercase tracking-widest">
                Or Continue With
              </span>
            </div>

            {/* Social / Google Buttons */}
            <div className="space-y-2.5">
              <div className="w-full flex justify-center">
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
                onClick={handleMockGoogleLogin}
                disabled={loading}
                className="flex items-center justify-center gap-2 py-2.5 rounded-lg border border-slate-200 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors font-semibold text-xs text-slate-700 dark:text-slate-300 w-full"
              >
                <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                </svg>
                Mock Google Account
              </button>
            </div>
          </div>
        </div>

        {/* Redirect Footer */}
        <p className="text-center text-xs text-slate-500 dark:text-slate-400 font-light">
          Don't have an account?{' '}
          <Link to="/signup" className="font-semibold text-indigo-500 hover:underline">
            Create account
          </Link>
        </p>
      </div>

      {/* Right Pane: Illustration / Dashboard Mockup Preview */}
      <div className="hidden lg:col-span-7 lg:flex flex-col justify-center items-center p-12 bg-slate-100 dark:bg-slate-950 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-cyan-500/10 blur-[100px] pointer-events-none"></div>
        
        {/* Grid Overlay */}
        <div className="absolute inset-0 grid-bg-light dark:grid-bg-dark opacity-10 pointer-events-none"></div>

        <div className="relative z-10 w-full max-w-lg space-y-8 text-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/10 dark:bg-indigo-500/15 border border-blue-500/20 dark:border-indigo-500/30 text-[10px] font-bold text-blue-600 dark:text-indigo-300 uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-blue-500 dark:text-indigo-400" /> Premium Career Platform
            </div>
            <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Acing mock interviews has never been easier.
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-light max-w-md mx-auto leading-relaxed">
              Get real-time feedback on your speech delivery, resume structure, and data structure solutions instantly.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-white/5 bg-white/60 dark:bg-slate-900/60 p-2 backdrop-blur-xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-3 left-3 flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/60"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/60"></div>
            </div>
            <img
              src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80"
              alt="TalentForge App Preview"
              className="w-full h-auto rounded-xl border border-white/5 opacity-80"
            />
          </div>

          <div className="flex items-center justify-center gap-6 text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            <span className="flex items-center gap-1"><Code2 className="w-3.5 h-3.5" /> 13+ DSA Topics</span>
            <span>•</span>
            <span>ATS Resume Scan</span>
            <span>•</span>
            <span>AI Feedback</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
