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
    color: 'hover:border-red-500/50 hover:bg-red-50',
  },
  {
    name: 'Instagram Generator',
    path: '/instagram-hashtag-generator',
    icon: Instagram,
    color: 'hover:border-pink-500/50 hover:bg-pink-50',
  },
  {
    name: 'TikTok Generator',
    path: '/tiktok-hashtag-generator',
    icon: TikTokIcon,
    color: 'hover:border-gray-800/50 hover:bg-gray-50',
  },
  {
    name: 'Facebook Generator',
    path: '/facebook-hashtag-generator',
    icon: Facebook,
    color: 'hover:border-blue-600/50 hover:bg-blue-50',
  },
  {
    name: 'AI Title Generator',
    path: '/ai-title-generator',
    icon: Sparkles,
    color: 'hover:border-purple-500/50 hover:bg-purple-50',
  },
  {
    name: 'All-in-One Generator',
    path: '/free-hashtag-generator',
    icon: CheckSquare,
    color: 'hover:border-green-500/50 hover:bg-green-50',
  },
];

const ToolLinkGrid = () => {
  return (
    <section className="bg-white p-6 rounded-xl shadow-md">
      <div className="text-center mb-8">
        <h2 className="h2 font-extrabold text-tt-dark-violet mb-2">Explore Our Free Tools</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Dedicated generators for every platform to fine-tune your content strategy.
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {tools.map((tool, index) => (
          <Link to={tool.path} key={tool.name}>
            <motion.div
              className={`flex flex-col items-center justify-center text-center p-6 bg-white rounded-lg border-2 border-transparent transition-colors duration-200 h-full ${tool.color}`}
              whileHover={{ y: -5, scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0, transition: { delay: index * 0.05 } }}
            >
              <tool.icon className="h-10 w-10 mb-3 text-tt-dark-violet" />
              <h3 className="font-bold text-gray-800">{tool.name}</h3>
            </motion.div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ToolLinkGrid;
