import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layouts/MainLayout';
import LoadingSpinner from './components/ui/LoadingSpinner';
import TargetCursor from './components/ui/TargetCursor';
import { Analytics } from '@vercel/analytics/react';

// Import HomePage eagerly for better LCP - it's the critical route
import HomePage from './pages/HomePage';
// Lazy load all other pages for better code splitting
const AboutPage = React.lazy(() => import('./pages/AboutPage'));
const FeaturesPage = React.lazy(() => import('./pages/FeaturesPage'));
const LegalPage = React.lazy(() => import('./pages/LegalPage'));
const BlogIndexPage = React.lazy(() => import('./pages/BlogIndexPage'));
const BlogPostPage = React.lazy(() => import('./pages/BlogPostPage'));
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage'));

// Tool pages (likely heavy with TagGenerator components)
const YouTubeHashtagGeneratorPage = React.lazy(() => import('./pages/tools/YouTubeHashtagGeneratorPage'));
const InstagramHashtagGeneratorPage = React.lazy(() => import('./pages/tools/InstagramHashtagGeneratorPage'));
const TikTokHashtagGeneratorPage = React.lazy(() => import('./pages/tools/TikTokHashtagGeneratorPage'));
const FacebookHashtagGeneratorPage = React.lazy(() => import('./pages/tools/FacebookHashtagGeneratorPage'));
const AITitleGeneratorPage = React.lazy(() => import('./pages/tools/AITitleGeneratorPage'));
const FreeHashtagGeneratorPage = React.lazy(() => import('./pages/tools/FreeHashtagGeneratorPage'));

// Specialized pages
const HashtagFAQPage = React.lazy(() => import('./pages/HashtagFAQPage'));
const InstagramReelsHashtagsPage = React.lazy(() => import('./pages/InstagramReelsHashtagsPage'));
const TikTokViralHashtagsPage = React.lazy(() => import('./pages/TikTokViralHashtagsPage'));

// Loading component for route transitions
const RouteLoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <LoadingSpinner size="large" ariaLabel="Loading page..." />
  </div>
);

function App() {
  return (
    <div style={{ cursor: 'none' }}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/about" element={
            <Suspense fallback={<RouteLoadingFallback />}>
              <AboutPage />
            </Suspense>
          } />
          <Route path="/features" element={
            <Suspense fallback={<RouteLoadingFallback />}>
              <FeaturesPage />
            </Suspense>
          } />
          <Route path="/legal" element={
            <Suspense fallback={<RouteLoadingFallback />}>
              <LegalPage />
            </Suspense>
          } />
          <Route path="/blog" element={
            <Suspense fallback={<RouteLoadingFallback />}>
              <BlogIndexPage />
            </Suspense>
          } />
          <Route path="/blog/:slug" element={
            <Suspense fallback={<RouteLoadingFallback />}>
              <BlogPostPage />
            </Suspense>
          } />
          
          {/* Tool Pages */}
          <Route path="/youtube-hashtag-generator" element={
            <Suspense fallback={<RouteLoadingFallback />}>
              <YouTubeHashtagGeneratorPage />
            </Suspense>
          } />
          <Route path="/instagram-hashtag-generator" element={
            <Suspense fallback={<RouteLoadingFallback />}>
              <InstagramHashtagGeneratorPage />
            </Suspense>
          } />
          <Route path="/tiktok-hashtag-generator" element={
            <Suspense fallback={<RouteLoadingFallback />}>
              <TikTokHashtagGeneratorPage />
            </Suspense>
          } />
          <Route path="/facebook-hashtag-generator" element={
            <Suspense fallback={<RouteLoadingFallback />}>
              <FacebookHashtagGeneratorPage />
            </Suspense>
          } />
          <Route path="/ai-title-generator" element={
            <Suspense fallback={<RouteLoadingFallback />}>
              <AITitleGeneratorPage />
            </Suspense>
          } />
          <Route path="/free-hashtag-generator" element={
            <Suspense fallback={<RouteLoadingFallback />}>
              <FreeHashtagGeneratorPage />
            </Suspense>
          } />
          <Route path="/how-hashtags-work" element={
            <Suspense fallback={<RouteLoadingFallback />}>
              <HashtagFAQPage />
            </Suspense>
          } />
          <Route path="/instagram-reels-hashtags" element={
            <Suspense fallback={<RouteLoadingFallback />}>
              <InstagramReelsHashtagsPage />
            </Suspense>
          } />
          <Route path="/tiktok-viral-hashtags" element={
            <Suspense fallback={<RouteLoadingFallback />}>
              <TikTokViralHashtagsPage />
            </Suspense>
          } />

          {/* Redirects */}
          <Route path="/generator" element={<Navigate to="/" replace />} />
          
          <Route path="*" element={
            <Suspense fallback={<RouteLoadingFallback />}>
              <NotFoundPage />
            </Suspense>
          } />
        </Route>
      </Routes>
      <Analytics />
      <TargetCursor />
    </div>
  );
}

export default App;
