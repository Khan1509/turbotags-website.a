import React from 'react';
import ToolPage from './ToolPage';

const pageConfig = {
  pageTitle: 'Free Hashtag Generator | Best AI Tool for All Social Media (2025)',
  pageDescription: 'The only free hashtag generator you need for 2025. Get AI-powered hashtag suggestions for Instagram, TikTok, YouTube, Facebook, and more in one place.',
  heroTitle: 'The Ultimate Free Hashtag Generator',
  heroSubtitle: 'Your all-in-one solution for social media growth. Generate hashtags for YouTube, Instagram, TikTok, and Facebook with a single click.',
  introContent: (
    <>
      <p>Why use multiple tools when one can do it all? Our <strong>Free Hashtag Generator</strong> is a comprehensive solution for all your social media needs. It leverages powerful AI to provide tailored hashtag recommendations for every major platform, ensuring your content is optimized for success no matter where you post. Streamline your workflow and supercharge your growth with the ultimate free tool for creators.</p>
    </>
  ),
  tagGeneratorProps: {},
  breadcrumbTrail: [
    { name: 'Home', path: '/' },
    { name: 'Free Hashtag Generator', path: '/free-hashtag-generator' }
  ]
};

const FreeHashtagGeneratorPage = () => <ToolPage pageConfig={pageConfig} />;

export default FreeHashtagGeneratorPage;
