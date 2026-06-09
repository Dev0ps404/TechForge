const Notification = require('../models/Notification');

/**
 * @desc    Get user notifications
 * @route   GET /api/notifications
 * @access  Private
 */
exports.getNotifications = async (req, res, next) => {
  try {
    let notifications = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 });

    // Seed welcoming notifications for first-time setup
    if (notifications.length === 0) {
      notifications = [
        await Notification.create({
          user: req.user.id,
          title: 'Welcome to TalentForge!',
          message: 'Explore the platform. Upload your resume to begin ATS scanning, or launch a mock interview.',
          type: 'system',
        }),
        await Notification.create({
          user: req.user.id,
          title: 'Daily Challenge Available',
          message: 'Solve today\'s Coding & Scenario questions to build up your streak and earn placement points!',
          type: 'challenge',
        })
      ];
      // Re-sort descending
      notifications.sort((a,b) => b.createdAt - a.createdAt);
    }

    return res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications,
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching notifications',
    });
  }
};

/**
 * @desc    Mark notification as read
 * @route   PUT /api/notifications/:id/read
 * @access  Private
 */
exports.markRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOne({ _id: req.params.id, user: req.user.id });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found',
      });
    }

    notification.isRead = true;
    await notification.save();

    return res.status(200).json({
      success: true,
      data: notification,
    });
  } catch (error) {
    console.error('Mark read notification error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error updating notification status',
    });
  }
};
