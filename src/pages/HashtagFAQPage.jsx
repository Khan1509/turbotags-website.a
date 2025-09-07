import React from 'react';
import { motion } from 'framer-motion';
import { usePageMeta } from '../hooks/usePageMeta';
import { ChevronDown, ChevronUp, Hash, HelpCircle } from 'lucide-react';
import { useState } from 'react';

const HashtagFAQPage = () => {
  usePageMeta(
    'How Do Hashtags Work? Complete Guide 2025 | TurboTags',
    'Learn how hashtags work, best practices for Instagram, TikTok, YouTube & Facebook. Expert answers to common hashtag questions. Free hashtag generator.'
  );

  const [openFAQ, setOpenFAQ] = useState(0);

  const faqData = [
    {
      question: "How do hashtags work on social media?",
      answer: "Hashtags work by categorizing content and making it discoverable. When you use a hashtag like #fitness, your post joins a searchable feed of all content using that tag. Social media algorithms use hashtags to understand your content topic and show it to users interested in that subject. Each platform has different hashtag mechanics - Instagram allows up to 30, TikTok focuses on trending ones, and YouTube uses them for discovery."
    },
    {
      question: "How many hashtags should I use?",
      answer: "The optimal number varies by platform: Instagram allows up to 30 hashtags (use 20-30 for maximum reach), TikTok works best with 3-6 strategic hashtags, YouTube should have 10-15 tags plus 3-5 hashtags in descriptions, and Facebook performs best with 1-3 hashtags. More isn't always better - focus on relevance and strategic selection."
    },
    {
      question: "Do hashtags increase followers and engagement?",
      answer: "Yes, when used strategically. Hashtags can increase your content's reach by 70-80% on Instagram and significantly boost discoverability on TikTok. However, they must be relevant to your content and audience. Random or excessive hashtags can hurt performance. Use a mix of popular hashtags (for reach) and niche hashtags (for targeted engagement)."
    },
    {
      question: "What makes a hashtag go viral?",
      answer: "Viral hashtags typically have these characteristics: they're short and memorable, easy to spell, relevant to current events or trends, emotionally engaging, and get picked up by influencers early. Timing is crucial - jumping on trends within 24-48 hours gives the best chance of viral success. Original hashtags for campaigns can also go viral if they're clever and shareable."
    },
    {
      question: "Should I use trending hashtags or niche hashtags?",
      answer: "Use both for maximum impact. The 80/20 rule works well: 80% niche hashtags (10K-100K posts) for targeted audience reach, and 20% trending hashtags (1M+ posts) for broader visibility. Trending hashtags get you initial exposure, while niche hashtags help you reach engaged users genuinely interested in your content."
    },
    {
      question: "Can hashtags hurt my reach?",
      answer: "Yes, improper hashtag use can reduce your reach. Avoid these mistakes: using banned or shadowbanned hashtags, using too many irrelevant hashtags, repeating the same hashtags on every post, or using more hashtags than the platform recommends. Instagram will hide posts with banned hashtags, and TikTok may limit reach for hashtag spam."
    },
    {
      question: "How do I research the best hashtags for my content?",
      answer: "Start by analyzing your content's main topic and audience. Use tools like our AI hashtag generator for suggestions, then research each hashtag's popularity and competition. Check if your target audience follows these hashtags. Look at successful competitors' hashtag strategies. Mix broad hashtags for reach with specific ones for engagement."
    },
    {
      question: "Do hashtags work the same on all social media platforms?",
      answer: "No, each platform treats hashtags differently. Instagram hashtags work like search keywords and categorization. TikTok hashtags influence the 'For You' page algorithm heavily. YouTube uses hashtags for search discovery and suggested videos. Facebook hashtags have less impact but still aid discoverability. Twitter hashtags join real-time conversations and trends."
    },
    {
      question: "What's the difference between tags and hashtags?",
      answer: "Tags are backend metadata used for organization and SEO (like YouTube video tags), while hashtags are public, clickable keywords with # symbols used for social discovery. YouTube tags help the algorithm understand your content but aren't visible to viewers. Hashtags appear in your post and are clickable, leading to feeds of similar content."
    },
    {
      question: "How often should I change my hashtags?",
      answer: "Vary your hashtags regularly but maintain some consistency. Use 70% new hashtags and 30% consistent brand/niche hashtags for each post. This prevents being flagged as spam while maintaining your niche presence. Research new trending hashtags weekly and retire underperforming ones monthly. Track which hashtags drive the most engagement for your content."
    },
    {
      question: "Are there hashtags I should avoid?",
      answer: "Yes, avoid banned, shadowbanned, or inappropriate hashtags. These include overly generic ones like #love or #follow, hashtags associated with spam or adult content, and temporarily banned hashtags (which change frequently). Also avoid hashtags unrelated to your content, broken or misspelled hashtags, and using the same hashtag set repeatedly."
    },
    {
      question: "How do I create my own branded hashtag?",
      answer: "Create a unique, memorable hashtag that represents your brand or campaign. It should be short (under 20 characters), easy to spell, not already in heavy use, and relevant to your brand identity. Promote it consistently across all your content, encourage followers to use it, and consider running campaigns around it. Monitor its usage and engage with posts that use your hashtag."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? -1 : index);
  };

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
            <Hash className="h-8 w-8 text-tt-dark-violet mr-3" />
            <HelpCircle className="h-8 w-8 text-tt-dark-violet" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-tt-dark-violet mb-4">
            How Do Hashtags Work?
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to know about using hashtags effectively on Instagram, TikTok, YouTube, and Facebook. 
            Get expert answers to the most common hashtag questions.
          </p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div 
          className="bg-white p-6 rounded-xl shadow-md mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-tt-dark-violet mb-1">70%</div>
              <div className="text-sm text-gray-600">More reach with proper hashtags</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-tt-dark-violet mb-1">30</div>
              <div className="text-sm text-gray-600">Max hashtags on Instagram</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-tt-dark-violet mb-1">3-6</div>
              <div className="text-sm text-gray-600">Optimal for TikTok success</div>
            </div>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div 
          className="bg-white rounded-xl shadow-md overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800">Frequently Asked Questions</h2>
            <p className="text-gray-600 mt-2">Click any question to see the detailed answer</p>
          </div>

          <div className="divide-y divide-gray-200">
            {faqData.map((faq, index) => (
              <div key={index} className="p-6">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-tt-dark-violet rounded-lg"
                >
                  <h3 className="text-lg font-semibold text-gray-800 pr-4">
                    {faq.question}
                  </h3>
                  {openFAQ === index ? (
                    <ChevronUp className="h-5 w-5 text-tt-dark-violet flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-tt-dark-violet flex-shrink-0" />
                  )}
                </button>
                
                {openFAQ === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4"
                  >
                    <p className="text-gray-700 leading-relaxed">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div 
          className="mt-12 bg-gradient-to-r from-tt-dark-violet to-purple-700 p-8 rounded-xl text-center text-white shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold mb-4">Ready to Create Viral Hashtags?</h2>
          <p className="text-purple-100 mb-6">
            Use our AI-powered hashtag generator to create optimized hashtags for any platform
          </p>
          <a
            href="/"
            className="inline-block bg-white text-tt-dark-violet px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Generate Hashtags Now →
          </a>
        </motion.div>

        {/* Structured Data JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": faqData.map(faq => ({
                "@type": "Question",
                "name": faq.question,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": faq.answer
                }
              }))
            })
          }}
        />
      </div>
    </div>
  );
};

export default HashtagFAQPage;