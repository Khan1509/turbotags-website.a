import React from 'react';
import { Sparkles } from 'lucide-react';

const quickTopicsData = {
  youtube: [
    { category: 'Gaming', topics: ['Call of Duty gameplay', 'Minecraft building tutorial', 'Fortnite battle royale', 'Valorant clutch moments'] },
    { category: 'Tech', topics: ['iPhone 15 review', 'AI tutorial for beginners', 'Best laptops 2024', 'Coding tips and tricks'] },
    { category: 'Lifestyle', topics: ['Morning routine vlog', 'Productivity tips', 'Home workout routine', 'Study with me session'] },
    { category: 'Food', topics: ['Easy pasta recipe', 'Healthy meal prep', 'Baking chocolate cookies', 'Coffee brewing guide'] }
  ],
  instagram: [
    { category: 'Fashion', topics: ['OOTD casual spring look', 'Thrift haul transformation', 'Summer dress collection', 'Jewelry styling tips'] },
    { category: 'Beauty', topics: ['Get ready with me glam', 'Skincare routine night', 'Makeup tutorial natural', 'Hair care routine curly'] },
    { category: 'Travel', topics: ['Paris vacation highlights', 'Beach day essentials', 'City exploration guide', 'Travel photography tips'] },
    { category: 'Food', topics: ['Aesthetic cafe breakfast', 'Homemade pizza recipe', 'Healthy smoothie bowl', 'Dinner date outfit'] }
  ],
  tiktok: [
    { category: 'Dance', topics: ['Popular TikTok dance trend', 'Hip hop dance tutorial', 'Viral dance challenge', 'Dance battle compilation'] },
    { category: 'Comedy', topics: ['Funny relatable moments', 'Comedy skit everyday life', 'Hilarious pet reactions', 'Awkward social situations'] },
    { category: 'DIY', topics: ['Room makeover budget', 'Craft project easy', 'Upcycling old clothes', 'Quick art tutorial'] },
    { category: 'Life Hacks', topics: ['Organization tips bedroom', 'Study hacks for students', 'Cooking shortcuts busy', 'Phone photography tricks'] }
  ],
  facebook: [
    { category: 'Business', topics: ['Small business marketing tips', 'Entrepreneur success story', 'Product launch announcement', 'Customer testimonial video'] },
    { category: 'Family', topics: ['Family vacation memories', 'Kids birthday party ideas', 'Parenting tips toddlers', 'Weekend activities family'] },
    { category: 'Community', topics: ['Local event announcement', 'Charity fundraiser support', 'Neighborhood clean up day', 'Community garden project'] },
    { category: 'Education', topics: ['Online learning benefits', 'Study group formation', 'Educational workshop', 'Skill development course'] }
  ]
};

const QuickTopics = ({ platform, onTopicSelect }) => {
  const topics = quickTopicsData[platform] || [];

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-4 mb-6">
      <div className="flex items-center mb-3">
        <Sparkles className="h-5 w-5 text-purple-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-800">Quick Topic Ideas</h3>
      </div>
      <p className="text-sm text-gray-600 mb-4">Click any topic below to instantly generate optimized content</p>
      
      <div className="grid gap-3">
        {topics.map((category, categoryIndex) => (
          <div key={categoryIndex}>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">{category.category}</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {category.topics.map((topic, topicIndex) => (
                <button
                  key={topicIndex}
                  onClick={() => onTopicSelect(topic)}
                  className="text-left p-2 bg-white rounded border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 text-sm group"
                >
                  <span className="text-gray-700 group-hover:text-purple-700 transition-colors">
                    {topic}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickTopics;