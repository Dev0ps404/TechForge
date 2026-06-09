const User = require('../models/User');
const Resume = require('../models/Resume');
const InterviewSession = require('../models/InterviewSession');
const DailyChallenge = require('../models/DailyChallenge');
const Notification = require('../models/Notification');

/**
 * @desc    Get all users list
 * @route   GET /api/admin/users
 * @access  Private/Admin
 */
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error('Admin get users error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving users list',
    });
  }
};

/**
 * @desc    Get platform stats analytics
 * @route   GET /api/admin/analytics
 * @access  Private/Admin
 */
exports.getPlatformAnalytics = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalResumes = await Resume.countDocuments();
    const totalSessions = await InterviewSession.countDocuments();
    
    // Average scores
    const completedSessions = await InterviewSession.find({ status: 'completed' });
    let avgScore = 0;
    if (completedSessions.length > 0) {
      const totalScoreSum = completedSessions.reduce((acc, curr) => acc + (curr.overallScore.overall || 0), 0);
      avgScore = Math.round(totalScoreSum / completedSessions.length);
    }

    return res.status(200).json({
      success: true,
      analytics: {
        totalUsers,
        totalResumesScanned: totalResumes,
        totalMockInterviews: totalSessions,
        averagePlatformScore: avgScore,
      },
    });
  } catch (error) {
    console.error('Admin get analytics error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error calculating platform analytics',
    });
  }
};

/**
 * @desc    Create Daily Challenge
 * @route   POST /api/admin/challenges
 * @access  Private/Admin
 */
exports.createChallenge = async (req, res, next) => {
  try {
    const { title, type, description, templateCode, sampleTestCases, date, rewardPoints } = req.body;

    if (!title || !type || !description || !date) {
      return res.status(400).json({
        success: false,
        message: 'Title, type, description, and date are required',
      });
    }

    // Check if challenge for this date already exists
    const existing = await DailyChallenge.findOne({ date });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `A challenge already exists for date ${date}`,
      });
    }

    const challenge = await DailyChallenge.create({
      title,
      type,
      description,
      templateCode,
      sampleTestCases,
      date,
      rewardPoints: rewardPoints || 15,
    });

    return res.status(201).json({
      success: true,
      data: challenge,
    });
  } catch (error) {
    console.error('Admin create challenge error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error creating challenge',
    });
  }
};

/**
 * @desc    Broadcast message to all users
 * @route   POST /api/admin/broadcast
 * @access  Private/Admin
 */
exports.broadcastNotification = async (req, res, next) => {
  try {
    const { title, message, type } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: 'Title and message are required',
      });
    }

    const users = await User.find({});
    
    // Create notifications in batch
    const notifications = users.map(user => ({
      user: user._id,
      title,
      message,
      type: type || 'system',
    }));

    await Notification.insertMany(notifications);

    return res.status(200).json({
      success: true,
      message: `Broadcasted successfully to ${users.length} users.`,
    });
  } catch (error) {
    console.error('Admin broadcast error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during broadcast',
    });
  }
};
