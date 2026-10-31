# 🎓 Gemini Study Buddy & Quiz Master ⚡
An intelligent, full-stack AI study platform and interactive challenge application built with **Google Gemini API**, **Firebase (Authentication & Cloud Firestore)**, and **Node.js / Express**.

Features a multi-turn AI study tutor, cloud-synced study notes organizer, a timed 15-second Quiz Master with structured question generation, a real-time global leaderboard, and strict API key security.

---

## 🌟 Key Features :

### 💬 1. AI Study Chat
- **Intelligent Study Companion**: Powered by Google Gemini with custom persona instructions designed to break down complex topics into digestible explanations.
- **Markdown & Code Rendering**: Instant formatting for code blocks, mathematical expressions, lists, and tables via `marked.js`.
- **Persistent Chat History**: Automatically saved and synced with Firebase Firestore for signed-in learners.
- **Quick-Prompt Suggestions**: One-click prompt pills to quickly explore core subjects (Algorithms, HTTP, Calculus, etc.).

### 📝 2. Study Notes Manager
- **Note Taking & Formatting**: Clean editor with real-time word and character counters.
- **Cloud Synchronization**: Notes are persisted to user-isolated Firestore collections in real-time.
- **✨ 1-Click Quiz Generation**: Turn your study notes directly into customized comprehension quizzes with a single click.

### ⚡ 3. Quiz Master Challenge
- **Multiple Question Sources**:
  - **Core Fundamentals**: Instant offline quiz dataset to practice without an internet connection or API quota.
  - **From Study Notes**: Gemini AI analyzes your notes and extracts key concepts into 5 targeted multiple-choice questions.
  - **Custom AI Topic**: Generate a fresh, 5-question quiz on any topic on demand.
- **Timed Question Engine**: 15-second countdown timer per question with auto-timeout and live visual timer badges.
- **Instant Explanations & Feedback**: Real-time correct/incorrect visual feedback and in-depth explanations for every answer.
- **Daily Quota System**: Built-in 50 questions/day limit to promote consistent daily study habits and manage API consumption.

### 🏆 4. Global Leaderboard & XP
- **Live Podium Highlights**: Top 3 ranking podium for Champion 👑, Silver Scholar 🥈, and Bronze Ace 🥉.
- **Score & Streak Tracking**: Earn 100 XP per correct question, track quiz completion counts, and monitor accuracy.
- **Real-Time Synchronization**: Live Firestore sync updates rankings as users complete quizzes across devices.

### 🔐 5. Authentication & User Profiles
- **Google Sign-In & Email/Password**: Firebase Authentication v10 modular integration.
- **Guest Learner Mode**: Fully functional offline/guest experience with local storage; seamless upgrade to cloud sync when signing in.
- **User Profiles**: Custom display names, profile avatars, and stats.

---

## 🔒 Security & Protecting Your Google API Keys

Security is a primary focus of this project. **API keys and credentials are never hardcoded in source code or committed to Git.**

### How Keys Are Protected
1. **Google Gemini API Key (`GEMINI_API_KEY`)**:
   - Stored strictly in the server-side `.env` file.
   - Accessed exclusively by the backend (`server/lib/gemini.js`).
   - Never exposed or transmitted to the client-side browser.
2. **Firebase Web API Key & Credentials (`FIREBASE_API_KEY`, etc.)**:
   - Stored in server environment variables (`.env`).
   - Served dynamically at runtime to the client via `/api/firebase-config`.
   - **No hardcoded API keys in `public/firebase-config.js`**, preventing accidental leakage in GitHub repositories and secret scanner triggers.
3. **Strict `.gitignore` Policy**:
   - `.env`, `.env.*`, and local credential files are ignored by default.
