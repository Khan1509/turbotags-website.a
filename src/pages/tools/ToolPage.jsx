import React from 'react';
import { motion } from 'framer-motion';
import usePageMeta from '../../hooks/usePageMeta';
import TagGenerator from '../../components/TagGenerator';
import Breadcrumbs from '../../components/ui/Breadcrumbs';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};


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
    <motion.div
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0 }}
      variants={containerVariants}
      className="container mx-auto max-w-7xl space-y-8 px-4 py-8 sm:space-y-12 sm:px-6 md:px-8"
    >
      <motion.div variants={itemVariants}>
        <Breadcrumbs trail={breadcrumbTrail} />
      </motion.div>
      
      <motion.header variants={itemVariants} className="text-center">
        <h1 className="h1 font-extrabold text-tt-dark-violet">{heroTitle}</h1>
        <p className="mt-4 text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">{heroSubtitle}</p>
      </motion.header>

      <motion.section variants={itemVariants} className="bg-white p-6 rounded-xl shadow-md">
        <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed">
          {introContent}
        </div>
      </motion.section>
      
      <motion.div variants={itemVariants}>
        <TagGenerator {...tagGeneratorProps} />
      </motion.div>
    </motion.div>
  );
};

export default ToolPage;
