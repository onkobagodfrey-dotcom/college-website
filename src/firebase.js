// Import the functions you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your Firebase configuration (ALREADY CORRECT)
const firebaseConfig = {
  apiKey: "AIzaSyCi9hZgoB5DCoOXNJLJT7TuWyGZ_2iN7Pg",
  authDomain: "college-lms-10caa.firebaseapp.com",
  projectId: "college-lms-10caa",
  storageBucket: "college-lms-10caa.firebasestorage.app",
  messagingSenderId: "1081010239834",
  appId: "1:1081010239834:web:7c652466406e3669a41b63"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ ADD THESE (VERY IMPORTANT)
export const auth = getAuth(app);
export const db = getFirestore(app);