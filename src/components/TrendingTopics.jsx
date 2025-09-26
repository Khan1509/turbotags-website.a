import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Youtube, Instagram, Facebook } from 'lucide-react';
import TikTokIcon from './icons/TikTokIcon';
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
        // Fetch from API with 24-hour auto-refresh, fallback to static data in dev
        try {
          const response = await fetch('/api/trending');
          if (!response.ok) {
            throw new Error('API unavailable');
          }
          const data = await response.json();
          setTopicsData(data.trendingTopics);
        } catch (apiError) {
          console.warn('API unavailable, using fallback data:', apiError.message);
          // Fallback to static data for development
          const fallbackResponse = await fetch('/data/fallback-trending.json');
          if (!fallbackResponse.ok) {
            throw new Error('Failed to fetch trending topics data.');
          }
          const fallbackData = await fallbackResponse.json();
          setTopicsData(fallbackData.trendingTopics);
        }
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
      <div className="p-6 rounded-xl shadow-md min-h-[300px] flex items-center justify-center border border-opacity-30" style={{
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.85), rgba(30, 41, 59, 0.85))',
        borderColor: '#344973',
        boxShadow: '0 10px 25px rgba(22, 32, 89, 0.3), 0 0 15px rgba(52, 73, 115, 0.1)'
      }}>
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !topicsData) {
    return (
      <div className="p-6 rounded-xl shadow-md text-center border border-opacity-30" style={{
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.85), rgba(30, 41, 59, 0.85))',
        borderColor: '#344973',
        boxShadow: '0 10px 25px rgba(22, 32, 89, 0.3), 0 0 15px rgba(52, 73, 115, 0.1)'
      }}>
        <h2 className="h2 font-bold mb-2" style={{ color: '#e5e7eb' }}>Trending Topics</h2>
        <p style={{ color: '#ef4444' }}>{error || 'No topics available.'}</p>
      </div>
    );
  }

  return (
    <section id="trending-topics" className="p-6 rounded-xl shadow-md border border-opacity-30" style={{
      background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.85), rgba(30, 41, 59, 0.85))',
      borderColor: '#344973',
      boxShadow: '0 10px 25px rgba(22, 32, 89, 0.3), 0 0 15px rgba(52, 73, 115, 0.1)'
    }}>
      <h2 className="h2 font-bold mb-6 text-center" style={{ color: '#e5e7eb' }}>Trending Topics to Inspire You</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {topicsData.map((platformData, index) => {
          const Icon = platformIcons[platformData.platform];
          return (
            <motion.div
              key={platformData.platform}
              className="p-4 rounded-lg border border-opacity-30 hover:border-opacity-50 transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.6), rgba(52, 73, 115, 0.4))',
                borderColor: '#344973',
                boxShadow: '0 4px 15px rgba(22, 32, 89, 0.2), inset 0 1px 0 rgba(74, 144, 226, 0.1)'
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{
                scale: 1.02,
                boxShadow: '0 8px 25px rgba(22, 32, 89, 0.3), 0 0 20px rgba(74, 144, 226, 0.15)'
              }}
            >
              <h3 className="font-bold text-lg mb-4 flex items-center" style={{ color: '#e5e7eb' }}>
                {Icon && <Icon className="h-6 w-6 mr-2" style={{ color: '#4a90e2' }} />}
                {platformData.platform}
              </h3>
              <ul className="space-y-3">
                {platformData.topics.map((topic) => (
                  <li key={topic.title} className="text-sm">
                    <p className="font-semibold" style={{ color: '#e5e7eb' }}>{topic.title}</p>
                    <p style={{ color: '#cbd5e1' }}>{topic.description}</p>
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
