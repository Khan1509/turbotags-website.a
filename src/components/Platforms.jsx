import React from 'react';
import { Youtube, Instagram, Facebook } from 'lucide-react';
import TikTokIcon from './icons/TikTokIcon';

const platformData = [
  { name: 'YouTube', icon: Youtube, color: 'text-red-500', description: 'Tags & Hashtags for maximum video discoverability' },
  { name: 'Instagram', icon: Instagram, color: 'text-pink-500', description: 'Hashtag optimization for better reach' },
  { name: 'TikTok', icon: TikTokIcon, color: 'text-black', description: 'Viral hashtags for maximum engagement' },
  { name: 'Facebook', icon: Facebook, color: 'text-blue-600', description: 'Content tags for better visibility' },
];

const Platforms = () => {
  return (
    <section className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-3xl font-bold text-tt-dark-violet mb-6 text-center">Platforms We Support</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {platformData.map(platform => (
          <div key={platform.name} className="platform-card bg-gray-50 rounded-lg p-6 text-center border border-gray-200 transition-transform hover:-translate-y-1 hover:shadow-lg">
            <platform.icon className={`h-10 w-10 mx-auto mb-3 ${platform.color}`} />
            <h3 className="text-xl font-bold text-tt-dark-violet mb-1">{platform.name}</h3>
            <p className="text-sm text-gray-600">{platform.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default React.memo(Platforms);
