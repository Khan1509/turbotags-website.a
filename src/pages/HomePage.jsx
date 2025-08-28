import React, { lazy, Suspense } from 'react';
import Hero from '../components/Hero';
import Stats from '../components/Stats';
import Platforms from '../components/Platforms';
import TagGenerator from '../components/TagGenerator';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import RatingWidget from '../components/ui/RatingWidget';
import LazySection from '../components/utils/LazySection';
import { motion } from 'framer-motion';
import Share from '../components/Share';
import TrendingTopics from '../components/TrendingTopics';

// Import new section components
import AboutSection from '../components/sections/AboutSection';
import FeaturesSection from '../components/sections/FeaturesSection';
import LegalSection from '../components/sections/LegalSection';

const WhyChooseUs = lazy(() => import('../components/WhyChooseUs'));
const Faq = lazy(() => import('../components/Faq'));

const FloatingBalls = React.memo(() => {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (isMobile) return null;

  const ballColors = [
    'bg-tt-medium-violet/10',
    'bg-tt-light-violet/10',
    'bg-tt-dark-violet/5',
  ];

  return (
    <div className="absolute top-0 left-0 w-full h-screen -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
      {Array.from({ length: 15 }).map((_, i) => (
        <div
          key={i}
          className={`absolute block list-none rounded-full will-change-transform ${ballColors[i % ballColors.length]}`}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 50 - 25}%`,
            width: `${Math.random() * 150 + 50}px`,
            height: `${Math.random() * 150 + 50}px`,
            animation: `gentle-float ${Math.random() * 20 + 15}s ease-in-out infinite alternate`,
            animationDelay: `${Math.random() * 15}s`,
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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Hero />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
          <Stats />
        </motion.div>
        <Share />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
          <Platforms />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
          <TagGenerator />
        </motion.div>
        
        <TrendingTopics />
        
        <Suspense fallback={<LoadingSpinner />}>
          <LazySection minHeight="420px">
            <WhyChooseUs />
          </LazySection>
          <LazySection>
            <AboutSection />
          </LazySection>
          <LazySection>
            <FeaturesSection />
          </LazySection>
          <LazySection minHeight="480px">
            <Faq />
          </LazySection>
          <LazySection>
            <LegalSection />
          </LazySection>
        </Suspense>

        <motion.section 
            className="bg-white p-6 rounded-xl shadow-md"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
        >
          <RatingWidget />
        </motion.section>
      </main>
    </div>
  );
}

export default HomePage;
