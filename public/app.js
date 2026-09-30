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

/* ==========================================================================
   QUIZ MASTER MODULE (Interactive timed quiz with local dataset)
   ========================================================================== */

// Local dataset for offline / backend-free Quiz Master operation
const LOCAL_QUIZ_QUESTIONS = [
  {
    question: "What does the '===' operator in JavaScript check for?",
    options: [
      "Value equality with automatic type coercion",
      "Both value and data type equality without coercion",
      "Assignment of values between variables",
      "Memory reference address pointer only"
    ],
    answerIndex: 1,
    explanation: "The strict equality operator (===) checks whether two operands are equal in both value and type without performing type coercion."
  },
  {
    question: "Which Git command creates and switches to a new branch simultaneously?",
    options: [
      "git branch -c <name>",
      "git checkout -b <name>",
      "git switch --new-branch <name>",
      "git make-branch <name>"
    ],
    answerIndex: 1,
    explanation: "Running 'git checkout -b <name>' creates the specified branch and switches HEAD to it in a single operation."
  },
  {
    question: "In asynchronous JavaScript, what state is a Promise in initially before resolution or rejection?",
    options: [
      "Fulfilled",
      "Rejected",
      "Pending",
      "Settled"
    ],
    answerIndex: 2,
    explanation: "A Promise starts in the 'pending' state and transitions to either 'fulfilled' or 'rejected'."
  },
  {
    question: "Which HTTP status code signifies that a resource was successfully created on the server?",
    options: [
      "200 OK",
      "201 Created",
      "204 No Content",
      "304 Not Modified"
    ],
    answerIndex: 1,
    explanation: "HTTP 201 Created indicates that the request succeeded and resulted in a new resource being created."
  },
  {
    question: "What is the primary function of a System Prompt when configuring LLMs like Gemini?",
    options: [
      "To set socket read and write timeouts",
      "To define the persona, behavioral rules, and constraints of the AI",
      "To encrypt API keys in browser storage",
      "To compile client JavaScript into bytecode"
    ],
    answerIndex: 1,
    explanation: "System prompts define the role, tone, safety boundaries, and operating persona of the language model."
  },
  {
    question: "What is a closure in JavaScript?",
    options: [
      "A database connection cleanup hook",
      "A function bundled with references to its surrounding lexical environment",
      "A CSS rule for closing modal dialogs",
      "A syntax construct that prevents object inheritance"
    ],
    answerIndex: 1,
    explanation: "A closure gives a function access to its outer scope even after the outer function has finished executing."
  },
  {
    question: "What feature in the Gemini API guarantees the model output strictly follows a predefined JSON schema?",
    options: [
      "Plain markdown regex post-processing",
      "Setting responseMimeType to 'application/json' with a responseSchema",
      "Passing temperature set to 0.0 only",
      "Converting prompts into binary protocol buffers"
    ],
    answerIndex: 1,
    explanation: "Using responseMimeType: 'application/json' alongside responseSchema forces structured JSON output matching the schema."
  },
  {
    question: "Which CSS property specifies how much a flex item will grow relative to other flex items?",
    options: [
      "flex-basis",
      "flex-grow",
      "flex-shrink",
      "flex-wrap"
    ],
    answerIndex: 1,
    explanation: "The flex-grow CSS property specifies what proportion of available space along the main axis should be assigned to the item."
  }
];

// Configuration
const QUESTION_TIME_LIMIT = 15; // 15 seconds per question
const POINTS_PER_QUESTION = 100;
const QUESTIONS_PER_QUIZ = 5;

// Navigation Elements
const tabChat = document.getElementById('tab-chat');
const tabNotes = document.getElementById('tab-notes');
const tabQuiz = document.getElementById('tab-quiz');
const headerNotesBtn = document.getElementById('header-notes-btn');
const headerQuizBtn = document.getElementById('header-quiz-btn');
const openNotesBtn = document.getElementById('open-notes-btn');
const openQuizMasterBtn = document.getElementById('open-quiz-master-btn');

