import React, { useState } from 'react';
import { Calendar, Type, Captions, Image } from 'lucide-react';

const tabs = [
  { name: 'Content Calendar', icon: Calendar },
  { name: 'Title Optimizer', icon: Type },
  { name: 'Caption Generator', icon: Captions },
  { name: 'Thumbnail Ideas', icon: Image },
];

const ContentSuite = () => {
  const [activeTab, setActiveTab] = useState('Content Calendar');

  const renderContent = () => {
    switch (activeTab) {
      case 'Content Calendar':
        return <p>Plan and schedule your content across all platforms. (Pro Feature)</p>;
      case 'Title Optimizer':
        return <p>Analyze and improve your existing titles for better CTR. (Pro Feature)</p>;
      case 'Caption Generator':
        return <p>Generate engaging captions for your social media posts. (Pro Feature)</p>;
      case 'Thumbnail Ideas':
        return <p>Get AI-powered ideas and layouts for your video thumbnails. (Pro Feature)</p>;
      default:
        return null;
    }
  };

  return (
    <section id="content-suite" className="py-12 bg-gray-50">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-tt-dark-violet">🎯 Content Creation Suite</h2>
          <p className="text-lg text-gray-600 mt-2">All the tools you need to create amazing content, in one place.</p>
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

export default ContentSuite;
