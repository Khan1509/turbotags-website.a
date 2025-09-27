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
          <h2 className="h2 font-extrabold text-black">How It Works</h2>
          <p className="text-lg text-brand-dark-grey mt-2">Our advanced AI analyzes billions of data points to generate perfectly optimized content.</p>
          <div className="mt-6 max-w-4xl mx-auto">
            <motion.div 
              className="p-6 rounded-xl"
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
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <h3 className="text-xl font-bold mb-3" style={{color: 'white'}}>🚀 Advanced AI Technology</h3>
              <p className="mb-4" style={{color: 'rgba(255, 255, 255, 0.8)'}}>
                TurboTags uses cutting-edge language models including Mistral, Gemini, and Claude to analyze trending patterns, 
                viral content, and platform-specific algorithms across YouTube, Instagram, TikTok, and Facebook.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  <span style={{color: 'rgba(255, 255, 255, 0.9)'}}>20+ Languages Supported</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                  <span style={{color: 'rgba(255, 255, 255, 0.9)'}}>Real-time Trend Analysis</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                  <span style={{color: 'rgba(255, 255, 255, 0.9)'}}>Platform-Specific Optimization</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                  <span style={{color: 'rgba(255, 255, 255, 0.9)'}}>70-100% Trend Accuracy</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="inline-block bg-brand-dark-blue/10 p-4 rounded-full mb-4 text-brand-dark-blue">
                <step.icon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-brand-dark-grey mb-2">{step.title}</h3>
              <p className="text-brand-dark-grey">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowToUse;
