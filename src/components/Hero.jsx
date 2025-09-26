import React from 'react';
import { Zap, Bot, BarChart, Globe } from 'lucide-react';

const Hero = React.memo(() => {
  return (
    <section
      id="home"
      className="text-center py-8"
    >
      <div
        className="mt-4 flex justify-center space-x-2 sm:space-x-4 flex-wrap gap-2"
        role="list"
        aria-label="Key features"
      >
        <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:shadow-xl border border-opacity-30" role="listitem"
          style={{
            background: 'linear-gradient(135deg, #162059 0%, #192340 100%)',
            borderColor: '#4a90e2',
            boxShadow: '0 8px 20px rgba(22, 32, 89, 0.2), 0 2px 10px rgba(0, 0, 0, 0.1)'
          }}>
          <Globe className="w-4 h-4 mr-2" aria-hidden="true" />
          30+ Regions Supported
        </span>
        <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold text-white shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:shadow-2xl border border-opacity-40" role="listitem"
          style={{
            background: 'linear-gradient(135deg, #475569, #334155)',
            borderColor: 'rgba(51, 65, 85, 0.3)',
            boxShadow: '0 8px 20px rgba(51, 65, 85, 0.25), 0 4px 8px rgba(0, 0, 0, 0.2)'
          }}>
          <Bot className="w-4 h-4 mr-2" aria-hidden="true" />
          AI Title & Tag Generation
        </span>
        <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border-2 shadow-lg transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:shadow-xl" role="listitem"
          style={{
            background: 'radial-gradient(125% 125% at 50% 90%, #fff 40%, #475569 100%)',
            color: '#1f2937',
            borderColor: 'rgba(51, 65, 85, 0.3)',
            boxShadow: '0 8px 20px rgba(51, 65, 85, 0.25), 0 4px 8px rgba(0, 0, 0, 0.2)'
          }}>
          <BarChart className="w-4 h-4 mr-2" aria-hidden="true" />
          SEO Optimized
        </span>
      </div>

      <h1
        className="text-4xl md:text-5xl font-extrabold mt-6 leading-tight"
        style={{
          background: 'linear-gradient(135deg, #475569 0%, #334155 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          textShadow: '0 2px 10px rgba(22, 32, 89, 0.2)',
          letterSpacing: '-0.02em',
        }}
      >
        Free AI Tags &amp; Hashtags Generator for YouTube, TikTok, Instagram &amp; Facebook
      </h1>

      <p
        className="text-lg md:text-xl font-semibold mt-4"
        style={{ 
          color: '#374151',
          textShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' 
        }}
      >
        Smarter Reach. Faster Growth. <span className="inline-block animate-rocket-float" role="img" aria-label="rocket">🚀</span>
      </p>

      <p
        className="mt-4 max-w-3xl mx-auto text-base md:text-lg leading-relaxed"
        style={{ color: '#6b7280' }}
      >
        Generate <strong style={{ color: '#1f2937' }}>viral tags</strong>, <strong style={{ color: '#1f2937' }}>trending hashtags</strong>, and <strong style={{ color: '#1f2937' }}>SEO-optimized titles</strong> for YouTube, TikTok, Instagram, and Facebook. Our AI helps you get more views and reach a global audience.
      </p>

      <div
        className="mt-8 flex justify-center"
      >
        <a
          href="#tag-generator"
          className="btn btn-secondary focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
          aria-label="Start generating tags and hashtags now"
        >
          Start Generating Now <Zap className="ml-2 h-5 w-5" aria-hidden="true" />
        </a>
      </div>
    </section>
  );
});

export default Hero;
