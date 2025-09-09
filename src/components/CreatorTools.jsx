import React from 'react';
import { Palette, Music, Clapperboard } from 'lucide-react';
import { motion } from 'framer-motion';

const tools = [
  {
    icon: Palette,
    name: 'Coolors',
    description: 'A fast color palette generator for your branding.',
    link: 'https://coolors.co/'
  },
  {
    icon: Music,
    name: 'Pixabay Music',
    description: 'Find royalty-free music and sound effects for your videos.',
    link: 'https://pixabay.com/music/'
  },
  {
    icon: Clapperboard,
    name: 'Pexels Videos',
    description: 'High-quality, free stock videos for your B-roll.',
    link: 'https://www.pexels.com/videos/'
  }
];

const CreatorTools = () => {
  return (
    <section id="free-tools" className="py-12 bg-white">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="text-center mb-12">
          <h2 className="h2 font-extrabold text-brand-dark-blue">More Free Tools for Creators</h2>
          <p className="text-lg text-brand-medium-grey mt-2">A curated list of our favorite free resources.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tools.map((tool, index) => (
            <motion.a
              key={index}
              href={tool.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-slate-50 p-8 rounded-2xl shadow-lg border border-gray-200 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.03, boxShadow: "0 10px 20px rgba(0,0,0,0.05)" }}
            >
              <div className="inline-block bg-brand-dark-blue/10 text-brand-dark-blue p-4 rounded-full mb-4">
                <tool.icon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-brand-dark-grey mb-2">{tool.name}</h3>
              <p className="text-brand-medium-grey">{tool.description}</p>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CreatorTools;
