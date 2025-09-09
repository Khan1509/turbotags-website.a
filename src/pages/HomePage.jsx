import React from 'react';
import Hero from '../components/Hero';
import TagGenerator from '../components/TagGenerator';
import Platforms from '../components/Platforms';
import Faq from '../components/Faq';
import LazySection from '../components/utils/LazySection';
import TrendingTopics from '../components/TrendingTopics';
import HowToUse from '../components/HowToUse';
import CreatorGrowthTips from '../components/CreatorGrowthTips';
import CreatorTools from '../components/CreatorTools';

function HomePage() {
  return (
    <div className="space-y-16 pb-16">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <Hero />
      </div>
      
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <LazySection><Platforms /></LazySection>
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <TagGenerator />
      </div>
      
      <LazySection><HowToUse /></LazySection>
      
      <LazySection><CreatorGrowthTips /></LazySection>
      
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <LazySection><TrendingTopics /></LazySection>
      </div>
      
      <LazySection><CreatorTools /></LazySection>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <LazySection><Faq /></LazySection>
      </div>
    </div>
  );
}

export default HomePage;
