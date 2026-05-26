const express = require('express');
const chatController = require('../controllers/chatController');
const { asyncHandler } = require('../utils/asyncHandler');

const router = express.Router();

router.get('/ask-question', (_req, res) => {
  res.status(405).json({
    success: false,
    message: 'Method Not Allowed. Use POST /ask-question with JSON: { "question": "..." }',
  });
});

router.post('/ask-question', asyncHandler(chatController.askQuestion));
router.post('/api/chat', asyncHandler(chatController.askQuestion));

module.exports = router;
