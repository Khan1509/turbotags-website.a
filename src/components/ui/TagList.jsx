import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';

const TagList = ({ title, items, icon: Icon }) => {
  const [copied, setCopied] = useState(false);

  if (!items || items.length === 0) {
    return null;
  }

  const handleCopyAll = () => {
    const textToCopy = items.map(item => item.text).join(', ');
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-xl font-bold text-gray-800 flex items-center">
          {Icon && <Icon className="h-5 w-5 mr-2" />}
          {title}
        </h3>
        <button
          onClick={handleCopyAll}
          className="flex items-center text-sm font-semibold text-tt-primary hover:text-tt-primary-dark transition-colors"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 mr-1 text-green-500" /> Copied!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 mr-1" /> Copy All
            </>
          )}
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="bg-gray-100 text-gray-800 px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2"
          >
            <span>{item.text}</span>
            <div className="w-px h-4 bg-gray-300"></div>
            <span className="text-xs text-tt-primary font-bold">{item.trend_percentage}%</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TagList;
