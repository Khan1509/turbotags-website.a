import React from 'react';
import { Link } from 'react-router-dom';
import { Youtube, Instagram, Facebook, Sparkles } from 'lucide-react';
import TikTokIcon from '../icons/TikTokIcon';

const toolLinks = [
  {
    path: '/youtube-hashtag-generator',
    name: 'YouTube Hashtag Generator',
    icon: Youtube,
    description: 'Generate viral YouTube tags and hashtags',
    color: 'text-red-500'
  },
  {
    path: '/instagram-hashtag-generator', 
    name: 'Instagram Hashtag Generator',
    icon: Instagram,
    description: 'Find trending Instagram hashtags for posts & Reels',
    color: 'text-pink-500'
  },
  {
    path: '/tiktok-hashtag-generator',
    name: 'TikTok Hashtag Generator', 
    icon: TikTokIcon,
    description: 'Discover viral TikTok hashtags',
    color: 'text-black'
  },
  {
    path: '/facebook-hashtag-generator',
    name: 'Facebook Hashtag Generator',
    icon: Facebook,
    description: 'Optimize Facebook posts with trending hashtags',
    color: 'text-blue-600'
  },
  {
    path: '/ai-title-generator',
    name: 'AI Title Generator',
    icon: Sparkles,
    description: 'Create click-worthy, SEO-optimized titles',
    color: 'text-purple-500'
  }
];

const InternalLinkSuggestions = ({ 
  title = "🚀 Ready to boost your content?", 
  subtitle = "Try these powerful AI tools mentioned in this post:",
  maxItems = 3 
}) => {
  const suggestedTools = toolLinks.slice(0, maxItems);

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 my-8 border border-blue-200">
      <h3 className="h3 font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6">{subtitle}</p>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {suggestedTools.map((tool) => (
          <Link
            key={tool.path}
            to={tool.path}
            className="group bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all duration-200"
          >
            <div className="flex items-start space-x-3">
              <tool.icon className={`h-5 w-5 ${tool.color} group-hover:scale-110 transition-transform`} />
              <div>
                <h4 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                  {tool.name}
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  {tool.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default InternalLinkSuggestions;