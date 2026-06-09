const express = require('express');
const router = express.Router();
const { getDailyChallenge, submitDailyChallenge } = require('../controllers/challengeController');
const { protect } = require('../middleware/auth');

router.get('/daily', protect, getDailyChallenge);
router.post('/submit', protect, submitDailyChallenge);

module.exports = router;
