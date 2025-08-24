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

// Highly optimized Floating Balls - minimal DOM impact
const FloatingBalls = React.memo(() => {
  const [shouldRender, setShouldRender] = React.useState(false);

  React.useEffect(() => {
    // Only render if desktop, supports animations, and user hasn't disabled motion
    const shouldShow =
      window.innerWidth >= 1024 &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
      'requestAnimationFrame' in window;

    setShouldRender(shouldShow);

    const handleResize = () => {
      setShouldRender(
        window.innerWidth >= 1024 &&
        !window.matchMedia('(prefers-reduced-motion: reduce)').matches
      );
    };

    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Don't render if conditions not met
  if (!shouldRender) return null;

  // Reduced number of balls for better performance
  return (
    <div
      className="floating-balls absolute top-0 left-0 -z-10 h-full w-full overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-tt-dark-violet/3 will-change-transform"
          style={{
            left: `${(i + 1) * 25}%`,
            width: '60px',
            height: '60px',
            animation: `fall ${30 + i * 5}s linear infinite`,
            animationDelay: `${i * 10}s`,
            top: '-150px',
          }}
        />
      ))}
    </div>
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
