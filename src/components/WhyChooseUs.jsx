import React from 'react';
import FeatureCard from './ui/FeatureCard';
import { Bot, Globe, BarChart, Target } from 'lucide-react';

const features = [
    { icon: Bot, title: "AI-Powered Generation", description: "Advanced AI algorithms generate highly relevant and trending tags for maximum reach." },
    { icon: Globe, title: "Global SEO Optimization", description: "Multi-language support and international SEO features to help you reach audiences worldwide." },
    { icon: BarChart, title: "Real-time Trending Analysis", description: "Live trend monitoring ensures your content stays relevant with the latest viral hashtags." },
    { icon: Target, title: "Creator & Business Focused", description: "Purpose-built for creators and marketers seeking to maximize their social media ROI." },
];

const WhyChooseUs = () => {
  return (
    <section id="why-choose" className="bg-white p-6 rounded-xl shadow-md">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-extrabold text-tt-dark-violet mb-2">Why Choose TurboTags?</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Powerful features designed for content creators seeking global reach.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <FeatureCard key={index} icon={feature.icon} title={feature.title} description={feature.description} />
        ))}
      </div>
    </section>
  );
};

export default WhyChooseUs;
