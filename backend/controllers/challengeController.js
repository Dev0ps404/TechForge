const DailyChallenge = require('../models/DailyChallenge');
const User = require('../models/User');

// Helper to get current date as YYYY-MM-DD string
const getTodayDateString = () => {
  return new Date().toISOString().split('T')[0];
};

/**
 * @desc    Get daily challenge for today
 * @route   GET /api/challenges/daily
 * @access  Private
 */
exports.getDailyChallenge = async (req, res, next) => {
  try {
    const today = getTodayDateString();
    
    // Find challenge for today
    let challenge = await DailyChallenge.findOne({ date: today });

    // Seed default challenges if none exists for today
    if (!challenge) {
      challenge = await DailyChallenge.create({
        title: 'Merge Intervals Optimization',
        type: 'coding',
        description: 'Given an array of intervals where intervals[i] = [start_i, end_i], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.\n\nExample 1:\nInput: intervals = [[1,3],[2,6],[8,10],[15,18]]\nOutput: [[1,6],[8,10],[15,18]]\nExplanation: Since intervals [1,3] and [2,6] overlap, merge them into [1,6].',
        templateCode: 'function merge(intervals) {\n  // Write your code here\n  return [];\n}',
        sampleTestCases: [
          { input: '[[1,3],[2,6],[8,10],[15,18]]', output: '[[1,6],[8,10],[15,18]]' }
        ],
        date: today,
        rewardPoints: 20,
      });
    }

    // Check if user has already completed today's challenge
    const userCompleted = challenge.completedUsers.some(
      (cu) => cu.user.toString() === req.user.id
    );

    return res.status(200).json({
      success: true,
      challenge: {
        _id: challenge._id,
        title: challenge.title,
        type: challenge.type,
        description: challenge.description,
        templateCode: challenge.templateCode,
        rewardPoints: challenge.rewardPoints,
        date: challenge.date,
        userCompleted,
      },
    });
  } catch (error) {
    console.error('Get daily challenge error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching daily challenge',
    });
  }
};

/**
 * @desc    Submit daily challenge
 * @route   POST /api/challenges/submit
 * @access  Private
 */
exports.submitDailyChallenge = async (req, res, next) => {
  try {
    const { challengeId, answerText } = req.body;

    if (!challengeId || !answerText) {
      return res.status(400).json({
        success: false,
        message: 'Challenge ID and answer text are required',
      });
    }

    const challenge = await DailyChallenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: 'Daily challenge not found',
      });
    }

    // Check if already completed
    const alreadyCompleted = challenge.completedUsers.some(
      (cu) => cu.user.toString() === req.user.id
    );

    if (alreadyCompleted) {
      return res.status(400).json({
        success: false,
        message: 'You have already completed this daily challenge!',
      });
    }

    // Record user completion
    challenge.completedUsers.push({
      user: req.user.id,
      completedAt: new Date(),
      answerText,
    });
    await challenge.save();

    // Award points and update user details
    const user = await User.findById(req.user.id);
    if (user) {
      user.points += challenge.rewardPoints;
      
      // Update challenge dates and streak
      const today = getTodayDateString();
      const lastCompleted = user.lastChallengeCompletedDate
        ? user.lastChallengeCompletedDate.toISOString().split('T')[0]
        : null;

      if (!lastCompleted) {
        user.dsaStreak = 1;
      } else if (lastCompleted !== today) {
        // Increment streak if last completed was yesterday, or reset if longer
        const diffTime = Math.abs(new Date(today) - new Date(lastCompleted));
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          user.dsaStreak += 1;
        } else if (diffDays > 1) {
          user.dsaStreak = 1;
        }
      }
      user.lastChallengeCompletedDate = new Date();
      await user.save();
    }

    return res.status(200).json({
      success: true,
      message: `Challenge submitted! Awarded +${challenge.rewardPoints} points.`,
      pointsAwarded: challenge.rewardPoints,
      userStreak: user ? user.dsaStreak : 0,
      userPoints: user ? user.points : 0,
    });
  } catch (error) {
    console.error('Submit daily challenge error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error submitting daily challenge response',
    });
  }
};
