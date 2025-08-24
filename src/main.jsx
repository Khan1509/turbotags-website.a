import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';

// Load only essential font weights for performance
import '@fontsource/inter/400.css';
import '@fontsource/inter/600.css';

// Remove initial loader
const removeInitialLoader = () => {
  const loader = document.getElementById('initial-loader');
  if (loader) {
    loader.style.opacity = '0';
    loader.style.transition = 'opacity 0.3s ease';
    setTimeout(() => {
      loader.remove();
    }, 300);
  }
};

// Performance monitoring
const performanceObserver = () => {
  if ('PerformanceObserver' in window) {
    // Monitor Largest Contentful Paint
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log('LCP:', lastEntry.startTime);
    });
    
    // Monitor First Input Delay
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        console.log('FID:', entry.processingStart - entry.startTime);
      });
    });
    
    // Monitor Cumulative Layout Shift
    const clsObserver = new PerformanceObserver((list) => {
      let cumulativeScore = 0;
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (!entry.hadRecentInput) {
          cumulativeScore += entry.value;
        }
      });
      console.log('CLS:', cumulativeScore);
    });

    try {
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      fidObserver.observe({ entryTypes: ['first-input'] });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (e) {
      // Browser doesn't support these metrics
      console.log('Performance monitoring not fully supported');
    }
  }
};

// Register service worker for caching and offline support
const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator && import.meta.env.PROD) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });
      
      console.log('ServiceWorker registered successfully:', registration.scope);
      
      // Handle updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New content is available, notify user
            console.log('New content available, please refresh the page');
          }
        });
      });
      
    } catch (error) {
      console.log('ServiceWorker registration failed:', error);
    }
  }
};

// Initialize app
const initializeApp = () => {
  // Remove initial loader
  removeInitialLoader();
  
  // Start performance monitoring in development
  if (import.meta.env.DEV) {
    performanceObserver();
  }
  
  // Register service worker
  registerServiceWorker();
  
  // Mark app as loaded
  window.React = React; // For initial loader check
  
  // Preload critical routes
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      import('./pages/AboutPage.jsx').catch(() => {});
      import('./pages/blog/BlogIndex.jsx').catch(() => {});
    });
  }
};

// Create React root with error boundary
const root = ReactDOM.createRoot(document.getElementById('root'));

// Error boundary component
const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = React.useState(false);
  
  React.useEffect(() => {
    const handleError = (error) => {
      console.error('Application error:', error);
      setHasError(true);
    };
    
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleError);
    
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleError);
    };
  }, []);
  
  if (hasError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Something went wrong
          </h1>
          <p className="text-gray-600 mb-4">
            Please refresh the page to try again.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }
  
  return children;
};

// Render app
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);

// Initialize after render
window.addEventListener('load', initializeApp);

// Cleanup on unload
window.addEventListener('beforeunload', () => {
  // Cancel any pending operations
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({ command: 'SKIP_WAITING' });
  }
});