4. **Google Cloud Key Restrictions (Recommended for Production)**:
   - In [Google Cloud Console](https://console.cloud.google.com/apis/credentials), restrict your API keys to specific HTTP referrers (e.g., `http://localhost:3000/*` and your production domain).
   - Restrict the Gemini API key to only the **Generative Language API**.

---

## 🛠️ Tech Stack & Architecture

| Layer | Technologies |
|---|---|
| **Frontend** | Vanilla JavaScript (ES Modules), HTML5, Modern CSS3, Marked.js |
| **Backend** | Node.js, Express.js, `@google/generative-ai` SDK, `dotenv`, `serverless-http` |
| **AI Engine** | Google Gemini Models (`gemini-1.5-flash`, `gemini-flash-lite-latest`, structured JSON schema) |
| **Database & Auth**| Firebase Modular SDK v10 (Firebase Auth, Cloud Firestore, Firebase Analytics) |
| **Hosting & Serverless** | Node.js Server / Netlify Serverless Functions (`netlify.toml`) |

---

## 📁 Project Structure

```
quizmaster/
├── .env.example              # Template for environment variables (Gemini & Firebase)
├── .env                      # Local environment configuration (GITIGNORED - NEVER COMMIT!)
├── .gitignore                # Protects secrets, node_modules, and environment files
├── firebase.json             # Firebase CLI configuration
├── firestore.rules           # Security rules for Firestore database collections
├── netlify.toml              # Netlify deployment and serverless redirect rules
├── package.json              # Project metadata, scripts, and dependencies
│
├── docs/
│   ├── CHECKPOINTS.md        # Workshop checkpoint instructions and walkthrough
│   └── TROUBLESHOOTING.md    # Common errors, diagnostics, and debugging solutions
│
├── netlify/
│   └── functions/
│       └── api.js            # Serverless HTTP wrapper for Express on Netlify
│
├── public/                   # Client-side web application (Static assets)
│   ├── index.html            # Main SPA layout (Chat, Notes, Quiz Master, Leaderboard)
│   ├── styles.css            # Responsive dark/modern UI stylesheet
│   ├── app.js                # Core frontend controller, UI state, & quiz engine
│   ├── firebase-config.js    # Modular Firebase loader (fetches config securely from API)
│   └── vendor/
│       └── marked.min.js     # Markdown parsing library
│
└── server/                   # Backend Express application
    ├── index.js              # Server entry point, middleware, & route registration
    ├── lib/
    │   └── gemini.js         # Google Gemini AI SDK integration (Chat & JSON Quiz schema)
    ├── prompts/
    │   └── system.js         # System instructions & persona definitions for Gemini
    └── routes/
        ├── chat.js           # POST /api/chat endpoint
        └── quiz.js           # POST /api/quiz endpoint
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18.0.0 or higher recommended)
- **npm** (v9.0.0 or higher)
- A **Google AI Studio** account (for Gemini API key)
- A **Firebase** project (for Auth & Firestore)

---

### Step 1: Clone the Repository
```bash
git clone <your-repository-url>
cd quizmaster
```

---

### Step 2: Install Dependencies
```bash
npm install
```

---

### Step 3: Configure Environment Variables

1. Copy the example environment template:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` in your editor and configure your credentials:
   ```env
   # ============================================================
   # Google Gemini AI Configuration
   # ============================================================
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   GEMINI_MODEL=gemini-1.5-flash
   PORT=3000

   # ============================================================
   # Firebase Configuration (Cloud Firestore & Authentication)
   # ============================================================
   FIREBASE_API_KEY=your_firebase_api_key_here
   FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
   FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   FIREBASE_APP_ID=your_app_id
   FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

#### How to Obtain Your Keys:
- **Google Gemini API Key**:
  1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey).
  2. Sign in with your Google account.
  3. Click **"Create API Key"** and copy the generated key into `GEMINI_API_KEY`.
- **Firebase Configuration**:
  1. Go to the [Firebase Console](https://console.firebase.google.com/).
  2. Create a project or open an existing one.
  3. Enable **Authentication** (Google Provider and Email/Password).
  4. Enable **Cloud Firestore** in test mode or with the provided `firestore.rules`.
  5. Go to **Project Settings** > **General** > **Your apps** > Add Web App (`</>`).
  6. Copy the configuration fields into your `.env`.

---

### Step 4: Start the Server

Run the application locally:
```bash
npm start
```
*Or during development:*
```bash
npm run dev
```

Visit **`http://localhost:3000`** in your browser.

---

### Step 5: Verify Server & Health Status

Check that the server is operational and your environment variables are loaded:
```bash
curl http://localhost:3000/api/health
```

Expected output:
```json
{
  "status": "ok",
  "message": "Server is running",
  "environmentLoaded": true,
  "flag": "FLAG{environment_loaded_successfully}"
}
```

---

## 📡 API Reference

### 1. Health Check
- **Endpoint**: `GET /api/health`
- **Description**: Verifies that the server is running and checks if `GEMINI_API_KEY` is present.

### 2. Firebase Configuration
- **Endpoint**: `GET /api/firebase-config`
- **Description**: Returns Firebase web client configuration populated from server environment variables.
- **Response**:
  ```json
  {
    "apiKey": "...",
    "authDomain": "...",
    "projectId": "...",
    "storageBucket": "...",
    "messagingSenderId": "...",
    "appId": "...",
    "measurementId": "..."
  }
  ```

### 3. Study Chat
- **Endpoint**: `POST /api/chat`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "message": "Explain how JavaScript closures work with an example."
  }
  ```
- **Response**:
  ```json
  {
    "response": "A closure is a feature in JavaScript where an inner function retains access to its outer scope..."
  }
  ```

### 4. Quiz Generation (Structured JSON)
- **Endpoint**: `POST /api/quiz`
- **Headers**: `Content-Type: application/json`
- **Request Body (By Topic)**:
  ```json
  {
    "topic": "Data Structures"
  }
  ```
- **Request Body (From Notes)**:
  ```json
  {
    "topic": "Operating Systems",
    "notes": "Process scheduling algorithms include FCFS, Round Robin, and Priority Scheduling..."
  }
  ```
- **Response**:
  ```json
  {
    "quiz": {
      "topic": "Data Structures",
      "questions": [
        {
          "question": "What is the time complexity of searching an element in a balanced binary search tree?",
          "options": ["O(1)", "O(n)", "O(log n)", "O(n log n)"],
          "answerIndex": 2,
          "explanation": "A balanced BST guarantees O(log n) height, making lookups logarithmic in time."
        }
      ]
    }
  }
  ```

---

## 🛡️ Firestore Security Rules

The repository includes [`firestore.rules`](firestore.rules) to protect user data:
- **User Profiles**: Users can only create and update their own document under `users/{userId}`.
- **Leaderboard**: Publicly readable so all students can view rankings, but strictly writable only by the authenticated owner.
- **Notes & History**: Isolated per user so other learners cannot view or modify your study notes.

Deploy rules via Firebase CLI:
```bash
firebase deploy --only firestore:rules
```

---

## ☁️ Deployment

### Deploying to Netlify
The project is configured for Netlify deployment via [`netlify.toml`](netlify.toml) and serverless functions in `netlify/functions/api.js`.

1. Push your repository to GitHub (ensure `.env` is **NOT** pushed!).
2. Link your repository in [Netlify](https://app.netlify.com/).
3. Set the build settings:
   - **Publish directory**: `public`
   - **Functions directory**: `netlify/functions`
4. In Netlify **Site Settings > Environment Variables**, add your environment variables:
   - `GEMINI_API_KEY`
   - `FIREBASE_API_KEY`
   - `FIREBASE_AUTH_DOMAIN`
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_STORAGE_BUCKET`
   - `FIREBASE_MESSAGING_SENDER_ID`
   - `FIREBASE_APP_ID`
   - `FIREBASE_MEASUREMENT_ID`
5. Deploy site.

---

## 🆘 Troubleshooting & Guides

- **Common Issues & Fixes**: Check [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md) for solutions to common port conflicts, invalid key errors, and network issues.
- **Workshop Checkpoints**: See [docs/CHECKPOINTS.md](docs/CHECKPOINTS.md) for step-by-step learning checkpoints.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
