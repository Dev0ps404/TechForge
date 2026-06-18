const express = require('express');
const router = express.Router();
const passport = require('passport');
const {
  register,
  login,
  googleAuth,
  googleCallback,
  getProfile,
  updateProfile,
  logout,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const {
  validate,
  registerRules,
  loginRules,
  profileRules,
} = require('../middleware/validation');

router.post('/register', registerRules, validate, register);
router.post('/login', loginRules, validate, login);
router.post('/google', googleAuth);
router.post('/logout', protect, logout);

// Google OAuth GET routes for Passport.js redirect flow
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login', session: false }), googleCallback);

router
  .route('/profile')
  .get(protect, getProfile)
  .put(protect, profileRules, validate, updateProfile);

module.exports = router;
