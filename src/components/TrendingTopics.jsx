import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Youtube, Instagram, Facebook } from 'lucide-react';
import TikTokIcon from './icons/TikTokIcon';
import { getTrendingTopics } from '../services/apiService';
import LoadingSpinner from './ui/LoadingSpinner';

const platformIcons = {
  YouTube: Youtube,
  Instagram: Instagram,
  TikTok: TikTokIcon,
  Facebook: Facebook,
};

const TrendingTopics = () => {
  const [topicsData, setTopicsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        setIsLoading(true);
        const data = await getTrendingTopics();
        setTopicsData(data.trendingTopics);
      } catch (err) {
        setError('Could not load trending topics. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTopics();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-md min-h-[300px] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !topicsData) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-md text-center">
        <h2 className="h2 font-bold text-gray-800 mb-2">Trending Topics</h2>
        <p className="text-red-500">{error || 'No topics available.'}</p>
      </div>
    );
  }

  return (
    <section id="trending-topics" className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="h2 font-bold text-gray-800 mb-6 text-center">Trending Topics to Inspire You</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {topicsData.map((platformData, index) => {
          const Icon = platformIcons[platformData.platform];
          return (
            <motion.div
              key={platformData.platform}
              className="bg-gray-50 p-4 rounded-lg border border-gray-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <h3 className="font-bold text-lg mb-4 flex items-center">
                {Icon && <Icon className="h-6 w-6 mr-2" />}
                {platformData.platform}
              </h3>
              <ul className="space-y-3">
                {platformData.topics.map((topic) => (
                  <li key={topic.title} className="text-sm">
                    <p className="font-semibold text-gray-800">{topic.title}</p>
                    <p className="text-gray-600">{topic.description}</p>
                  </li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default TrendingTopics;
