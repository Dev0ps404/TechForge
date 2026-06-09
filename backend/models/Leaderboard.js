const mongoose = require('mongoose');

const LeaderboardSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
    default: '',
  },
  points: {
    type: Number,
    required: true,
  },
  rank: {
    type: Number,
    required: true,
  },
  scope: {
    type: String,
    enum: ['global', 'weekly', 'monthly'],
    required: true,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Leaderboard', LeaderboardSchema);
