const express = require('express');
const router = express.Router();
const {
  generateInterview,
  submitAnswer,
  evaluateSession,
  getSessions,
  getSessionDetails,
} = require('../controllers/interviewController');
const { protect } = require('../middleware/auth');
const {
  validate,
  generateInterviewRules,
  submitAnswerRules,
} = require('../middleware/validation');

router.post('/generate', protect, generateInterviewRules, validate, generateInterview);
router.post('/sessions/:id/submit-answer', protect, submitAnswerRules, validate, submitAnswer);
router.post('/sessions/:id/evaluate', protect, evaluateSession);
router.get('/sessions', protect, getSessions);
router.get('/sessions/:id', protect, getSessionDetails);

module.exports = router;
