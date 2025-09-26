import React from 'react';
import { TrendingUp, Target, Brain, Clock, Users, Zap, BarChart3, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

const tips = [
  {
    icon: Brain,
    title: 'Algorithm Psychology',
    description: 'Understand that platforms reward engagement velocity. Get comments within the first 30 minutes by asking specific questions, using controversial (but respectful) takes, or creating content that demands responses.'
  },
  {
    icon: Target,
    title: 'Micro-Niche Domination',
    description: 'Instead of targeting broad topics, dominate ultra-specific niches first. Be the go-to creator for "productivity tips for remote developers" rather than just "productivity tips." Then expand.'
  },
  {
    icon: Clock,
    title: 'Platform-Specific Timing',
    description: 'YouTube: 2-4PM and 7-10PM EST. Instagram: 11AM-1PM and 7-9PM. TikTok: 6-10PM and 9AM-12PM. But test your audience\'s unique behavior using analytics.'
  },
  {
    icon: Users,
    title: 'Community-First Strategy',
    description: 'Build a community, not just followers. Create content series, respond to every comment in the first hour, collaborate with similar-sized creators, and cross-pollinate audiences.'
  },
  {
    icon: Zap,
    title: 'Hook Mastery Techniques',
    description: 'Pattern interrupt (start mid-conversation), curiosity gaps ("The mistake that cost me $10k..."), or controversy ("Everyone is wrong about..."). Test different hooks on the same content.'
  },
  {
    icon: BarChart3,
    title: 'Data-Driven Content',
    description: 'Track not just views but engagement rates, saves, shares, and comments-to-views ratio. Double down on formats that generate high engagement, even if views are lower initially.'
  },
  {
    icon: Globe,
    title: 'Cross-Platform Synergy',
    description: 'Create content ecosystems: teasers on TikTok/Instagram, full content on YouTube, behind-scenes on Stories, community discussions on Twitter. Each platform serves a different purpose.'
  },
  {
    icon: TrendingUp,
    title: 'Trend Surfing Strategy',
    description: 'Don\'t just follow trends—anticipate them. Monitor Google Trends, Reddit discussions, and emerging hashtags. Create content around trends before they peak for maximum exposure.'
  }
];

const CreatorGrowthTips = () => {
  return (
    <section id="growth-tips" className="py-12">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="text-center mb-12">
          <h2 className="h2 font-extrabold text-black">Advanced Growth Strategies</h2>
          <p className="text-lg text-brand-dark-grey mt-2">Proven techniques used by top creators to scale rapidly.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tips.map((tip, index) => (
            <motion.div
              key={index}
              className="bg-[var(--color-bg)] p-8 rounded-2xl shadow-lg border border-gray-200 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.03 }}
            >
              <div className="inline-block bg-brand-dark-blue/10 text-brand-dark-blue p-4 rounded-full mb-4">
                <tip.icon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-brand-dark-grey mb-2">{tip.title}</h3>
              <p className="text-brand-dark-grey">{tip.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CreatorGrowthTips;
