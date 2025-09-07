import React from 'react';
import TipBox from './ui/TipBox';
import { BookOpen, Target, TrendingUp } from 'lucide-react';

const CreatorTips = ({ platform = 'general', compact = false }) => {
  const tips = {
    youtube: [
      {
        title: "Optimize Your Tags Strategy",
        content: "Use 10-15 tags mixing broad and specific keywords. Place your most important tag first - YouTube uses it for categorization.",
        type: "strategy"
      },
      {
        title: "Hashtags in YouTube Descriptions",
        content: "Add 3-5 hashtags in your description. The first 3 appear above your title. Avoid using more than 15 or YouTube ignores them all.",
        type: "tip"
      },
      {
        title: "Long-tail Keywords Work",
        content: "Target specific phrases like 'how to cook pasta for beginners' rather than just 'cooking'. Less competition, more targeted audience.",
        type: "trending"
      }
    ],
    instagram: [
      {
        title: "The 30 Hashtag Rule",
        content: "Use all 30 hashtags but mix popular (1M+ posts) with niche (10K-100K posts) for maximum reach and engagement.",
        type: "strategy"
      },
      {
        title: "Hide Hashtags in Comments",
        content: "Post your caption first, then immediately comment with hashtags. Keeps your caption clean while maintaining discoverability.",
        type: "tip"
      },
      {
        title: "Research Your Audience",
        content: "Check what hashtags your target audience follows. Use Instagram's search to see suggested hashtags for your niche.",
        type: "trending"
      }
    ],
    tiktok: [
      {
        title: "Trend + Niche Strategy",
        content: "Combine 2-3 trending hashtags with 3-5 niche-specific ones. This balances viral potential with targeted audience reach.",
        type: "strategy"
      },
      {
        title: "Jump on Trends Early",
        content: "Use trending hashtags within 24-48 hours of them trending. Early adoption gives you better visibility in the algorithm.",
        type: "trending"
      },
      {
        title: "Less is More",
        content: "Use 3-6 strategic hashtags instead of maxing out. TikTok's algorithm focuses more on content quality than hashtag quantity.",
        type: "tip"
      }
    ],
    facebook: [
      {
        title: "Hashtags Still Work",
        content: "Use 1-3 hashtags per post. Facebook's algorithm values engagement over hashtag quantity, so choose wisely.",
        type: "strategy"
      },
      {
        title: "Local Hashtags Matter",
        content: "Include location-based hashtags for local businesses. #YourCityName or #LocalBusiness can boost local discovery.",
        type: "tip"
      },
      {
        title: "Community Hashtags",
        content: "Join existing hashtag communities relevant to your niche. Engage with posts using these hashtags to build relationships.",
        type: "trending"
      }
    ],
    general: [
      {
        title: "Research Before You Post",
        content: "Spend 5-10 minutes researching hashtags for each post. Tools like our generator help, but manual research adds the human touch.",
        type: "strategy"
      },
      {
        title: "Create Branded Hashtags",
        content: "Develop a unique hashtag for your brand or campaign. Encourage followers to use it for user-generated content.",
        type: "tip"
      },
      {
        title: "Monitor Performance",
        content: "Track which hashtags drive the most engagement. Most platforms offer analytics to show hashtag performance.",
        type: "trending"
      }
    ]
  };

  const currentTips = tips[platform] || tips.general;

  if (compact) {
    return (
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg border border-indigo-200 my-4">
        <div className="flex items-center mb-2">
          <BookOpen className="h-4 w-4 text-indigo-600 mr-2" />
          <h3 className="font-semibold text-indigo-800 text-sm">
            💡 Quick Tip for {platform.charAt(0).toUpperCase() + platform.slice(1)}
          </h3>
        </div>
        <p className="text-sm text-indigo-700 leading-relaxed">
          {currentTips[0].content}
        </p>
      </div>
    );
  }

  return (
    <section className="bg-white p-6 rounded-xl shadow-md">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          📚 Creator Tips for {platform.charAt(0).toUpperCase() + platform.slice(1)}
        </h2>
        <p className="text-gray-600">
          Expert strategies to maximize your reach and engagement
        </p>
      </div>

      <div className="space-y-4">
        {currentTips.map((tip, index) => (
          <TipBox
            key={index}
            title={tip.title}
            content={tip.content}
            type={tip.type}
            platform={platform !== 'general' ? platform : null}
          />
        ))}
      </div>

      <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
        <div className="flex items-center mb-2">
          <Target className="h-4 w-4 text-orange-600 mr-2" />
          <h3 className="font-semibold text-orange-800 text-sm">
            🎯 Pro Strategy
          </h3>
        </div>
        <p className="text-sm text-orange-700 leading-relaxed">
          Combine our AI-generated hashtags with these manual strategies for maximum impact. 
          Test different combinations and track your analytics to find what works best for your audience.
        </p>
      </div>
    </section>
  );
};

export default CreatorTips;