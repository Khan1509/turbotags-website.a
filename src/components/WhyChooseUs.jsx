import React from 'react';
import FeatureCard from './ui/FeatureCard';
import { Bot, Globe, BarChart, Target, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
    { icon: Bot, title: "Advanced AI Engine", description: "Our AI understands content nuances to generate highly relevant tags that drive engagement." },
    { icon: Globe, title: "Global Reach Toolkit", description: "Dominate international markets with support for 30+ regions and 20+ languages." },
    { icon: BarChart, title: "Trend-Aware Suggestions", description: "Stay ahead of the curve with tags and hashtags informed by real-time trend analysis." },
    { icon: Target, title: "Creator-Centric Design", description: "A simple, fast, and privacy-focused tool built to streamline your content workflow." },
];

const WhyChooseUs = () => {
  return (
    <motion.section 
      id="why-choose" 
      className="bg-white p-6 rounded-xl shadow-md"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-8">
        <h2 className="text-4xl font-extrabold text-tt-dark-violet mb-2">Why is TurboTags the Best Hashtag Generator?</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          We offer powerful features designed for creators seeking a free, powerful YouTube tag and Instagram hashtag generator for global reach.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <FeatureCard key={index} icon={feature.icon} title={feature.title} description={feature.description} />
        ))}
      </div>
      <div className="mt-8 text-center">
        <a href="#features" className="btn-primary">
          Explore All Features <ArrowRight className="ml-2 h-5 w-5" />
        </a>
      </div>
    </motion.section>
  );
};

export default WhyChooseUs;
