import React from 'react';
import ToolPage from './ToolPage';

const pageConfig = {
  pageTitle: 'TikTok Hashtag Generator | Find Viral & Trending Hashtags',
  pageDescription: 'Go viral on TikTok with our free AI hashtag generator. Discover the best trending hashtags for your videos to land on the For You Page and grow your followers.',
  heroTitle: 'Free TikTok Hashtag Generator',
  heroSubtitle: 'Unlock the For You Page. Our AI finds the most viral and relevant hashtags to make your TikTok videos trend.',
  introContent: (
    <>
      <p>The TikTok algorithm moves at lightning speed. To stay ahead, you need a hashtag strategy that's just as fast. The <strong>TikTok Hashtag Generator</strong> helps you identify the perfect blend of broad and niche hashtags that are currently trending. Give your content the best possible chance to go viral and reach millions of users on the For You Page.</p>
    </>
  ),
  tagGeneratorProps: {
    initialTab: 'tiktok'
  },
  breadcrumbTrail: [
    { name: 'TikTok Hashtag Generator', path: '/tiktok-hashtag-generator' }
  ]
};

const TikTokHashtagGeneratorPage = () => <ToolPage pageConfig={pageConfig} />;

export default TikTokHashtagGeneratorPage;
