import React from 'react';
import { Link } from 'react-router-dom';
import { Bot, Zap, ShieldCheck, Globe } from 'lucide-react';

const AboutPage = () => {
  return (
    <main className="container mx-auto max-w-4xl p-6 py-10">
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-tt-dark-violet mb-4">About TurboTags</h1>
          <p className="text-lg text-gray-600">Smarter Reach. Faster Growth. Built for Creators.</p>
        </div>

        <div className="mt-12 space-y-10">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0 bg-tt-dark-violet text-white p-6 rounded-full">
              <Bot className="h-12 w-12" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-tt-dark-violet mb-2">Our Mission</h2>
              <p className="text-gray-700 leading-relaxed">
                Our mission is to empower content creators of all sizes with the tools they need to succeed. We believe that great content deserves to be seen, and the right tags and hashtags are crucial for discoverability. TurboTags was built to level the playing field, offering powerful, AI-driven insights for free, so you can focus on what you do best: creating.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row-reverse items-center gap-8">
            <div className="flex-shrink-0 bg-tt-dark-violet text-white p-6 rounded-full">
              <Zap className="h-12 w-12" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-tt-dark-violet mb-2">How It Works</h2>
              <p className="text-gray-700 leading-relaxed">
                TurboTags leverages a cascade of cutting-edge AI models through OpenRouter to analyze your content topic. It understands context, identifies trends, and generates SEO-optimized tags and hashtags tailored to specific platforms like YouTube, Instagram, and TikTok. If our primary AI services are busy, a robust fallback system ensures you always get high-quality suggestions, guaranteeing 99.9% uptime.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0 bg-tt-dark-violet text-white p-6 rounded-full">
              <ShieldCheck className="h-12 w-12" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-tt-dark-violet mb-2">Our Commitment to Privacy</h2>
              <p className="text-gray-700 leading-relaxed">
                We are creators ourselves, and we value privacy. TurboTags requires no sign-up or personal information. Your content ideas (the prompts you enter) are sent to our API for processing and are never stored or logged. Your creative strategy remains yours alone. For more details, read our full <Link to="/legal/privacy" className="text-tt-medium-violet hover:underline font-medium">Privacy Policy</Link>.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Ready to Grow Your Channel?</h3>
          <Link to="/#tag-generator" className="btn-primary">
            Start Generating For Free <Globe className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </main>
  );
};

export default AboutPage;
