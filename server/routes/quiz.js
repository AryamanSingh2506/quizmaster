const express = require('express');
const router = express.Router();
const { generateQuiz } = require('../lib/gemini');

/**
 * POST /api/quiz
 * Body: { topic: string }
 * Returns: { quiz: Object }
 */
router.post('/', async (req, res) => {
  try {
    const { topic } = req.body;

    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    const quiz = await generateQuiz(topic);
    res.json({ quiz });
  } catch (error) {
    console.error('Quiz error:', error);
    res.status(500).json({ error: 'Failed to generate quiz' });
  }
});

module.exports = router;
