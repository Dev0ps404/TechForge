const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  fileUrl: {
    type: String,
    required: true,
  },
  atsScore: {
    type: Number,
    required: true,
  },
  skillsDetected: {
    type: [String],
    default: [],
  },
  missingKeywords: {
    type: [String],
    default: [],
  },
  weakAreas: {
    type: [String],
    default: [],
  },
  improvementSuggestions: {
    type: [String],
    default: [],
  },
  parsedData: {
    type: Object, // Raw JSON from OpenAI analysis
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Resume', ResumeSchema);
