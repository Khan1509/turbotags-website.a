import React from 'react';
import Hero from '../components/Hero';
import TagGenerator from '../components/TagGenerator';
import Platforms from '../components/Platforms';
import Faq from '../components/Faq';
import LazySection from '../components/utils/LazySection';
import WhyChooseUs from '../components/WhyChooseUs';
import Stats from '../components/Stats';
import TrendingTopics from '../components/TrendingTopics';
import EnhancedUxHub from '../components/EnhancedUxHub';
import AdvancedFeatures from '../components/AdvancedFeatures';
import ContentSuite from '../components/ContentSuite';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import SocialProof from '../components/SocialProof';
import EducationalHub from '../components/EducationalHub';
import Pricing from '../components/Pricing';

function HomePage() {
  return (
    <div className="space-y-16 pb-16">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <Hero />
      </div>
      
      <LazySection><Stats /></LazySection>
      
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <LazySection><Platforms /></LazySection>
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <TagGenerator />
      </div>
      
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <LazySection><EnhancedUxHub /></LazySection>
      </div>
      
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <LazySection><TrendingTopics /></LazySection>
      </div>
      
      <LazySection><AdvancedFeatures /></LazySection>
      <LazySection><ContentSuite /></LazySection>
      <LazySection><AnalyticsDashboard /></LazySection>
      <LazySection><SocialProof /></LazySection>
      <LazySection><EducationalHub /></LazySection>
      <LazySection><Pricing /></LazySection>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <LazySection><Faq /></LazySection>
      </div>
    </div>
  );
}

export default HomePage;
