const express = require('express');
const router = express.Router();

// Import gemini functions
// const { generateQuiz } = require('../lib/gemini');

/**
 * POST /api/quiz
 * Body: { topic: string }
 * Returns: { quiz: Object }
 */
router.post('/', async (req, res) => {
  res.status(501).json({
    error: 'Not implemented yet'
  });
});

module.exports = router;
