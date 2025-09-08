import React, { useState } from 'react';
import { Copy, ThumbsUp, ThumbsDown } from 'lucide-react';

const getTrendColor = (percentage) => {
  if (percentage >= 85) return 'text-green-800 bg-green-100 border-green-300';
  if (percentage >= 70) return 'text-yellow-800 bg-yellow-100 border-yellow-300';
  return 'text-red-800 bg-red-100 border-red-300';
};

const TagItem = React.memo(({ item, onCopy, onFeedback }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(item.text);
    setCopied(true);
    onCopy();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFeedback = (feedbackType) => {
    const newFeedback = item.feedback === feedbackType ? 'none' : feedbackType;
    onFeedback(item.text, newFeedback);
  };

  // Generate deterministic trend percentage based on tag text
  const generateTrendPercentage = (text) => {
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash % 41) + 60;
  };

  const trendPercentage = item.trend_percentage || generateTrendPercentage(item.text);

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-md bg-white p-3 shadow-sm transition-all duration-200 hover:shadow-md border border-gray-200">
      <div className="flex items-center flex-grow min-w-0 mr-2">
        <span className="text-gray-800 text-sm sm:text-base font-medium break-words mr-3" aria-label={`Tag: ${item.text}`}>
          {item.text}
        </span>
        <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getTrendColor(trendPercentage)}`} aria-label={`Trending at ${trendPercentage} percent`}>
          {trendPercentage}%
        </span>
      </div>
      <div className="flex items-center self-end sm:self-center mt-2 sm:mt-0 flex-shrink-0" role="group" aria-label="Tag actions">
        <button
          onClick={() => handleFeedback('liked')}
          className={`p-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 ${item.feedback === 'liked' ? 'bg-green-100 text-green-700' : 'text-gray-500 hover:bg-gray-100 hover:text-green-600'}`}
          aria-label={`Mark tag "${item.text}" as good`}
          aria-pressed={item.feedback === 'liked'}
        >
          <ThumbsUp className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          onClick={() => handleFeedback('disliked')}
          className={`p-2 rounded-md transition-colors ml-1 focus:outline-none focus:ring-2 focus:ring-red-500 ${item.feedback === 'disliked' ? 'bg-red-100 text-red-700' : 'text-gray-500 hover:bg-gray-100 hover:text-red-600'}`}
          aria-label={`Mark tag "${item.text}" as bad`}
          aria-pressed={item.feedback === 'disliked'}
        >
          <ThumbsDown className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          onClick={handleCopy}
          className="copy-btn bg-indigo-100 text-indigo-700 px-3 py-2 rounded-md text-sm font-semibold hover:bg-indigo-200 transition duration-200 ease-in-out ml-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label={`Copy tag "${item.text}" to clipboard`}
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </div>
  );
});

const TagList = ({ items, type, onFeedback, onCopy }) => {
  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <TagItem
          key={`${item.text}-${index}`}
          item={item}
          onCopy={onCopy}
          onFeedback={(text, feedback) => onFeedback(type, text, feedback)}
        />
      ))}
    </div>
  );
};

export default TagList;