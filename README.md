# 🎓 Gemini Study Buddy

An AI-powered study assistant built with Google's Gemini API. Learn to integrate AI into your applications through checkpoints.

## 🚀 Quick Start

### Step 1: Get Your Gemini API Key
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your **personal Gmail account** (each person needs their own key)
3. Click "Create API Key"
4. Copy your API key

### Step 2: Clone the Repository
```bash
git clone <repository-url>
cd gemini-study-buddy
```

### Step 3: Set Up Your Environment
1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` in your text editor and replace `your_api_key_here` with your actual API key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   GEMINI_MODEL=gemini-1.5-flash
   PORT=3000
   ```

### Step 4: Install Dependencies
```bash
npm install
```

### Step 5: Start the Server
```bash
npm start
```

### Step 6: Test the Setup
Open your browser and visit `http://localhost:3000`

Then check the health endpoint to get your first flag:
```bash
curl http://localhost:3000/api/health
```

## 🎯 Workshop Steps

### Step 0: Setup
- Verify the server is running
- Check `/api/health` returns your flag when `.env` is configured correctly

### Step 1: Chat
- Chat functionality is already implemented in `server/lib/gemini.js`
- Route is wired up in `server/routes/chat.js`
- Test by sending messages in the UI

### Step 2: System Prompt
- Edit `server/prompts/system.js` to customize the AI persona
- Make your study buddy explain at first-year level
- Test that it stays in character

### Step 3: Quiz JSON
- Quiz generation is already implemented with JSON schema
- Generate 5 multiple-choice questions in JSON format
- Quiz cards are displayed in the UI


## �📁 Key Files to Study

- `server/lib/gemini.js` - Where Gemini SDK calls happen
- `server/prompts/system.js` - System instructions for the AI
- `server/routes/chat.js` - Chat endpoint
- `server/routes/quiz.js` - Quiz generation endpoint

## 🔑 Important Security Note

**Never commit your `.env` file or API keys to GitHub!** The `.gitignore` file is configured to prevent this, but always double-check before pushing.

## 🛠️ Tech Stack

- **Backend**: Node.js + Express
- **AI**: Google Gemini API (@google/generative-ai SDK)
- **Frontend**: Plain HTML, CSS, JavaScript (no frameworks)

## 📚 What You'll Learn

- Environment variables and API key security
- Making API calls to AI models
- System prompts and AI personas
- Structured output (JSON schema)

## 🆘 Need Help?

- Check [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md) for common issues
- Ask a workshop instructor

## 📝 License

MIT
