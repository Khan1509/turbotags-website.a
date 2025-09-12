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
        <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-brand-blue text-white shadow-lg transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:shadow-xl" role="listitem">
          <Globe className="w-4 h-4 mr-2" aria-hidden="true" />
          30+ Regions Supported
        </span>
        <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-brand-dark-blue text-white shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:shadow-2xl" role="listitem">
          <Bot className="w-4 h-4 mr-2" aria-hidden="true" />
          AI Title & Tag Generation
        </span>
        <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-white text-brand-dark-blue border-2 border-brand-dark-blue shadow-lg transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:shadow-xl" role="listitem">
          <BarChart className="w-4 h-4 mr-2" aria-hidden="true" />
          SEO Optimized
        </span>
      </div>

      <h1
        className="text-4xl md:text-5xl font-extrabold mt-6 text-gradient leading-tight"
      >
        Free AI Tags &amp; Hashtags Generator for YouTube, TikTok, Instagram &amp; Facebook
      </h1>

      <p
        className="text-lg md:text-xl font-semibold mt-4 text-brand-dark-grey"
      >
        Smarter Reach. Faster Growth. <span className="inline-block animate-rocket-float" role="img" aria-label="rocket">🚀</span>
      </p>

      <p
        className="mt-4 max-w-3xl mx-auto text-brand-medium-grey text-base md:text-lg leading-relaxed"
      >
        Generate <strong>viral tags</strong>, <strong>trending hashtags</strong>, and <strong>SEO-optimized titles</strong> for YouTube, TikTok, Instagram, and Facebook. Our AI helps you get more views and reach a global audience.
      </p>

      <div
        className="mt-8 flex justify-center"
      >
        <a
          href="#tag-generator"
          className="btn btn-secondary focus:outline-none focus:ring-2 focus:ring-brand-dark-blue focus:ring-offset-2"
          aria-label="Start generating tags and hashtags now"
        >
          Start Generating Now <Zap className="ml-2 h-5 w-5" aria-hidden="true" />
        </a>
      </div>
    </section>
  );
});

export default Hero;
