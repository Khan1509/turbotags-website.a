import React, { useState, useEffect } from 'react';
import { Youtube, Instagram, Globe, Lightbulb, RefreshCw, AlertTriangle } from 'lucide-react';
import TikTokIcon from './icons/TikTokIcon';
import { motion } from 'framer-motion';
import { getTrendingTopics } from '../services/apiService';
import { trendingTopicsData as fallbackData } from '../data/trendingTopicsData';
import TrendingTopicsSkeleton from './ui/TrendingTopicsSkeleton';

const platformIcons = {
  YouTube: Youtube,
  Instagram: Instagram,
  TikTok: TikTokIcon,
  'Global Film & TV': Globe,
};

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
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const result = await getTrendingTopics();
        setData(result.topics || fallbackData);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch trending topics, using fallback.", err);
        setError("Could not load fresh topics. Showing recent trends.");
        setData(fallbackData);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTopics();
  }, []);

  if (isLoading) {
    return <TrendingTopicsSkeleton />;
  }

  return (
    <motion.section 
      id="trending-topics" 
      className="bg-white p-6 rounded-xl shadow-md"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="text-center mb-8">
        <motion.h2 variants={itemVariants} className="text-4xl font-extrabold text-tt-dark-violet mb-2">Trending Topic Ideas</motion.h2>
        <motion.p variants={itemVariants} className="text-lg text-gray-600 max-w-3xl mx-auto">
          Stuck on what to create next? Here's what's currently hot across major platforms.
        </motion.p>
        <motion.p variants={itemVariants} className="text-sm text-gray-500 mt-2 flex items-center justify-center">
          <RefreshCw className="h-4 w-4 mr-2 animate-spin" style={{ animationDuration: '3s' }} />
          <span>Content ideas updated every 24 hours.</span>
        </motion.p>
        {error && (
          <motion.p variants={itemVariants} className="text-sm text-yellow-600 bg-yellow-50 p-2 rounded-md mt-2 flex items-center justify-center">
            <AlertTriangle className="h-4 w-4 mr-2" />
            {error}
          </motion.p>
        )}
      </div>
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={containerVariants}
      >
        {data && data.map((platformData) => {
          const Icon = platformIcons[platformData.platform] || Globe;
          return (
            <motion.div 
              key={platformData.platform} 
              className="bg-gray-50 border border-gray-200 rounded-lg p-6 h-full flex flex-col"
              variants={itemVariants}
              whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)" }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center mb-4">
                <Icon className={`h-8 w-8 mr-3 ${platformData.color || 'text-gray-800'}`} />
                <h3 className="text-2xl font-bold text-gray-800">{platformData.platform}</h3>
              </div>
              <ul className="space-y-4 flex-grow">
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
          );
        })}
      </motion.div>
    </motion.section>
  );
};

export default TrendingTopics;
