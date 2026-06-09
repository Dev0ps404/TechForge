const { body, validationResult } = require('express-validator');

// Error checker to reject requests with invalid fields
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({ field: err.path, message: err.msg })),
    });
  }
  next();
};

const registerRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Provide a valid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];

const loginRules = [
  body('email').isEmail().withMessage('Provide a valid email address'),
  body('password').notEmpty().withMessage('Password is required'),
];

const profileRules = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('skills').optional().isArray().withMessage('Skills must be an array of strings'),
];

const generateInterviewRules = [
  body('jobRole').trim().notEmpty().withMessage('Job role is required'),
  body('techStack').trim().notEmpty().withMessage('Technology stack is required'),
  body('difficulty')
    .isIn(['Beginner', 'Intermediate', 'Advanced'])
    .withMessage('Difficulty must be Beginner, Intermediate, or Advanced'),
  body('experience').trim().notEmpty().withMessage('Experience level is required'),
  body('numQuestions')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Number of questions must be between 1 and 10'),
];

const submitAnswerRules = [
  body('questionId').isMongoId().withMessage('Valid Question ID is required'),
  body('answerText').trim().notEmpty().withMessage('Answer text cannot be empty'),
];

module.exports = {
  validate,
  registerRules,
  loginRules,
  profileRules,
  generateInterviewRules,
  submitAnswerRules,
};
