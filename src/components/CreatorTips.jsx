import React from 'react';
import { Lightbulb } from 'lucide-react';
import TipBox from './ui/TipBox';

const tipsData = {
  youtube: [
    "Master the first 15 seconds: Use pattern interrupts, preview the value, and create curiosity gaps to maximize watch time retention.",
    "Optimize for suggested videos: Study your competition's top videos and create content that could appear alongside them in suggestions.",
    "Thumbnail psychology: Use faces with exaggerated expressions, high contrast colors (red, yellow, white), and text that creates curiosity without giving away the answer.",
    "End screen strategy: Always direct viewers to your best-performing video, not your latest. This creates a feedback loop of high-engagement content.",
    "Community tab mastery: Use polls, behind-the-scenes content, and teasers to maintain engagement between uploads and boost overall channel activity."
  ],
  instagram: [
    "Hashtag pyramid strategy: Use 5 small hashtags (under 100k), 20 medium (100k-1M), and 5 large (1M+) for maximum discoverability without shadow-banning.",
    "Reel hook formulas: 'POV:', 'Tell me you're X without telling me', 'Things that just make sense', or 'Plot twist:' are proven engagement drivers.",
    "Story highlights as funnels: Create highlight categories that tell your brand story and guide new followers through your best content systematically.",
    "Carousel engagement hack: Make the last slide a summary or call-to-action that encourages saves and shares, which Instagram heavily rewards.",
    "Cross-pollination commenting: Spend 30 minutes daily engaging meaningfully on accounts in your niche to increase your visibility in their audience."
  ],
  tiktok: [
    "Trend interpolation: Take trending sounds/effects and adapt them to your niche rather than copying exactly - this shows creativity while leveraging viral momentum.",
    "Comment engagement loops: Ask questions that require detailed answers, create content that sparks debate (respectfully), or use controversial opinions to drive comments.",
    "Batch content creation: Film multiple videos in one session using different trending sounds to maximize your chances of hitting the algorithm.",
    "For You page optimization: Post when your audience is most active, use trending hashtags within 2-3 hours of them gaining momentum, and test different video lengths.",
    "Duet and stitch strategy: React to trending content in your niche to ride the wave of someone else's viral video while showcasing your expertise."
  ],
  facebook: [
    "Facebook Groups authority building: Become the go-to expert in 3-5 relevant groups by consistently providing valuable answers and sharing insights.",
    "Native video prioritization: Upload videos directly to Facebook rather than sharing YouTube links - the algorithm heavily favors native content.",
    "Engagement baiting (ethical): Use 'fill in the blank' posts, 'this or that' choices, and 'unpopular opinion' starters to drive meaningful discussions.",
    "Facebook Live strategy: Go live consistently at the same time weekly to build a recurring audience and take advantage of Facebook's live video promotion.",
    "Cross-promotion mastery: Share your content strategically across relevant Facebook Groups (following their rules) to expand reach beyond your page followers."
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
      <div className="space-y-3">
        {tips.map((tip, index) => (
          <TipBox key={index} tip={tip} />
        ))}
      </div>
    </section>
  );
};

export default CreatorTips;
