import React from 'react';
import { FileText, Lightbulb, Bot } from 'lucide-react';

const comingSoonFeatures = [
    { icon: FileText, title: "AI Script Outline", description: "Generate structured script outlines to streamline your video production process." },
    { icon: Lightbulb, title: "Viral Video Idea Finder", description: "Discover trending topics and content ideas in your niche before they go mainstream." },
    { icon: Bot, title: "YouTube Title Analyst", description: "Get AI-driven feedback and scores on your video titles to maximize click-through rates." },
];

const ComingSoon = () => {
  return (
    <section className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">Coming Soon</h2>
      <p className="text-center text-gray-600 mb-8">
        Exciting new features are in development to make TurboTags even more powerful.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {comingSoonFeatures.map((feature, index) => (
          <div key={index} className="premium-card bg-gray-50 border border-gray-200 rounded-lg p-6 text-center transition-transform hover:-translate-y-1">
            <div className="bg-tt-dark-violet text-white p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <feature.icon className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
            <p className="text-gray-600 text-sm mb-4">{feature.description}</p>
            <div className="text-tt-medium-violet text-sm font-semibold">
              Coming Soon
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ComingSoon;
