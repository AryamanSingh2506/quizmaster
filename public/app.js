// Firebase Service Imports
import {
  auth,
  db,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
  increment
} from './firebase-config.js';

/* ==========================================================================
   GLOBAL APP CONFIGURATION & CONSTANTS
   ========================================================================== */
const DAILY_QUESTION_LIMIT = 50; // Strict daily limit of 50 quiz questions per user
const QUESTION_TIME_LIMIT = 15;  // 15 seconds per question with auto-timeout
const POINTS_PER_QUESTION = 100; // 100 XP per correct answer
const QUESTIONS_PER_QUIZ = 5;

// Offline Question Dataset
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

// Fallback Leaderboard Seeds (rendered if Firestore is freshly initialized)
const SEED_LEADERBOARD = [
  { displayName: "Alex Mercer", xp: 3200, totalQuizzes: 12, questionsAnsweredToday: 15 },
  { displayName: "Maya Chen", xp: 2800, totalQuizzes: 10, questionsAnsweredToday: 20 },
  { displayName: "Jordan Patel", xp: 2400, totalQuizzes: 9, questionsAnsweredToday: 10 },
  { displayName: "Samira Khan", xp: 1900, totalQuizzes: 7, questionsAnsweredToday: 5 },
  { displayName: "Liam O'Connor", xp: 1400, totalQuizzes: 5, questionsAnsweredToday: 8 }
];

/* ==========================================================================
   DOM ELEMENTS
   ========================================================================== */
// Navigation & Views
const tabChat = document.getElementById('tab-chat');
const tabNotes = document.getElementById('tab-notes');
const tabQuiz = document.getElementById('tab-quiz');
const tabLeaderboard = document.getElementById('tab-leaderboard');

const chatView = document.getElementById('chat-view');
const notesView = document.getElementById('notes-view');
const quizView = document.getElementById('quiz-view');
const leaderboardView = document.getElementById('leaderboard-view');

const headerNotesBtn = document.getElementById('header-notes-btn');
const headerQuizBtn = document.getElementById('header-quiz-btn');
const headerLeaderboardBtn = document.getElementById('header-leaderboard-btn');
const headerAuthBtn = document.getElementById('header-auth-btn');
const headerAuthText = document.getElementById('header-auth-text');

const openNotesBtn = document.getElementById('open-notes-btn');
const openQuizMasterBtn = document.getElementById('open-quiz-master-btn');
const openLeaderboardBtn = document.getElementById('open-leaderboard-btn');

// User Profile & Sidebar Elements
const userAvatarDisplay = document.getElementById('user-avatar-display');
const userNameDisplay = document.getElementById('user-name-display');
const userEmailDisplay = document.getElementById('user-email-display');
const sidebarAuthBtn = document.getElementById('sidebar-auth-btn');
const sidebarQuotaText = document.getElementById('sidebar-quota-text');
const sidebarQuotaFill = document.getElementById('sidebar-quota-fill');

// Chat Elements
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const messagesContainer = document.getElementById('messages');
const quizBtn = document.getElementById('quiz-btn');

// Notes Elements
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

// Quiz Elements
const quizQuotaLimitBanner = document.getElementById('quiz-quota-limit-banner');
const introQuotaCounter = document.getElementById('intro-quota-counter');
const quizIntroCard = document.getElementById('quiz-intro-card');
const startQuizBtn = document.getElementById('start-quiz-btn');
const quizModeSelect = document.getElementById('quiz-mode-select');
const quizNotesDropdownContainer = document.getElementById('quiz-notes-dropdown-container');
const quizSelectedNote = document.getElementById('quiz-selected-note');
const quizCustomTopicContainer = document.getElementById('quiz-custom-topic-container');
const quizCustomTopicInput = document.getElementById('quiz-custom-topic-input');

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
const resultQuotaCount = document.getElementById('result-quota-count');
const quizRestartBtn = document.getElementById('quiz-restart-btn');
const quizGotoLeaderboardBtn = document.getElementById('quiz-goto-leaderboard-btn');
const quizReturnChatBtn = document.getElementById('quiz-return-chat-btn');

// Leaderboard Elements
const leaderboardBody = document.getElementById('leaderboard-body');
const refreshLeaderboardBtn = document.getElementById('refresh-leaderboard-btn');
const podiumName1 = document.getElementById('podium-name-1');
const podiumXp1 = document.getElementById('podium-xp-1');
const podiumName2 = document.getElementById('podium-name-2');
const podiumXp2 = document.getElementById('podium-xp-2');
const podiumName3 = document.getElementById('podium-name-3');
const podiumXp3 = document.getElementById('podium-xp-3');

// Auth Modal Elements
const authModal = document.getElementById('auth-modal');
const closeAuthModal = document.getElementById('close-auth-modal');
const googleSigninBtn = document.getElementById('google-signin-btn');
const authForm = document.getElementById('auth-form');
const authNameField = document.getElementById('auth-name-field');
const authNameInput = document.getElementById('auth-name-input');
const authEmailInput = document.getElementById('auth-email-input');
const authPasswordInput = document.getElementById('auth-password-input');
const authErrorAlert = document.getElementById('auth-error-alert');
const authSubmitBtn = document.getElementById('auth-submit-btn');
const authTogglePrompt = document.getElementById('auth-toggle-prompt');
const authToggleModeBtn = document.getElementById('auth-toggle-mode-btn');
const authModalTitle = document.getElementById('auth-modal-title');

// Global Modals / Feedback
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const errorMessage = document.getElementById('error-message');
const closeError = document.getElementById('close-error');

/* ==========================================================================
   STATE MANAGEMENT
   ========================================================================== */
let currentUser = null; // Firebase User
let userProfile = {
  uid: null,
  displayName: 'Guest Learner',
  email: '',
  photoURL: '',
  xp: 0,
  totalQuizzes: 0,
  questionsAnsweredToday: 0,
  lastQuizDate: getTodayDateString()
};

