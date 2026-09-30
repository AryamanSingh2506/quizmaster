const express = require('express');
const router = express.Router();

// Import gemini functions
// const { generateChat } = require('../lib/gemini');
// const { STUDY_BUDDY_PERSONA } = require('../prompts/system');

/**
 * POST /api/chat
 * Body: { message: string }
 * Returns: { response: string }
 */
router.post('/', async (req, res) => {
  res.status(501).json({
    error: 'Not implemented yet'
  });
});

module.exports = router;
