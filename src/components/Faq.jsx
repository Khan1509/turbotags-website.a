import React from 'react';
import FaqItem from './ui/FaqItem';

export const faqData = [
  {
    question: "How does this free YouTube tags generator work?",
    answer: "Our free YouTube tags generator uses advanced AI to analyze your video's topic. It identifies key themes and cross-references them with current trends to provide relevant, SEO-optimized tags and hashtags designed to get more views."
  },
  {
    question: "How can I find good Instagram hashtag ideas for 2025?",
    answer: "TurboTags is the perfect tool for finding Instagram hashtag ideas for 2025. Our AI analyzes your topic and suggests a mix of popular, niche, and trending hashtags. Just select the 'Instagram' platform and enter your post idea to get a fresh list of suggestions tailored for growth."
  },
  {
    question: "Can this tool also work as an AI title generator?",
    answer: "Yes! Beyond tags, TurboTags features a powerful AI title generator. It creates 5 engaging, SEO-friendly titles for your content based on your topic, platform, and target region. It's an all-in-one tool for content optimization."
  },
  {
    question: "Is this the best free hashtag generator for Instagram and TikTok?",
    answer: "We believe so! TurboTags is a free hashtag generator for Instagram Reels, posts, and stories. It also serves as a powerful TikTok hashtag generator, finding trending hashtags to help you go viral. You can generate hashtags and copy and paste them directly into your posts."
  },
  {
    question: "Is TurboTags really free to use?",
    answer: "Yes! All core features of TurboTags, including the free YouTube tags generator, the Instagram hashtag idea generator, and the AI title generator, are available at no cost. We are committed to helping creators grow."
  }
];

const Faq = () => {
  return (
    <section id="faq" className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="h2 font-bold text-gray-800 mb-6 text-center">Frequently Asked Questions</h2>
      <div className="max-w-3xl mx-auto">
        {faqData.map((item, index) => (
          <FaqItem key={index} question={item.question} answer={item.answer} />
        ))}
      </div>
    </section>
  );
};

export default Faq;
