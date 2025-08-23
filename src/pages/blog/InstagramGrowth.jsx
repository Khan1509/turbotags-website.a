import React from 'react';
import { Link } from 'react-router-dom';
import { Bot } from 'lucide-react';

const InstagramGrowth = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 min-h-[60vh] bg-gray-50">
      <Bot size={64} className="text-tt-medium-violet mb-4 animate-bounce" />
      <h1 className="text-4xl font-bold mb-4 text-tt-dark-violet">Content Coming Soon!</h1>
      <p className="text-xl text-gray-600 max-w-2xl mb-8">
        Our AI is analyzing the latest trends to bring you the best Instagram growth strategies. Check back soon for an in-depth guide!
      </p>
      <Link to="/blog" className="btn-secondary">Back to All Articles</Link>
    </div>
  );
};

export default InstagramGrowth;
