import React, { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../Header';
import ScrollToAnchor from '../utils/ScrollToAnchor';

// Lazy load non-critical components for better performance
const Footer = lazy(() => import('../Footer'));
const CookieConsent = lazy(() => import('../CookieConsent'));
const ScrollToTopButton = lazy(() => import('../ScrollToTopButton'));

const MainLayout = () => {
  return (
    <>
      <ScrollToAnchor />
      <Header />
      <main>
        <Outlet />
      </main>
      <Suspense fallback={null}>
        <Footer />
        <CookieConsent />
        <ScrollToTopButton />
      </Suspense>
    </>
  );
};

export default MainLayout;