const chatView = document.getElementById('chat-view');
const notesView = document.getElementById('notes-view');
const quizView = document.getElementById('quiz-view');

// Navigation Tab Switcher
function switchTab(target) {
  [tabChat, tabNotes, tabQuiz].forEach(tab => tab && tab.classList.remove('active'));
  [chatView, notesView, quizView].forEach(view => view && view.classList.add('hidden'));

  if (target === 'notes') {
    if (tabNotes) tabNotes.classList.add('active');
    if (notesView) notesView.classList.remove('hidden');
  } else if (target === 'quiz') {
    if (tabQuiz) tabQuiz.classList.add('active');
    if (quizView) quizView.classList.remove('hidden');
    syncNotesDropdown();
  } else {
    if (tabChat) tabChat.classList.add('active');
    if (chatView) chatView.classList.remove('hidden');
  }
}

if (tabChat) tabChat.addEventListener('click', () => switchTab('chat'));
if (tabNotes) tabNotes.addEventListener('click', () => switchTab('notes'));
if (tabQuiz) tabQuiz.addEventListener('click', () => switchTab('quiz'));
if (headerNotesBtn) headerNotesBtn.addEventListener('click', () => switchTab('notes'));
if (headerQuizBtn) headerQuizBtn.addEventListener('click', () => switchTab('quiz'));
if (openNotesBtn) openNotesBtn.addEventListener('click', () => switchTab('notes'));
if (openQuizMasterBtn) openQuizMasterBtn.addEventListener('click', () => switchTab('quiz'));

/* ==========================================================================
   STUDY NOTES MODULE (Local Storage with Gemini AI Quiz Generation)
   Ready for Firebase Backend Integration
   ========================================================================== */

const NOTES_STORAGE_KEY = 'gemini_study_buddy_notes';

// DOM Elements for Notes
const notesList = document.getElementById('notes-list');
const newNoteBtn = document.getElementById('new-note-btn');
const noteTitleInput = document.getElementById('note-title-input');
const noteContentInput = document.getElementById('note-content-input');
const noteDateBadge = document.getElementById('note-date-badge');
const noteWordCount = document.getElementById('note-word-count');
const noteCharCount = document.getElementById('note-char-count');
const saveNoteBtn = document.getElementById('save-note-btn');
const deleteNoteBtn = document.getElementById('delete-note-btn');
const generateFromNoteBtn = document.getElementById('generate-from-note-btn');

// Notes State
let savedNotes = [];
let activeNoteId = null;

// Initial sample note for immediate testing
const DEFAULT_SAMPLE_NOTE = {
  id: 'sample-1',
  title: 'JavaScript Asynchronous Architecture & Closures',
  content: `JavaScript operates on a single-threaded event loop architecture utilizing a call stack, Web APIs, and task queues. 

Key Concepts:
1. Microtasks vs Macrotasks: Promises resolve in the microtask queue, which has higher execution priority than macrotasks like setTimeout or setInterval.
2. Closures: A closure is formed when an inner function preserves lexical scope references to its outer enclosing scope, remaining accessible even after outer execution completes.
3. Strict Equality (===): Verifies both operand value and data type without implicit type coercion.
4. Error Handling: Async/await functions catch rejected Promises cleanly with try...catch blocks.`,
  createdAt: new Date().toLocaleDateString(),
  updatedAt: new Date().toLocaleDateString()
};

function loadNotes() {
  try {
    const raw = localStorage.getItem(NOTES_STORAGE_KEY);
    if (raw) {
      savedNotes = JSON.parse(raw);
    } else {
      savedNotes = [DEFAULT_SAMPLE_NOTE];
      saveNotesToStorage();
    }
  } catch (err) {
    console.error('Failed to load notes from localStorage:', err);
    savedNotes = [DEFAULT_SAMPLE_NOTE];
  }

  if (savedNotes.length > 0) {
    selectNote(savedNotes[0].id);
  } else {
    createNewNoteDraft();
  }

  renderNotesList();
  syncNotesDropdown();
}

