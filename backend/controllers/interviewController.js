const InterviewSession = require('../models/InterviewSession');
const Question = require('../models/Question');
const Score = require('../models/Score');
const User = require('../models/User');
const aiService = require('../services/aiService');
const { sendPerformanceReportEmail } = require('../services/emailService');

/**
 * @desc    Start Mock Interview Session & Generate Questions
 * @route   POST /api/interviews/generate
 * @access  Private
 */
exports.generateInterview = async (req, res, next) => {
  try {
    const { jobRole, techStack, difficulty, experience, numQuestions = 5 } = req.body;

    // 1. Generate questions via AI
    const rawQuestions = await aiService.generateQuestions(
      jobRole,
      techStack,
      difficulty,
      experience,
      numQuestions
    );

    if (!rawQuestions || rawQuestions.length === 0) {
      return res.status(500).json({
        success: false,
        message: 'Failed to generate interview questions. Please try again.',
      });
    }

    // 2. Create session doc
    const session = await InterviewSession.create({
      user: req.user.id,
      jobRole,
      techStack,
      difficulty,
      experience,
      numQuestions,
      status: 'in_progress',
    });

    // 3. Create question docs associated with this session
    const questionDocs = [];
    for (let i = 0; i < rawQuestions.length; i++) {
      const q = rawQuestions[i];
      const qDoc = await Question.create({
        session: session._id,
        text: q.text,
        category: q.category,
        difficulty: q.difficulty || difficulty,
        sampleAnswer: q.sampleAnswer || '',
        expectedKeywords: q.expectedKeywords || [],
        order: i + 1,
      });
      questionDocs.push(qDoc);
    }

    // Link questions to session
    session.questions = questionDocs.map(qd => qd._id);
    await session.save();

    // Return session details (excluding answers for security)
    const sanitizedQuestions = questionDocs.map(q => ({
      _id: q._id,
      text: q.text,
      category: q.category,
      difficulty: q.difficulty,
      order: q.order,
    }));

    return res.status(201).json({
      success: true,
      session: {
        _id: session._id,
        jobRole: session.jobRole,
        techStack: session.techStack,
        difficulty: session.difficulty,
        experience: session.experience,
        status: session.status,
      },
      questions: sanitizedQuestions,
    });
  } catch (error) {
    console.error('Interview generation error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error generating interview questions',
    });
  }
};

/**
 * @desc    Submit answer for a specific question
 * @route   POST /api/interviews/sessions/:id/submit-answer
 * @access  Private
 */
exports.submitAnswer = async (req, res, next) => {
  try {
    const sessionId = req.params.id;
    const { questionId, answerText } = req.body;

    // Verify session belongs to user
    const session = await InterviewSession.findOne({ _id: sessionId, user: req.user.id });
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Interview session not found or access denied',
      });
    }

    // Fetch the question
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found',
      });
    }

    // Call AI to evaluate candidate answer
    const aiEvaluation = await aiService.evaluateAnswer(
      question.text,
      answerText,
      question.category,
      question.difficulty
    );

    // Save evaluation to Score schema
    // Delete existing score if they resubmitted for this question
    await Score.deleteOne({ session: sessionId, question: questionId });

    const scoreDoc = await Score.create({
      user: req.user.id,
      session: sessionId,
      question: questionId,
      answerText,
      evaluation: {
        score: aiEvaluation.score || 70,
        technicalScore: aiEvaluation.technicalScore || 70,
        communicationScore: aiEvaluation.communicationScore || 70,
        confidenceScore: aiEvaluation.confidenceScore || 70,
        grammarErrors: aiEvaluation.grammarErrors || [],
        technicalFeedback: aiEvaluation.technicalFeedback || '',
        communicationFeedback: aiEvaluation.communicationFeedback || '',
        strengths: aiEvaluation.strengths || [],
        weaknesses: aiEvaluation.weaknesses || [],
      },
    });

    return res.status(200).json({
      success: true,
      data: scoreDoc,
    });
  } catch (error) {
    console.error('Submit answer error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error submitting response',
    });
  }
};

