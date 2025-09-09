import React, { useState } from 'react';
import { Clock, Star, Target, BarChart } from 'lucide-react';

const tabs = [
  { name: 'History', icon: Clock },
  { name: 'Favorites', icon: Star },
  { name: 'Campaigns', icon: Target },
];

const EnhancedUxHub = () => {
  const [activeTab, setActiveTab] = useState('History');

  const renderContent = () => {
    switch (activeTab) {
      case 'History':
        return <p>Your past generations will appear here. (Pro Feature)</p>;
      case 'Favorites':
        return <p>Your saved tags and titles will appear here. (Pro Feature)</p>;
      case 'Campaigns':
        return <p>Group your content into campaigns for better tracking. (Pro Feature)</p>;
      default:
        return null;
    }
  };

  return (
    <section id="ux-hub" className="bg-white p-6 rounded-xl shadow-md">
      <div className="flex border-b border-gray-200 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`flex items-center gap-2 px-4 py-3 font-semibold transition-colors duration-200 focus:outline-none ${
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
    </section>
  );
};

export default EnhancedUxHub;
