const express = require('express');
const router = express.Router();

// WORKSHOP: Import gemini functions in step-3-quiz-json
// const { generateQuiz } = require('../lib/gemini');

/**
 * POST /api/quiz
 * Body: { topic: string }
 * Returns: { quiz: Object }
 */
router.post('/', async (req, res) => {
  // WORKSHOP: Implement this route in step-3-quiz-json
  res.status(501).json({
    error: 'Not implemented yet',
    message: 'Students will implement this in step-3-quiz-json'
  });
});

module.exports = router;
