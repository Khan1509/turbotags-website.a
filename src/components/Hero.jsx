import React from 'react';
import { Zap, Bot, BarChart, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

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
        <motion.span whileHover={{ y: -3, scale: 1.05 }} className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-brand-blue text-white shadow-lg will-change-transform" role="listitem">
          <Globe className="w-4 h-4 mr-2" aria-hidden="true" />
          30+ Regions Supported
        </motion.span>
        <motion.span whileHover={{ y: -3, scale: 1.05 }} className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-brand-dark-blue text-white shadow-xl transform transition-all duration-300 hover:shadow-2xl will-change-transform" role="listitem">
          <Bot className="w-4 h-4 mr-2" aria-hidden="true" />
          AI Title & Tag Generation
        </motion.span>
        <motion.span whileHover={{ y: -3, scale: 1.05 }} className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-white text-brand-dark-blue border-2 border-brand-dark-blue shadow-lg will-change-transform" role="listitem">
          <BarChart className="w-4 h-4 mr-2" aria-hidden="true" />
          SEO Optimized
        </motion.span>
      </motion.div>

      <motion.h1
        variants={itemVariants}
        className="text-4xl md:text-5xl font-extrabold mt-6 text-gradient leading-tight will-change-transform"
      >
        Free AI Tags &amp; Hashtags Generator for YouTube, TikTok, Instagram &amp; Facebook
      </motion.h1>

      <motion.p
        variants={itemVariants}
        className="text-lg md:text-xl font-semibold mt-4 text-brand-dark-grey will-change-transform"
      >
        Smarter Reach. Faster Growth. <span className="inline-block animate-rocket-float" role="img" aria-label="rocket">🚀</span>
      </motion.p>

      <motion.p
        variants={itemVariants}
        className="mt-4 max-w-3xl mx-auto text-brand-medium-grey text-base md:text-lg leading-relaxed will-change-transform"
      >
        Generate <strong>viral tags</strong>, <strong>trending hashtags</strong>, and <strong>SEO-optimized titles</strong> for YouTube, TikTok, Instagram, and Facebook. Our AI helps you get more views and reach a global audience.
      </motion.p>

      <motion.div
        variants={itemVariants}
        className="mt-8 flex justify-center"
      >
        <a
          href="#tag-generator"
          className="btn btn-secondary focus:outline-none focus:ring-2 focus:ring-brand-dark-blue focus:ring-offset-2"
          aria-label="Start generating tags and hashtags now"
        >
          Start Generating Now <Zap className="ml-2 h-5 w-5" aria-hidden="true" />
        </a>
      </motion.div>
    </motion.section>
  );
});

export default Hero;