function saveNotesToStorage() {
  try {
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(savedNotes));
  } catch (err) {
    console.error('Failed to save notes to localStorage:', err);
  }
}

function renderNotesList() {
  if (!notesList) return;
  notesList.innerHTML = '';

  if (savedNotes.length === 0) {
    notesList.innerHTML = '<div style="padding: 12px; color: var(--text-muted); font-size: 13px; text-align: center;">No notes saved yet. Click ➕ New to add one!</div>';
    return;
  }

  savedNotes.forEach(note => {
    const item = document.createElement('div');
    item.className = `note-item ${note.id === activeNoteId ? 'active' : ''}`;
    item.innerHTML = `
      <div class="note-item-title">${escapeHtml(note.title || 'Untitled Note')}</div>
      <div class="note-item-meta">${escapeHtml(note.updatedAt || note.createdAt || '')}</div>
    `;
    item.addEventListener('click', () => selectNote(note.id));
    notesList.appendChild(item);
  });
}

function selectNote(id) {
  activeNoteId = id;
  const note = savedNotes.find(n => n.id === id);
  if (!note) return;

  if (noteTitleInput) noteTitleInput.value = note.title || '';
  if (noteContentInput) noteContentInput.value = note.content || '';
  if (noteDateBadge) noteDateBadge.textContent = `Updated: ${note.updatedAt || note.createdAt || 'Draft'}`;

  updateNoteStats();
  renderNotesList();
}

function createNewNoteDraft() {
  activeNoteId = null;
  if (noteTitleInput) {
    noteTitleInput.value = '';
    noteTitleInput.focus();
  }
  if (noteContentInput) noteContentInput.value = '';
  if (noteDateBadge) noteDateBadge.textContent = 'New Draft';

  updateNoteStats();
  renderNotesList();
}

function updateNoteStats() {
  const text = noteContentInput ? noteContentInput.value : '';
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;

  if (noteWordCount) noteWordCount.textContent = `${words} words`;
  if (noteCharCount) noteCharCount.textContent = `${chars} characters`;
}

if (noteContentInput) {
  noteContentInput.addEventListener('input', updateNoteStats);
}

function handleSaveNote() {
  const title = (noteTitleInput ? noteTitleInput.value.trim() : '') || 'Untitled Study Note';
  const content = (noteContentInput ? noteContentInput.value.trim() : '');

  if (!content) {
    showError('Please enter some note content before saving.');
    return;
  }

  const now = new Date().toLocaleDateString();

  if (activeNoteId) {
    // Update existing note
    const note = savedNotes.find(n => n.id === activeNoteId);
    if (note) {
      note.title = title;
      note.content = content;
      note.updatedAt = now;
    }
  } else {
    // Create new note
    const newNote = {
      id: 'note-' + Date.now(),
      title,
      content,
      createdAt: now,
      updatedAt: now
    };
    savedNotes.unshift(newNote);
    activeNoteId = newNote.id;
  }

  saveNotesToStorage();
  renderNotesList();
  syncNotesDropdown();
  if (noteDateBadge) noteDateBadge.textContent = `Saved: ${now}`;

  // Visual success feedback
  if (saveNoteBtn) {
    const originalText = saveNoteBtn.textContent;
    saveNoteBtn.textContent = '✅ Saved!';
    setTimeout(() => { saveNoteBtn.textContent = originalText; }, 1500);
  }
}

function handleDeleteNote() {
  if (!activeNoteId) {
    createNewNoteDraft();
    return;
  }

  if (confirm('Are you sure you want to delete this note?')) {
    savedNotes = savedNotes.filter(n => n.id !== activeNoteId);
    saveNotesToStorage();
    if (savedNotes.length > 0) {
      selectNote(savedNotes[0].id);
    } else {
      createNewNoteDraft();
    }
    renderNotesList();
    syncNotesDropdown();
  }
}

