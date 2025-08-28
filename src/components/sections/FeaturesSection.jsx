import React from 'react';
import { Bot, Globe, BarChart, Video, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const FeatureDetailCard = ({ icon: Icon, title, children }) => (
  <motion.div 
    className="bg-white p-8 rounded-xl shadow-lg border border-gray-200"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.5 }}
    transition={{ duration: 0.5 }}
  >
    <div className="flex items-center mb-4">
      <div className="flex-shrink-0 bg-tt-dark-violet text-white p-4 rounded-full mr-4">
        <Icon className="h-8 w-8" />
      </div>
      <h3 className="text-2xl font-bold text-tt-dark-violet">{title}</h3>
    </div>
    <div className="text-gray-700 leading-relaxed space-y-2">
      {children}
    </div>
  </motion.div>
);

const FeaturesSection = () => {
  return (
    <section id="features" className="bg-gray-50 py-12 px-4">
        <div className="text-center mb-12">
            <h2 className="text-5xl font-extrabold text-tt-dark-violet mb-4">Features Built for Growth</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Discover the tools that make TurboTags the ultimate asset for creators aiming for global success.
            </p>
        </div>

        <div className="container mx-auto max-w-5xl space-y-12">
            <FeatureDetailCard icon={Bot} title="Advanced AI Engine">
                <p>At the core of TurboTags is a sophisticated AI that thinks like a marketing strategist. We use a cascade of leading language models to analyze the nuances of your content topic.</p>
                <p>This means our AI doesn't just find keywords; it understands context, intent, and platform-specific language to generate tags and hashtags that truly resonate with your target audience and the algorithms.</p>
            </FeatureDetailCard>

            <FeatureDetailCard icon={Globe} title="Global Reach Toolkit">
                <p>Break geographical barriers and connect with audiences worldwide. Our generator is one of the few tools that offers hyper-specific targeting for both region and language.</p>
                <ul className="list-disc list-inside pl-4 space-y-1">
                    <li><strong>30+ Targetable Regions:</strong> From the USA and India to Japan and Brazil, target trends specific to each country.</li>
                    <li><strong>20+ Supported Languages:</strong> Generate content in native languages, including Hindi, Spanish, German, Tamil, and more.</li>
                </ul>
            </FeatureDetailCard>

            <FeatureDetailCard icon={BarChart} title="Trend-Aware Suggestions">
                <p>Don't just guess what's popular. Our AI is prompted to consider current trends, providing a "Trend Percentage" for every tag and hashtag.</p>
                <p>This data-driven insight allows you to prioritize keywords with the highest potential for engagement and virality, ensuring your content stays relevant and gets discovered.</p>
            </FeatureDetailCard>

            <FeatureDetailCard icon={Video} title="Content Format Optimization">
                <p>A YouTube Short needs a different strategy than a long-form video. An Instagram Reel is not the same as a Feed Post. TurboTags understands this.</p>
                <p>Select your exact content format—whether it's a Reel, Short, Story, or standard video—and our AI will tailor its suggestions to match the optimization strategies best suited for that format.</p>
            </FeatureDetailCard>

            <FeatureDetailCard icon={ShieldCheck} title="Privacy-First by Design">
                <p>Your creative strategy is your most valuable asset. We protect it by building privacy into the core of our service.</p>
                <ul className="list-disc list-inside pl-4 space-y-1">
                    <li><strong>No Sign-Up Required:</strong> Use the tool instantly without creating an account.</li>
                    <li><strong>No Prompts Stored:</strong> Your content ideas are sent to the AI for processing and are never logged or saved on our servers.</li>
                </ul>
            </FeatureDetailCard>

            <div className="text-center pt-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready to Elevate Your Content?</h2>
                <a href="#tag-generator" className="btn-primary text-lg">
                    Try the Generator for Free <Zap className="ml-2 h-5 w-5" />
                </a>
            </div>
        </div>
    </section>
  );
};

export default FeaturesSection;
