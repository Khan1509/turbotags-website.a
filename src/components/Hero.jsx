import React from 'react';
import { Zap, Bot, BarChart, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

// UX: Enhanced animation variants
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
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
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
        <motion.span whileHover={{ y: -3, scale: 1.05 }} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-tt-dark-violet text-white shadow-sm will-change-transform" role="listitem">
          <Globe className="w-4 h-4 mr-2" aria-hidden="true" />
          30+ Regions Supported
        </motion.span>
        <motion.span whileHover={{ y: -3, scale: 1.05 }} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-tt-dark-violet text-white shadow-sm will-change-transform" role="listitem">
          <Bot className="w-4 h-4 mr-2" aria-hidden="true" />
          AI-Powered
        </motion.span>
        <motion.span whileHover={{ y: -3, scale: 1.05 }} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-tt-dark-violet text-white shadow-sm will-change-transform" role="listitem">
          <BarChart className="w-4 h-4 mr-2" aria-hidden="true" />
          SEO Optimized
        </motion.span>
      </motion.div>

      {/* SEO: Changed from h2 to h1 for semantic correctness and SEO alignment with page title */}
      <motion.h1
        variants={itemVariants}
        className="text-4xl md:text-5xl font-extrabold mt-4 text-tt-dark-violet leading-tight will-change-transform"
      >
        Free AI Hashtag & Tag Generator
      </motion.h1>

      <motion.p
        variants={itemVariants}
        className="text-lg md:text-xl font-semibold mt-2 text-gray-800 will-change-transform"
      >
        Smarter Reach. Faster Growth. <span className="inline-block animate-rocket-float" role="img" aria-label="rocket">🚀</span>
      </motion.p>

      {/* SEO: Rewritten to be a direct "answer" for search engines and featured snippets */}
      <motion.p
        variants={itemVariants}
        className="mt-4 max-w-3xl mx-auto text-gray-700 text-base md:text-lg leading-relaxed will-change-transform"
      >
        TurboTags is the best free AI hashtag generator for creators. Get <strong>viral tags for YouTube</strong>, <strong>trending TikTok hashtags</strong>, and the best hashtags for Instagram to get more likes and followers. Our YouTube tag generator helps you get more views, and you can easily copy and paste your results.
      </motion.p>

      <motion.div
        variants={itemVariants}
        className="mt-8 flex justify-center"
      >
        <a
          href="#tag-generator"
          className="btn-primary focus:outline-none focus:ring-2 focus:ring-tt-dark-violet focus:ring-offset-2"
          aria-label="Start generating tags and hashtags now"
        >
          Start Generating Now <Zap className="ml-2 h-5 w-5" aria-hidden="true" />
        </a>
      </motion.div>
    </motion.section>
  );
});

export default Hero;
