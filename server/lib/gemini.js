// WORKSHOP: This file wraps all Gemini SDK calls
// Students will implement the actual API calls here

const { GoogleGenerativeAI } = require('@google/genai');

// Initialize the Gemini client
// WORKSHOP: Get API key from environment variable
const apiKey = process.env.GEMINI_API_KEY;
const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

// WORKSHOP: Initialize the client
// const genAI = new GoogleGenerativeAI(apiKey);

/**
 * Generate a chat response
 * @param {string} prompt - The user's message
 * @param {string} systemPrompt - Optional system instructions
 * @returns {Promise<string>} The AI's response
 */
async function generateChat(prompt, systemPrompt = null) {
  // WORKSHOP: Implement this function in step-1-chat
  throw new Error('Not implemented yet - students will add this in step-1-chat');
}

/**
 * Generate a quiz in JSON format
 * @param {string} topic - The topic to quiz on
 * @returns {Promise<Object>} The quiz data
 */
async function generateQuiz(topic) {
  // WORKSHOP: Implement this function in step-3-quiz-json
  throw new Error('Not implemented yet - students will add this in step-3-quiz-json');
}

/**
 * Summarize content (text or image)
 * @param {string} content - The content to summarize
 * @param {string} mimeType - Optional MIME type for images
 * @returns {Promise<string>} The summary
 */
async function summarize(content, mimeType = null) {
  // WORKSHOP: Implement this function in step-5-multimodal
  throw new Error('Not implemented yet - students will add this in step-5-multimodal');
}

module.exports = {
  generateChat,
  generateQuiz,
  summarize
};