// Generate Quiz directly from Note using Gemini AI
async function handleGenerateQuizFromNote() {
  const title = noteTitleInput ? noteTitleInput.value.trim() : '';
  const content = noteContentInput ? noteContentInput.value.trim() : '';

  if (!content) {
    showError('Please write or paste study notes first so Gemini can generate questions from them.');
    return;
  }

  try {
    showLoading();
    const loadingText = document.querySelector('#loading p');
    if (loadingText) loadingText.textContent = 'Gemini AI is reading your notes and generating questions...';

    const response = await fetch('/api/quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        topic: title || 'Study Notes Review',
        notes: content
      })
    });

    const data = await response.json();

    if (!response.ok || !data.quiz || !data.quiz.questions) {
      throw new Error(data.error || 'Failed to generate quiz from notes');
    }

    // Switch to Quiz Master and launch with the generated questions!
    switchTab('quiz');
    startQuiz(data.quiz.questions, `Notes: ${data.quiz.topic || title || 'Study Notes'}`);
  } catch (err) {
    console.error('Quiz from notes generation error:', err);
    showError(`Gemini could not generate quiz: ${err.message}. Ensure your GEMINI_API_KEY is configured in .env.`);
  } finally {
    hideLoading();
    const loadingText = document.querySelector('#loading p');
    if (loadingText) loadingText.textContent = 'Thinking...';
  }
}

if (newNoteBtn) newNoteBtn.addEventListener('click', createNewNoteDraft);
if (saveNoteBtn) saveNoteBtn.addEventListener('click', handleSaveNote);
if (deleteNoteBtn) deleteNoteBtn.addEventListener('click', handleDeleteNote);
if (generateFromNoteBtn) generateFromNoteBtn.addEventListener('click', handleGenerateQuizFromNote);

// Sync Notes dropdown in Quiz Master Start Screen
function syncNotesDropdown() {
  const quizSelectedNote = document.getElementById('quiz-selected-note');
  if (!quizSelectedNote) return;

  quizSelectedNote.innerHTML = '<option value="">Choose a saved note...</option>';
  savedNotes.forEach(note => {
    const opt = document.createElement('option');
    opt.value = note.id;
    opt.textContent = note.title || 'Untitled Note';
    if (note.id === activeNoteId) opt.selected = true;
    quizSelectedNote.appendChild(opt);
  });
}

// Initialize Notes on load
loadNotes();

// Quiz Master DOM Elements
const quizIntroCard = document.getElementById('quiz-intro-card');
const startQuizBtn = document.getElementById('start-quiz-btn');
const quizPlayCard = document.getElementById('quiz-play-card');
const quizCounterText = document.getElementById('quiz-counter-text');
const quizTimerBadge = document.getElementById('quiz-timer-badge');
const quizTimerCount = document.getElementById('quiz-timer-count');
const quizLiveScore = document.getElementById('quiz-live-score');
const quizProgressFill = document.getElementById('quiz-progress-fill');
const quizQuestionTitle = document.getElementById('quiz-question-title');
const quizOptionsList = document.getElementById('quiz-options-list');
const quizFeedbackBanner = document.getElementById('quiz-feedback-banner');
const quizQuitBtn = document.getElementById('quiz-quit-btn');
const quizNextBtn = document.getElementById('quiz-next-btn');

const quizResultsCard = document.getElementById('quiz-results-card');
const resultTrophy = document.getElementById('result-trophy');
const resultHeadline = document.getElementById('result-headline');
const resultFinalScore = document.getElementById('result-final-score');
const resultPercentage = document.getElementById('result-percentage');
const resultCorrectCount = document.getElementById('result-correct-count');
const resultTimeoutCount = document.getElementById('result-timeout-count');
const quizRestartBtn = document.getElementById('quiz-restart-btn');
const quizReturnChatBtn = document.getElementById('quiz-return-chat-btn');

// Quiz Master State
let quizState = {
  questions: [],
  currentIndex: 0,
  score: 0,
  correctCount: 0,
  wrongCount: 0,
  timeoutCount: 0,
  selectedOptionIndex: null,
  timerInterval: null,
  timeLeft: QUESTION_TIME_LIMIT,
  isProcessingAnswer: false,
  topicLabel: 'Core Fundamentals'
};

