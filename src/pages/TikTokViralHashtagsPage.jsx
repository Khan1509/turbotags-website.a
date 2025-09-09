import React from 'react';
import { motion } from 'framer-motion';
import usePageMeta from '../hooks/usePageMeta';
import TagGenerator from '../components/TagGenerator';
import CreatorTips from '../components/CreatorTips';
import TikTokIcon from '../components/icons/TikTokIcon';
import { TrendingUp, Hash, Zap } from 'lucide-react';

const TikTokViralHashtagsPage = () => {
  usePageMeta(
    'TikTok Viral Hashtags Generator 2025 - Get on FYP | TurboTags',
    'Generate viral TikTok hashtags for the For You Page. AI-powered trending hashtags that boost views and engagement. Free TikTok hashtag generator 2025.'
  );

  const viralTikTokHashtags = [
    '#fyp', '#foryou', '#foryoupage', '#viral', '#trending',
    '#tiktok', '#tiktokviral', '#tiktokmemes', '#tiktokdance', '#tiktokchallenge',
    '#dance', '#comedy', '#funny', '#memes', '#relatable',
    '#lifehack', '#diy', '#tutorial', '#howto', '#tips',
    '#aesthetic', '#outfit', '#makeup', '#skincare', '#grwm',
    '#food', '#recipe', '#cooking', '#baking', '#foodtok',
    '#booktok', '#studytok', '#motivation', '#selfcare', '#mindfulness'
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
            <TikTokIcon className="h-8 w-8 mr-3" />
            <Zap className="h-8 w-8 text-yellow-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">
            TikTok Viral Hashtags Generator
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Generate viral hashtags for TikTok that get you on the For You Page. 
            AI-powered trending hashtags for maximum reach and engagement in 2025.
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
              <div className="text-3xl font-bold text-gray-800 mb-1">3-6</div>
              <div className="text-sm text-gray-600">Optimal hashtags for TikTok</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-800 mb-1">1B+</div>
              <div className="text-sm text-gray-600">Monthly active users</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-800 mb-1">60s</div>
              <div className="text-sm text-gray-600">Max video length</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-800 mb-1">24h</div>
              <div className="text-sm text-gray-600">Best time to use trending tags</div>
            </div>
          </div>
        </motion.div>

        {/* AI Generator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <TagGenerator initialTab="tiktok" />
        </motion.div>

        {/* Viral Hashtags */}
        <motion.div 
          className="bg-white p-6 rounded-xl shadow-md mb-8 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center mb-4">
            <TrendingUp className="h-6 w-6 text-yellow-500 mr-3" />
            <h2 className="text-2xl font-bold text-gray-800">Viral TikTok Hashtags 2025</h2>
          </div>
          <p className="text-gray-600 mb-6">
            These hashtags are currently trending on TikTok. Use 3-6 strategically for best results on the For You Page.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-6">
            {viralTikTokHashtags.map((hashtag, index) => (
              <motion.button
                key={index}
                className="text-left p-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors text-sm"
                whileHover={{ scale: 1.02 }}
                onClick={() => navigator.clipboard.writeText(hashtag)}
              >
                {hashtag}
              </motion.button>
            ))}
          </div>
          <button
            onClick={() => navigator.clipboard.writeText(viralTikTokHashtags.slice(0, 6).join(' '))}
            className="btn-primary"
          >
            <Hash className="mr-2 h-4 w-4" />
            Copy Top 6 Viral Hashtags
          </button>
        </motion.div>

        {/* Creator Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <CreatorTips platform="tiktok" />
        </motion.div>

        {/* TikTok FYP Strategy */}
        <motion.div 
          className="bg-gradient-to-r from-yellow-50 to-red-50 p-8 rounded-xl shadow-md mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Get on TikTok's For You Page (FYP)</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">🔥 FYP Algorithm Factors</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Video completion rate (watch time)</li>
                <li>• Comments and engagement speed</li>
                <li>• Shares and saves</li>
                <li>• Trending audio usage</li>
                <li>• Hashtag relevance and timing</li>
                <li>• User interaction with similar content</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">⚡ Viral Content Tips</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Hook viewers in the first 3 seconds</li>
                <li>• Use trending sounds and effects</li>
                <li>• Post during peak hours (6-10 PM)</li>
                <li>• Engage with comments immediately</li>
                <li>• Keep videos under 60 seconds</li>
                <li>• Add captions for accessibility</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 p-4 bg-white rounded-lg border border-yellow-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">🎯 Hashtag Strategy for FYP</h3>
            <p className="text-gray-700">
              Use 1-2 trending hashtags + 2-3 niche hashtags + 1-2 content-specific hashtags. 
              Jump on trending hashtags within 24-48 hours for maximum algorithmic boost.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TikTokViralHashtagsPage;
