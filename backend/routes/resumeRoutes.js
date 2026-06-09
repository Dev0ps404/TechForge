const express = require('express');
const router = express.Router();
const {
  uploadResume,
  getResumeHistory,
  getResumeDetails,
} = require('../controllers/resumeController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/fileUpload');

router.post('/upload', protect, upload.single('resume'), uploadResume);
router.get('/history', protect, getResumeHistory);
router.get('/:id', protect, getResumeDetails);

module.exports = router;
