import React, { lazy, Suspense } from 'react';
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from './components/layouts/MainLayout';
import LoadingSpinner from './components/ui/LoadingSpinner';
import { Analytics } from '@vercel/analytics/react';

// Lazy load page components for better performance
const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const FeaturesPage = lazy(() => import('./pages/FeaturesPage'));
const LegalPage = lazy(() => import('./pages/LegalPage'));
const BlogIndexPage = lazy(() => import('./pages/BlogIndexPage'));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Lazy load new tool pages
const YouTubeHashtagGeneratorPage = lazy(() => import('./pages/tools/YouTubeHashtagGeneratorPage'));
const InstagramHashtagGeneratorPage = lazy(() => import('./pages/tools/InstagramHashtagGeneratorPage'));
const TikTokHashtagGeneratorPage = lazy(() => import('./pages/tools/TikTokHashtagGeneratorPage'));
const FacebookHashtagGeneratorPage = lazy(() => import('./pages/tools/FacebookHashtagGeneratorPage'));
const AITitleGeneratorPage = lazy(() => import('./pages/tools/AITitleGeneratorPage'));
const FreeHashtagGeneratorPage = lazy(() => import('./pages/tools/FreeHashtagGeneratorPage'));

function App() {
  return (
    <Suspense fallback={<div className="w-full h-screen flex items-center justify-center"><LoadingSpinner /></div>}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/legal" element={<LegalPage />} />
          <Route path="/blog" element={<BlogIndexPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          
          {/* Tool Pages */}
          <Route path="/youtube-hashtag-generator" element={<YouTubeHashtagGeneratorPage />} />
          <Route path="/instagram-hashtag-generator" element={<InstagramHashtagGeneratorPage />} />
          <Route path="/tiktok-hashtag-generator" element={<TikTokHashtagGeneratorPage />} />
          <Route path="/facebook-hashtag-generator" element={<FacebookHashtagGeneratorPage />} />
          <Route path="/ai-title-generator" element={<AITitleGeneratorPage />} />
          <Route path="/free-hashtag-generator" element={<FreeHashtagGeneratorPage />} />

          {/* Redirects */}
          <Route path="/generator" element={<Navigate to="/" replace />} />
          
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
      <Analytics />
    </Suspense>
  );
}

export default App;
