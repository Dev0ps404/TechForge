const User = require('../models/User');

/**
 * @desc    Get leaderboard rankings
 * @route   GET /api/leaderboard
 * @access  Private
 */
exports.getRankings = async (req, res, next) => {
  try {
    const scope = req.query.scope || 'global'; // 'global', 'weekly', 'monthly'

    // Retrieve top 20 users by points
    const users = await User.find({})
      .sort({ points: -1 })
      .limit(20);

    const rankings = users.map((u, index) => ({
      userId: u._id,
      name: u.name,
      profilePicture: u.profilePicture,
      points: u.points,
      rank: index + 1,
      streak: u.dsaStreak || 0,
      role: u.role,
    }));

    return res.status(200).json({
      success: true,
      scope,
      rankings,
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving leaderboard rankings',
    });
  }
};
