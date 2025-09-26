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
            borderColor: '#344973',
            boxShadow: '0 8px 20px rgba(22, 32, 89, 0.3), 0 0 15px rgba(52, 73, 115, 0.2)'
          }}>
          <Globe className="w-4 h-4 mr-2" aria-hidden="true" />
          30+ Regions Supported
        </span>
        <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold text-white shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:shadow-2xl border border-opacity-40" role="listitem"
          style={{
            background: 'linear-gradient(135deg, #192340 0%, #344973 100%)',
            borderColor: '#4a90e2',
            boxShadow: '0 10px 25px rgba(25, 35, 64, 0.4), 0 0 20px rgba(74, 144, 226, 0.25)'
          }}>
          <Bot className="w-4 h-4 mr-2" aria-hidden="true" />
          AI Title & Tag Generation
        </span>
        <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border-2 shadow-lg transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:shadow-xl" role="listitem"
          style={{
            background: 'linear-gradient(135deg, rgba(52, 73, 115, 0.1), rgba(74, 144, 226, 0.1))',
            color: '#e5e7eb',
            borderColor: '#344973',
            boxShadow: '0 8px 20px rgba(52, 73, 115, 0.2), inset 0 1px 0 rgba(74, 144, 226, 0.1)'
          }}>
          <BarChart className="w-4 h-4 mr-2" aria-hidden="true" />
          SEO Optimized
        </span>
      </div>

      <h1
        className="text-4xl md:text-5xl font-extrabold mt-6 leading-tight"
        style={{
          background: 'linear-gradient(135deg, #e5e7eb 0%, #cbd5e1 40%, #4a90e2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          textShadow: '0 0 30px rgba(74, 144, 226, 0.3)',
          letterSpacing: '-0.02em',
        }}
      >
        Free AI Tags &amp; Hashtags Generator for YouTube, TikTok, Instagram &amp; Facebook
      </h1>

      <p
        className="text-lg md:text-xl font-semibold mt-4"
        style={{ 
          color: '#cbd5e1',
          textShadow: '0 2px 10px rgba(74, 144, 226, 0.2)' 
        }}
      >
        Smarter Reach. Faster Growth. <span className="inline-block animate-rocket-float" role="img" aria-label="rocket">🚀</span>
      </p>

      <p
        className="mt-4 max-w-3xl mx-auto text-base md:text-lg leading-relaxed"
        style={{ color: '#94a3b8' }}
      >
        Generate <strong style={{ color: '#e5e7eb' }}>viral tags</strong>, <strong style={{ color: '#e5e7eb' }}>trending hashtags</strong>, and <strong style={{ color: '#e5e7eb' }}>SEO-optimized titles</strong> for YouTube, TikTok, Instagram, and Facebook. Our AI helps you get more views and reach a global audience.
      </p>

      <div
        className="mt-8 flex justify-center"
      >
        <a
          href="#tag-generator"
          className="btn btn-secondary focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:ring-offset-2"
          aria-label="Start generating tags and hashtags now"
        >
          Start Generating Now <Zap className="ml-2 h-5 w-5" aria-hidden="true" />
        </a>
      </div>
    </section>
  );
});

export default Hero;
