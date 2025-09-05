import React from 'react';
import ToolPage from './ToolPage';

const pageConfig = {
  pageTitle: 'Free YouTube Hashtag Generator | AI-Powered Tags (2025)',
  pageDescription: 'Generate SEO-optimized YouTube tags and hashtags for free with the TurboTags AI generator. Get more views, increase watch time, and grow your channel faster.',
  heroTitle: 'Free YouTube Hashtag & Tag Generator',
  heroSubtitle: 'Instantly generate hundreds of relevant, high-traffic tags and hashtags to boost your video\'s discoverability and ranking on YouTube.',
  introContent: (
    <>
      <p>In the competitive world of YouTube, visibility is everything. The right combination of tags and hashtags can be the difference between a video that gets lost in the algorithm and one that trends. Our <strong>YouTube Hashtag Generator</strong> uses advanced AI to analyze your video topic and provide you with a strategic mix of broad, niche, and long-tail keywords. Stop guessing and start ranking with data-driven tags that get results.</p>
    </>
  ),
  tagGeneratorProps: {
    initialTab: 'youtube'
  },
  breadcrumbTrail: [
    { name: 'YouTube Hashtag Generator', path: '/youtube-hashtag-generator' }
  ]
};

const YouTubeHashtagGeneratorPage = () => <ToolPage pageConfig={pageConfig} />;

export default YouTubeHashtagGeneratorPage;
