// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Check if Firebase configuration is available
const hasFirebaseConfig = import.meta.env.VITE_API_KEY && 
                          import.meta.env.VITE_AUTH_DOMAIN && 
                          import.meta.env.VITE_PROJECT_ID &&
                          import.meta.env.VITE_STORAGE_BUCKET &&
                          import.meta.env.VITE_MESSAGING_SENDER_ID &&
                          import.meta.env.VITE_APP_ID;

let app = null;
let analytics = null;
let auth = null;
let db = null;
let storage = null;

if (hasFirebaseConfig) {
  // Your web app's Firebase configuration is read from Environment Variables
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_API_KEY,
    authDomain: import.meta.env.VITE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_APP_ID,
    measurementId: import.meta.env.VITE_MEASUREMENT_ID
  };

  try {
    // Initialize Firebase
    app = initializeApp(firebaseConfig);

    // Initialize Firebase services
    if (typeof window !== 'undefined') {
      analytics = getAnalytics(app);
    }
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
  } catch (error) {
    console.warn('Firebase initialization failed:', error.message);
    console.warn('Running in development mode without Firebase services.');
  }
} else {
  console.warn('Firebase configuration not found. Running in development mode without Firebase services.');
}

// Export the services for use in other parts of your app
export { app, analytics, auth, db, storage };
