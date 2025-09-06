import React from 'react';
import FeaturesSection from '../components/sections/FeaturesSection';
import usePageMeta from '../hooks/usePageMeta';
import { motion } from 'framer-motion';
import Breadcrumbs from '../components/ui/Breadcrumbs';

const FeaturesPage = () => {
  usePageMeta(
    'TurboTags Features - Advanced AI, Global Reach & More',
    'Explore the powerful features of TurboTags, including our advanced AI engine, global targeting toolkit, trend-aware suggestions, and content format optimization.'
  );

  const breadcrumbTrail = [
    { name: 'Features', path: '/features' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* SEO: Add the page's main H1 here for correct semantic structure */}
      <div className="container mx-auto max-w-7xl px-4 pt-8 sm:px-6 md:px-8">
        <Breadcrumbs trail={breadcrumbTrail} />
        <h1 className="sr-only">TurboTags Features</h1>
      </div>
      <FeaturesSection />
    </motion.div>
  );
};

export default FeaturesPage;
