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

// Optimized animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

const WhyChooseUs = lazy(() => import('../components/WhyChooseUs'));
const Faq = lazy(() => import('../components/Faq'));

function HomePage() {
  return (
    <div className="relative">
      <FloatingBalls />
      <motion.main
        className="container mx-auto max-w-7xl space-y-8 px-4 sm:space-y-12 sm:px-6 md:px-8"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <motion.div variants={fadeInUp}>
          <Hero />
        </motion.div>

        <motion.div variants={fadeInUp}>
          <Stats />
        </motion.div>

        <motion.div variants={fadeInUp}>
          <Share />
        </motion.div>

        <motion.div variants={fadeInUp}>
          <Platforms />
        </motion.div>

        <motion.div variants={fadeInUp}>
          <TagGenerator />
        </motion.div>

        <motion.div
          variants={fadeInUp}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <TrendingTopics />
        </motion.div>

        <Suspense fallback={<LoadingSpinner />}>
          <motion.div variants={fadeInUp}>
            <LazySection minHeight="420px">
              <WhyChooseUs />
            </LazySection>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <LazySection minHeight="480px">
              <Faq />
            </LazySection>
          </motion.div>
        </Suspense>

        <motion.section
          className="bg-white p-6 rounded-xl shadow-md"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <RatingWidget />
        </motion.section>
      </motion.main>
    </div>
  );
}

export default HomePage;
