import React from 'react';
import Hero from '../components/Hero';
import TagGenerator from '../components/TagGenerator';
import Platforms from '../components/Platforms';

function HomePage() {
  return (
    <div className="space-y-12">
      <Hero />
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <TagGenerator />
        <div className="mt-12">
          <Platforms />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
