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
    transition: { 
      staggerChildren: 0.08, 
      delayChildren: 0.1,
      ease: "easeOut"
    },
  },
};

const itemVariants = {
  hidden: { y: 15, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  },
};

const cardVariants = {
  hidden: { y: 20, opacity: 0, scale: 0.95 },
  visible: { 
    y: 0, 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  },
};

const TrendingTopics = React.memo(() => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchTopics = async () => {
      try {
        const result = await getTrendingTopics();
        if (isMounted) {
          setData(result.topics || fallbackData);
          setError(null);
        }
      } catch (err) {
        console.error("Failed to fetch trending topics, using fallback.", err);
        if (isMounted) {
          setError("Could not load fresh topics. Showing recent trends.");
          setData(fallbackData);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    
    fetchTopics();
    
    return () => {
      isMounted = false;
    };
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
        <motion.h2 
          variants={itemVariants} 
          className="text-4xl font-extrabold text-tt-dark-violet mb-2 will-change-transform"
        >
          Trending Topic Ideas
        </motion.h2>
        <motion.p 
          variants={itemVariants} 
          className="text-lg text-gray-600 max-w-3xl mx-auto will-change-transform"
        >
          Stuck on what to create next? Here's what's currently hot across major platforms.
        </motion.p>
        <motion.p 
          variants={itemVariants} 
          className="text-sm text-gray-500 mt-2 flex items-center justify-center will-change-transform"
        >
          <RefreshCw className="h-4 w-4 mr-2 animate-spin" style={{ animationDuration: '3s' }} />
          <span>Content ideas updated every 24 hours.</span>
        </motion.p>
        {error && (
          <motion.p 
            variants={itemVariants} 
            className="text-sm text-yellow-600 bg-yellow-50 p-2 rounded-md mt-2 flex items-center justify-center will-change-transform"
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            {error}
          </motion.p>
        )}
      </div>
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={containerVariants}
      >
        {data && data.map((platformData, index) => {
          const Icon = platformIcons[platformData.platform] || Globe;
          return (
            <motion.div 
              key={platformData.platform} 
              className="bg-gray-50 border border-gray-200 rounded-lg p-6 h-full flex flex-col will-change-transform"
              variants={cardVariants}
              whileHover={{ 
                y: -3, 
                scale: 1.02,
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.15)",
                transition: { duration: 0.2, ease: "easeOut" }
              }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center mb-4">
                <Icon className={`h-8 w-8 mr-3 ${platformData.color || 'text-gray-800'}`} />
                <h3 className="text-2xl font-bold text-gray-800">{platformData.platform}</h3>
              </div>
              <ul className="space-y-4 flex-grow">
                {platformData.topics.map((topic, topicIndex) => (
                  <motion.li 
                    key={topicIndex} 
                    className="flex items-start"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: (index * 0.1) + (topicIndex * 0.05), duration: 0.3 }}
                  >
                    <Lightbulb className="h-5 w-5 text-yellow-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-800">{topic.title}</h4>
                      <p className="text-sm text-gray-600">{topic.description}</p>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.section>
  );
});

TrendingTopics.displayName = 'TrendingTopics';

export default TrendingTopics;
