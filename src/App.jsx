import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layouts/MainLayout';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import FeaturesPage from './pages/FeaturesPage';
import LegalPage from './pages/LegalPage';
import BlogIndexPage from './pages/BlogIndexPage';
import BlogPostPage from './pages/BlogPostPage';
import NotFoundPage from './pages/NotFoundPage';
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
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    // Add a class to body when app is mounted to prevent FOUC
    document.body.classList.add('app-loaded');
    
    return () => {
      document.body.classList.remove('app-loaded');
    };
  }, []);

  // Show loading state until app is mounted to prevent hydration issues
  if (!isMounted) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 50%, #f8fafc 100%)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            border: '4px solid #e2e8f0',
            borderTop: '4px solid #1a1a4f',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p style={{ color: '#64748b', fontSize: '1rem' }}>Loading TurboTags...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
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
