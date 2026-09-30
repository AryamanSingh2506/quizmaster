// DOM Elements
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const messagesContainer = document.getElementById('messages');
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const errorMessage = document.getElementById('error-message');
const closeError = document.getElementById('close-error');
const quizBtn = document.getElementById('quiz-btn');

// State
let isLoading = false;

// Event Listeners
chatForm.addEventListener('submit', handleChatSubmit);
closeError.addEventListener('click', hideError);
quizBtn.addEventListener('click', handleQuiz);

// Functions
async function handleChatSubmit(e) {
  e.preventDefault();
  const message = userInput.value.trim();

  if (!message || isLoading) return;

  // Add user message to chat
  addMessage(message, 'user');
  userInput.value = '';

  // Call the chat API
  try {
    showLoading();
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
    const data = await response.json();
    addMessage(data.response, 'assistant');
  } catch (err) {
    showError('Failed to send message. Please try again.');
  } finally {
    hideLoading();
  }
}

async function handleQuiz() {
  const topic = prompt('What topic would you like a quiz on?');
  if (!topic) return;

  try {
    showLoading();
    const response = await fetch('/api/quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic })
    });
    const data = await response.json();
    displayQuiz(data.quiz);
  } catch (err) {
    showError('Failed to generate quiz. Please try again.');
  } finally {
    hideLoading();
  }
}

function addMessage(content, type) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${type}`;
  messageDiv.innerHTML = `<div class="message-content">${escapeHtml(content)}</div>`;
  messagesContainer.appendChild(messageDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function showLoading() {
  isLoading = true;
  loading.classList.remove('hidden');
  sendBtn.disabled = true;
}

function hideLoading() {
  isLoading = false;
  loading.classList.add('hidden');
  sendBtn.disabled = false;
}

function showError(message) {
  errorMessage.textContent = message;
  error.classList.remove('hidden');
}

function hideError() {
  error.classList.add('hidden');
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function displayQuiz(quiz) {
  addMessage(`📝 Quiz: ${quiz.topic}`, 'system');

  quiz.questions.forEach((q, index) => {
    const questionText = `Q${index + 1}: ${q.question}`;
    const optionsText = q.options.map((opt, i) => `${i}. ${opt}`).join('\n');
    const answerText = `Answer: ${q.answerIndex + 1}. ${q.options[q.answerIndex]}`;
    const explanationText = `Explanation: ${q.explanation}`;

    const quizContent = `${questionText}\n\n${optionsText}\n\n${answerText}\n\n${explanationText}`;
    addMessage(quizContent, 'assistant');
  });
}

// Check server health on load
async function checkHealth() {
  try {
    const response = await fetch('/api/health');
    const data = await response.json();
    console.log('Server health:', data);
  } catch (err) {
    showError('Cannot connect to server. Make sure it is running.');
  }
}

checkHealth();
