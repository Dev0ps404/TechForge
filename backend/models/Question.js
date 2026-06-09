const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InterviewSession',
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['Technical', 'Coding', 'Behavioral', 'Scenario-Based', 'System Design', 'HR'],
    default: 'Technical',
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    required: true,
  },
  sampleAnswer: {
    type: String,
    default: '',
  },
  expectedKeywords: {
    type: [String],
    default: [],
  },
  order: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('Question', QuestionSchema);
