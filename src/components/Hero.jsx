import React from 'react';
import { Zap, Play, Bot, BarChart, BadgeCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.1,
      duration: 0.6,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.4,
    }
  },
};

const Hero = () => {
  return (
    <motion.section 
      id="home" 
      className="hero-fixed-height text-center py-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      role="banner"
      aria-labelledby="hero-title"
    >
      <motion.div 
        variants={itemVariants} 
        className="mt-4 flex justify-center space-x-2 sm:space-x-4 flex-wrap gap-2"
        role="list"
        aria-label="Key features"
      >
        <span 
          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-tt-dark-violet text-white"
          role="listitem"
        >
          <BadgeCheck className="w-4 h-4 mr-2" aria-hidden="true" />
          Free to Use
        </span>
        <span 
          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-tt-dark-violet text-white"
          role="listitem"
        >
          <Bot className="w-4 h-4 mr-2" aria-hidden="true" />
          AI-Powered
        </span>
        <span 
          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-tt-dark-violet text-white"
          role="listitem"
        >
          <BarChart className="w-4 h-4 mr-2" aria-hidden="true" />
          SEO Optimized
        </span>
      </motion.div>
      
      <motion.h1 
        id="hero-title"
        variants={itemVariants} 
        className="text-4xl md:text-5xl font-extrabold mt-4 text-tt-dark-violet"
      >
        The #1 FREE AI-Powered Tags & Hashtags Generator
      </motion.h1>
      
      <motion.p 
        variants={itemVariants} 
        className="text-lg md:text-xl font-semibold mt-2 text-gray-800"
      >
        Smarter Reach. Faster Growth. <span className="inline-block animate-rocket-float" aria-label="rocket emoji">🚀</span>
      </motion.p>
      
      <motion.p 
        variants={itemVariants} 
        className="mt-4 max-w-3xl mx-auto text-gray-700 text-lg"
      >
        Get instant, high-quality, and SEO-optimized tags and hashtags for YouTube, Instagram, TikTok & Facebook. Boost your content's worldwide visibility.
      </motion.p>
      
      <motion.div 
        variants={itemVariants} 
        className="mt-8 flex flex-col sm:flex-row justify-center gap-4"
        role="group"
        aria-label="Main actions"
      >
        <a 
          href="#tag-generator" 
          className="btn-primary"
          aria-describedby="start-generating-desc"
        >
          Start Generating Now 
          <Zap className="ml-2 h-5 w-5" aria-hidden="true" />
        </a>
        <span id="start-generating-desc" className="sr-only">
          Jump to the tag generator section to start creating tags and hashtags
        </span>
        
        <a 
          href="#demo" 
          className="btn-secondary"
          aria-describedby="watch-demo-desc"
        >
          Watch Demo 
          <Play className="ml-2 h-5 w-5" aria-hidden="true" />
        </a>
        <span id="watch-demo-desc" className="sr-only">
          Watch a demonstration of how the tag generator works
        </span>
      </motion.div>
    </motion.section>
  );
};

export default Hero;