let savedNotes = [];
let activeNoteId = null;
let isAuthSignUpMode = false;
let isLoading = false;
let unsubscribeNotes = null;
let unsubscribeLeaderboard = null;

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

/* ==========================================================================
   DATE & QUOTA HELPERS
   ========================================================================== */
function getTodayDateString() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getDailyQuotaUsed() {
  const today = getTodayDateString();
  if (currentUser && userProfile) {
    if (userProfile.lastQuizDate !== today) {
      userProfile.questionsAnsweredToday = 0;
      userProfile.lastQuizDate = today;
    }
    return userProfile.questionsAnsweredToday || 0;
  }
  // Fallback for guest mode in localStorage
  try {
    const raw = localStorage.getItem('guest_daily_quota');
    if (raw) {
      const data = JSON.parse(raw);
      if (data.date === today) return data.count || 0;
    }
  } catch (e) {}
  return 0;
}

function updateDailyQuotaDisplay() {
  const count = getDailyQuotaUsed();
  const remaining = Math.max(0, DAILY_QUESTION_LIMIT - count);
  const percentage = Math.min(100, Math.round((count / DAILY_QUESTION_LIMIT) * 100));

  // Sidebar quota
  if (sidebarQuotaText) sidebarQuotaText.textContent = `${count} / ${DAILY_QUESTION_LIMIT}`;
  if (sidebarQuotaFill) {
    sidebarQuotaFill.style.width = `${percentage}%`;
    sidebarQuotaFill.classList.remove('warning', 'danger');
    if (count >= DAILY_QUESTION_LIMIT) {
      sidebarQuotaFill.classList.add('danger');
    } else if (count >= 35) {
      sidebarQuotaFill.classList.add('warning');
    }
  }

  // Quiz intro quota
  if (introQuotaCounter) {
    introQuotaCounter.textContent = `${count} / ${DAILY_QUESTION_LIMIT} questions used today (${remaining} remaining)`;
  }

  // Quota banner toggle
  if (quizQuotaLimitBanner) {
    if (count >= DAILY_QUESTION_LIMIT) {
      quizQuotaLimitBanner.classList.remove('hidden');
      if (startQuizBtn) {
        startQuizBtn.disabled = true;
        startQuizBtn.textContent = '🔒 Daily Limit Reached';
      }
    } else {
      quizQuotaLimitBanner.classList.add('hidden');
      if (startQuizBtn) {
        startQuizBtn.disabled = false;
        startQuizBtn.textContent = '🚀 Start Quiz';
      }
    }
  }

  if (resultQuotaCount) {
    resultQuotaCount.textContent = `${count} / ${DAILY_QUESTION_LIMIT}`;
  }
}

async function incrementDailyQuestionsCount(delta = 1) {
  const today = getTodayDateString();
  if (currentUser) {
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        questionsAnsweredToday: increment(delta),
        lastQuizDate: today,
        updatedAt: serverTimestamp()
      });
      userProfile.questionsAnsweredToday = (userProfile.questionsAnsweredToday || 0) + delta;
      userProfile.lastQuizDate = today;
    } catch (err) {
      console.warn("Could not increment Firestore quota, updating locally:", err);
      userProfile.questionsAnsweredToday = (userProfile.questionsAnsweredToday || 0) + delta;
    }
  } else {
    // Guest increment in localStorage
    const current = getDailyQuotaUsed();
    const newCount = current + delta;
    localStorage.setItem('guest_daily_quota', JSON.stringify({
      date: today,
      count: newCount
    }));
  }
  updateDailyQuotaDisplay();
}

/* ==========================================================================
   NAVIGATION TAB SWITCHER
   ========================================================================== */
function switchTab(target) {
  [tabChat, tabNotes, tabQuiz, tabLeaderboard].forEach(tab => tab && tab.classList.remove('active'));
  [chatView, notesView, quizView, leaderboardView].forEach(view => view && view.classList.add('hidden'));

  if (target === 'notes') {
    if (tabNotes) tabNotes.classList.add('active');
    if (notesView) notesView.classList.remove('hidden');
  } else if (target === 'quiz') {
    if (tabQuiz) tabQuiz.classList.add('active');
    if (quizView) quizView.classList.remove('hidden');
    syncNotesDropdown();
    updateDailyQuotaDisplay();
  } else if (target === 'leaderboard') {
    if (tabLeaderboard) tabLeaderboard.classList.add('active');
    if (leaderboardView) leaderboardView.classList.remove('hidden');
    fetchAndRenderLeaderboard();
  } else {
    if (tabChat) tabChat.classList.add('active');
    if (chatView) chatView.classList.remove('hidden');
  }
}

if (tabChat) tabChat.addEventListener('click', () => switchTab('chat'));
if (tabNotes) tabNotes.addEventListener('click', () => switchTab('notes'));
if (tabQuiz) tabQuiz.addEventListener('click', () => switchTab('quiz'));
if (tabLeaderboard) tabLeaderboard.addEventListener('click', () => switchTab('leaderboard'));

if (headerNotesBtn) headerNotesBtn.addEventListener('click', () => switchTab('notes'));
if (headerQuizBtn) headerQuizBtn.addEventListener('click', () => switchTab('quiz'));
if (headerLeaderboardBtn) headerLeaderboardBtn.addEventListener('click', () => switchTab('leaderboard'));
if (openNotesBtn) openNotesBtn.addEventListener('click', () => switchTab('notes'));
if (openQuizMasterBtn) openQuizMasterBtn.addEventListener('click', () => switchTab('quiz'));
if (openLeaderboardBtn) openLeaderboardBtn.addEventListener('click', () => switchTab('leaderboard'));
if (quizGotoLeaderboardBtn) quizGotoLeaderboardBtn.addEventListener('click', () => switchTab('leaderboard'));

/* ==========================================================================
   AUTHENTICATION & PROFILE MANAGEMENT
   ========================================================================== */
