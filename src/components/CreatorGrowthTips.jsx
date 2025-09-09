import React from 'react';
import { TrendingUp, Video, Mic } from 'lucide-react';
import { motion } from 'framer-motion';

const tips = [
  {
    icon: TrendingUp,
    title: 'Analyze Trends',
    description: 'Use the "Trending Topics" section below for fresh ideas. Creating content around current trends is the fastest way to get discovered.'
  },
  {
    icon: Video,
    title: 'Hook in 3 Seconds',
    description: 'The first three seconds of your video are critical. Use a strong visual, ask a question, or make a bold statement to stop the scroll.'
  },
  {
    icon: Mic,
    title: 'Clear Audio is Key',
    description: 'Viewers will forgive bad video quality, but not bad audio. Invest in a simple microphone to make your content sound professional.'
  }
];

const CreatorGrowthTips = () => {
  return (
    <section id="growth-tips" className="py-12">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="text-center mb-12">
          <h2 className="h2 font-extrabold text-brand-dark-blue">Simple Tips for Faster Growth</h2>
          <p className="text-lg text-brand-medium-grey mt-2">Actionable advice you can use today to get more views.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tips.map((tip, index) => (
            <motion.div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.03 }}
            >
              <div className="inline-block bg-brand-dark-blue/10 text-brand-dark-blue p-4 rounded-full mb-4">
                <tip.icon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-brand-dark-grey mb-2">{tip.title}</h3>
              <p className="text-brand-medium-grey">{tip.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CreatorGrowthTips;
