import React, { lazy, Suspense } from 'react';
import Hero from '../components/Hero';
import Stats from '../components/Stats';
import Platforms from '../components/Platforms';
import TagGenerator from '../components/TagGenerator';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import RatingWidget from '../components/ui/RatingWidget';

const WhyChooseUs = lazy(() => import('../components/WhyChooseUs'));
const ComingSoon = lazy(() => import('../components/ComingSoon'));
const Faq = lazy(() => import('../components/Faq'));
const Demo = lazy(() => import('../components/Demo'));

// Floating Balls Background Animation Component
const FloatingBalls = React.memo(() => (
  <ul className="floating-balls absolute top-0 left-0 -z-10 h-full w-full overflow-hidden">
    {Array.from({ length: 10 }).map((_, i) => (
      <li key={i} className="absolute block list-none rounded-full bg-tt-dark-violet/10" style={{
        left: `${Math.random() * 100}%`,
        width: `${Math.random() * 130 + 20}px`,
        height: `${Math.random() * 130 + 20}px`,
        animation: `fall ${Math.random() * 20 + 15}s linear infinite`,
        animationDelay: `${Math.random() * 5}s`,
        top: '-150px',
      }}></li>
    ))}
  </ul>
));

function HomePage() {
  return (
    <div className="relative">
      <FloatingBalls />
      <main className="container mx-auto max-w-7xl space-y-8 px-4 sm:space-y-12 sm:px-6 md:px-8">
        <Hero />
        <Stats />
        <Platforms />
        <TagGenerator />
        <Suspense fallback={<LoadingSpinner />}>
          <WhyChooseUs />
          <ComingSoon />
          <Demo />
          <Faq />
        </Suspense>
        <section className="bg-white p-6 rounded-xl shadow-md">
          <RatingWidget />
        </section>
      </main>
    </div>
  );
}

export default HomePage;
