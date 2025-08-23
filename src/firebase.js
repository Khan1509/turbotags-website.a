import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration.
// This should match the values in your Firebase project console.
const firebaseConfig = {
  apiKey: "AIzaSyCdQdG1cqcmUDwSSUlFVrP9arOV3qvdCpE",
  authDomain: "turbotags-b4ca1.firebaseapp.com",
  projectId: "turbotags-b4ca1",
  storageBucket: "turbotags-b4ca1.firebasestorage.app",
  messagingSenderId: "766845880079",
  appId: "1:766845880079:web:1722ceb1cf6e976231607a",
  measurementId: "G-YXQPT1LPT8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export Firebase services
const analytics = getAnalytics(app);

export { app, analytics };
