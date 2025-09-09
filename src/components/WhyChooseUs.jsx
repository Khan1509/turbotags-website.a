import React from 'react';
import { Bot, Globe, ShieldCheck, Zap } from 'lucide-react';
import FeatureCard from './ui/FeatureCard';

const features = [
  {
    icon: Bot,
    title: "Smarter AI",
    description: "Our AI generates not just tags, but also 5 SEO-optimized titles to maximize your content's impact."
  },
  {
    icon: Globe,
    title: "Global Reach",
    description: "Target over 30 regions and generate content in 20+ languages to connect with a worldwide audience."
  },
  {
    icon: ShieldCheck,
    title: "Privacy First",
    description: "No sign-up required. Your prompts are never stored. Your creative strategy stays yours alone."
  },
  {
    icon: Zap,
    title: "Completely Free",
    description: "Get unlimited access to all our powerful tools at no cost. We're committed to helping creators grow."
  }
];

const WhyChooseUs = () => {
  return (
    <section id="why-choose-us" className="py-12">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="text-center mb-12">
          <h2 className="h2 font-extrabold text-tt-dark-violet">Why TurboTags?</h2>
          <p className="text-lg text-gray-600 mt-2">The ultimate free toolkit for creators.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} icon={feature.icon} title={feature.title} description={feature.description} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
