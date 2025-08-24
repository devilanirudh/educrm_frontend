// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDMiQ2voLNHsKLC5pn9opzku8vDTxd_faY",
  authDomain: "educrm-9f3f9.firebaseapp.com",
  projectId: "educrm-9f3f9",
  storageBucket: "educrm-9f3f9.appspot.com",
  messagingSenderId: "106858909099060526587",
  appId: "1:106858909099060526587:web:7aca51fb42"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export default app;
