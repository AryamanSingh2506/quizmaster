const express = require('express');
const router = express.Router();
const { generateChat } = require('../lib/gemini');
const { STUDY_BUDDY_PERSONA } = require('../prompts/system');

/**
 * POST /api/chat
 * Body: { message: string }
 * Returns: { response: string }
 */
router.post('/', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const response = await generateChat(message, STUDY_BUDDY_PERSONA);
    res.json({ response });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate response' });
  }
});

module.exports = router;