function openAuthModal(isSignUp = false) {
  isAuthSignUpMode = isSignUp;
  updateAuthModalUI();
  if (authErrorAlert) {
    authErrorAlert.textContent = '';
    authErrorAlert.classList.add('hidden');
  }
  if (authModal) authModal.classList.remove('hidden');
}

function hideAuthModal() {
  if (authModal) authModal.classList.add('hidden');
}

function updateAuthModalUI() {
  if (!authModalTitle || !authSubmitBtn || !authToggleModeBtn) return;
  if (isAuthSignUpMode) {
    authModalTitle.textContent = 'Create Study Buddy Account';
    authNameField.classList.remove('hidden');
    authSubmitBtn.textContent = 'Create Account';
    authTogglePrompt.textContent = 'Already have an account?';
    authToggleModeBtn.textContent = 'Sign In';
  } else {
    authModalTitle.textContent = 'Sign In to Study Buddy';
    authNameField.classList.add('hidden');
    authSubmitBtn.textContent = 'Sign In';
    authTogglePrompt.textContent = "Don't have an account?";
    authToggleModeBtn.textContent = 'Create an account';
  }
}

if (closeAuthModal) closeAuthModal.addEventListener('click', hideAuthModal);
if (authToggleModeBtn) {
  authToggleModeBtn.addEventListener('click', () => {
    isAuthSignUpMode = !isAuthSignUpMode;
    updateAuthModalUI();
  });
}

// Google Sign-In
if (googleSigninBtn) {
  googleSigninBtn.addEventListener('click', async () => {
    try {
      showLoading();
      const result = await signInWithPopup(auth, googleProvider);
      currentUser = result.user;
      renderUserUI(result.user);
      hideAuthModal();
    } catch (err) {
      console.error('Google Sign-In failed:', err);
      showAuthError(err.message || 'Google sign-in could not be completed.');
    } finally {
      hideLoading();
    }
  });
}

// Email/Password Auth Form
if (authForm) {
  authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = authEmailInput.value.trim();
    const password = authPasswordInput.value;
    const name = authNameInput ? authNameInput.value.trim() : '';

    if (!email || !password) return;

    try {
      showLoading();
      if (isAuthSignUpMode) {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        if (name && userCred.user) {
          await updateProfile(userCred.user, { displayName: name });
        }
        currentUser = userCred.user;
        renderUserUI(userCred.user, { displayName: name });
      } else {
        const userCred = await signInWithEmailAndPassword(auth, email, password);
        currentUser = userCred.user;
        renderUserUI(userCred.user);
      }
      hideAuthModal();
      authForm.reset();
    } catch (err) {
      console.error('Email authentication error:', err);
      let userMsg = err.message;
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        userMsg = 'Incorrect password or email combination.';
      } else if (err.code === 'auth/user-not-found') {
        userMsg = 'No registered user found with this email.';
      } else if (err.code === 'auth/email-already-in-use') {
        userMsg = 'An account with this email already exists. Try signing in.';
      } else if (err.code === 'auth/weak-password') {
        userMsg = 'Password must be at least 6 characters.';
      }
      showAuthError(userMsg);
    } finally {
      hideLoading();
    }
  });
}

function showAuthError(msg) {
  if (authErrorAlert) {
    authErrorAlert.textContent = msg;
    authErrorAlert.classList.remove('hidden');
  }
}

// Synchronous User UI Renderer
function renderUserUI(user, extraProfile = null) {
  if (user) {
    const displayName = (extraProfile && extraProfile.displayName) || user.displayName || (user.email ? user.email.split('@')[0] : 'Learner');
    const email = user.email || (extraProfile && extraProfile.email) || '';
    const photoURL = (extraProfile && extraProfile.photoURL) || user.photoURL || '';

    if (userNameDisplay) userNameDisplay.textContent = displayName;
    if (userEmailDisplay) userEmailDisplay.textContent = email || 'Signed In';
    if (userAvatarDisplay) {
      if (photoURL) {
        userAvatarDisplay.innerHTML = `<img src="${escapeHtml(photoURL)}" alt="avatar">`;
      } else {
        const initial = (displayName[0] || 'U').toUpperCase();
        userAvatarDisplay.textContent = initial;
      }
    }
    if (sidebarAuthBtn) sidebarAuthBtn.textContent = 'Sign Out';
    if (headerAuthText) headerAuthText.textContent = displayName;
  } else {
    if (userNameDisplay) userNameDisplay.textContent = 'Guest Learner';
    if (userEmailDisplay) userEmailDisplay.textContent = 'Sign in to sync data';
    if (userAvatarDisplay) userAvatarDisplay.textContent = 'GL';
    if (sidebarAuthBtn) sidebarAuthBtn.textContent = 'Login';
    if (headerAuthText) headerAuthText.textContent = 'Sign In';
  }
}

// Auth Header and Sidebar Click Handlers
function handleAuthButtonClick() {
  if (currentUser) {
    if (confirm('Are you sure you want to sign out?')) {
      signOut(auth).then(() => {
        currentUser = null;
        renderUserUI(null);
      }).catch(err => console.error("Sign out error:", err));
    }
  } else {
    openAuthModal(false);
  }
}

if (sidebarAuthBtn) sidebarAuthBtn.addEventListener('click', handleAuthButtonClick);
if (headerAuthBtn) headerAuthBtn.addEventListener('click', handleAuthButtonClick);

