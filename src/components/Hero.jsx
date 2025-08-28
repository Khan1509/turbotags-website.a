import React from 'react';
import { Zap, Play, Bot, BarChart, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

// Optimized animation variants with better easing
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
      ease: "easeOut"
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  },
};

const Hero = React.memo(() => {
  return (
    <motion.section
      id="home"
      className="text-center py-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        variants={itemVariants}
        className="mt-4 flex justify-center space-x-2 sm:space-x-4 flex-wrap gap-2"
        role="list"
        aria-label="Key features"
      >
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-tt-dark-violet text-white shadow-sm will-change-transform" role="listitem">
          <Globe className="w-4 h-4 mr-2" aria-hidden="true" />
          30+ Regions Supported
        </span>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-tt-dark-violet text-white shadow-sm will-change-transform" role="listitem">
          <Bot className="w-4 h-4 mr-2" aria-hidden="true" />
          AI-Powered
        </span>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-tt-dark-violet text-white shadow-sm will-change-transform" role="listitem">
          <BarChart className="w-4 h-4 mr-2" aria-hidden="true" />
          SEO Optimized
        </span>
      </motion.div>

      <motion.h2
        variants={itemVariants}
        className="text-4xl md:text-5xl font-extrabold mt-4 text-tt-dark-violet leading-tight will-change-transform"
      >
        The #1 FREE AI-Powered Global Tag Generator
      </motion.h2>

      <motion.p
        variants={itemVariants}
        className="text-lg md:text-xl font-semibold mt-2 text-gray-800 will-change-transform"
      >
        Smarter Reach. Faster Growth. <span className="inline-block animate-rocket-float" role="img" aria-label="rocket">🚀</span>
      </motion.p>

      <motion.p
        variants={itemVariants}
        className="mt-4 max-w-3xl mx-auto text-gray-700 text-base md:text-lg leading-relaxed will-change-transform"
      >
        Get instant, high-quality, SEO-optimized tags for YouTube, Instagram, TikTok & Facebook. Dominate local and international markets with support for **30+ regions** and **20+ languages**.
      </motion.p>

      <motion.div
        variants={itemVariants}
        className="mt-8 flex flex-col sm:flex-row justify-center gap-4"
      >
        <a
          href="#tag-generator"
          className="btn-primary focus:outline-none focus:ring-2 focus:ring-tt-dark-violet focus:ring-offset-2"
          aria-label="Start generating tags and hashtags now"
        >
          Start Generating Now <Zap className="ml-2 h-5 w-5" aria-hidden="true" />
        </a>
        <a
          href="#demo"
          className="btn-secondary focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          aria-label="Watch product demonstration video"
        >
          Watch Demo <Play className="ml-2 h-5 w-5" aria-hidden="true" />
        </a>
      </motion.div>
    </motion.section>
  );
});

export default Hero;
