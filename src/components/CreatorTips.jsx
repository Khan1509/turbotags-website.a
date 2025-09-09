import React from 'react';
import { Lightbulb } from 'lucide-react';
import TipBox from './ui/TipBox';

const tipsData = {
  youtube: [
    "Use your main keyword in the first sentence of your description.",
    "Create custom thumbnails with expressive faces and bold text.",
    "Engage with comments within the first few hours to boost visibility."
  ],
  instagram: [
    "Use a mix of popular (1M+ posts) and niche (10k-100k posts) hashtags.",
    "Post Reels consistently to leverage Instagram's algorithm boost.",
    "Interact with other accounts in your niche to increase your visibility."
  ],
  tiktok: [
    "Hook viewers within the first 3 seconds of your video.",
    "Use trending sounds and effects to increase your chances of going viral.",
    "Post 3-5 times a day when you're trying to grow your account."
  ],
  facebook: [
    "Ask questions in your posts to encourage comments and engagement.",
    "Share your content to relevant Facebook Groups to expand your reach.",
    "Upload videos directly to Facebook for better performance than sharing a link."
  ]
};

const CreatorTips = ({ platform }) => {
  const tips = tipsData[platform] || tipsData.youtube;

  return (
    <section id="creator-tips" className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="h2 font-bold text-gray-800 mb-6 text-center flex items-center justify-center">
        <Lightbulb className="h-8 w-8 mr-3 text-yellow-400" />
        Pro Creator Tips
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tips.map((tip, index) => (
          <TipBox key={index} tip={tip} />
        ))}
      </div>
    </section>
  );
};

export default CreatorTips;
