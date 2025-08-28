import React, { lazy, Suspense } from 'react';
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from './components/layouts/MainLayout';
import LoadingSpinner from './components/ui/LoadingSpinner';

// Lazy load page components for better performance
const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const FeaturesPage = lazy(() => import('./pages/FeaturesPage'));
const LegalPage = lazy(() => import('./pages/LegalPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function App() {
  return (
    <Suspense fallback={<div className="w-full h-screen flex items-center justify-center"><LoadingSpinner /></div>}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/legal" element={<LegalPage />} />
          <Route path="/generator" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
