import React from 'react';
import { Youtube, Instagram, Clapperboard } from 'lucide-react';
import TikTokIcon from '../components/icons/TikTokIcon';

export const trendingTopicsData = [
  {
    platform: 'YouTube',
    icon: Youtube,
    color: 'text-red-500',
    topics: [
      { title: 'AI Tools Explained', description: 'Deep dives into new AI tools and their impact on productivity.' },
      { title: 'Sustainable Living Hacks', description: 'Videos on eco-friendly habits and zero-waste lifestyles.' },
      { title: 'Retro Gaming Revival', description: 'Long-form documentaries on classic video games and consoles.' },
    ]
  },
  {
    platform: 'Instagram',
    icon: Instagram,
    color: 'text-pink-500',
    topics: [
      { title: '"Day in the Life" Reels', description: 'Authentic, less-polished glimpses into daily routines.' },
      { title: '30-Second Recipes', description: 'Quick, visually appealing cooking tutorials for Reels.' },
      { title: 'Thrift-Flipping Fashion', description: 'Transforming second-hand clothes into trendy outfits.' },
    ]
  },
  {
    platform: 'TikTok',
    icon: TikTokIcon,
    color: 'text-black',
    topics: [
      { title: 'Niche History Facts', description: 'Quick, surprising facts about obscure historical events.' },
      { title: '"CoreCore" Aesthetic Edits', description: 'Artistic, abstract video collages with a specific mood.' },
      { title: 'Hyper-Local "Hidden Gems"', description: 'Showcasing unique spots in your city or neighborhood.' },
    ]
  },
];
