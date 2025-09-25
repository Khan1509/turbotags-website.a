import React from 'react';
import { ListChecks, PenSquare, Copy } from 'lucide-react';
import { motion } from 'framer-motion';

const steps = [
  {
    icon: ListChecks,
    title: '1. Choose Platform & Settings',
    description: 'Select your target platform (YouTube, Instagram, TikTok, Facebook), content format (video types), language (20+ supported), and target region for geo-specific optimization.'
  },
  {
    icon: PenSquare,
    title: '2. Describe Your Content',
    description: 'Enter your content topic with as much detail as possible. Our AI analyzes current trends, viral patterns, and platform algorithms to generate optimized suggestions with 70-100% trend scores.'
  },
  {
    icon: Copy,
    title: '3. Get Instant Results',
    description: 'Receive 15-20 platform-optimized tags and hashtags, plus 5-7 SEO-friendly titles. Copy directly to your content or use our built-in tools for character counting and hashtag cleaning.'
  }
];

const HowToUse = () => {
  return (
    <section id="how-to-use" className="py-12">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="text-center mb-12">
          <h2 className="h2 font-extrabold text-brand-dark-blue">How It Works</h2>
          <p className="text-lg text-brand-medium-grey mt-2">Our advanced AI analyzes billions of data points to generate perfectly optimized content.</p>
          <div className="mt-6 max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-indigo-900/30 to-violet-900/30 p-6 rounded-xl border border-gray-200">
              <h3 className="text-xl font-bold text-brand-dark-grey mb-3">🚀 Advanced AI Technology</h3>
              <p className="text-brand-medium-grey mb-4">
                TurboTags uses cutting-edge language models including Mistral, Gemini, and Claude to analyze trending patterns, 
                viral content, and platform-specific algorithms across YouTube, Instagram, TikTok, and Facebook.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>20+ Languages Supported</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span>Real-time Trend Analysis</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  <span>Platform-Specific Optimization</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  <span>70-100% Trend Accuracy</span>
                </div>
              </div>
            </div>
          </div>
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
              <div className="inline-block bg-brand-dark-blue/10 p-4 rounded-full mb-4 text-indigo-300">
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
