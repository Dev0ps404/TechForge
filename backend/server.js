const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const connectDB = require('./config/db');
const passport = require('passport');
require('./config/passport');

// Connect to MongoDB database
connectDB();

const app = express();

// Security Headers
app.use(helmet());

// CORS Configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5000',
  'https://tech-forge-zeta.vercel.app',
  'https://techforge-w677.onrender.com'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Body Parser Middleware
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Initialize Passport
app.use(passport.initialize());

// Request Logger (simple dev logger)
app.use((req, res, next) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl}`);
  }
  next();
});

// API Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again after 15 minutes.',
  },
});
app.use('/api/', limiter);

// Mount API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/auth', require('./routes/authRoutes'));
app.use('/api/resumes', require('./routes/resumeRoutes'));
app.use('/api/interviews', require('./routes/interviewRoutes'));
app.use('/api/dsa', require('./routes/dsaRoutes'));
app.use('/api/challenges', require('./routes/challengeRoutes'));
app.use('/api/leaderboard', require('./routes/leaderboardRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Basic Health Check Route
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date(),
    uptime: process.uptime(),
  });
});

// 404 Route Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'An unexpected server error occurred';

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

const listRoutes = (appInstance) => {
  console.log('\n--- Registered Auth Routes ---');
  appInstance._router.stack.forEach((middleware) => {
    if (middleware.name === 'router') {
      const base = middleware.regexp.toString()
        .replace('/^\\', '')
        .replace('\\/?(?=\\/|$)/i', '')
        .replace('\\/i', '')
        .replace(/\\/g, '');
      
      if (base.includes('auth')) {
        middleware.handle.stack.forEach((handler) => {
          if (handler.route) {
            const path = handler.route.path;
            const methods = Object.keys(handler.route.methods).join(', ').toUpperCase();
            console.log(`${methods} ${base}${path}`);
          }
        });
      }
    }
  });
  console.log('-------------------------------\n');
};

const server = app.listen(PORT, () => {
  console.log(`TechForge Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  listRoutes(app);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`Unhandled Rejection Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