/**
 * @desc    Evaluate entire interview session
 * @route   POST /api/interviews/sessions/:id/evaluate
 * @access  Private
 */
exports.evaluateSession = async (req, res, next) => {
  try {
    const sessionId = req.params.id;

    const session = await InterviewSession.findOne({ _id: sessionId, user: req.user.id }).populate('questions');
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Interview session not found',
      });
    }

    // Fetch all scored responses for this session
    const scores = await Score.find({ session: sessionId });

    if (scores.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No answers have been submitted for this session. Cannot evaluate.',
      });
    }

    // Aggregate sub-scores
    let totalScore = 0;
    let totalTech = 0;
    let totalComm = 0;
    let totalConf = 0;
    let totalGrammar = 0;
    let allStrengths = [];
    let allWeaknesses = [];
    let allSuggestions = [];

    scores.forEach((s) => {
      totalScore += s.evaluation.score;
      totalTech += s.evaluation.technicalScore;
      totalComm += s.evaluation.communicationScore;
      totalConf += s.evaluation.confidenceScore;
      // Deduct points for grammar errors to compute general grammar score
      const errorsCount = s.evaluation.grammarErrors ? s.evaluation.grammarErrors.length : 0;
      totalGrammar += Math.max(100 - errorsCount * 15, 40);

      allStrengths = [...allStrengths, ...(s.evaluation.strengths || [])];
      allWeaknesses = [...allWeaknesses, ...(s.evaluation.weaknesses || [])];
      if (s.evaluation.technicalFeedback) allSuggestions.push(s.evaluation.technicalFeedback);
    });

    const numScored = scores.length;
    const overallScore = {
      overall: Math.round(totalScore / numScored),
      technical: Math.round(totalTech / numScored),
      communication: Math.round(totalComm / numScored),
      confidence: Math.round(totalConf / numScored),
      grammar: Math.round(totalGrammar / numScored),
    };

    // De-duplicate lists
    const uniqueStrengths = [...new Set(allStrengths)].slice(0, 5);
    const uniqueWeaknesses = [...new Set(allWeaknesses)].slice(0, 5);
    const uniqueSuggestions = [...new Set(allSuggestions)].slice(0, 3);

    // Save changes to session
    session.overallScore = overallScore;
    session.feedback = {
      strengths: uniqueStrengths,
      weaknesses: uniqueWeaknesses,
      suggestions: uniqueSuggestions,
      overallSummary: `You completed a mock interview for the role of ${session.jobRole}. Your technical responses averaged a score of ${overallScore.technical}%, while your presentation style was rated at ${overallScore.communication}%. Review the details below to structure your practice session.`,
    };
    session.status = 'completed';
    await session.save();

    // Award user reward points (e.g. 50 points for completing a full interview)
    const user = await User.findById(req.user.id);
    if (user) {
      user.points += 50;
      await user.save();
    }

    // Send performance email report
    sendPerformanceReportEmail(req.user.email, req.user.name, session).catch(err => console.error('Error sending performance email:', err));

    return res.status(200).json({
      success: true,
      session,
      answers: scores,
    });
  } catch (error) {
    console.error('Session evaluation error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error generating overall evaluation',
    });
  }
};

/**
 * @desc    Get all session histories for user
 * @route   GET /api/interviews/sessions
 * @access  Private
 */
exports.getSessions = async (req, res, next) => {
  try {
    const sessions = await InterviewSession.find({ user: req.user.id }).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: sessions.length,
      data: sessions,
    });
  } catch (error) {
    console.error('Get sessions error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching sessions list',
    });
  }
};

/**
 * @desc    Get details of a single session (including questions and evaluated answers)
 * @route   GET /api/interviews/sessions/:id
 * @access  Private
 */
exports.getSessionDetails = async (req, res, next) => {
  try {
    const session = await InterviewSession.findOne({ _id: req.params.id, user: req.user.id }).populate('questions');

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found',
      });
    }

    // Fetch individual answer scores
    const answers = await Score.find({ session: session._id }).populate('question');

    return res.status(200).json({
      success: true,
      session,
      answers,
    });
  } catch (error) {
    console.error('Get session details error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching session details',
    });
  }
};
