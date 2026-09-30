// This file wraps all Gemini SDK calls

const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize the Gemini client
const apiKey = process.env.GEMINI_API_KEY;
const modelName = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

const genAI = new GoogleGenerativeAI(apiKey);

/**
 * Generate a chat response
 * @param {string} prompt - The user's message
 * @param {string} systemPrompt - Optional system instructions
 * @returns {Promise<string>} The AI's response
 */
async function generateChat(prompt, systemPrompt = null) {
  const model = genAI.getGenerativeModel({ model: modelName });

  let content = prompt;
  if (systemPrompt) {
    content = `${systemPrompt}\n\nUser: ${prompt}`;
  }

  const result = await model.generateContent(content);
  const response = await result.response;
  return response.text();
}

/**
 * Generate a quiz in JSON format
 * @param {string} topic - The topic to quiz on
 * @param {string|null} notes - Optional study notes content to base the quiz on
 * @returns {Promise<Object>} The quiz data
 */
async function generateQuiz(topic, notes = null) {
  const model = genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: 'object',
        properties: {
          topic: { type: 'string' },
          questions: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                question: { type: 'string' },
                options: {
                  type: 'array',
                  items: { type: 'string' },
                  minItems: 4,
                  maxItems: 4
                },
                answerIndex: { type: 'number', minimum: 0, maximum: 3 },
                explanation: { type: 'string' }
              },
              required: ['question', 'options', 'answerIndex', 'explanation']
            }
          }
        },
        required: ['topic', 'questions']
      }
    }
  });

  const prompt = notes
    ? `Based on the following study notes on "${topic}", generate 5 multiple choice questions testing comprehension of key concepts. Each question should have 4 options, a correct answer index (0-3), and a brief explanation.\n\nSTUDY NOTES:\n${notes}`
    : `Generate 5 multiple choice questions about ${topic}. Each question should have 4 options, a correct answer index (0-3), and a brief explanation.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  // Validate JSON
  const quizData = JSON.parse(text);

  // Server-side validation
  if (!quizData.topic || !Array.isArray(quizData.questions) || quizData.questions.length !== 5) {
    throw new Error('Invalid quiz structure');
  }

  for (const q of quizData.questions) {
    if (!q.question || !Array.isArray(q.options) || q.options.length !== 4 ||
        typeof q.answerIndex !== 'number' || q.answerIndex < 0 || q.answerIndex > 3 ||
        !q.explanation) {
      throw new Error('Invalid question structure');
    }
  }

  return quizData;
}

module.exports = {
  generateChat,
  generateQuiz
};
