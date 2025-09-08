import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layouts/MainLayout';
import TestComponent from './TestComponent';
import AboutPage from './pages/AboutPage';
import FeaturesPage from './pages/FeaturesPage';
import LegalPage from './pages/LegalPage';
import BlogIndexPage from './pages/BlogIndexPage';
import BlogPostPage from './pages/BlogPostPage';
import NotFoundPage from './pages/NotFoundPage';

// Import tool pages directly (removing lazy loading for now)
import YouTubeHashtagGeneratorPage from './pages/tools/YouTubeHashtagGeneratorPage';
import InstagramHashtagGeneratorPage from './pages/tools/InstagramHashtagGeneratorPage';
import TikTokHashtagGeneratorPage from './pages/tools/TikTokHashtagGeneratorPage';
import FacebookHashtagGeneratorPage from './pages/tools/FacebookHashtagGeneratorPage';
import AITitleGeneratorPage from './pages/tools/AITitleGeneratorPage';
import FreeHashtagGeneratorPage from './pages/tools/FreeHashtagGeneratorPage';
import HashtagFAQPage from './pages/HashtagFAQPage';
import InstagramReelsHashtagsPage from './pages/InstagramReelsHashtagsPage';
import TikTokViralHashtagsPage from './pages/TikTokViralHashtagsPage';
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <div>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<TestComponent />} />
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
          <Route path="/how-hashtags-work" element={<HashtagFAQPage />} />
          <Route path="/instagram-reels-hashtags" element={<InstagramReelsHashtagsPage />} />
          <Route path="/tiktok-viral-hashtags" element={<TikTokViralHashtagsPage />} />

          {/* Redirects */}
          <Route path="/generator" element={<Navigate to="/" replace />} />
          
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
      <Analytics />
    </div>
  );
}

export default App;
