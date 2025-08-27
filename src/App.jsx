import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layouts/MainLayout';
import HomePage from './pages/HomePage';
import LoadingSpinner from './components/ui/LoadingSpinner';

// Lazy load pages
const AboutPage = lazy(() => import('./pages/AboutPage'));
const FeaturesPage = lazy(() => import('./pages/FeaturesPage')); // New Features Page
const BlogIndex = lazy(() => import('./pages/blog/BlogIndex'));
const BlogPostPage = lazy(() => import('./pages/blog/BlogPostPage')); // Dynamic blog post page

const CookiePolicy = lazy(() => import('./pages/legal/CookiePolicy'));
const Disclaimer = lazy(() => import('./pages/legal/Disclaimer'));
const Privacy = lazy(() => import('./pages/legal/Privacy'));
const Terms = lazy(() => import('./pages/legal/Terms'));

function App() {
  return (
    <Suspense fallback={<div className="w-full h-screen flex items-center justify-center"><LoadingSpinner /></div>}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/features" element={<FeaturesPage />} />
          
          {/* Blog pages - now dynamic */}
          <Route path="/blog" element={<BlogIndex />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />

          {/* Legal pages */}
          <Route path="/legal/cookies" element={<CookiePolicy />} />
          <Route path="/legal/disclaimer" element={<Disclaimer />} />
          <Route path="/legal/privacy" element={<Privacy />} />
          <Route path="/legal/terms" element={<Terms />} />

          {/* Redirects for old static .html and old blog paths to ensure bookmarks and SEO links still work */}
          <Route path="/blog/facebook-strategy" element={<Navigate to="/blog/facebook-strategy-2025" replace />} />
          <Route path="/blog/tiktok-hashtags" element={<Navigate to="/blog/tiktok-hashtags-2025" replace />} />
          <Route path="/blog/instagram-growth" element={<Navigate to="/blog/instagram-growth-guide" replace />} />
          <Route path="/blog/youtube-shorts-strategy" element={<Navigate to="/blog/youtube-shorts-strategy" replace />} />

          <Route path="/blog/index.html" element={<Navigate to="/blog" replace />} />
          <Route path="/legal/cookies.html" element={<Navigate to="/legal/cookies" replace />} />
          <Route path="/legal/disclaimer.html" element={<Navigate to="/legal/disclaimer" replace />} />
          <Route path="/legal/privacy.html" element={<Navigate to="/legal/privacy" replace />} />
          <Route path="/legal/terms.html" element={<Navigate to="/legal/terms" replace />} />
          <Route path="/generator" element={<Navigate to="/#tag-generator" replace />} />
          <Route path="/generator/index.html" element={<Navigate to="/#tag-generator" replace />} />
          
          {/* Fallback for any other page, redirects to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
