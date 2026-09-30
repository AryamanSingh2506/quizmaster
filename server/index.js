require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.get('/api/health', (req, res) => {
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
});

// Import and use other routes here
const chatRoutes = require('./routes/chat');
const quizRoutes = require('./routes/quiz');

app.use('/api/chat', chatRoutes);
app.use('/api/quiz', quizRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
