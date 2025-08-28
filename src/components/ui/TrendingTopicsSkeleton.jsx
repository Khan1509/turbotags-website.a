import React from 'react';
import { Lightbulb, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

const Shimmer = () => (
  <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-gray-200/50 to-transparent" />
);

const SkeletonCard = () => (
  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 h-full flex flex-col relative overflow-hidden">
    <div className="flex items-center mb-4">
      <div className="h-8 w-8 rounded-full bg-gray-300 mr-3" />
      <div className="h-7 w-32 bg-gray-300 rounded-md" />
    </div>
    <div className="space-y-4 flex-grow">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex items-start">
          <Lightbulb className="h-5 w-5 text-gray-300 mr-3 mt-1 flex-shrink-0" />
          <div>
            <div className="h-5 w-40 bg-gray-300 rounded-md mb-1" />
            <div className="h-4 w-48 bg-gray-300 rounded-md" />
          </div>
        </div>
      ))}
    </div>
    <Shimmer />
  </div>
);

const TrendingTopicsSkeleton = () => {
  return (
    <motion.section 
      className="bg-white p-6 rounded-xl shadow-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center mb-8">
        <div className="h-10 w-3/4 bg-gray-300 rounded-md mx-auto mb-2 relative overflow-hidden"><Shimmer /></div>
        <div className="h-6 w-1/2 bg-gray-300 rounded-md mx-auto relative overflow-hidden"><Shimmer /></div>
        <div className="text-sm text-gray-400 mt-2 flex items-center justify-center">
          <RefreshCw className="h-4 w-4 mr-2 animate-spin" style={{ animationDuration: '3s' }} />
          <span>Content ideas updated every 24 hours.</span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
      </div>
    </motion.section>
  );
};

export default TrendingTopicsSkeleton;
