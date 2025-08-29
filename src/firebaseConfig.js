// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCdQdG1cqcmUDwSSUlFVrP9arOV3qvdCpE",
  authDomain: "turbotags-b4ca1.firebaseapp.com",
  projectId: "turbotags-b4ca1",
  storageBucket: "turbotags-b4ca1.appspot.com",
  messagingSenderId: "766845880079",
  appId: "1:766845880079:web:1722ceb1cf6e976231607a",
  measurementId: "G-YXQPT1LPT8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Analytics and get a reference to the service
const analytics = getAnalytics(app);

export { app, analytics };
