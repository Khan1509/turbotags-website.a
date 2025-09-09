import React from 'react';
import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import Stats from '../components/Stats';
import Platforms from '../components/Platforms';
import TagGenerator from '../components/TagGenerator';
import FaqSchema from '../components/schemas/FaqSchema';
import { faqData } from '../components/Faq';
import Share from '../components/Share';
import TrendingTopics from '../components/TrendingTopics';
import ToolLinkGrid from '../components/ui/ToolLinkGrid';
import FreeTools from '../components/FreeTools';
import CreatorTips from '../components/CreatorTips';
import TrendingHashtags from '../components/TrendingHashtags';
import WhyChooseUs from '../components/WhyChooseUs';
import Faq from '../components/Faq';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.6, 
      ease: "easeOut"
    }
  },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    }
  }
};

function HomePage() {
  return (
    <>
      <FaqSchema faqData={faqData} />
      <motion.div
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

          <motion.div variants={fadeInUp}>
            <FreeTools />
          </motion.div>

          <motion.div variants={fadeInUp}>
            <TrendingHashtags />
          </motion.div>

          <motion.div variants={fadeInUp}>
            <CreatorTips platform="general" />
          </motion.div>

          <motion.div variants={fadeInUp}>
            <ToolLinkGrid />
          </motion.div>

          <motion.div variants={fadeInUp}>
            <TrendingTopics />
          </motion.div>

          <motion.div variants={fadeInUp}>
            <WhyChooseUs />
          </motion.div>

          <motion.div variants={fadeInUp}>
            <Faq />
          </motion.div>

        </motion.div>
    </>
  );
}

export default HomePage;
