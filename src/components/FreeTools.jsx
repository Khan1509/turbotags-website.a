import React from 'react';
import { Link } from 'react-router-dom';
import { Youtube, Instagram, Facebook, Sparkles } from 'lucide-react';
import TikTokIcon from './icons/TikTokIcon';
import { motion } from 'framer-motion';

const tools = [
  { path: '/youtube-hashtag-generator', name: 'YouTube Hashtag Generator', icon: Youtube, color: 'text-red-500' },
  { path: '/instagram-hashtag-generator', name: 'Instagram Hashtag Generator', icon: Instagram, color: 'text-pink-500' },
  { path: '/tiktok-hashtag-generator', name: 'TikTok Hashtag Generator', icon: TikTokIcon, color: 'text-black' },
  { path: '/facebook-hashtag-generator', name: 'Facebook Hashtag Generator', icon: Facebook, color: 'text-blue-600' },
  { path: '/ai-title-generator', name: 'AI Title Generator', icon: Sparkles, color: 'text-purple-500' },
  { path: '/how-hashtags-work', name: 'Hashtag FAQ', icon: Sparkles, color: 'text-green-500' },
];

const FreeTools = () => {
  return (
    <section id="free-tools" className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="h2 font-bold text-gray-800 mb-6 text-center">Explore Our Free Tools</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((tool, index) => (
          <motion.div
            key={tool.path}
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Link to={tool.path} className="block bg-gray-50 rounded-lg p-4 h-full border border-gray-200 hover:border-tt-primary transition-colors">
              <div className="flex items-center">
                <tool.icon className={`h-6 w-6 mr-3 ${tool.color}`} />
                <h3 className="font-semibold text-gray-800">{tool.name}</h3>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FreeTools;
