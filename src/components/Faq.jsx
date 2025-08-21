import React from 'react';
import FaqItem from './ui/FaqItem';

const faqData = [
  {
    question: "How does TurboTags generate tags and hashtags?",
    answer: "TurboTags uses advanced AI algorithms powered by OpenRouter (Mistral 7B Instruct primary, Google Gemini Flash fallback) to analyze your content description and generate relevant, SEO-optimized tags and hashtags. Our system considers current trends, search volume, and platform-specific optimization strategies."
  },
  {
    question: "Is TurboTags really free to use?",
    answer: "Yes! TurboTags is completely free to use. We believe in supporting content creators and helping them grow their audience without financial barriers. All core features including tag generation, hashtag creation, and search history are available at no cost."
  },
  {
    question: "Which platforms does TurboTags support?",
    answer: "Currently, TurboTags supports YouTube (tags and hashtags), Instagram (hashtags), TikTok (hashtags), and Facebook (hashtags). Each platform has optimized algorithms to ensure the best possible tag and hashtag suggestions for maximum reach and engagement."
  },
  {
    question: "How many tags and hashtags can I generate?",
    answer: "TurboTags generates 15-20 optimized tags and hashtags per request (25 maximum), which is ideal for most platforms. YouTube allows up to 500 characters in tags, while Instagram and TikTok have their own best practices that our system follows automatically."
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
