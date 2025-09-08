import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import './index.css';

import '@fontsource/inter/400.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/800.css';

// Safe hydration with error handling
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ErrorBoundary>
    </React.StrictMode>
  );
} catch (error) {
  console.error('React rendering failed:', error);
  // Fallback UI
  rootElement.innerHTML = `
    <div style="padding: 2rem; text-align: center;">
      <h2>Something went wrong</h2>
      <p>Please refresh the page or try again later.</p>
      <button onclick="window.location.reload()">Refresh Page</button>
    </div>
  `;
}

// ... rest of your service worker code
