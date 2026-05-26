const express = require('express');
const uploadController = require('../controllers/uploadController');
const { upload, handleUploadError } = require('../middleware/uploadMiddleware');
const { asyncHandler } = require('../utils/asyncHandler');

const router = express.Router();

router.post(
  '/upload-pdf',
  upload.single('pdf'),
  handleUploadError,
  asyncHandler(uploadController.uploadPdf)
);

// Backward-compatible alias.
router.post(
  '/api/upload',
  upload.single('pdf'),
  handleUploadError,
  asyncHandler(uploadController.uploadPdf)
);

module.exports = router;