// Listen to Firebase Auth State changes
onAuthStateChanged(auth, async (user) => {
  currentUser = user;
  
  // 1. Immediately update UI synchronously so name, email, avatar, and buttons reflect instantly
  renderUserUI(user);

  if (user) {
    const today = getTodayDateString();
    const userDocRef = doc(db, 'users', user.uid);

    // 2. Non-blocking Firestore synchronization with timeout guard
    try {
      const fetchPromise = getDoc(userDocRef);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Firestore profile timeout')), 2500)
      );
      const snap = await Promise.race([fetchPromise, timeoutPromise]);

      if (snap && snap.exists()) {
        const remoteData = snap.data();
        userProfile = { ...userProfile, ...remoteData };
        if (userProfile.lastQuizDate !== today) {
          userProfile.questionsAnsweredToday = 0;
          userProfile.lastQuizDate = today;
          updateDoc(userDocRef, {
            questionsAnsweredToday: 0,
            lastQuizDate: today
          }).catch(() => {});
        }
        renderUserUI(user, userProfile);
      } else {
        userProfile = {
          uid: user.uid,
          displayName: user.displayName || user.email.split('@')[0],
          email: user.email,
          photoURL: user.photoURL || '',
          xp: 0,
          totalQuizzes: 0,
          questionsAnsweredToday: 0,
          lastQuizDate: today,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };
        setDoc(userDocRef, userProfile).catch(() => {});
      }
    } catch (err) {
      console.warn("Firestore profile sync fallback (offline/timeout):", err.message);
      userProfile = {
        uid: user.uid,
        displayName: user.displayName || user.email.split('@')[0],
        email: user.email,
        photoURL: user.photoURL || '',
        xp: 0,
        totalQuizzes: 0,
        questionsAnsweredToday: 0,
        lastQuizDate: today
      };
    }

    // Sync Firestore Notes for this user
    initFirestoreNotesListener(user.uid);
  } else {
    // Guest Mode
    userProfile = {
      uid: null,
      displayName: 'Guest Learner',
      email: '',
      photoURL: '',
      xp: 0,
      totalQuizzes: 0,
      questionsAnsweredToday: getDailyQuotaUsed(),
      lastQuizDate: getTodayDateString()
    };

    if (unsubscribeNotes) {
      unsubscribeNotes();
      unsubscribeNotes = null;
    }
    loadLocalNotes();
  }

  updateDailyQuotaDisplay();
  fetchAndRenderLeaderboard();
});

/* ==========================================================================
   STUDY NOTES MODULE (Firestore Sync with Local Fallback)
   ========================================================================== */
const NOTES_STORAGE_KEY = 'gemini_study_buddy_notes';

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

function initFirestoreNotesListener(userId) {
  if (unsubscribeNotes) unsubscribeNotes();

  const notesRef = collection(db, 'users', userId, 'notes');
  const q = query(notesRef, orderBy('updatedAt', 'desc'));

  unsubscribeNotes = onSnapshot(q, (snapshot) => {
    savedNotes = [];
    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      savedNotes.push({
        id: docSnap.id,
        title: data.title || 'Untitled Note',
        content: data.content || '',
        createdAt: data.createdAt ? new Date(data.createdAt.seconds * 1000).toLocaleDateString() : '',
        updatedAt: data.updatedAt ? new Date(data.updatedAt.seconds * 1000).toLocaleDateString() : ''
      });
    });

    if (savedNotes.length === 0) {
      // Create initial sample note in Firestore
      handleSaveDefaultNoteToFirestore(userId);
    } else {
      if (!activeNoteId || !savedNotes.find(n => n.id === activeNoteId)) {
        selectNote(savedNotes[0].id);
      }
      renderNotesList();
      syncNotesDropdown();
    }
  }, (err) => {
    console.warn("Firestore notes listener error, falling back to local storage:", err);
    loadLocalNotes();
  });
}

