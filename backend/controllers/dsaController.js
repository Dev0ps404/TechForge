const DsaProgress = require('../models/DsaProgress');
const User = require('../models/User');

/**
 * @desc    Get all completed DSA problems for user
 * @route   GET /api/dsa/progress
 * @access  Private
 */
exports.getDsaProgress = async (req, res, next) => {
  try {
    const progress = await DsaProgress.find({ user: req.user.id }).sort({ completedAt: -1 });
    return res.status(200).json({
      success: true,
      count: progress.length,
      data: progress,
    });
  } catch (error) {
    console.error('Get DSA progress error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving DSA progress',
    });
  }
};

/**
 * @desc    Mark a DSA problem as completed/incomplete
 * @route   POST /api/dsa/progress
 * @access  Private
 */
exports.updateDsaProgress = async (req, res, next) => {
  try {
    const { topic, problemName, difficulty, completed } = req.body;

    if (!topic || !problemName || !difficulty) {
      return res.status(400).json({
        success: false,
        message: 'Topic, problem name, and difficulty are required',
      });
    }

    // Check if progress already exists
    const existingProgress = await DsaProgress.findOne({
      user: req.user.id,
      topic,
      problemName,
    });

    if (existingProgress) {
      if (completed === false) {
        // Toggle/remove progress
        await DsaProgress.findByIdAndDelete(existingProgress._id);
        
        // Deduct points from user
        const user = await User.findById(req.user.id);
        if (user) {
          user.points = Math.max(user.points - 10, 0);
          await user.save();
        }

        return res.status(200).json({
          success: true,
          message: 'DSA problem marked as incomplete',
          data: null,
        });
      } else {
        return res.status(200).json({
          success: true,
          message: 'Problem already completed',
          data: existingProgress,
        });
      }
    }

    // If new completion
    const newProgress = await DsaProgress.create({
      user: req.user.id,
      topic,
      problemName,
      difficulty,
    });

    // Update user points and streak
    const user = await User.findById(req.user.id);
    if (user) {
      user.points += 10; // 10 points per problem

      // Calculate streak
      const today = new Date().toISOString().split('T')[0];
      const lastCompleted = user.lastChallengeCompletedDate
        ? user.lastChallengeCompletedDate.toISOString().split('T')[0]
        : null;

      if (!lastCompleted) {
        user.dsaStreak = 1;
      } else {
        const diffTime = Math.abs(new Date(today) - new Date(lastCompleted));
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          // completed on consecutive day, increment streak
          user.dsaStreak += 1;
        } else if (diffDays > 1) {
          // streak broken, reset to 1
          user.dsaStreak = 1;
        }
      }
      user.lastChallengeCompletedDate = new Date();
      await user.save();
    }

    return res.status(201).json({
      success: true,
      message: 'DSA problem completed successfully!',
      data: newProgress,
      userStreak: user ? user.dsaStreak : 0,
      userPoints: user ? user.points : 0,
    });
  } catch (error) {
    console.error('Update DSA progress error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error updating DSA progress',
    });
  }
};
