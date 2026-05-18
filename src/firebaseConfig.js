
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC2cC5iLJfXJ-M_M1AF00cogr_PrdgbBLE",
  authDomain: "fitmeal-1.firebaseapp.com",
  projectId: "fitmeal-1",
  storageBucket: "fitmeal-1.firebasestorage.app",
  messagingSenderId: "890273092385",
  appId: "1:890273092385:web:8e7b5e7918606367d5a460"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Google provider
export const googleProvider = new GoogleAuthProvider();
