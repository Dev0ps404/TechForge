import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from 'react-hot-toast';

// Layout Components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

// Page Components
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ResumeAnalysis from './pages/ResumeAnalysis';
import QuestionGenerator from './pages/QuestionGenerator';
import MockInterview from './pages/MockInterview';
import Evaluation from './pages/Evaluation';
import DsaPractice from './pages/DsaPractice';
import ChatAssistant from './pages/ChatAssistant';
import Leaderboard from './pages/Leaderboard';
import DailyChallenge from './pages/DailyChallenge';
import Analytics from './pages/Analytics';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';

// Guard for Protected Routes
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-dark-950">
        <div className="w-8 h-8 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Main Layout Wrapper
const AppLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Exclude landing and authentication pages from sidebar layout
  const isAuthRoute = ['/', '/login', '/signup'].includes(location.pathname);

  if (isAuthRoute) {
    return children;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-dark-950 transition-colors duration-300">
      <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1 relative">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 p-4 md:p-6 lg:pl-68 w-full overflow-x-hidden min-h-[calc(100vh-62px)]">
          {children}
        </main>
      </div>
    </div>
  );
};

const AppRoutes = () => {
  return (
    <AppLayout>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Dashboard & Prep Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/resume-upload"
          element={
            <ProtectedRoute>
              <ResumeAnalysis />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mock-interview"
          element={
            <ProtectedRoute>
              <QuestionGenerator />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mock-interview-room"
          element={
            <ProtectedRoute>
              <MockInterview />
            </ProtectedRoute>
          }
        />
        <Route
          path="/evaluation/:id"
          element={
            <ProtectedRoute>
              <Evaluation />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dsa-practice"
          element={
            <ProtectedRoute>
              <DsaPractice />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ai-chat"
          element={
            <ProtectedRoute>
              <ChatAssistant />
            </ProtectedRoute>
          }
        />
        <Route
          path="/leaderboard"
          element={
            <ProtectedRoute>
              <Leaderboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/daily-challenge"
          element={
            <ProtectedRoute>
              <DailyChallenge />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          }
        />

        {/* Fallback Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppLayout>
  );
};

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
          <Toaster position="top-right" reverseOrder={false} />
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
