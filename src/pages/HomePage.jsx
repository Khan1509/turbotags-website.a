import React, { lazy, Suspense } from 'react';
import Hero from '../components/Hero';
import Stats from '../components/Stats';
import Platforms from '../components/Platforms';
import TagGenerator from '../components/TagGenerator';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import RatingWidget from '../components/ui/RatingWidget';
import LazySection from '../components/utils/LazySection';

const WhyChooseUs = lazy(() => import('../components/WhyChooseUs'));
const TrendingTopics = lazy(() => import('../components/TrendingTopics'));
const Faq = lazy(() => import('../components/Faq'));
const Demo = lazy(() => import('../components/Demo'));

// Optimized Floating Balls - reduced for mobile performance
const FloatingBalls = React.memo(() => {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Don't render on mobile for performance
  if (isMobile) return null;

  return (
    <ul className="floating-balls absolute top-0 left-0 -z-10 h-full w-full overflow-hidden pointer-events-none">
      {Array.from({ length: 5 }).map((_, i) => (
        <li
          key={i}
          className="absolute block list-none rounded-full bg-tt-medium-violet/20 will-change-transform"
          style={{
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 80 + 40}px`,
            height: `${Math.random() * 80 + 40}px`,
            animation: `fall ${Math.random() * 25 + 20}s linear infinite`,
            animationDelay: `${Math.random() * 10}s`,
            top: '-150px',
          }}
        />
      ))}
    </ul>
  );
});

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
          <LazySection>
            <WhyChooseUs />
          </LazySection>
          <LazySection>
            <TrendingTopics />
          </LazySection>
          <LazySection>
            <Demo />
          </LazySection>
          <LazySection>
            <Faq />
          </LazySection>
        </Suspense>
        <section className="bg-white p-6 rounded-xl shadow-md">
          <RatingWidget />
        </section>
      </main>
    </div>
  );
}

export default HomePage;
