// Firebase Modular Configuration & Service Exports for Gemini Study Buddy
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAnalytics, isSupported } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-analytics.js";
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile 
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  deleteDoc, 
  onSnapshot,
  serverTimestamp,
  increment 
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

// Firebase Configuration dynamically loaded from server environment
// Keeps API keys and project credentials secure and out of version control
let firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
};

// 1. Fetch configuration securely from backend server (/api/firebase-config)
try {
  const response = await fetch('/api/firebase-config');
  if (response.ok) {
    const data = await response.json();
    if (data && data.apiKey) {
      firebaseConfig = { ...firebaseConfig, ...data };
    }
  }
} catch (e) {
  console.warn("Could not load Firebase configuration from /api/firebase-config:", e);
}

// 2. Allow runtime fallback via window.__FIREBASE_CONFIG__ if provided
if (!firebaseConfig.apiKey && typeof window !== 'undefined' && window.__FIREBASE_CONFIG__) {
  firebaseConfig = { ...firebaseConfig, ...window.__FIREBASE_CONFIG__ };
}

// Check if valid credentials are present
const isConfigValid = Boolean(
  firebaseConfig.apiKey && 
  firebaseConfig.apiKey !== 'your_firebase_api_key_here' && 
  !firebaseConfig.apiKey.includes('REPLACE_WITH')
);

// Safe configuration to ensure SDK loads without unhandled runtime exceptions
const activeConfig = isConfigValid ? firebaseConfig : {
  apiKey: "AIzaSy_REPLACE_WITH_YOUR_FIREBASE_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.firebasestorage.app",
  messagingSenderId: "000000000000",
  appId: "1:000000000000:web:0000000000000000000000",
  measurementId: ""
};

if (!isConfigValid) {
  console.info("ℹ️ Firebase configuration not detected. Please configure FIREBASE_API_KEY and related variables in .env");
}

// Initialize Firebase
const app = initializeApp(activeConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Safe Analytics Initialization
let analytics = null;
if (isConfigValid) {
  isSupported().then(supported => {
    if (supported) {
      try {
        analytics = getAnalytics(app);
      } catch (e) {
        console.warn("Firebase Analytics could not initialize:", e);
      }
    }
  }).catch(() => {});
}

export {
  app,
  auth,
  db,
  analytics,
  googleProvider,
  signInWithPopup,
  GoogleAuthProvider,
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
  where,
  orderBy,
  limit,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
  increment
};