async function handleSaveDefaultNoteToFirestore(userId) {
  try {
    const docRef = await addDoc(collection(db, 'users', userId, 'notes'), {
      title: DEFAULT_SAMPLE_NOTE.title,
      content: DEFAULT_SAMPLE_NOTE.content,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    DEFAULT_SAMPLE_NOTE.id = docRef.id;
  } catch (err) {
    loadLocalNotes();
  }
}

function loadLocalNotes() {
  try {
    const raw = localStorage.getItem(NOTES_STORAGE_KEY);
    if (raw) {
      savedNotes = JSON.parse(raw);
    } else {
      savedNotes = [DEFAULT_SAMPLE_NOTE];
      saveNotesToLocalStorage();
    }
  } catch (err) {
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

function saveNotesToLocalStorage() {
  try {
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(savedNotes));
  } catch (err) {}
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

async function handleSaveNote() {
  const title = (noteTitleInput ? noteTitleInput.value.trim() : '') || 'Untitled Study Note';
  const content = (noteContentInput ? noteContentInput.value.trim() : '');

  if (!content) {
    showError('Please enter some note content before saving.');
    return;
  }

  const nowStr = new Date().toLocaleDateString();

  if (currentUser) {
    try {
      showLoading();
      if (activeNoteId) {
        const noteDocRef = doc(db, 'users', currentUser.uid, 'notes', activeNoteId);
        await updateDoc(noteDocRef, {
          title,
          content,
          updatedAt: serverTimestamp()
        });
      } else {
        const newDoc = await addDoc(collection(db, 'users', currentUser.uid, 'notes'), {
          title,
          content,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        activeNoteId = newDoc.id;
      }
    } catch (err) {
      console.error('Firestore note save error:', err);
      showError('Failed to save to Cloud Firestore. Note stored locally.');
    } finally {
      hideLoading();
    }
  } else {
    // Local storage note save
    if (activeNoteId) {
      const note = savedNotes.find(n => n.id === activeNoteId);
      if (note) {
        note.title = title;
        note.content = content;
        note.updatedAt = nowStr;
      }
    } else {
      const newNote = {
        id: 'note-' + Date.now(),
        title,
        content,
        createdAt: nowStr,
        updatedAt: nowStr
      };
      savedNotes.unshift(newNote);
      activeNoteId = newNote.id;
    }
    saveNotesToLocalStorage();
    renderNotesList();
  }

  syncNotesDropdown();
  if (noteDateBadge) noteDateBadge.textContent = `Saved: ${nowStr}`;

  if (saveNoteBtn) {
    const orig = saveNoteBtn.textContent;
    saveNoteBtn.textContent = '✅ Saved!';
    setTimeout(() => { saveNoteBtn.textContent = orig; }, 1500);
  }
}

async function handleDeleteNote() {
  if (!activeNoteId) {
    createNewNoteDraft();
    return;
  }

  if (!confirm('Are you sure you want to delete this note?')) return;

  if (currentUser) {
    try {
      showLoading();
      await deleteDoc(doc(db, 'users', currentUser.uid, 'notes', activeNoteId));
      activeNoteId = null;
      createNewNoteDraft();
    } catch (err) {
      console.error('Firestore note deletion error:', err);
      showError('Failed to delete note from Cloud.');
    } finally {
      hideLoading();
    }
  } else {
    savedNotes = savedNotes.filter(n => n.id !== activeNoteId);
    saveNotesToLocalStorage();
    if (savedNotes.length > 0) {
      selectNote(savedNotes[0].id);
    } else {
      createNewNoteDraft();
    }
    renderNotesList();
    syncNotesDropdown();
  }
}

async function handleGenerateQuizFromNote() {
  const title = noteTitleInput ? noteTitleInput.value.trim() : '';
  const content = noteContentInput ? noteContentInput.value.trim() : '';

  if (!content) {
    showError('Please write or paste study notes first so Gemini can generate questions from them.');
    return;
  }

  // Quota verification before generation
  const usedToday = getDailyQuotaUsed();
  if (usedToday >= DAILY_QUESTION_LIMIT) {
    showError('Daily quiz limit of 50 questions reached. You cannot generate more quizzes today.');
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

function syncNotesDropdown() {
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

/* ==========================================================================
   QUIZ MASTER MODULE (With 50 Questions/Day Quota Limit)
   ========================================================================== */
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
  const currentCount = getDailyQuotaUsed();
  if (currentCount >= DAILY_QUESTION_LIMIT) {
    showError(`Daily quiz limit reached (${DAILY_QUESTION_LIMIT}/${DAILY_QUESTION_LIMIT} questions). Come back tomorrow to continue!`);
    updateDailyQuotaDisplay();
    return;
  }

  const mode = quizModeSelect ? quizModeSelect.value : 'default';

  if (mode === 'notes') {
    const noteId = quizSelectedNote ? quizSelectedNote.value : null;
    const note = savedNotes.find(n => n.id === noteId) || savedNotes[0];

    if (!note || !note.content.trim()) {
      showError('Please select a saved note with content or create one in the Study Notes tab.');
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
      console.warn('Quiz start fallback to local questions:', err);
      showError(`Could not generate quiz: ${err.message}. Starting with practice questions instead.`);
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
      console.warn('Topic quiz error fallback:', err);
      showError(`Could not generate quiz: ${err.message}. Starting with practice questions instead.`);
      startQuiz(null, 'Core Fundamentals');
    } finally {
      hideLoading();
      const loadingText = document.querySelector('#loading p');
      if (loadingText) loadingText.textContent = 'Thinking...';
    }
  } else {
    // Offline local questions
    startQuiz(null, 'Core Fundamentals');
  }
}

function startQuiz(customQuestions = null, topicLabel = 'Core Fundamentals') {
  clearInterval(quizState.timerInterval);

  // Check remaining daily quota
  const usedToday = getDailyQuotaUsed();
  const remainingQuota = Math.max(0, DAILY_QUESTION_LIMIT - usedToday);

  if (remainingQuota <= 0) {
    showError('Daily quiz limit of 50 questions reached.');
    updateDailyQuotaDisplay();
    return;
  }

  // Adjust number of questions to never exceed daily quota of 50
  const questionsInThisQuiz = Math.min(QUESTIONS_PER_QUIZ, remainingQuota);

  let selectedQuestions;
  if (customQuestions && Array.isArray(customQuestions) && customQuestions.length > 0) {
    selectedQuestions = customQuestions.slice(0, questionsInThisQuiz);
  } else {
    const shuffled = [...LOCAL_QUIZ_QUESTIONS].sort(() => Math.random() - 0.5);
    selectedQuestions = shuffled.slice(0, questionsInThisQuiz);
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

if (startQuizBtn) startQuizBtn.addEventListener('click', handleStartQuizClick);
if (quizRestartBtn) {
  quizRestartBtn.addEventListener('click', () => {
    quizResultsCard.classList.add('hidden');
    quizIntroCard.classList.remove('hidden');
    updateDailyQuotaDisplay();
  });
}
if (quizReturnChatBtn) {
  quizReturnChatBtn.addEventListener('click', () => {
    switchTab('chat');
    quizResultsCard.classList.add('hidden');
    quizIntroCard.classList.remove('hidden');
  });
}

if (quizQuitBtn) {
  quizQuitBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to quit the quiz?')) {
      clearInterval(quizState.timerInterval);
      quizPlayCard.classList.add('hidden');
      quizIntroCard.classList.remove('hidden');
    }
  });
}

function renderCurrentQuestion() {
  const currentQ = quizState.questions[quizState.currentIndex];
  const totalQ = quizState.questions.length;

  quizState.selectedOptionIndex = null;
  quizState.isProcessingAnswer = false;

  quizCounterText.textContent = `Question ${quizState.currentIndex + 1} of ${totalQ}`;
  const progressPercent = ((quizState.currentIndex + 1) / totalQ) * 100;
  quizProgressFill.style.width = `${progressPercent}%`;
  quizLiveScore.textContent = quizState.score;
  quizQuestionTitle.innerHTML = formatInlineText(currentQ.question);

  quizFeedbackBanner.className = 'feedback-banner hidden';
  quizFeedbackBanner.textContent = '';
  quizNextBtn.disabled = true;

  quizOptionsList.innerHTML = '';
  const optionLetters = ['A', 'B', 'C', 'D'];

  currentQ.options.forEach((optionText, index) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'option-btn';
    btn.innerHTML = `<span class="option-letter">${optionLetters[index]}</span><span class="option-text">${formatInlineText(optionText)}</span>`;
    btn.addEventListener('click', () => selectOption(index));
    quizOptionsList.appendChild(btn);
  });

  startTimer();
}

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

  quizNextBtn.disabled = false;
}

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

async function handleQuestionTimeout() {
  if (quizState.isProcessingAnswer) return;
  quizState.isProcessingAnswer = true;

  quizState.timeoutCount++;
  quizState.wrongCount++;

  // Record this question against daily 50 questions quota
  await incrementDailyQuestionsCount(1);

  const currentQ = quizState.questions[quizState.currentIndex];
  const buttons = quizOptionsList.querySelectorAll('.option-btn');

  buttons.forEach((btn, i) => {
    btn.disabled = true;
    if (i === currentQ.answerIndex) {
      btn.classList.add('correct');
    }
  });

  quizNextBtn.disabled = true;

  quizFeedbackBanner.className = 'feedback-banner timeout';
  quizFeedbackBanner.innerHTML = `⏰ <strong>Time's up!</strong> Question marked as unanswered/wrong.`;
  quizFeedbackBanner.classList.remove('hidden');

  setTimeout(() => {
    advanceToNext();
  }, 1500);
}

if (quizNextBtn) quizNextBtn.addEventListener('click', handleNextQuestionClick);

async function handleNextQuestionClick() {
  if (quizState.selectedOptionIndex === null || quizState.isProcessingAnswer) return;

  clearInterval(quizState.timerInterval);
  quizState.isProcessingAnswer = true;

  // Record this question against daily 50 questions quota
  await incrementDailyQuestionsCount(1);

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
    quizFeedbackBanner.innerHTML = `✅ <strong>Correct!</strong> +${POINTS_PER_QUESTION} pts earned`;
  } else {
    quizState.wrongCount++;
    const correctLetter = ['A', 'B', 'C', 'D'][currentQ.answerIndex];
    quizFeedbackBanner.className = 'feedback-banner incorrect';
    quizFeedbackBanner.innerHTML = `❌ <strong>Incorrect.</strong> The correct answer was <strong>(${correctLetter}) ${formatInlineText(currentQ.options[currentQ.answerIndex])}</strong>.`;
  }

  quizFeedbackBanner.classList.remove('hidden');
  quizNextBtn.disabled = true;

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

async function showResults() {
  clearInterval(quizState.timerInterval);

  quizPlayCard.classList.add('hidden');
  quizResultsCard.classList.remove('hidden');

  const total = quizState.questions.length;
  const percentage = Math.round((quizState.correctCount / total) * 100);

  resultFinalScore.textContent = quizState.score;
  resultPercentage.textContent = `${percentage}%`;
  resultCorrectCount.textContent = `${quizState.correctCount} / ${total}`;
  resultTimeoutCount.textContent = quizState.timeoutCount;
  resultQuotaCount.textContent = `${getDailyQuotaUsed()} / ${DAILY_QUESTION_LIMIT}`;

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

  // Update User Total XP and Quizzes in Firestore
  if (currentUser) {
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        xp: increment(quizState.score),
        totalQuizzes: increment(1),
        updatedAt: serverTimestamp()
      });
      userProfile.xp = (userProfile.xp || 0) + quizState.score;
      userProfile.totalQuizzes = (userProfile.totalQuizzes || 0) + 1;

      // Save Quiz attempt record
      await addDoc(collection(db, 'users', currentUser.uid, 'quizAttempts'), {
        topic: quizState.topicLabel,
        score: quizState.score,
        percentage,
        correctCount: quizState.correctCount,
        timeoutCount: quizState.timeoutCount,
        timestamp: Date.now()
      });

      // Refresh leaderboard after new XP earned
      fetchAndRenderLeaderboard();
    } catch (err) {
      console.warn("Could not save score to Firestore:", err);
    }
  }
}

/* ==========================================================================
   LEADERBOARD MODULE (Firestore Sync)
   ========================================================================== */
async function fetchAndRenderLeaderboard() {
  if (!leaderboardBody) return;

  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, orderBy('xp', 'desc'), limit(25));
    const fetchPromise = getDocs(q);
    const timeoutPromise = new Promise((_, rej) => setTimeout(() => rej(new Error('Leaderboard timeout')), 2500));
    const snapshot = await Promise.race([fetchPromise, timeoutPromise]);

    let learners = [];
    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      learners.push({
        uid: docSnap.id,
        displayName: data.displayName || 'Anonymous Learner',
        photoURL: data.photoURL || '',
        xp: data.xp || 0,
        totalQuizzes: data.totalQuizzes || 0,
        questionsAnsweredToday: data.questionsAnsweredToday || 0
      });
    });

    // If Firestore has fewer than 3 users, combine with friendly seed students
    if (learners.length < 3) {
      SEED_LEADERBOARD.forEach((seed, idx) => {
        if (!learners.find(l => l.displayName === seed.displayName)) {
          learners.push({
            uid: `seed-${idx}`,
            displayName: seed.displayName,
            photoURL: '',
            xp: seed.xp,
            totalQuizzes: seed.totalQuizzes,
            questionsAnsweredToday: seed.questionsAnsweredToday
          });
        }
      });
    }

    // Sort descending by XP
    learners.sort((a, b) => b.xp - a.xp);

    // Update Top 3 Podium
    const p1 = learners[0] || { displayName: 'Quiz Master', xp: 0 };
    const p2 = learners[1] || { displayName: 'Silver Scholar', xp: 0 };
    const p3 = learners[2] || { displayName: 'Bronze Ace', xp: 0 };

    if (podiumName1) podiumName1.textContent = p1.displayName;
    if (podiumXp1) podiumXp1.textContent = `${p1.xp.toLocaleString()} XP`;
    if (podiumName2) podiumName2.textContent = p2.displayName;
    if (podiumXp2) podiumXp2.textContent = `${p2.xp.toLocaleString()} XP`;
    if (podiumName3) podiumName3.textContent = p3.displayName;
    if (podiumXp3) podiumXp3.textContent = `${p3.xp.toLocaleString()} XP`;

    // Render Full Table
    leaderboardBody.innerHTML = '';
    learners.forEach((learner, index) => {
      const rank = index + 1;
      const isCurrentUser = currentUser && (learner.uid === currentUser.uid);

      let rankBadgeHtml = `<span class="rank-badge default">${rank}</span>`;
      if (rank === 1) rankBadgeHtml = `<span class="rank-badge gold">🥇</span>`;
      else if (rank === 2) rankBadgeHtml = `<span class="rank-badge silver">🥈</span>`;
      else if (rank === 3) rankBadgeHtml = `<span class="rank-badge bronze">🥉</span>`;

      const avatarHtml = learner.photoURL 
        ? `<div class="student-avatar"><img src="${escapeHtml(learner.photoURL)}" alt="avatar"></div>`
        : `<div class="student-avatar">${escapeHtml(learner.displayName[0].toUpperCase())}</div>`;

      const tr = document.createElement('tr');
      if (isCurrentUser) tr.className = 'you-row';

      tr.innerHTML = `
        <td class="td-rank">${rankBadgeHtml}</td>
        <td>
          <div class="student-col-wrapper">
            ${avatarHtml}
            <span class="student-name-text">${escapeHtml(learner.displayName)}</span>
            ${isCurrentUser ? '<span class="you-tag">YOU</span>' : ''}
          </div>
        </td>
        <td>${learner.totalQuizzes || 0}</td>
        <td>${learner.questionsAnsweredToday || 0} / 50</td>
        <td class="td-xp"><span class="td-xp-val">${(learner.xp || 0).toLocaleString()} XP</span></td>
      `;

      leaderboardBody.appendChild(tr);
    });
  } catch (err) {
    console.warn("Firestore leaderboard fetch error, using local seed fallback:", err);
    renderFallbackLeaderboard();
  }
}

