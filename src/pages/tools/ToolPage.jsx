import React from 'react';
import { motion } from 'framer-motion';
import usePageMeta from '../../hooks/usePageMeta';
import TagGenerator from '../../components/TagGenerator';
import Breadcrumbs from '../../components/ui/Breadcrumbs';

const ToolPage = ({ pageConfig }) => {
  const {
    pageTitle,
    pageDescription,
    heroTitle,
    heroSubtitle,
    introContent,
    tagGeneratorProps,
    breadcrumbTrail
  } = pageConfig;

  usePageMeta(pageTitle, pageDescription);

  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto max-w-7xl space-y-8 px-4 py-8 sm:space-y-12 sm:px-6 md:px-8"
      >
        <Breadcrumbs trail={breadcrumbTrail} />
        
        <header className="text-center">
          <h1 className="h1 font-extrabold text-tt-dark-violet">{heroTitle}</h1>
          <p className="mt-4 text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">{heroSubtitle}</p>
        </header>

        <section className="bg-white p-6 rounded-xl shadow-md">
          <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed">
            {introContent}
          </div>
        </section>
        
        <TagGenerator {...tagGeneratorProps} />
      </motion.div>
    </div>
  );
};

export default ToolPage;
