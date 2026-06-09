const express = require('express');
const router = express.Router();
const { getDsaProgress, updateDsaProgress } = require('../controllers/dsaController');
const { protect } = require('../middleware/auth');

router
  .route('/progress')
  .get(protect, getDsaProgress)
  .post(protect, updateDsaProgress);

module.exports = router;
