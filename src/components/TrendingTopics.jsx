import React from 'react';
import { trendingTopicsData } from '../data/trendingTopicsData';
import { Lightbulb, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const TrendingTopics = () => {
  return (
    <section id="trending-topics" className="bg-white p-6 rounded-xl shadow-md">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-extrabold text-tt-dark-violet mb-2">Trending Topic Ideas</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Stuck on what to create next? Here's what's currently trending across major platforms.
        </p>
        <p className="text-sm text-gray-500 mt-2 flex items-center justify-center">
          <RefreshCw className="h-4 w-4 mr-2 animate-spin" style={{ animationDuration: '3s' }} />
          <span>Content ideas updated every 24 hours.</span>
        </p>
      </div>
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {trendingTopicsData.map((platformData) => (
          <motion.div 
            key={platformData.platform} 
            className="bg-gray-50 border border-gray-200 rounded-lg p-6"
            variants={itemVariants}
            whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)" }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex items-center mb-4">
              <platformData.icon className={`h-8 w-8 mr-3 ${platformData.color}`} />
              <h3 className="text-2xl font-bold text-gray-800">{platformData.platform}</h3>
            </div>
            <ul className="space-y-4">
              {platformData.topics.map((topic, index) => (
                <li key={index} className="flex items-start">
                  <Lightbulb className="h-5 w-5 text-yellow-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-800">{topic.title}</h4>
                    <p className="text-sm text-gray-600">{topic.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default TrendingTopics;
