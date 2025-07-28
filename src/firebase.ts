// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDd1PKO9M7BaUkFGp14l21UEmK2QbDPIY0",
  authDomain: "learningregexp.firebaseapp.com",
  projectId: "learningregexp",
  storageBucket: "learningregexp.firebasestorage.app",
  messagingSenderId: "885195261658",
  appId: "1:885195261658:web:c4d681cc0e0694906d87e3",
  measurementId: "G-HMVQGW66F2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };