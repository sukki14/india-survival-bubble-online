
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBmxEPvYA6f6mZmtvdKqzIlUDjmqfUlWd8",
  authDomain: "survival-bubble.firebaseapp.com",
  projectId: "survival-bubble",
  storageBucket: "survival-bubble.appspot.com",
  messagingSenderId: "564218304819",
  appId: "1:564218304819:web:48293ed6beda5f9f8c59c3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Note to users: Replace the above config with your own Firebase config.
// You can get your config from the Firebase console.
