import React from 'react';
import ToolPage from './ToolPage';

const pageConfig = {
  pageTitle: 'Facebook Hashtag Generator | AI Tool for Posts & Reels',
  pageDescription: 'Increase the organic reach of your Facebook posts and Reels with our free AI hashtag generator. Find relevant hashtags to connect with a wider audience.',
  heroTitle: 'Free Facebook Hashtag Generator',
  heroSubtitle: 'Boost your organic reach on the world\'s largest social network. Generate targeted hashtags for your Facebook posts, Reels, and videos.',
  introContent: (
    <>
      <p>Don't underestimate the power of hashtags on Facebook. They are a key tool for categorizing your content and making it discoverable to new audiences. The <strong>Facebook Hashtag Generator</strong> provides you with a concise, effective list of hashtags tailored to your content, helping you increase engagement and visibility in a crowded feed.</p>
    </>
  ),
  tagGeneratorProps: {
    initialTab: 'facebook'
  },
  breadcrumbTrail: [
    { name: 'Facebook Hashtag Generator', path: '/facebook-hashtag-generator' }
  ]
};

const FacebookHashtagGeneratorPage = () => <ToolPage pageConfig={pageConfig} />;

export default FacebookHashtagGeneratorPage;
