import React from 'react';
import FeaturesSection from '../components/sections/FeaturesSection';
import usePageMeta from '../hooks/usePageMeta';
import { motion } from 'framer-motion';

const FeaturesPage = () => {
  usePageMeta(
    'TurboTags Features - Advanced AI, Global Reach & More',
    'Explore the powerful features of TurboTags, including our advanced AI engine, global targeting toolkit, trend-aware suggestions, and content format optimization.'
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <FeaturesSection />
    </motion.div>
  );
};

export default FeaturesPage;
