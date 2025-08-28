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
import FloatingBalls from '../components/ui/FloatingBalls';

const WhyChooseUs = lazy(() => import('../components/WhyChooseUs'));
const Faq = lazy(() => import('../components/Faq'));

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
          <LazySection minHeight="480px">
            <Faq />
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
