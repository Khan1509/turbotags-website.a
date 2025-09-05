import React from 'react';
import ToolPage from './ToolPage';

const pageConfig = {
  pageTitle: 'Instagram Hashtag Generator | Free AI Tool for Reels & Posts',
  pageDescription: 'Find the best trending and niche hashtags for your Instagram posts and Reels. Our free AI hashtag generator helps you increase reach, engagement, and followers.',
  heroTitle: 'Free Instagram Hashtag Generator',
  heroSubtitle: 'Supercharge your Instagram growth. Generate the perfect mix of trending, niche, and community hashtags to get your content seen by the right audience.',
  introContent: (
    <>
      <p>Struggling to keep up with the ever-changing trends on Instagram? Our <strong>Instagram Hashtag Generator</strong> is designed to do the hard work for you. By simply describing your post or Reel, our AI generates a curated list of hashtags optimized for maximum reach and engagement. Whether you're a fashion influencer, a food blogger, or a small business, the right hashtags will connect you with a larger, more targeted audience.</p>
    </>
  ),
  tagGeneratorProps: {
    initialTab: 'instagram'
  },
  breadcrumbTrail: [
    { name: 'Instagram Hashtag Generator', path: '/instagram-hashtag-generator' }
  ]
};

const InstagramHashtagGeneratorPage = () => <ToolPage pageConfig={pageConfig} />;

export default InstagramHashtagGeneratorPage;
