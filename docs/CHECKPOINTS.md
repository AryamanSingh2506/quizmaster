# 🎯 Workshop Checkpoints Guide

This guide walks you through each workshop step, what you'll build, and how to verify your work.

## 🏁 Step Overview

| Step | What You Build | Verification |
|------|----------------|-------------|
| Step 0 | Setup and health check | `/api/health` returns flag |
| Step 1 | First Gemini call | Chat replies work |
| Step 2 | System prompt persona | AI stays in character |
| Step 3 | JSON quiz generation | Valid quiz JSON returned |

---

## 📋 Detailed Step Instructions

### Step 0: Setup and Health Check

**What you'll do**:
- Clone the repository
- Set up your `.env` file with your Gemini API key
- Install dependencies
- Start the server
- Verify the health endpoint works

**Verification**:
```bash
# Start the server
npm start

# In another terminal, test the health endpoint
curl http://localhost:3000/api/health
```

**Expected response**:
```json
{
  "status": "ok",
  "message": "Server is running",
  "environmentLoaded": true,
  "flag": "FLAG{environment_loaded_successfully}"
}
```

**Flag hint**: The flag appears when your `.env` file is configured correctly with a real API key.

---

### Step 1: First Chat

**What you'll do**:
- Chat functionality is already implemented
- Test the chat feature
- Customize the system prompt if desired

**Key features**:
1. In `server/lib/gemini.js`:
   - `generateChat` uses the Gemini SDK
   - Accepts optional system prompt parameter
   - Returns the AI's text response

2. In `server/routes/chat.js`:
   - `/api/chat` endpoint is already wired up
   - Accepts `{ message: string }` in request body
   - Returns `{ response: string }`

3. In `server/index.js`:
   - Chat route is already enabled

4. In `public/app.js`:
   - Chat API call is already implemented
   - Type messages in the UI to test

**Verification**:
- Type a message in the chat interface
- You should receive a response from Gemini

**Flag hint**: The flag appears when you successfully receive a non-empty response from the AI.

---

### Step 2: System Prompt

**What you'll do**:
- Modify the system prompt in `server/prompts/system.js`
- Give your study buddy a specific personality
- Test that it stays in character

**Key changes to make**:
1. In `server/prompts/system.js`:
   - Create a new persona (e.g., a patient tutor, a challenging quiz master)
   - Update `STUDY_BUDDY_PERSONA` with your custom prompt

2. In `server/lib/gemini.js`:
   - Pass the system prompt to the model

**Verification**:
- Ask questions that test the persona
- The AI should respond consistently with its assigned personality

**Flag hint**: The flag appears when the AI maintains its character across multiple questions.

---

### Step 3: JSON Quiz

**What you'll do**:
- Quiz generation is already implemented with JSON schema
- Test the quiz generation
- Customize the quiz display if desired

**Key features**:
1. In `server/lib/gemini.js`:
   - `generateQuiz` uses JSON schema with responseMimeType
   - Server-side validation ensures proper structure
   - Returns 5 MCQs with questions, options, answerIndex, and explanation

2. In `server/routes/quiz.js`:
   - `/api/quiz` endpoint is already wired up
   - Accepts `{ topic: string }` in request body

3. In `public/app.js`:
   - `displayQuiz` function renders quiz cards in the chat
   - Click "Generate Quiz" button to test

**Expected JSON structure**:
```json
{
  "topic": "JavaScript",
  "questions": [
    {
      "question": "What is a closure?",
      "options": ["A function", "A function + its lexical environment", "A variable", "A loop"],
      "answer": 1,
      "explanation": "A closure is a function bundled with its lexical environment."
    }
  ]
}
```

**Verification**:
- Click "Generate Quiz" and enter a topic
- Quiz should appear as formatted cards
- JSON should parse without errors

**Flag hint**: The flag appears when the quiz JSON validates successfully.

---

## 🎓 Tips for Success

1. **Test incrementally**: Verify each step before moving on
2. **Check the console**: Look for error messages in the terminal
3. **Use Git**: Commit your work at each step
4. **Ask for help**: If stuck for more than 10 minutes, ask an instructor

## 🏆 Submitting Flags

Once you complete a step:
1. Find the flag (it will be displayed in the app or console)
2. Submit it in the Google Form
3. Check the leaderboard to see your progress

Good luck! 🚀
