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
      <motion.div variants={itemVariants} className="mt-4 flex justify-center space-x-2 sm:space-x-4 flex-wrap gap-2">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-tt-dark-violet text-white">
          <BadgeCheck className="w-4 h-4 mr-2" />
          Free to Use
        </span>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-tt-dark-violet text-white">
          <Bot className="w-4 h-4 mr-2" />
          AI-Powered
        </span>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-tt-dark-violet text-white">
          <BarChart className="w-4 h-4 mr-2" />
          SEO Optimized
        </span>
      </motion.div>
      
      <motion.h2 
        variants={itemVariants} 
        className="text-4xl md:text-5xl font-extrabold mt-4 text-tt-dark-violet"
      >
        The #1 FREE AI-Powered Tags & Hashtags Generator
      </motion.h2>
      <motion.p 
        variants={itemVariants} 
        className="text-lg md:text-xl font-semibold mt-2 text-gray-700"
      >
        Smarter Reach. Faster Growth. <span className="inline-block animate-rocket-float">🚀</span>
      </motion.p>
      <motion.p 
        variants={itemVariants} 
        className="mt-4 max-w-3xl mx-auto text-gray-600"
      >
        Get instant, high-quality, and SEO-optimized tags and hashtags for YouTube, Instagram, TikTok & Facebook. Boost your content's worldwide visibility.
      </motion.p>
      
      <motion.div variants={itemVariants} className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
        <a href="#tag-generator" className="btn-primary">
          Start Generating Now <Zap className="ml-2 h-5 w-5" />
        </a>
        <a href="#demo" className="btn-secondary">
          Watch Demo <Play className="ml-2 h-5 w-5" />
        </a>
      </motion.div>
    </motion.section>
  );
};

export default Hero;
