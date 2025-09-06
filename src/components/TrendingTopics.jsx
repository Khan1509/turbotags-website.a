import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Youtube, Instagram, Facebook, TrendingUp, AlertTriangle } from 'lucide-react';
import TikTokIcon from './icons/TikTokIcon';
import TrendingTopicsSkeleton from './ui/TrendingTopicsSkeleton';
import { getTrendingTopics } from '../services/apiService';

const platformIcons = {
  YouTube: Youtube,
  Instagram: Instagram,
  TikTok: TikTokIcon,
  Facebook: Facebook,
};

const platformColors = {
  YouTube: 'text-red-500',
  Instagram: 'text-pink-500',
  TikTok: 'text-black',
  Facebook: 'text-blue-600',
};

const TopicCard = ({ platform, icon: Icon, color, topics, index }) => {
  return (
    <motion.div
      className="bg-gray-50 border border-gray-200 rounded-lg p-6 h-full flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <div className="flex items-center mb-4">
        <Icon className={`h-8 w-8 mr-3 ${color}`} />
        <h3 className="text-xl font-bold text-gray-800">{platform}</h3>
      </div>
      <div className="space-y-4 flex-grow">
        {topics.slice(0, 4).map((topic, i) => (
          <div key={i} className="flex items-start">
            <TrendingUp className="h-5 w-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-gray-700">{topic.title}</h4>
              <p className="text-sm text-gray-600">{topic.description}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

const TrendingTopics = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFallback, setIsFallback] = useState(false);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        setIsLoading(true);
        const result = await getTrendingTopics();
        setData(result.trendingTopics || []);
        if (result.fallback) {
          setIsFallback(true);
        }
        setError(null);
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
    return <TrendingTopicsSkeleton />;
  }

  if (error) {
    return (
      <section className="bg-red-50 border border-red-200 p-6 rounded-xl shadow-md text-center">
        <AlertTriangle className="h-10 w-10 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-red-800 mb-2">An Error Occurred</h2>
        <p className="text-red-700">{error}</p>
      </section>
    );
  }

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <section className="bg-white p-6 rounded-xl shadow-md">
      <div className="text-center mb-8">
        <h2 className="h2 font-extrabold text-tt-dark-violet mb-2">Trending Topic Ideas for {new Date().getFullYear()}</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Stuck on what to create next? Get inspired by these AI-curated trending topics for major platforms.
        </p>
        {isFallback && (
          <div className="mt-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-3 rounded-r-lg max-w-2xl mx-auto text-left" role="alert">
            <p className="font-bold">Notice</p>
            <p className="text-sm">Live trends are currently unavailable. Showing sample ideas.</p>
          </div>
        )}
      </div>
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {data.map((platformData, index) => {
          const Icon = platformIcons[platformData.platform];
          const color = platformColors[platformData.platform];
          if (!Icon) return null;
          return (
            <TopicCard
              key={platformData.platform}
              platform={platformData.platform}
              icon={Icon}
              color={color}
              topics={platformData.topics}
              index={index}
            />
          );
        })}
      </motion.div>
    </section>
  );
};

export default TrendingTopics;
