import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Youtube, Instagram, Facebook, Sparkles, CheckSquare } from 'lucide-react';
import TikTokIcon from '../icons/TikTokIcon';

const tools = [
  {
    name: 'YouTube Generator',
    path: '/youtube-hashtag-generator',
    icon: Youtube,
    description: 'Get SEO tags & hashtags to rank your videos.',
    color: 'text-red-600',
    hoverColor: 'hover:border-red-500/50 hover:bg-red-50/50',
  },
  {
    name: 'Instagram Generator',
    path: '/instagram-hashtag-generator',
    icon: Instagram,
    description: 'Find trending hashtags for Reels & posts.',
    color: 'text-pink-600',
    hoverColor: 'hover:border-pink-500/50 hover:bg-pink-50/50',
  },
  {
    name: 'TikTok Generator',
    path: '/tiktok-hashtag-generator',
    icon: TikTokIcon,
    description: 'Discover viral hashtags to hit the FYP.',
    color: 'text-gray-800',
    hoverColor: 'hover:border-gray-800/50 hover:bg-gray-50/50',
  },
  {
    name: 'Facebook Generator',
    path: '/facebook-hashtag-generator',
    icon: Facebook,
    description: 'Boost organic reach on posts & Reels.',
    color: 'text-blue-600',
    hoverColor: 'hover:border-blue-600/50 hover:bg-blue-50/50',
  },
  {
    name: 'AI Title Generator',
    path: '/ai-title-generator',
    icon: Sparkles,
    description: 'Create 5 click-worthy, SEO-friendly titles.',
    color: 'text-purple-600',
    hoverColor: 'hover:border-purple-500/50 hover:bg-purple-50/50',
  },
  {
    name: 'All-in-One Generator',
    path: '/free-hashtag-generator',
    icon: CheckSquare,
    description: 'The main generator for all platforms.',
    color: 'text-green-600',
    hoverColor: 'hover:border-green-500/50 hover:bg-green-50/50',
  },
];

const ToolLinkGrid = () => {
  return (
    <section className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6 rounded-xl shadow-md">
      <div className="text-center mb-8">
        <h2 className="h2 font-extrabold text-tt-dark-violet mb-2">Explore Our Free Tools</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Dedicated generators for every platform to fine-tune your content strategy.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool, index) => (
          <Link to={tool.path} key={tool.name} className="group">
            <motion.div
              className={`flex flex-col items-center justify-center text-center p-6 bg-white/70 backdrop-blur-sm rounded-lg border-2 border-gray-100 transition-all duration-300 h-full ${tool.hoverColor}`}
              whileHover={{ y: -5, scale: 1.03, boxShadow: "0 10px 20px -5px rgba(0, 0, 0, 0.1)" }}
              transition={{ type: 'spring', stiffness: 300 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0, transition: { delay: index * 0.05 } }}
            >
              <tool.icon className={`h-10 w-10 mb-4 transition-transform group-hover:scale-110 ${tool.color}`} />
              <h3 className="font-bold text-gray-800 text-lg">{tool.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{tool.description}</p>
            </motion.div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ToolLinkGrid;
