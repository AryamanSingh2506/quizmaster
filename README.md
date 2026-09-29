# 🎓 Gemini Study Buddy

An AI-powered study assistant built with Google's Gemini API. Learn to integrate AI into your applications through hands-on checkpoints.

## 🚀 Quick Start (5 Steps)

### Step 1: Get Your Gemini API Key
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key (you'll need it in Step 3)

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

Open your browser and visit `http://localhost:3000`

## 🎯 Workshop Checkpoints

This project uses a treasure-hunt style learning approach. Each checkpoint branch adds a new feature:

| Branch | Feature | Flag Hint |
|--------|---------|-----------|
| `step-0-starter` | UI + server stub | Check your `.env` file |
| `step-1-chat` | First Gemini call | When the AI replies |
| `step-2-system-prompt` | Study-buddy persona | When it stays in character |
| `step-3-quiz-json` | JSON quiz cards | When JSON parses correctly |
| `step-4-streaming` | Token streaming | When text appears gradually |
| `step-5-multimodal` | Image summarization | When images work |
| `step-6-antigravity` | AI agent planner | When the plan validates |

### How to Navigate Checkpoints

```bash
# See all available branches
git branch -a

# Switch to a checkpoint
git checkout step-1-chat

# See what changed
git diff step-0-starter..step-1-chat
```

## 📁 Project Structure

```
gemini-study-buddy/
├── README.md              # This file
├── .env.example           # Environment variables template
├── .gitignore             # Files to ignore in git
├── package.json           # Dependencies and scripts
├── server/
│   ├── index.js           # Express app entry point
│   ├── lib/
│   │   └── gemini.js      # Gemini SDK wrapper
│   ├── prompts/
│   │   └── system.js      # System instructions
│   └── routes/
│       ├── chat.js        # Chat endpoint
│       ├── quiz.js        # Quiz generation
│       └── summarize.js   # Text/image summarization
├── public/
│   ├── index.html         # Frontend HTML
│   ├── styles.css         # Styling
│   └── app.js             # Frontend JavaScript
└── docs/
    ├── CHECKPOINTS.md     # Detailed checkpoint guide
    └── TROUBLESHOOTING.md # Common issues and fixes
```

## 🔑 Important Security Note

**Never commit your `.env` file or API keys to GitHub!** The `.gitignore` file is configured to prevent this, but always double-check before pushing.

## 🛠️ Tech Stack

- **Backend**: Node.js + Express
- **AI**: Google Gemini API (@google/genai SDK)
- **Frontend**: Plain HTML, CSS, JavaScript (no frameworks)

## 📚 What You'll Learn

- Environment variables and API key security
- Making API calls to AI models
- System prompts and AI personas
- Structured output (JSON schema)
- Streaming responses
- Multimodal AI (text + images)
- AI agents and planning

## 🆘 Need Help?

- Check [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md) for common issues
- Review [docs/CHECKPOINTS.md](docs/CHECKPOINTS.md) for detailed checkpoint guidance
- Ask a workshop instructor

## 📝 License

MIT
