import React, { Suspense } from 'react';
import Hero from '../components/Hero';
import Platforms from '../components/Platforms';
import LazySection from '../components/utils/LazySection';
import HowToUse from '../components/HowToUse';
import CreatorGrowthTips from '../components/CreatorGrowthTips';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import usePageMeta from '../hooks/usePageMeta';

// Lazy load the heavy TagGenerator component for better FCP/LCP
const TagGenerator = React.lazy(() => import('../components/TagGenerator'));

function HomePage() {
  usePageMeta(
    'TurboTags: Free AI Hashtag & Tag Generator Tool',
    'Generate viral hashtags and tags for YouTube, Instagram, TikTok & Facebook with our free AI-powered tool. Boost your content reach and engagement instantly.'
  );
  return (
    <div className="space-y-16 pb-16">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <Hero />
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <LazySection threshold={0.1}>
          <Suspense fallback={
            <div className="min-h-96 flex items-center justify-center">
              <LoadingSpinner size="large" ariaLabel="Loading tag generator..." />
            </div>
          }>
            <TagGenerator />
          </Suspense>
        </LazySection>
      </div>
      
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <LazySection><Platforms /></LazySection>
      </div>
      
      <LazySection><CreatorGrowthTips /></LazySection>
      
      <LazySection><HowToUse /></LazySection>
    </div>
  );
}

export default HomePage;
