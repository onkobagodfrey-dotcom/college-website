// Import the functions you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  sendSignInLinkToEmail,
  signInWithEmailLink,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your Firebase configuration (UNCHANGED)
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

// ✅ KEEP THESE
export const auth = getAuth(app);
export const db = getFirestore(app);

/* =====================================================
   🔥 EMAIL LINK AUTH (NO MORE DYNAMIC LINKS)
===================================================== */

const actionCodeSettings = {
  url: window.location.origin + "/finishSignIn",
  handleCodeInApp: true
};

// Send login link
export const sendLoginLink = async (email) => {
  await sendSignInLinkToEmail(auth, email, actionCodeSettings);
  window.localStorage.setItem("emailForSignIn", email);
};

// Complete login after clicking email
export const completeEmailSignIn = async (url) => {
  let email = window.localStorage.getItem("emailForSignIn");

  if (!email) {
    email = window.prompt("Enter your email again");
  }

  const result = await signInWithEmailLink(auth, email, url);

  window.localStorage.removeItem("emailForSignIn");

  return result.user;
};

/* =====================================================
   🔥 GOOGLE AUTH (SAFE REDIRECT METHOD)
===================================================== */

const provider = new GoogleAuthProvider();

// Start Google login
export const loginWithGoogle = () => {
  return signInWithRedirect(auth, provider);
};

// Handle redirect result
export const handleGoogleRedirect = async () => {
  const result = await getRedirectResult(auth);
  return result?.user || null;
};