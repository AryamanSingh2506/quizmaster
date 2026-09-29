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
  res.json({ status: 'ok', message: 'Server is running' });
});

// WORKSHOP: Import and use other routes here
// const chatRoutes = require('./routes/chat');
// const quizRoutes = require('./routes/quiz');
// const summarizeRoutes = require('./routes/summarize');

// app.use('/api/chat', chatRoutes);
// app.use('/api/quiz', quizRoutes);
// app.use('/api/summarize', summarizeRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
