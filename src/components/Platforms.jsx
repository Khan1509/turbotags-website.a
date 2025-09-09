import React from 'react';
import { Youtube, Instagram, Facebook } from 'lucide-react';
import TikTokIcon from './icons/TikTokIcon';
import { motion } from 'framer-motion';

const platformData = [
  { name: 'YouTube', icon: Youtube, color: 'text-red-500', description: 'Tags & Hashtags for video discoverability' },
  { name: 'Instagram', icon: Instagram, color: 'text-pink-500', description: 'Hashtag optimization for better reach' },
  { name: 'TikTok', icon: TikTokIcon, color: 'text-black', description: 'Viral hashtags for maximum engagement' },
  { name: 'Facebook', icon: Facebook, color: 'text-blue-600', description: 'Content tags for better visibility' },
];

const Platforms = () => {
  return (
    <section className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-3xl font-bold text-brand-dark-blue mb-6 text-center">Platforms We Support</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {platformData.map((platform, index) => (
          <motion.div 
            key={platform.name} 
            className="platform-card bg-slate-50 rounded-lg p-6 text-center border border-gray-200"
            whileHover={{ y: -8, scale: 1.05, boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.05), 0 4px 6px -4px rgb(0 0 0 / 0.05)" }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: index * 0.1 } }}
          >
            <platform.icon className={`h-10 w-10 mx-auto mb-3 ${platform.color}`} />
            <h3 className="text-xl font-bold text-brand-dark-grey mb-1">{platform.name}</h3>
            <p className="text-sm text-brand-medium-grey">{platform.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default React.memo(Platforms);
