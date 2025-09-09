import React from 'react';
import { motion } from 'framer-motion';
import usePageMeta from '../hooks/usePageMeta';
import TagGenerator from '../components/TagGenerator';
import CreatorTips from '../components/CreatorTips';
import { Instagram, TrendingUp, Hash, Play } from 'lucide-react';

const InstagramReelsHashtagsPage = () => {
  usePageMeta(
    'Instagram Reels Hashtags Generator 2025 - Get More Views | TurboTags',
    'Generate viral Instagram Reels hashtags with our AI tool. Get trending hashtags for Reels that boost views and engagement. Free Instagram hashtag generator.'
  );

  const popularReelsHashtags = [
    '#reels', '#reelsinstagram', '#reelsvideo', '#reelsindia', '#reelsofinstagram',
    '#trending', '#viral', '#fyp', '#foryou', '#explore',
    '#instagram', '#instagood', '#love', '#photography', '#photooftheday',
    '#fashion', '#beauty', '#makeup', '#ootd', '#style',
    '#fitness', '#workout', '#gym', '#motivation', '#health',
    '#food', '#foodie', '#cooking', '#recipe', '#delicious',
    '#travel', '#nature', '#sunset', '#beach', '#adventure',
    '#music', '#dance', '#art', '#creative', '#diy'
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto max-w-6xl px-4">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center mb-4">
            <Instagram className="h-8 w-8 text-pink-600 mr-3" />
            <Play className="h-8 w-8 text-pink-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">
            Instagram Reels Hashtags Generator
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Generate viral hashtags for Instagram Reels that boost views, engagement, and help you reach the explore page. 
            AI-powered suggestions for maximum Reels performance in 2025.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div 
          className="bg-white p-6 rounded-xl shadow-md mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-pink-600 mb-1">30</div>
              <div className="text-sm text-gray-600">Max hashtags for Reels</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-pink-600 mb-1">50%</div>
              <div className="text-sm text-gray-600">Higher reach with hashtags</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-pink-600 mb-1">90s</div>
              <div className="text-sm text-gray-600">Max Reels length</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-pink-600 mb-1">2B+</div>
              <div className="text-sm text-gray-600">Monthly Reels views</div>
            </div>
          </div>
        </motion.div>

        {/* AI Generator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <TagGenerator initialTab="instagram" />
        </motion.div>

        {/* Popular Hashtags */}
        <motion.div 
          className="bg-white p-6 rounded-xl shadow-md mb-8 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center mb-4">
            <TrendingUp className="h-6 w-6 text-pink-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-800">Popular Instagram Reels Hashtags 2025</h2>
          </div>
          <p className="text-gray-600 mb-6">
            Copy and paste these trending hashtags for your Instagram Reels to increase visibility and engagement.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-6">
            {popularReelsHashtags.map((hashtag, index) => (
              <motion.button
                key={index}
                className="text-left p-2 bg-pink-50 text-pink-700 rounded-md hover:bg-pink-100 transition-colors text-sm"
                whileHover={{ scale: 1.02 }}
                onClick={() => navigator.clipboard.writeText(hashtag)}
              >
                {hashtag}
              </motion.button>
            ))}
          </div>
          <button
            onClick={() => navigator.clipboard.writeText(popularReelsHashtags.join(' '))}
            className="btn-primary"
          >
            <Hash className="mr-2 h-4 w-4" />
            Copy All Popular Hashtags
          </button>
        </motion.div>

        {/* Creator Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <CreatorTips platform="instagram" />
        </motion.div>

        {/* Reels Strategy Guide */}
        <motion.div 
          className="bg-gradient-to-r from-pink-50 to-purple-50 p-8 rounded-xl shadow-md mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Instagram Reels Hashtag Strategy 2025</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">✅ Best Practices</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Use 20-30 hashtags for maximum reach</li>
                <li>• Mix trending and niche hashtags (80/20 rule)</li>
                <li>• Place hashtags in your caption or first comment</li>
                <li>• Research hashtags before posting</li>
                <li>• Use location-based hashtags when relevant</li>
                <li>• Create a branded hashtag for your content</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">❌ What to Avoid</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Don't use banned or shadowbanned hashtags</li>
                <li>• Avoid irrelevant hashtags for more followers</li>
                <li>• Don't repeat the same hashtag set every post</li>
                <li>• Avoid overly generic hashtags like #love</li>
                <li>• Don't use hashtags in your Reels video text</li>
                <li>• Avoid using more than 30 hashtags</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 p-4 bg-white rounded-lg border border-pink-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">🚀 Pro Tip for Viral Reels</h3>
            <p className="text-gray-700">
              Post your Reels during peak hours (6-9 AM and 7-9 PM in your audience's timezone) and use trending audio. 
              Engage with comments in the first hour to boost performance in the algorithm.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default InstagramReelsHashtagsPage;