function renderFallbackLeaderboard() {
  if (!leaderboardBody) return;
  leaderboardBody.innerHTML = '';
  SEED_LEADERBOARD.forEach((seed, index) => {
    const rank = index + 1;
    let badge = `<span class="rank-badge default">${rank}</span>`;
    if (rank === 1) badge = `<span class="rank-badge gold">🥇</span>`;
    else if (rank === 2) badge = `<span class="rank-badge silver">🥈</span>`;
    else if (rank === 3) badge = `<span class="rank-badge bronze">🥉</span>`;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="td-rank">${badge}</td>
      <td>
        <div class="student-col-wrapper">
          <div class="student-avatar">${seed.displayName[0]}</div>
          <span class="student-name-text">${escapeHtml(seed.displayName)}</span>
        </div>
      </td>
      <td>${seed.totalQuizzes}</td>
      <td>${seed.questionsAnsweredToday} / 50</td>
      <td class="td-xp"><span class="td-xp-val">${seed.xp.toLocaleString()} XP</span></td>
    `;
    leaderboardBody.appendChild(tr);
  });
}

if (refreshLeaderboardBtn) refreshLeaderboardBtn.addEventListener('click', fetchAndRenderLeaderboard);

/* ==========================================================================
   AI STUDY CHAT MODULE (With Firestore Chat History)
   ========================================================================== */
if (chatForm) chatForm.addEventListener('submit', handleChatSubmit);
if (closeError) closeError.addEventListener('click', hideError);
if (quizBtn) quizBtn.addEventListener('click', handleQuickQuiz);

async function handleChatSubmit(e) {
  e.preventDefault();
  const message = userInput.value.trim();
  if (!message || isLoading) return;

  addMessage(message, 'user');
  userInput.value = '';

  if (currentUser) {
    try {
      addDoc(collection(db, 'users', currentUser.uid, 'chatHistory'), {
        role: 'user',
        content: message,
        timestamp: Date.now()
      });
    } catch (e) {}
  }

  try {
    showLoading();
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
    const data = await response.json();

    if (!response.ok || !data.response) {
      throw new Error(data.error || 'Failed to generate response from Gemini AI');
    }

    addMessage(data.response, 'assistant');

    if (currentUser && data.response) {
      try {
        addDoc(collection(db, 'users', currentUser.uid, 'chatHistory'), {
          role: 'assistant',
          content: data.response,
          timestamp: Date.now()
        });
      } catch (e) {}
    }
  } catch (err) {
    console.error('Chat fetch error:', err);
    addMessage(`⚠️ ${err.message || 'Failed to get response from Gemini. Please try again.'}`, 'assistant');
    showError(err.message || 'Failed to send message. Please check server connection.');
  } finally {
    hideLoading();
  }
}

async function handleQuickQuiz() {
  const topic = prompt('What topic would you like a quick quiz on?');
  if (!topic) return;

  try {
    showLoading();
    const response = await fetch('/api/quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic })
    });
    const data = await response.json();
    displayQuizInChat(data.quiz);
  } catch (err) {
    showError('Failed to generate quick quiz.');
  } finally {
    hideLoading();
  }
}

/* ==========================================================================
   TEXT FORMATTING & MARKDOWN ENGINES
   ========================================================================== */
function sanitizeHtml(html) {
  if (typeof html !== 'string' || !html) return '';
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // Strip dangerous elements
  const dangerous = doc.querySelectorAll('script, iframe, object, embed, style, form, input, button');
  dangerous.forEach(el => el.remove());

  // Clean attributes from remaining elements
  const allElements = doc.querySelectorAll('*');
  allElements.forEach(el => {
    Array.from(el.attributes).forEach(attr => {
      const name = attr.name.toLowerCase();
      const val = attr.value.toLowerCase().trim();
      if (name.startsWith('on') || val.startsWith('javascript:') || val.startsWith('data:text/html')) {
        el.removeAttribute(attr.name);
      }
    });

    if (el.tagName.toLowerCase() === 'a') {
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener noreferrer');
    }
  });

  return doc.body.innerHTML;
}

function fallbackMarkdownParser(text, isInline = false) {
  if (typeof text !== 'string' || !text) return '';
  let str = escapeHtml(text);

  if (isInline) {
    str = str.replace(/`([^`\n]+)`/g, '<code class="inline-code">$1</code>');
    str = str.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    str = str.replace(/__([^_]+)__/g, '<strong>$1</strong>');
    str = str.replace(/\*([^*\n]+)\*/g, '<em>$1</em>');
    str = str.replace(/_([^_\n]+)_/g, '<em>$1</em>');
    return str;
  }

  // 1. Preserve code blocks
  const codeBlocks = [];
  str = str.replace(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g, (match, lang, code) => {
    const placeholder = `@@@CODEBLOCK_${codeBlocks.length}@@@`;
    codeBlocks.push(`<pre><code class="language-${lang}">${code.trim()}</code></pre>`);
    return placeholder;
  });

  // 2. Preserve inline code
  const inlineCodes = [];
  str = str.replace(/`([^`\n]+)`/g, (match, code) => {
    const placeholder = `@@@INLINECODE_${inlineCodes.length}@@@`;
    inlineCodes.push(`<code class="inline-code">${code}</code>`);
    return placeholder;
  });

  // 3. Headings
  str = str.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  str = str.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  str = str.replace(/^# (.*$)/gim, '<h1>$1</h1>');

  // 4. Blockquotes
  str = str.replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>');

  // 5. Unordered List Items (* or -)
  str = str.replace(/^[*-]\s+(.*$)/gim, '<li>$1</li>');
  str = str.replace(/(<li>.*?<\/li>\s*)+/gs, (match) => `<ul>${match}</ul>`);

  // 6. Ordered List Items (1. )
  str = str.replace(/^\d+\.\s+(.*$)/gim, '<li class="ol-item">$1</li>');
  str = str.replace(/(<li class="ol-item">.*?<\/li>\s*)+/gs, (match) => `<ol>${match.replace(/ class="ol-item"/g, '')}</ol>`);

  // 7. Bold and Italic
  str = str.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  str = str.replace(/__([^_]+)__/g, '<strong>$1</strong>');
  str = str.replace(/\*([^*\n]+)\*/g, '<em>$1</em>');
  str = str.replace(/_([^_\n]+)_/g, '<em>$1</em>');

  // 8. Paragraphs
  const sections = str.split(/\n{2,}/);
  str = sections.map(s => {
    s = s.trim();
    if (!s) return '';
    if (s.startsWith('<h') || s.startsWith('<ul') || s.startsWith('<ol') || s.startsWith('<blockquote') || s.startsWith('@@@CODEBLOCK')) {
      return s;
    }
    return `<p>${s.replace(/\n/g, '<br>')}</p>`;
  }).join('\n');

  // 9. Restore placeholders
  codeBlocks.forEach((block, i) => {
    str = str.replace(`@@@CODEBLOCK_${i}@@@`, block);
  });
  inlineCodes.forEach((code, i) => {
    str = str.replace(`@@@INLINECODE_${i}@@@`, code);
  });

  return str;
}

function formatAssistantText(content) {
  if (typeof content !== 'string' || !content) return '';
  let html = '';
  if (window.marked && typeof window.marked.parse === 'function') {
    try {
      html = window.marked.parse(content, { breaks: true, gfm: true });
    } catch (e) {
      console.warn("marked.parse error, using fallback parser:", e);
      html = fallbackMarkdownParser(content, false);
    }
  } else {
    html = fallbackMarkdownParser(content, false);
  }
  return sanitizeHtml(html);
}

function formatInlineText(content) {
  if (typeof content !== 'string' || !content) return '';
  let html = '';
  if (window.marked && typeof window.marked.parseInline === 'function') {
    try {
      html = window.marked.parseInline(content);
    } catch (e) {
      html = fallbackMarkdownParser(content, true);
    }
  } else {
    html = fallbackMarkdownParser(content, true);
  }
  return sanitizeHtml(html);
}

function addMessage(content, type) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${type}`;

  const contentDiv = document.createElement('div');
  contentDiv.className = 'message-content';

  if (type === 'assistant') {
    contentDiv.innerHTML = formatAssistantText(content);
  } else if (type === 'system') {
    contentDiv.innerHTML = formatInlineText(content);
  } else {
    // User message: textContent preserves all user whitespace and newlines safely
    contentDiv.textContent = content;
  }

  messageDiv.appendChild(contentDiv);
  messagesContainer.appendChild(messageDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function displayQuizInChat(quiz) {
  addMessage(`🎯 **Quick Quiz: ${quiz.topic}**`, 'system');
  quiz.questions.forEach((q, index) => {
    const questionText = `### Question ${index + 1}: ${q.question}`;
    const optionsText = q.options.map((opt, i) => `* **(${['A', 'B', 'C', 'D'][i]})** ${opt}`).join('\n');
    const answerText = `> **Correct Answer:** (${['A', 'B', 'C', 'D'][q.answerIndex]}) ${q.options[q.answerIndex]}`;
    const explanationText = `*💡 Explanation:* ${q.explanation}`;
    addMessage(`${questionText}\n\n${optionsText}\n\n${answerText}\n\n${explanationText}`, 'assistant');
  });
}

/* ==========================================================================
   FEEDBACK & UTILITIES
   ========================================================================== */
function showLoading() {
  isLoading = true;
  if (loading) loading.classList.remove('hidden');
  if (sendBtn) sendBtn.disabled = true;
}

function hideLoading() {
  isLoading = false;
  if (loading) loading.classList.add('hidden');
  if (sendBtn) sendBtn.disabled = false;
}

function showError(message) {
  if (errorMessage) errorMessage.textContent = message;
  if (error) error.classList.remove('hidden');
}

function hideError() {
  if (error) error.classList.add('hidden');
}

function escapeHtml(text) {
  if (typeof text !== 'string') return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

async function checkHealth() {
  try {
    const response = await fetch('/api/health');
    const data = await response.json();
    console.log('Server health:', data);
  } catch (err) {}
}

checkHealth();
updateDailyQuotaDisplay();
