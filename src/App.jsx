import React, { lazy, Suspense } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Stats from './components/Stats';
import Platforms from './components/Platforms';
import TagGenerator from './components/TagGenerator';
import Footer from './components/Footer';
import CookieConsent from './components/CookieConsent';
import ScrollToTopButton from './components/ScrollToTopButton';
import LoadingSpinner from './components/ui/LoadingSpinner';

const About = lazy(() => import('./components/About'));
const WhyChooseUs = lazy(() => import('./components/WhyChooseUs'));
const Testimonial = lazy(() => import('./components/Testimonial'));
const Rating = lazy(() => import('./components/Rating'));
const ComingSoon = lazy(() => import('./components/ComingSoon'));
const Faq = lazy(() => import('./components/Faq'));
const Demo = lazy(() => import('./components/Demo'));


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
    <style>{`
      @keyframes fall {
        0% { transform: translateY(0) rotate(0deg); opacity: 1; }
        100% { transform: translateY(120vh) rotate(720deg); opacity: 0; }
      }
    `}</style>
  </ul>
));

function App() {
  return (
    <div className="relative">
      <FloatingBalls />
      <Header />
      <main className="container mx-auto max-w-7xl space-y-8 px-4 sm:space-y-12 sm:px-6 md:px-8">
        <Hero />
        <Stats />
        <Platforms />
        <TagGenerator />
        <Suspense fallback={<LoadingSpinner />}>
          <About />
          <WhyChooseUs />
          <Testimonial />
          <Rating />
          <ComingSoon />
          <Demo />
          <Faq />
        </Suspense>
      </main>
      <Footer />
      <CookieConsent />
      <ScrollToTopButton />
    </div>
  );
}

export default App;
