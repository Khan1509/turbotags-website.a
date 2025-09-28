import React from 'react';
import { Bot, Globe, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutSection = () => {
  return (
    <section id="about" className="bg-white p-6 sm:p-8 rounded-xl shadow-md">
      <div className="text-center">
        {/* SEO: Changed from h1 to h2 for correct semantic structure. The H1 is now on the page component. */}
        <h2 className="text-4xl font-extrabold mb-4" style={{color: '#475569'}}>Our Mission & Vision</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">Smarter Reach. Faster Growth. Built for a Global Audience.</p>
      </div>

      <div className="mt-12 space-y-12">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-shrink-0 bg-tt-dark-violet text-white p-6 rounded-full">
            <Bot className="h-12 w-12" />
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-2" style={{color: '#475569'}}>Our Mission</h3>
            <p className="text-gray-700 leading-relaxed">
              Our mission is to empower content creators of all sizes with the tools they need to succeed. We believe that great content deserves to be seen, and the right tags and hashtags are crucial for discoverability. TurboTags was built to level the playing field, offering powerful, AI-driven insights for free.
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row-reverse items-center gap-8">
          <div className="flex-shrink-0 bg-tt-dark-violet text-white p-6 rounded-full">
            <Globe className="h-12 w-12" />
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-2" style={{color: '#475569'}}>A Tool for the World</h3>
            <p className="text-gray-700 leading-relaxed">
              The internet has no borders, and your content shouldn't either. TurboTags is designed for a global audience, with support for over <strong>20 languages</strong> and <strong>30 targetable regions</strong>. Whether you're creating content for a local community in Mumbai or a global audience from Berlin, our tool helps you find the right keywords to connect.
            </p>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-shrink-0 bg-tt-dark-violet text-white p-6 rounded-full">
            <ShieldCheck className="h-12 w-12" />
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-2" style={{color: '#475569'}}>Our Commitment to Privacy</h3>
            <p className="text-gray-700 leading-relaxed">
              We are creators ourselves, and we value privacy. TurboTags requires no sign-up or personal information. Your content ideas are sent to our API for processing and are never stored or logged. Your creative strategy remains yours alone. For more details, read our full <Link to="/legal/privacy" className="text-tt-medium-violet hover:underline font-medium">Privacy Policy</Link>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
