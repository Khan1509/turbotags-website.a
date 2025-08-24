import React, { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../Header';
import ScrollToAnchor from '../utils/ScrollToAnchor';
import LoadingSpinner from '../ui/LoadingSpinner';

// Lazy load non-critical components for better performance
const Footer = lazy(() => import('../Footer'));
const CookieConsent = lazy(() => import('../CookieConsent'));
const ScrollToTopButton = lazy(() => import('../ScrollToTopButton'));

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToAnchor />
      
      {/* Skip to main content link for accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-tt-dark-violet text-white px-4 py-2 rounded-md z-50"
        aria-label="Skip to main content"
      >
        Skip to main content
      </a>
      
      <Header />
      
      <main 
        id="main-content" 
        className="flex-grow"
        role="main"
        aria-label="Main content"
      >
        <Outlet />
      </main>
      
      <Suspense fallback={
        <div className="flex justify-center py-4" aria-label="Loading footer">
          <LoadingSpinner />
        </div>
      }>
        <Footer />
        <CookieConsent />
        <ScrollToTopButton />
      </Suspense>
    </div>
  );
};

export default MainLayout;
