const express = require('express');
const router = express.Router();

// WORKSHOP: Import gemini functions in step-1-chat
// const { generateChat } = require('../lib/gemini');
// const { STUDY_BUDDY_PERSONA } = require('../prompts/system');

/**
 * POST /api/chat
 * Body: { message: string }
 * Returns: { response: string }
 */
router.post('/', async (req, res) => {
  // WORKSHOP: Implement this route in step-1-chat
  res.status(501).json({
    error: 'Not implemented yet',
    message: 'Students will implement this in step-1-chat'
  });
});

module.exports = router;
