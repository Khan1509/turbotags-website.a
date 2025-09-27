import React from 'react';
import { Youtube, Instagram, Facebook } from 'lucide-react';
import TikTokIcon from './icons/TikTokIcon';
import { motion } from 'framer-motion';

const platformData = [
  { name: 'YouTube', icon: Youtube, color: 'text-white', description: 'Tags & Hashtags for video discoverability' },
  { name: 'Instagram', icon: Instagram, color: 'text-white', description: 'Hashtag optimization for better reach' },
  { name: 'TikTok', icon: TikTokIcon, color: 'text-white', description: 'Viral hashtags for maximum engagement' },
  { name: 'Facebook', icon: Facebook, color: 'text-white', description: 'Content tags for better visibility' },
];

const Platforms = () => {
  return (
    <section className="p-6 rounded-xl" style={{
      background: 'rgba(255, 255, 255, 0.15)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
    }}>
      <h2 className="text-3xl font-bold mb-6 text-center" style={{color: '#1f2937'}}>Platforms We Support</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {platformData.map((platform, index) => (
          <motion.div 
            key={platform.name} 
            className="platform-card rounded-lg p-6 text-center"
            style={{
              background: 'linear-gradient(135deg, #475569 0%, #334155 100%)',
              border: '1px solid rgba(71, 85, 105, 0.3)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 20px rgba(71, 85, 105, 0.25), 0 2px 10px rgba(0, 0, 0, 0.1)'
            }}
            whileHover={{ 
              boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15), 0 0 20px rgba(255, 255, 255, 0.2)",
              y: -5
            }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: index * 0.1 } }}
          >
            <platform.icon className={`h-10 w-10 mx-auto mb-3 ${platform.color}`} />
            <h3 className="text-xl font-bold mb-1" style={{color: 'white'}}>{platform.name}</h3>
            <p className="text-sm" style={{color: 'rgba(255, 255, 255, 0.8)'}}>{platform.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default React.memo(Platforms);
