import React from 'react';
import { motion } from 'framer-motion';
import usePageMeta from '../hooks/usePageMeta';
import { HelpCircle } from 'lucide-react';
import FaqItem from '../components/ui/FaqItem';
import { faqData } from '../components/Faq';

const FaqPage = () => {
  usePageMeta(
    'Frequently Asked Questions - TurboTags',
    'Get answers to common questions about TurboTags free hashtag generator, AI title generator, and our tools for YouTube, Instagram, TikTok, and Facebook.'
  );

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto max-w-4xl px-4">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center mb-4">
            <HelpCircle className="h-8 w-8 text-tt-dark-violet" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4" style={{color: 'var(--color-text)'}}>
            Frequently Asked Questions
          </h1>
          <p className="text-xl max-w-3xl mx-auto" style={{color: 'var(--color-text-muted)'}}>
            Get answers to common questions about TurboTags and how to use our free hashtag generator effectively.
          </p>
        </motion.div>

        {/* FAQ Section */}
        <motion.div 
          className="bg-white rounded-xl shadow-md overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold" style={{color: 'var(--color-text)'}}>Common Questions</h2>
            <p style={{color: 'var(--color-text-muted)'}} className="mt-2">Click any question to see the detailed answer</p>
          </div>

          <div className="max-w-3xl mx-auto p-6">
            {faqData.map((item, index) => (
              <FaqItem key={index} question={item.question} answer={item.answer} />
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div 
          className="mt-12 bg-gradient-to-r from-tt-dark-violet to-purple-700 p-8 rounded-xl text-center text-white shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold mb-4">Ready to Start Generating?</h2>
          <p className="text-purple-100 mb-6">
            Create viral hashtags and titles for your content across all social media platforms
          </p>
          <a
            href="/"
            className="inline-block bg-white text-tt-dark-violet px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Start Generating Now →
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default FaqPage;