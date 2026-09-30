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
    const { topic, notes } = req.body;

    if (!topic && !notes) {
      return res.status(400).json({ error: 'Topic or study notes are required' });
    }

    const quizTopic = topic || (notes ? 'Study Notes Review' : 'General Knowledge');
    const quiz = await generateQuiz(quizTopic, notes || null);
    res.json({ quiz });
  } catch (error) {
    console.error('Quiz error:', error);
    res.status(500).json({ error: 'Failed to generate quiz' });
  }
});

module.exports = router;
