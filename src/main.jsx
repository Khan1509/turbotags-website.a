import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import './index.css';
import { initPerformanceMonitoring } from './utils/performanceMonitoring';

// Initialize performance monitoring
initPerformanceMonitoring();

// Get the root element from the HTML.
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found in the document.');
}

// Create a React root. This is the standard and correct way to initialize a React 18 app.
const root = ReactDOM.createRoot(rootElement);

// Initial render. React will now correctly manage the content inside the #root div.
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);

// Service worker registration - ONLY in production
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(error => {
        console.log('SW registration failed: ', error);
      });
  });
}
