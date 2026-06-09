const express = require('express');
const router = express.Router();
const {
  register,
  login,
  googleAuth,
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

router
  .route('/profile')
  .get(protect, getProfile)
  .put(protect, profileRules, validate, updateProfile);

module.exports = router;
