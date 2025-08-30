import React from 'react';
import FaqItem from './ui/FaqItem';

const faqData = [
  {
    question: "How does the TurboTags AI hashtag generator work?",
    answer: "TurboTags uses advanced AI to analyze your content description. It understands context, identifies key themes, and cross-references them with current trends for platforms like YouTube, Instagram, and TikTok. This allows our free hashtag generator to provide relevant, SEO-optimized tags and hashtags designed to get views."
  },
  {
    question: "How can I find viral tags for YouTube and YouTube Shorts?",
    answer: "Our YouTube Tag Generator is designed to find viral tags that get views. When you select 'YouTube' and the 'Short' content format, our AI specifically looks for trending keywords and hashtags like #shorts to maximize your reach. It's the best way to generate YouTube tags for views, for free."
  },
  {
    question: "Is this the best free hashtag generator for Instagram and TikTok?",
    answer: "We believe so! TurboTags is a free hashtag generator for Instagram Reels, posts, and stories. It also serves as a powerful TikTok hashtag generator, finding trending hashtags to help you go viral. You can generate hashtags and copy and paste them directly into your posts."
  },
  {
    question: "Can I generate hashtags for Facebook Reels?",
    answer: "Yes! Our hashtag generator for Facebook Reels helps you find trending hashtags to increase the visibility of your content on the platform. Just select the 'Facebook' platform and 'Reels' format to get started."
  },
  {
    question: "Is TurboTags really free to use?",
    answer: "Yes! TurboTags is a completely free hashtag and tag generator. We believe in supporting content creators and helping them grow their audience without financial barriers. All core features are available at no cost."
  }
];

const Faq = () => {
  return (
    <section id="faq" className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Frequently Asked Questions</h2>
      <div className="max-w-3xl mx-auto">
        {faqData.map((item, index) => (
          <FaqItem key={index} question={item.question} answer={item.answer} />
        ))}
      </div>
    </section>
  );
};

export default Faq;
