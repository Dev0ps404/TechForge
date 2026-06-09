const express = require('express');
const router = express.Router();
const { getRankings } = require('../controllers/leaderboardController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getRankings);

module.exports = router;
