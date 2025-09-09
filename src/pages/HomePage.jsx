import React from 'react';
import Hero from '../components/Hero';
import TagGenerator from '../components/TagGenerator';
import Platforms from '../components/Platforms';
import Faq from '../components/Faq';
import LazySection from '../components/utils/LazySection';
import WhyChooseUs from '../components/WhyChooseUs';
import Stats from '../components/Stats';
import TrendingTopics from '../components/TrendingTopics';
import FreeTools from '../components/FreeTools';
import CreatorTips from '../components/CreatorTips';

function HomePage() {
  return (
    <div className="space-y-16 pb-16">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <Hero />
      </div>
      
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <TagGenerator />
      </div>

      <LazySection>
        <WhyChooseUs />
      </LazySection>

      <LazySection>
        <Stats />
      </LazySection>
      
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 md:px-8 space-y-16">
        <LazySection>
          <Platforms />
        </LazySection>
        
        <LazySection>
          <TrendingTopics />
        </LazySection>

        <LazySection>
          <CreatorTips platform="youtube" />
        </LazySection>
        
        <LazySection>
          <FreeTools />
        </LazySection>

        <LazySection>
          <Faq />
        </LazySection>
      </div>
    </div>
  );
}

export default HomePage;
