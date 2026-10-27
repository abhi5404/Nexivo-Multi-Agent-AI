// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "nexivo-12bf9.firebaseapp.com",
  projectId: "nexivo-12bf9",
  storageBucket: "nexivo-12bf9.firebasestorage.app",
  messagingSenderId: "656976595351",
  appId: "1:656976595351:web:739cbfd96f961a18899cd2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
