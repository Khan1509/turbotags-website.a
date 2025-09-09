import React, { useState } from 'react';
import { Layers, GitCompareArrows, Gauge, Sparkles } from 'lucide-react';

const tabs = [
  { name: 'Bulk Generation', icon: Layers },
  { name: 'A/B Testing', icon: GitCompareArrows },
  { name: 'Performance Scoring', icon: Gauge },
  { name: 'Smart Optimization', icon: Sparkles },
];

const AdvancedFeatures = () => {
  const [activeTab, setActiveTab] = useState('Bulk Generation');

  const renderContent = () => {
    switch (activeTab) {
      case 'Bulk Generation':
        return <p>Generate tags for multiple videos at once from a CSV file. (Enterprise Feature)</p>;
      case 'A/B Testing':
        return <p>Test different sets of titles and tags to see what performs best. (Pro Feature)</p>;
      case 'Performance Scoring':
        return <p>Get a detailed score for your existing video's SEO and optimization. (Pro Feature)</p>;
      case 'Smart Optimization':
        return <p>Our AI will analyze your existing content and suggest improvements. (Pro Feature)</p>;
      default:
        return null;
    }
  };

  return (
    <section id="features" className="py-12">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-tt-dark-violet">🚀 Advanced Features</h2>
          <p className="text-lg text-gray-600 mt-2">Take your content strategy to the next level with our Pro tools.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-3 font-semibold transition-colors duration-200 focus:outline-none ${
                  activeTab === tab.name
                    ? 'border-b-2 border-tt-primary text-tt-primary'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
          <div className="text-center text-gray-500 p-8 bg-gray-50 rounded-lg">
            {renderContent()}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdvancedFeatures;
