const mongoose = require('mongoose');

const DsaProgressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  topic: {
    type: String,
    required: true,
    enum: [
      'Arrays', 'Strings', 'Linked List', 'Stack', 'Queue',
      'Trees', 'Binary Trees', 'BST', 'Graphs', 'Dynamic Programming',
      'Greedy', 'Recursion', 'Backtracking'
    ],
  },
  problemName: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true,
  },
  completed: {
    type: Boolean,
    default: true,
  },
  completedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('DsaProgress', DsaProgressSchema);