const quizModeSelect = document.getElementById('quiz-mode-select');
const quizNotesDropdownContainer = document.getElementById('quiz-notes-dropdown-container');
const quizCustomTopicContainer = document.getElementById('quiz-custom-topic-container');
const quizSelectedNote = document.getElementById('quiz-selected-note');
const quizCustomTopicInput = document.getElementById('quiz-custom-topic-input');

if (quizModeSelect) {
  quizModeSelect.addEventListener('change', () => {
    const mode = quizModeSelect.value;
    if (quizNotesDropdownContainer) {
      if (mode === 'notes') {
        quizNotesDropdownContainer.classList.remove('hidden');
        syncNotesDropdown();
      } else {
        quizNotesDropdownContainer.classList.add('hidden');
      }
    }
    if (quizCustomTopicContainer) {
      if (mode === 'topic') {
        quizCustomTopicContainer.classList.remove('hidden');
      } else {
        quizCustomTopicContainer.classList.add('hidden');
      }
    }
  });
}

async function handleStartQuizClick() {
  const mode = quizModeSelect ? quizModeSelect.value : 'default';

  if (mode === 'notes') {
    const noteId = quizSelectedNote ? quizSelectedNote.value : null;
    const note = savedNotes.find(n => n.id === noteId) || savedNotes[0];

    if (!note || !note.content.trim()) {
      showError('Please select a saved note with content or add one in the Study Notes tab.');
      return;
    }

    try {
      showLoading();
      const loadingText = document.querySelector('#loading p');
      if (loadingText) loadingText.textContent = `Gemini AI is reading "${note.title || 'Note'}" and building questions...`;

      const response = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: note.title || 'Study Notes',
          notes: note.content
        })
      });
      const data = await response.json();

      if (!response.ok || !data.quiz || !data.quiz.questions) {
        throw new Error(data.error || 'Failed to generate quiz from notes');
      }

      startQuiz(data.quiz.questions, `Note: ${note.title || 'Study Notes'}`);
    } catch (err) {
      console.error('Quiz start error:', err);
      showError(`Could not generate quiz from note: ${err.message}. Starting with practice questions instead.`);
      startQuiz(null, 'Core Fundamentals');
    } finally {
      hideLoading();
      const loadingText = document.querySelector('#loading p');
      if (loadingText) loadingText.textContent = 'Thinking...';
    }
  } else if (mode === 'topic') {
    const topic = (quizCustomTopicInput ? quizCustomTopicInput.value.trim() : '') || 'Web Development Fundamentals';

    try {
      showLoading();
      const loadingText = document.querySelector('#loading p');
      if (loadingText) loadingText.textContent = `Gemini AI is crafting questions on "${topic}"...`;

      const response = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic })
      });
      const data = await response.json();

      if (!response.ok || !data.quiz || !data.quiz.questions) {
        throw new Error(data.error || 'Failed to generate quiz');
      }

      startQuiz(data.quiz.questions, `Topic: ${topic}`);
    } catch (err) {
      console.error('Topic quiz error:', err);
      showError(`Could not generate quiz: ${err.message}. Starting with practice questions instead.`);
      startQuiz(null, 'Core Fundamentals');
    } finally {
      hideLoading();
      const loadingText = document.querySelector('#loading p');
      if (loadingText) loadingText.textContent = 'Thinking...';
    }
  } else {
    // Default offline questions
    startQuiz(null, 'Core Fundamentals');
  }
}

