import React from 'react';
import { Lightbulb, Target, TrendingUp, Zap, Star, Award } from 'lucide-react';
import { motion } from 'framer-motion';

const TipBox = ({ 
  type = 'tip', 
  title, 
  content, 
  platform = null, 
  variant = 'default',
  icon = null 
}) => {
  const icons = {
    tip: Lightbulb,
    strategy: Target,
    trending: TrendingUp,
    boost: Zap,
    pro: Star,
    best: Award
  };

  const variants = {
    default: 'from-blue-50 to-blue-100 border-blue-200 text-blue-800',
    success: 'from-green-50 to-green-100 border-green-200 text-green-800',
    warning: 'from-yellow-50 to-yellow-100 border-yellow-200 text-yellow-800',
    info: 'from-purple-50 to-purple-100 border-purple-200 text-purple-800',
    pro: 'from-gradient-to-r from-purple-50 via-pink-50 to-indigo-100 border-purple-300 text-purple-900'
  };

  const platformColors = {
    youtube: 'from-red-50 to-red-100 border-red-200 text-red-800',
    instagram: 'from-pink-50 to-pink-100 border-pink-200 text-pink-800',
    tiktok: 'from-gray-50 to-gray-100 border-gray-300 text-gray-800',
    facebook: 'from-blue-50 to-blue-100 border-blue-200 text-blue-800'
  };

  const IconComponent = icon || icons[type] || Lightbulb;
  const colorClass = platform ? platformColors[platform] : variants[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`bg-gradient-to-r ${colorClass} p-4 rounded-xl border-l-4 shadow-lg my-4 cursor-pointer`}
    >
      <div className="flex items-start space-x-3">
        <IconComponent className="h-5 w-5 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          {title && (
            <h4 className="font-semibold text-sm mb-1">
              {platform && (
                <span className="uppercase text-xs font-bold mr-2">
                  {platform}
                </span>
              )}
              {title}
            </h4>
          )}
          <div className="text-sm leading-relaxed">
            {content}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TipBox;