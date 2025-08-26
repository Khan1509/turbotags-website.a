import React from 'react';
import { trendingTopicsData } from '../data/trendingTopicsData';
import { Lightbulb } from 'lucide-react';

const TrendingTopics = () => {
  return (
    <section id="trending-topics" className="bg-white p-6 rounded-xl shadow-md">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-extrabold text-tt-dark-violet mb-2">Trending Topic Ideas</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Stuck on what to create next? Here's what's currently trending across major platforms.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {trendingTopicsData.map((platformData) => (
          <div key={platformData.platform} className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <platformData.icon className={`h-8 w-8 mr-3 ${platformData.color}`} />
              <h3 className="text-2xl font-bold text-gray-800">{platformData.platform}</h3>
            </div>
            <ul className="space-y-4">
              {platformData.topics.map((topic, index) => (
                <li key={index} className="flex items-start">
                  <Lightbulb className="h-5 w-5 text-yellow-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-800">{topic.title}</h4>
                    <p className="text-sm text-gray-600">{topic.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrendingTopics;