// Start Quiz Master
function startQuiz(customQuestions = null, topicLabel = 'Core Fundamentals') {
  clearInterval(quizState.timerInterval);

  let selectedQuestions;
  if (customQuestions && Array.isArray(customQuestions) && customQuestions.length > 0) {
    selectedQuestions = customQuestions.slice(0, QUESTIONS_PER_QUIZ);
  } else {
    // Shuffle and select questions from local dataset
    const shuffled = [...LOCAL_QUIZ_QUESTIONS].sort(() => Math.random() - 0.5);
    selectedQuestions = shuffled.slice(0, QUESTIONS_PER_QUIZ);
  }

  quizState = {
    questions: selectedQuestions,
    currentIndex: 0,
    score: 0,
    correctCount: 0,
    wrongCount: 0,
    timeoutCount: 0,
    selectedOptionIndex: null,
    timerInterval: null,
    timeLeft: QUESTION_TIME_LIMIT,
    isProcessingAnswer: false,
    topicLabel: topicLabel
  };

  quizIntroCard.classList.add('hidden');
  quizResultsCard.classList.add('hidden');
  quizPlayCard.classList.remove('hidden');

  renderCurrentQuestion();
}

startQuizBtn.addEventListener('click', handleStartQuizClick);
quizRestartBtn.addEventListener('click', () => {
  // Re-run with previous custom questions if available, or restart
  startQuiz(quizState.questions, quizState.topicLabel);
});
quizReturnChatBtn.addEventListener('click', () => {
  switchTab('chat');
  quizResultsCard.classList.add('hidden');
  quizIntroCard.classList.remove('hidden');
});

quizQuitBtn.addEventListener('click', () => {
  if (confirm('Are you sure you want to quit the quiz?')) {
    clearInterval(quizState.timerInterval);
    quizPlayCard.classList.add('hidden');
    quizIntroCard.classList.remove('hidden');
  }
});

// Render the active question
function renderCurrentQuestion() {
  const currentQ = quizState.questions[quizState.currentIndex];
  const totalQ = quizState.questions.length;

  quizState.selectedOptionIndex = null;
  quizState.isProcessingAnswer = false;

  // Question Counter
  quizCounterText.textContent = `Question ${quizState.currentIndex + 1} of ${totalQ}`;

  // Progress Bar
  const progressPercent = ((quizState.currentIndex + 1) / totalQ) * 100;
  quizProgressFill.style.width = `${progressPercent}%`;

  // Live Score Display
  quizLiveScore.textContent = quizState.score;

  // Question Title
  quizQuestionTitle.textContent = currentQ.question;

  // Reset Feedback and Next Button
  quizFeedbackBanner.className = 'feedback-banner hidden';
  quizFeedbackBanner.textContent = '';
  quizNextBtn.disabled = true;

  // Render 4 Options
  quizOptionsList.innerHTML = '';
  const optionLetters = ['A', 'B', 'C', 'D'];

  currentQ.options.forEach((optionText, index) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'option-btn';
    btn.innerHTML = `<span class="option-letter">${optionLetters[index]}</span><span class="option-text">${escapeHtml(optionText)}</span>`;
    btn.addEventListener('click', () => selectOption(index));
    quizOptionsList.appendChild(btn);
  });

  // Start countdown timer for this question
  startTimer();
}

// Option selection
function selectOption(index) {
  if (quizState.isProcessingAnswer) return;

  quizState.selectedOptionIndex = index;

  const buttons = quizOptionsList.querySelectorAll('.option-btn');
  buttons.forEach((btn, i) => {
    if (i === index) {
      btn.classList.add('selected');
    } else {
      btn.classList.remove('selected');
    }
  });

  // Enable the Next Question button once an answer is chosen
  quizNextBtn.disabled = false;
}

// Timer management
function startTimer() {
  clearInterval(quizState.timerInterval);
  quizState.timeLeft = QUESTION_TIME_LIMIT;
  updateTimerDisplay();

  quizState.timerInterval = setInterval(() => {
    quizState.timeLeft--;
    updateTimerDisplay();

    if (quizState.timeLeft <= 0) {
      clearInterval(quizState.timerInterval);
      handleQuestionTimeout();
    }
  }, 1000);
}

function updateTimerDisplay() {
  quizTimerCount.textContent = quizState.timeLeft;

  quizTimerBadge.classList.remove('warning', 'danger');
  if (quizState.timeLeft <= 4) {
    quizTimerBadge.classList.add('danger');
  } else if (quizState.timeLeft <= 8) {
    quizTimerBadge.classList.add('warning');
  }
}

