const mongoose = require('mongoose');

const DailyChallengeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['coding', 'interview'],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  templateCode: {
    type: String, // Coding starter code template (optional)
    default: '',
  },
  sampleTestCases: [{
    input: { type: String, default: '' },
    output: { type: String, default: '' },
  }],
  date: {
    type: String, // format YYYY-MM-DD
    required: true,
    unique: true,
  },
  rewardPoints: {
    type: Number,
    default: 15,
  },
  completedUsers: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
    answerText: {
      type: String,
      default: '',
    }
  }],
});

module.exports = mongoose.model('DailyChallenge', DailyChallengeSchema);
