import React from 'react';
import { ListChecks, PenSquare, Copy } from 'lucide-react';
import { motion } from 'framer-motion';

const steps = [
  {
    icon: ListChecks,
    title: '1. Select Your Platform',
    description: 'Choose from YouTube, Instagram, TikTok, or Facebook to get platform-specific suggestions.'
  },
  {
    icon: PenSquare,
    title: '2. Enter Your Topic',
    description: 'Describe your content topic. The more detail you provide, the better the suggestions will be.'
  },
  {
    icon: Copy,
    title: '3. Copy & Paste',
    description: 'Click "Copy All" and paste the generated tags or hashtags directly into your post or video details.'
  }
];

const HowToUse = () => {
  return (
    <section id="how-to-use" className="py-12 bg-white">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="text-center mb-12">
          <h2 className="h2 font-extrabold text-brand-dark-blue">How It Works</h2>
          <p className="text-lg text-brand-medium-grey mt-2">Get perfectly optimized tags in three simple steps.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="bg-slate-50 p-8 rounded-2xl shadow-lg border border-gray-200 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="inline-block bg-brand-dark-blue/10 text-brand-dark-blue p-4 rounded-full mb-4">
                <step.icon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-brand-dark-grey mb-2">{step.title}</h3>
              <p className="text-brand-medium-grey">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowToUse;
