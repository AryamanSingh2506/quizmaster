const express = require('express');
const router = express.Router();
const multer = require('multer');

// WORKSHOP: Configure multer for file uploads in step-5-multimodal
// const upload = multer({ dest: 'uploads/' });

// WORKSHOP: Import gemini functions in step-5-multimodal
// const { summarize } = require('../lib/gemini');

/**
 * POST /api/summarize
 * Body: { content: string } or multipart/form-data with file
 * Returns: { summary: string }
 */
router.post('/', async (req, res) => {
  // WORKSHOP: Implement this route in step-5-multimodal
  res.status(501).json({
    error: 'Not implemented yet',
    message: 'Students will implement this in step-5-multimodal'
  });
});

module.exports = router;
