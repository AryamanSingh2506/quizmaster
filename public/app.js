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
const summarizeBtn = document.getElementById('summarize-btn');

// State
let isLoading = false;

// WORKSHOP: Students will add streaming logic in step-4-streaming

// Event Listeners
chatForm.addEventListener('submit', handleChatSubmit);
closeError.addEventListener('click', hideError);
quizBtn.addEventListener('click', handleQuiz);
summarizeBtn.addEventListener('click', handleSummarize);

// Functions
async function handleChatSubmit(e) {
  e.preventDefault();
  const message = userInput.value.trim();

  if (!message || isLoading) return;

  // Add user message to chat
  addMessage(message, 'user');
  userInput.value = '';

  // WORKSHOP: Call the chat API in step-1-chat
  try {
    showLoading();
    // const response = await fetch('/api/chat', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ message })
    // });
    // const data = await response.json();
    // addMessage(data.response, 'assistant');

    // Placeholder for step-0
    addMessage('Chat feature coming in step-1-chat!', 'system');
  } catch (err) {
    showError('Failed to send message. Please try again.');
  } finally {
    hideLoading();
  }
}

async function handleQuiz() {
  // WORKSHOP: Implement quiz generation in step-3-quiz-json
  const topic = prompt('What topic would you like a quiz on?');
  if (!topic) return;

  try {
    showLoading();
    // const response = await fetch('/api/quiz', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ topic })
    // });
    // const data = await response.json();
    // displayQuiz(data.quiz);

    // Placeholder for step-0
    addMessage(`Quiz feature coming in step-3-quiz-json! Topic: ${topic}`, 'system');
  } catch (err) {
    showError('Failed to generate quiz. Please try again.');
  } finally {
    hideLoading();
  }
}

async function handleSummarize() {
  // WORKSHOP: Implement summarization in step-5-multimodal
  const content = prompt('Paste your notes or text to summarize:');
  if (!content) return;

  try {
    showLoading();
    // const response = await fetch('/api/summarize', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ content })
    // });
    // const data = await response.json();
    // addMessage(data.summary, 'assistant');

    // Placeholder for step-0
    addMessage('Summarization feature coming in step-5-multimodal!', 'system');
  } catch (err) {
    showError('Failed to summarize. Please try again.');
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

// WORKSHOP: Students will add displayQuiz function in step-3-quiz-json
function displayQuiz(quiz) {
  // Placeholder for step-3-quiz-json
  console.log('Quiz data:', quiz);
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
