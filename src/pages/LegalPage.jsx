import React from 'react';
import LegalSection from '../components/sections/LegalSection';
import usePageMeta from '../hooks/usePageMeta';
import { motion } from 'framer-motion';
import Breadcrumbs from '../components/ui/Breadcrumbs';

const LegalPage = () => {
  usePageMeta(
    'Legal Information - TurboTags',
    'Read the Terms of Service, Privacy Policy, Cookie Policy, and Legal Disclaimer for TurboTags.app.'
  );

  const breadcrumbTrail = [
    { name: 'Legal', path: '/legal' }
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
      <h1 className="sr-only">TurboTags Legal Information</h1>
      <LegalSection />
    </motion.div>
  );
};

export default LegalPage;
