import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Flame, Copy, Check, Calendar, Clock } from 'lucide-react';

const TrendingHashtags = () => {
  const [copied, setCopied] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());

  // Simulated trending hashtags that rotate based on day of year
  const trendingPools = {
    general: [
      { tag: '#viral', change: '+127%', posts: '2.3M' },
      { tag: '#trending', change: '+89%', posts: '5.1M' },
      { tag: '#fyp', change: '+156%', posts: '8.7M' },
      { tag: '#aesthetic', change: '+203%', posts: '1.9M' },
      { tag: '#mindfulness', change: '+67%', posts: '892K' },
      { tag: '#productivity', change: '+145%', posts: '1.2M' }
    ],
    seasonal: [
      { tag: '#fallvibes', change: '+234%', posts: '743K' },
      { tag: '#cozyseason', change: '+189%', posts: '567K' },
      { tag: '#halloween2025', change: '+456%', posts: '2.1M' },
      { tag: '#backtoschool', change: '+178%', posts: '934K' },
      { tag: '#autumnleaves', change: '+123%', posts: '456K' },
      { tag: '#pumpkinspice', change: '+289%', posts: '1.3M' }
    ],
    tech: [
      { tag: '#ai2025', change: '+334%', posts: '2.8M' },
      { tag: '#techtips', change: '+198%', posts: '1.4M' },
      { tag: '#coding', change: '+167%', posts: '3.2M' },
      { tag: '#productivity', change: '+145%', posts: '1.8M' },
      { tag: '#digitalnomad', change: '+234%', posts: '956K' },
      { tag: '#innovation', change: '+123%', posts: '2.1M' }
    ],
    lifestyle: [
      { tag: '#selfcare', change: '+189%', posts: '4.5M' },
      { tag: '#wellness', change: '+156%', posts: '3.2M' },
      { tag: '#motivation', change: '+234%', posts: '6.1M' },
      { tag: '#minimalism', change: '+178%', posts: '1.7M' },
      { tag: '#sustainability', change: '+145%', posts: '2.3M' },
      { tag: '#mentalhealth', change: '+267%', posts: '3.8M' }
    ]
  };

  // Get day-based trending hashtags (simulates daily refresh)
  const getDailyTrending = () => {
    const dayOfYear = Math.floor((currentDate - new Date(currentDate.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    const poolKeys = Object.keys(trendingPools);
    const selectedPool = poolKeys[dayOfYear % poolKeys.length];
    
    // Shuffle and get 6 hashtags
    const shuffled = [...trendingPools[selectedPool]].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 6);
  };

  const [todaysTrending, setTodaysTrending] = useState(getDailyTrending());

  useEffect(() => {
    // Update trending hashtags at midnight
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const msUntilMidnight = tomorrow.getTime() - now.getTime();
    
    const timer = setTimeout(() => {
      setCurrentDate(new Date());
      setTodaysTrending(getDailyTrending());
    }, msUntilMidnight);

    return () => clearTimeout(timer);
  }, [currentDate]);

  const copyHashtag = (hashtag) => {
    navigator.clipboard.writeText(hashtag);
    setCopied(hashtag);
    setTimeout(() => setCopied(''), 2000);
  };

  const copyAllTrending = () => {
    const allTags = todaysTrending.map(item => item.tag).join(' ');
    navigator.clipboard.writeText(allTags);
    setCopied('all');
    setTimeout(() => setCopied(''), 2000);
  };

  const formatDate = () => {
    return currentDate.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <section className="bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 p-6 rounded-xl shadow-md border border-orange-200">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-3">
          <Flame className="h-6 w-6 text-red-500 mr-2" />
          <TrendingUp className="h-6 w-6 text-orange-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">🔥 Trending Today</h2>
        <div className="flex items-center justify-center text-sm text-gray-600 mb-1">
          <Calendar className="h-4 w-4 mr-1" />
          <span>{formatDate()}</span>
        </div>
        <p className="text-gray-600">Hot hashtags gaining momentum right now</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {todaysTrending.map((item, index) => (
          <motion.div
            key={`${item.tag}-${index}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-4 rounded-lg border border-orange-200 hover:border-orange-300 transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-gray-800">{item.tag}</span>
              <button
                onClick={() => copyHashtag(item.tag)}
                className="p-1 hover:bg-orange-100 rounded transition-colors"
                title="Copy hashtag"
              >
                {copied === item.tag ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4 text-orange-600" />
                )}
              </button>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">{item.posts} posts</span>
              <span className="flex items-center text-green-600 font-semibold">
                <TrendingUp className="h-3 w-3 mr-1" />
                {item.change}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={copyAllTrending}
          className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-colors flex items-center"
        >
          {copied === 'all' ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Copied All!
            </>
          ) : (
            <>
              <Copy className="mr-2 h-4 w-4" />
              Copy All Trending
            </>
          )}
        </button>
        
        <div className="text-center">
          <div className="flex items-center text-sm text-gray-600 mb-1">
            <Clock className="h-4 w-4 mr-1" />
            <span>Updates daily at midnight</span>
          </div>
          <p className="text-xs text-gray-500">Bookmark this page for fresh trends daily!</p>
        </div>
      </div>

      <div className="mt-6 p-4 bg-white rounded-lg border border-orange-200">
        <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
          <TrendingUp className="h-4 w-4 mr-2 text-orange-600" />
          💡 How to Use Trending Hashtags
        </h3>
        <p className="text-sm text-gray-700 leading-relaxed">
          Jump on these trending hashtags within 24-48 hours for maximum visibility. 
          Mix 1-2 trending tags with 3-5 niche hashtags for your content. 
          Time your posts during peak hours for best algorithm performance.
        </p>
      </div>
    </section>
  );
};

export default TrendingHashtags;