// Import Firebase SDK pieces
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase config
const firebaseConfig = {
  apiKey: "1:447564857407:web:b8a72dc6b8b0767cafb88a",
  authDomain: "survival-bubble.firebaseapp.com",
  projectId: "survival-bubble",
  storageBucket: "survival-bubble.appspot.com",
  messagingSenderId: "447564857407",
  appId: "1:447564857407:web:b8a72dc6b8b0767cafb88a",
  measurementId: "G-3JGY84XKGK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// ✅ Add these
export const auth = getAuth(app);
export const db = getFirestore(app);
export const firebaseApp = app;
export const firebaseAnalytics = analytics;
