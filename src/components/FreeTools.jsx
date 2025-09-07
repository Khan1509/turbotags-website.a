import React, { useState } from 'react';
import { Hash, Type, Clock, TrendingUp, Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';

const FreeTools = () => {
  const [hashtagInput, setHashtagInput] = useState('');
  const [textInput, setTextInput] = useState('');
  const [copied, setCopied] = useState(false);

  const platformLimits = {
    instagram: { caption: 2200, hashtags: 30 },
    tiktok: { caption: 4000, hashtags: 100 },
    youtube: { description: 5000, tags: 500 },
    facebook: { post: 63206, hashtags: 30 }
  };

  const bestPostingTimes = {
    instagram: { best: '11 AM - 1 PM', days: 'Tuesday to Friday' },
    tiktok: { best: '6 AM - 10 AM', days: 'Tuesday to Thursday' },
    youtube: { best: '2 PM - 4 PM', days: 'Tuesday and Wednesday' },
    facebook: { best: '1 PM - 3 PM', days: 'Tuesday to Thursday' }
  };

  const getHashtagCount = (text) => {
    const hashtags = text.match(/#\w+/g);
    return hashtags ? hashtags.length : 0;
  };

  const getPopularityScore = (hashtag) => {
    const length = hashtag.length;
    const hasNumbers = /\d/.test(hashtag);
    const commonWords = ['love', 'like', 'follow', 'life', 'happy', 'photo', 'art', 'style', 'beauty', 'fitness'];
    const hasCommonWord = commonWords.some(word => hashtag.toLowerCase().includes(word));
    
    let score = 50; // Base score
    
    if (length < 15) score += 20; // Shorter hashtags tend to be more popular
    if (length > 25) score -= 15; // Very long hashtags are less popular
    if (hasCommonWord) score += 25; // Common words boost popularity
    if (hasNumbers) score -= 10; // Numbers reduce discoverability
    
    return Math.min(Math.max(score, 10), 95); // Keep between 10-95
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="bg-white p-6 rounded-xl shadow-md">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-tt-dark-violet mb-2">🛠️ Free Creator Tools</h2>
        <p className="text-lg text-gray-600">Professional hashtag utilities to optimize your content</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Hashtag Length Checker */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-50 to-indigo-100 p-4 rounded-lg border border-blue-200"
        >
          <div className="flex items-center mb-3">
            <Hash className="h-5 w-5 text-blue-600 mr-2" />
            <h3 className="font-bold text-gray-800">Hashtag Counter</h3>
          </div>
          <textarea
            value={hashtagInput}
            onChange={(e) => setHashtagInput(e.target.value)}
            placeholder="Paste your hashtags here..."
            className="w-full p-3 border border-gray-300 rounded-md text-sm h-20 resize-none"
          />
          <div className="mt-3 space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Total hashtags:</span>
              <span className="font-semibold text-blue-700">{getHashtagCount(hashtagInput)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Characters:</span>
              <span className="font-semibold text-blue-700">{hashtagInput.length}</span>
            </div>
            {getHashtagCount(hashtagInput) > 30 && (
              <p className="text-red-600 text-xs">⚠️ Over Instagram's 30 hashtag limit</p>
            )}
          </div>
        </motion.div>

        {/* Character Counter */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-green-50 to-emerald-100 p-4 rounded-lg border border-green-200"
        >
          <div className="flex items-center mb-3">
            <Type className="h-5 w-5 text-green-600 mr-2" />
            <h3 className="font-bold text-gray-800">Caption Counter</h3>
          </div>
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Write your caption here..."
            className="w-full p-3 border border-gray-300 rounded-md text-sm h-20 resize-none"
          />
          <div className="mt-3 space-y-2">
            {Object.entries(platformLimits).map(([platform, limits]) => (
              <div key={platform} className="flex justify-between text-xs">
                <span className="capitalize text-gray-600">{platform}:</span>
                <span className={`font-semibold ${
                  textInput.length > limits.caption ? 'text-red-600' : 'text-green-600'
                }`}>
                  {textInput.length}/{limits.caption}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Hashtag Popularity Estimator */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-purple-50 to-violet-100 p-4 rounded-lg border border-purple-200"
        >
          <div className="flex items-center mb-3">
            <TrendingUp className="h-5 w-5 text-purple-600 mr-2" />
            <h3 className="font-bold text-gray-800">Popularity Check</h3>
          </div>
          <input
            type="text"
            placeholder="Enter hashtag (without #)"
            className="w-full p-3 border border-gray-300 rounded-md text-sm mb-3"
            onChange={(e) => {
              const value = e.target.value.replace('#', '');
              e.target.value = value;
            }}
          />
          {hashtagInput.replace('#', '').trim() && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Popularity Score:</span>
                <span className="font-bold text-purple-700">
                  {getPopularityScore(hashtagInput.replace('#', '').trim())}/100
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getPopularityScore(hashtagInput.replace('#', '').trim())}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-600">
                {getPopularityScore(hashtagInput.replace('#', '').trim()) > 70 ? 
                  '🔥 High competition, great reach potential' :
                  getPopularityScore(hashtagInput.replace('#', '').trim()) > 40 ?
                  '⚡ Medium competition, good balance' :
                  '🎯 Low competition, easier to rank'
                }
              </p>
            </div>
          )}
        </motion.div>

        {/* Best Posting Times */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-orange-50 to-amber-100 p-4 rounded-lg border border-orange-200"
        >
          <div className="flex items-center mb-3">
            <Clock className="h-5 w-5 text-orange-600 mr-2" />
            <h3 className="font-bold text-gray-800">Best Times</h3>
          </div>
          <div className="space-y-3">
            {Object.entries(bestPostingTimes).map(([platform, times]) => (
              <div key={platform} className="border-b border-orange-200 pb-2 last:border-b-0">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold capitalize text-gray-700">{platform}</span>
                  <button
                    onClick={() => copyToClipboard(`${platform.charAt(0).toUpperCase() + platform.slice(1)}: ${times.best} on ${times.days}`)}
                    className="p-1 hover:bg-orange-200 rounded"
                  >
                    {copied ? <Check className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3 text-orange-600" />}
                  </button>
                </div>
                <p className="text-xs text-gray-600">{times.best}</p>
                <p className="text-xs text-gray-500">{times.days}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-3">🕒 Times shown in EST. Adjust for your timezone.</p>
        </motion.div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600 mb-4">
          💡 <strong>Pro Tip:</strong> Use these tools together with our AI generator for maximum engagement!
        </p>
        <div className="flex flex-wrap justify-center gap-2 text-xs">
          <span className="bg-gray-100 px-2 py-1 rounded">Free Forever</span>
          <span className="bg-gray-100 px-2 py-1 rounded">No Registration</span>
          <span className="bg-gray-100 px-2 py-1 rounded">Real-time Results</span>
        </div>
      </div>
    </section>
  );
};

export default FreeTools;