import React from 'react';
import FeatureCard from './ui/FeatureCard';
import { Zap, Target, BarChart, Lock } from 'lucide-react';

const features = [
  { icon: Target, title: "Precision Targeting", description: "Generate laser-focused tags that connect with your exact audience demographic and interests." },
  { icon: BarChart, title: "Performance Analytics", description: "Built-in trending percentages help you choose tags with the highest engagement potential." },
  { icon: Zap, title: "Instant Results", description: "Get professional-grade tags and hashtags in seconds, not hours of manual research." },
  { icon: Lock, title: "Privacy First", description: "No registration required. Your content ideas and strategies remain completely private." },
];

const About = () => {
  return (
    <section className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">About TurboTags</h2>
      <p className="text-gray-600 leading-relaxed mb-8 text-center max-w-4xl mx-auto">
        TurboTags is the world's most advanced AI-powered tag and hashtag generator, designed specifically for content creators and digital marketers who want to maximize their reach across all major social media platforms with global SEO optimization.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <FeatureCard key={index} icon={feature.icon} title={feature.title} description={feature.description} />
        ))}
      </div>

      <div className="mt-8 text-center">
        <p className="text-gray-700 font-medium mb-4">Trusted by over 50,000 content creators worldwide</p>
        <a href="#tag-generator" className="btn-primary">
          Start Generating Now - It's Free! <Zap className="ml-2 h-5 w-5" />
        </a>
      </div>
    </section>
  );
};

export default About;
