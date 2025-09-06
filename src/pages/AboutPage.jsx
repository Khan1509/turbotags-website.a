import React from 'react';
import AboutSection from '../components/sections/AboutSection';
import usePageMeta from '../hooks/usePageMeta';
import { motion } from 'framer-motion';
import Breadcrumbs from '../components/ui/Breadcrumbs';

const AboutPage = () => {
  usePageMeta(
    'About TurboTags - Our Mission & Vision for Creators',
    'Learn about the mission behind TurboTags, our commitment to privacy, and how we are building the best free AI-powered tools for content creators worldwide.'
  );
  
  const breadcrumbTrail = [
    { name: 'About Us', path: '/about' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto max-w-7xl space-y-8 px-4 py-8 sm:space-y-12 sm:px-6 md:px-8"
    >
      <Breadcrumbs trail={breadcrumbTrail} />
      {/* SEO: Add the page's main H1 here for correct semantic structure */}
      <h1 className="sr-only">About TurboTags</h1>
      <AboutSection />
    </motion.div>
  );
};

export default AboutPage;
