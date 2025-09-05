import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
// Defer Firebase Analytics initialization

import '@fontsource/inter/400.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/800.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);

// Initialize Firebase Analytics after app render
if (typeof window !== 'undefined' && import.meta.env.PROD) {
  import('./firebaseConfig.js').then(({ analytics }) => {
    console.log('Firebase Analytics initialized');
  }).catch(err => console.log('Firebase Analytics failed to load:', err));
}

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered successfully');
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('New version available!');
            }
          });
        });
      })
      .catch(registrationError => {
        console.error('SW registration failed:', registrationError);
      });
  });
}
