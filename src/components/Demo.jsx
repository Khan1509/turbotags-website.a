import React from 'react';
import { PlayCircle, Zap, Target, BarChart, Globe } from 'lucide-react';
import LazyImage from '../ui/LazyImage';

const Demo = () => {
  return (
    <section id="demo" className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-3xl font-bold text-tt-dark-violet mb-2 text-center">See TurboTags in Action</h2>
      <p className="text-center text-gray-600 mb-8">Watch how easy it is to generate professional-grade tags and hashtags.</p>
      
      <div className="bg-gray-100 rounded-xl p-4 sm:p-8 text-center">
        <div className="max-w-4xl mx-auto">
          <a href="https://www.youtube.com/watch?v=ysz5S6PUM-U" target="_blank" rel="noopener noreferrer" className="aspect-video bg-gray-300 rounded-lg flex items-center justify-center cursor-pointer group relative overflow-hidden">
            <LazyImage src="https://img-wrapper.vercel.app/image?url=https://images.unsplash.com/photo-1611162617213-6d22e525732d?w=1280&h=720&fit=crop" alt="TurboTags Demo Video Thumbnail" className="absolute w-full h-full object-cover"/>
            <div className="absolute w-full h-full bg-black/30 group-hover:bg-black/50 transition-colors flex items-center justify-center">
              <PlayCircle className="h-16 w-16 sm:h-24 sm:w-24 text-white/80 group-hover:text-white transition-colors" />
            </div>
          </a>
          <h3 className="text-lg sm:text-xl font-bold mt-4 text-gray-800">Learn how to maximize your social media reach with AI</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="flex flex-col items-center p-2">
              <Zap className="h-8 w-8 text-tt-dark-violet mb-2" />
              <span className="text-sm font-semibold">Instant Generation</span>
              <span className="text-xs text-gray-500">Results in seconds</span>
            </div>
            <div className="flex flex-col items-center p-2">
              <Target className="h-8 w-8 text-tt-dark-violet mb-2" />
              <span className="text-sm font-semibold">Platform Specific</span>
              <span className="text-xs text-gray-500">Optimized for each</span>
            </div>
            <div className="flex flex-col items-center p-2">
              <BarChart className="h-8 w-8 text-tt-dark-violet mb-2" />
              <span className="text-sm font-semibold">Trending Analysis</span>
              <span className="text-xs text-gray-500">Real-time trend data</span>
            </div>
            <div className="flex flex-col items-center p-2">
              <Globe className="h-8 w-8 text-tt-dark-violet mb-2" />
              <span className="text-sm font-semibold">Global Reach</span>
              <span className="text-xs text-gray-500">Worldwide optimization</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Demo;
