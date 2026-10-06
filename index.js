require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

const healthHandler = (req, res) => {
  const hasApiKey = !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_api_key_here';
  const response = {
    status: 'ok',
    message: 'Server is running',
    environmentLoaded: hasApiKey
  };

  if (hasApiKey) {
    response.flag = 'FLAG{environment_loaded_successfully}';
  }

  res.json(response);
};

app.get('/api/health', healthHandler);
app.get('/health', healthHandler);

// Firebase Configuration Endpoint (serves config securely from environment variables)
const firebaseConfigHandler = (req, res) => {
  res.json({
    apiKey: process.env.FIREBASE_API_KEY || '',
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || '',
    projectId: process.env.FIREBASE_PROJECT_ID || '',
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || '',
    appId: process.env.FIREBASE_APP_ID || '',
    measurementId: process.env.FIREBASE_MEASUREMENT_ID || ''
  });
};

app.get('/api/firebase-config', firebaseConfigHandler);
app.get('/firebase-config', firebaseConfigHandler);

// Import and use other routes here
const chatRoutes = require('./routes/chat');
const quizRoutes = require('./routes/quiz');

app.use('/api/chat', chatRoutes);
app.use('/chat', chatRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/quiz', quizRoutes);

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
