import { initializeApp } from 'firebase/app';
import { getAuth, RecaptchaVerifier } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyA7LxPQzkqZoB-HDOSd7v40sXjnNwZ5Zpc",
  authDomain: "connectkar-emergent.firebaseapp.com",
  projectId: "connectkar-emergent",
  storageBucket: "connectkar-emergent.firebasestorage.app",
  messagingSenderId: "489396701837",
  appId: "1:489396701837:web:42ffbd08aaf01938bd70c4",
  measurementId: "G-874D91YPXL"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Set up RecaptchaVerifier
export const setupRecaptcha = (containerId) => {
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: 'invisible',
      callback: () => {
        // reCAPTCHA solved
      }
    });
  }
  return window.recaptchaVerifier;
};
