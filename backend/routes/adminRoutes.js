const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getPlatformAnalytics,
  createChallenge,
  broadcastNotification,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// Apply admin guard globally to these routes
router.use(protect, authorize('admin'));

router.get('/users', getAllUsers);
router.get('/analytics', getPlatformAnalytics);
router.post('/challenges', createChallenge);
router.post('/broadcast', broadcastNotification);

module.exports = router;
