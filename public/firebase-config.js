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

// Web app's Firebase configuration provided by user
const firebaseConfig = {
  apiKey: "AIzaSyAZgvr4y2yyrgF8ogXnID6XOzu7P84K8iA",
  authDomain: "cheap-flight-e7d4f.firebaseapp.com",
  projectId: "cheap-flight-e7d4f",
  storageBucket: "cheap-flight-e7d4f.firebasestorage.app",
  messagingSenderId: "205939117683",
  appId: "1:205939117683:web:9ebc886eff5e6c1d726406",
  measurementId: "G-V131W2XVX0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Safe Analytics Initialization
let analytics = null;
isSupported().then(supported => {
  if (supported) {
    try {
      analytics = getAnalytics(app);
    } catch (e) {
      console.warn("Firebase Analytics could not initialize:", e);
    }
  }
});

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
