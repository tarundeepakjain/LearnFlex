// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth"; // ✅ THIS LINE IS MISSING

import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC3PU_Q5is1PknFU9XO1-xi1XBoqQPsitI",
  authDomain: "learnflex-b85fe.firebaseapp.com",
  projectId: "learnflex-b85fe",
  storageBucket: "learnflex-b85fe.firebasestorage.app",
  messagingSenderId: "557176458165",
  appId: "1:557176458165:web:d45ce1c8d778a2748da7fc",
  measurementId: "G-NGL8WHW0P1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider }; // ✅ Important!