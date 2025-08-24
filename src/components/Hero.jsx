import React from 'react';
import { Zap, Play, ArrowRight, Bot, BarChart, BadgeCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const Hero = () => {
  return (
    <motion.section 
      id="home" 
      className="text-center py-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="mt-4 flex justify-center space-x-2 sm:space-x-4 flex-wrap gap-2" role="list" aria-label="Key features">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-tt-dark-violet text-white shadow-sm" role="listitem">
          <BadgeCheck className="w-4 h-4 mr-2" aria-hidden="true" />
          Free to Use
        </span>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-tt-dark-violet text-white shadow-sm" role="listitem">
          <Bot className="w-4 h-4 mr-2" aria-hidden="true" />
          AI-Powered
        </span>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-tt-dark-violet text-white shadow-sm" role="listitem">
          <BarChart className="w-4 h-4 mr-2" aria-hidden="true" />
          SEO Optimized
        </span>
      </motion.div>
      
      <motion.h2
        variants={itemVariants}
        className="text-4xl md:text-5xl font-extrabold mt-4 text-tt-dark-violet leading-tight"
      >
        The #1 FREE AI-Powered Tags & Hashtags Generator
      </motion.h2>
      <motion.p
        variants={itemVariants}
        className="text-lg md:text-xl font-semibold mt-2 text-gray-800"
      >
        Smarter Reach. Faster Growth. <span className="inline-block animate-rocket-float" role="img" aria-label="rocket">🚀</span>
      </motion.p>
      <motion.p
        variants={itemVariants}
        className="mt-4 max-w-3xl mx-auto text-gray-700 text-base md:text-lg leading-relaxed"
      >
        Get instant, high-quality, and SEO-optimized tags and hashtags for YouTube, Instagram, TikTok & Facebook. Boost your content's worldwide visibility.
      </motion.p>
      
      <motion.div variants={itemVariants} className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
        <a href="#tag-generator" className="btn-primary focus:outline-none focus:ring-2 focus:ring-tt-dark-violet focus:ring-offset-2" aria-label="Start generating tags and hashtags now">
          Start Generating Now <Zap className="ml-2 h-5 w-5" aria-hidden="true" />
        </a>
        <a href="#demo" className="btn-secondary focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2" aria-label="Watch product demonstration video">
          Watch Demo <Play className="ml-2 h-5 w-5" aria-hidden="true" />
        </a>
      </motion.div>
    </motion.section>
  );
};

export default Hero;
