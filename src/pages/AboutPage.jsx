import React from 'react';
import { Link } from 'react-router-dom';
import { Bot, Zap, ShieldCheck, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

const AboutPage = () => {
  return (
    <motion.main 
      className="container mx-auto max-w-4xl p-6 py-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-tt-dark-violet mb-4">About TurboTags</h1>
          <p className="text-lg text-gray-600">Smarter Reach. Faster Growth. Built for a Global Audience.</p>
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
              <Globe className="h-12 w-12" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-tt-dark-violet mb-2">A Tool for the World</h2>
              <p className="text-gray-700 leading-relaxed">
                The internet has no borders, and your content shouldn't either. TurboTags is designed for a global audience, with support for over **20 languages** and **30 targetable regions**. Whether you're creating content for a local community in Mumbai or a global audience from Berlin, our tool helps you find the right keywords to connect.
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
            Start Generating For Free <Zap className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </motion.main>
  );
};

export default AboutPage;
