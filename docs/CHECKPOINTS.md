# 🎯 Workshop Checkpoints Guide

This guide walks you through each checkpoint branch, what you'll build, and how to verify your work.

## 🏁 Checkpoint Overview

| Branch | What You Build | Flag Appears When | Flag Hint |
|--------|----------------|------------------|-----------|
| `step-0-starter` | UI + server stub, `/api/health` | `.env` loaded correctly | "Environment loaded" |
| `step-1-chat` | First Gemini call | Chat reply comes back | "Hello from Gemini" |
| `step-2-system-prompt` | Study-buddy persona | Persona stays in character | "In character" |
| `step-3-quiz-json` | JSON schema quiz cards | Response parses as valid JSON | "Valid JSON" |
| `step-4-streaming` | Token streaming | Stream works end to end | "Streaming active" |
| `step-5-multimodal` | Upload notes or image, get summary | Summary returned | "Multimodal ready" |
| `step-6-antigravity` | Agent adds a study planner | Agent's plan passes checklist | "Agent validated" |

---

## 📋 Detailed Checkpoint Instructions

### Step 0: Starter Branch
**Branch**: `step-0-starter`

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
  "message": "Server is running"
}
```

**Flag hint**: Check that your `.env` file is in the project root and contains `GEMINI_API_KEY=your_key_here`

---

### Step 1: First Chat
**Branch**: `step-1-chat`

**What you'll do**:
- Initialize the Gemini SDK in `server/lib/gemini.js`
- Implement the `generateChat` function
- Connect the chat route in `server/routes/chat.js`
- Uncomment the chat route in `server/index.js`
- Update the frontend to call the chat API

**Key changes to make**:
1. In `server/lib/gemini.js`:
   - Initialize `GoogleGenerativeAI` with your API key
   - Implement `generateChat` to call the model

2. In `server/routes/chat.js`:
   - Import `generateChat` and `STUDY_BUDDY_PERSONA`
   - Implement the POST route to call `generateChat`

3. In `server/index.js`:
   - Uncomment the chat route imports and middleware

4. In `public/app.js`:
   - Uncomment the fetch call to `/api/chat`

**Verification**:
- Type a message in the chat interface
- You should receive a response from Gemini

**Flag hint**: The flag appears when you successfully receive a response that starts with "Hello from Gemini" (or similar AI response)

---

### Step 2: System Prompt
**Branch**: `step-2-system-prompt`

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

**Flag hint**: The flag appears when the AI maintains its character across multiple questions

---

### Step 3: JSON Quiz
**Branch**: `step-3-quiz-json`

**What you'll do**:
- Implement structured output using JSON schema
- Create a quiz generator in `server/lib/gemini.js`
- Connect the quiz route
- Display quiz cards in the frontend

**Key changes to make**:
1. In `server/lib/gemini.js`:
   - Implement `generateQuiz` with JSON schema
   - Ensure the response is valid JSON

2. In `server/routes/quiz.js`:
   - Import and use `generateQuiz`
   - Implement the POST route

3. In `server/index.js`:
   - Uncomment the quiz route

4. In `public/app.js`:
   - Implement `displayQuiz` function
   - Uncomment the quiz API call

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

**Flag hint**: The flag appears when the quiz JSON validates successfully

---

### Step 4: Streaming
**Branch**: `step-4-streaming`

**What you'll do**:
- Implement token streaming for real-time responses
- Update the chat to display text as it arrives
- Handle streaming errors

**Key changes to make**:
1. In `server/lib/gemini.js`:
   - Modify `generateChat` to use streaming
   - Return a readable stream

2. In `server/routes/chat.js`:
   - Handle streaming responses
   - Set appropriate headers

3. In `public/app.js`:
   - Implement streaming reader
   - Update UI incrementally

**Verification**:
- Send a message
- Text should appear character-by-character or word-by-word
- No long waiting for full response

**Flag hint**: The flag appears when streaming works end-to-end

---

### Step 5: Multimodal
**Branch**: `step-5-multimodal`

**What you'll do**:
- Add file upload capability
- Implement image/text summarization
- Handle different MIME types

**Key changes to make**:
1. In `server/routes/summarize.js`:
   - Configure multer for file uploads
   - Implement the summarize route

2. In `server/lib/gemini.js`:
   - Implement `summarize` function
   - Handle both text and image inputs

3. In `server/index.js`:
   - Uncomment the summarize route

4. In `public/app.js`:
   - Add file input to the UI
   - Handle file uploads

**Verification**:
- Upload an image or paste text
- Receive a summary
- Image analysis should work

**Flag hint**: The flag appears when multimodal summarization works

---

### Step 6: Antigravity Agent
**Branch**: `step-6-antigravity`

**What you'll do**:
- Implement an AI agent that creates study plans
- Add planning and verification loops
- Create a checklist for plan validation

**Key changes to make**:
1. In `server/lib/gemini.js`:
   - Add agent planning function
   - Implement verification step

2. In `server/routes/`:
   - Add new agent route

3. In `public/`:
   - Add agent UI components
   - Display plans and verification results

**Verification**:
- Agent creates a study plan
- Plan passes your validation checklist
- Can iterate on the plan

**Flag hint**: The flag appears when the agent's plan validates successfully

---

## 🎓 Tips for Success

1. **Read the comments**: Look for `// WORKSHOP:` comments in the code
2. **Test incrementally**: Verify each step before moving on
3. **Check the console**: Look for error messages in the terminal
4. **Use Git**: Commit your work at each checkpoint
5. **Ask for help**: If stuck for more than 10 minutes, ask an instructor

## 🏆 Submitting Flags

Once you complete a checkpoint:
1. Find the flag (it will be displayed in the app or console)
2. Submit it in the Google Form
3. Check the leaderboard to see your progress

Good luck! 🚀