// Automatic timeout when countdown hits 0
function handleQuestionTimeout() {
  if (quizState.isProcessingAnswer) return;
  quizState.isProcessingAnswer = true;

  quizState.timeoutCount++;
  quizState.wrongCount++;

  const currentQ = quizState.questions[quizState.currentIndex];
  const buttons = quizOptionsList.querySelectorAll('.option-btn');

  // Disable options and highlight the correct answer
  buttons.forEach((btn, i) => {
    btn.disabled = true;
    if (i === currentQ.answerIndex) {
      btn.classList.add('correct');
    }
  });

  quizNextBtn.disabled = true;

  // Show visual timeout alert
  quizFeedbackBanner.className = 'feedback-banner timeout';
  quizFeedbackBanner.textContent = `⏰ Time's up! Question marked as unanswered/wrong.`;
  quizFeedbackBanner.classList.remove('hidden');

  // Automatically advance to the next question after a brief delay
  setTimeout(() => {
    advanceToNext();
  }, 1500);
}

// Handle Next Question button click
quizNextBtn.addEventListener('click', handleNextQuestionClick);

function handleNextQuestionClick() {
  if (quizState.selectedOptionIndex === null || quizState.isProcessingAnswer) return;

  clearInterval(quizState.timerInterval);
  quizState.isProcessingAnswer = true;

  const currentQ = quizState.questions[quizState.currentIndex];
  const isCorrect = (quizState.selectedOptionIndex === currentQ.answerIndex);
  const buttons = quizOptionsList.querySelectorAll('.option-btn');

  buttons.forEach((btn, i) => {
    btn.disabled = true;
    if (i === currentQ.answerIndex) {
      btn.classList.add('correct');
    }
    if (i === quizState.selectedOptionIndex && !isCorrect) {
      btn.classList.add('incorrect');
    }
  });

  if (isCorrect) {
    quizState.score += POINTS_PER_QUESTION;
    quizState.correctCount++;
    quizLiveScore.textContent = quizState.score;

    quizFeedbackBanner.className = 'feedback-banner correct';
    quizFeedbackBanner.textContent = `✅ Correct! +${POINTS_PER_QUESTION} pts`;
  } else {
    quizState.wrongCount++;
    const correctLetter = ['A', 'B', 'C', 'D'][currentQ.answerIndex];
    quizFeedbackBanner.className = 'feedback-banner incorrect';
    quizFeedbackBanner.textContent = `❌ Incorrect. The correct answer was (${correctLetter}).`;
  }

  quizFeedbackBanner.classList.remove('hidden');
  quizNextBtn.disabled = true;

  // Advance after displaying visual feedback
  setTimeout(() => {
    advanceToNext();
  }, 1200);
}

function advanceToNext() {
  clearInterval(quizState.timerInterval);

  if (quizState.currentIndex + 1 < quizState.questions.length) {
    quizState.currentIndex++;
    renderCurrentQuestion();
  } else {
    showResults();
  }
}

// Final Results Screen
function showResults() {
  clearInterval(quizState.timerInterval);

  quizPlayCard.classList.add('hidden');
  quizResultsCard.classList.remove('hidden');

  const total = quizState.questions.length;
  const percentage = Math.round((quizState.correctCount / total) * 100);

  resultFinalScore.textContent = quizState.score;
  resultPercentage.textContent = `${percentage}%`;
  resultCorrectCount.textContent = `${quizState.correctCount} / ${total}`;
  resultTimeoutCount.textContent = quizState.timeoutCount;

  if (percentage >= 80) {
    resultTrophy.textContent = '🏆';
    resultHeadline.textContent = 'Quiz Master Champion!';
  } else if (percentage >= 60) {
    resultTrophy.textContent = '🎉';
    resultHeadline.textContent = 'Great Job!';
  } else {
    resultTrophy.textContent = '📚';
    resultHeadline.textContent = 'Good Effort!';
  }
}

