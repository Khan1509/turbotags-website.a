import React from 'react';
import ToolPage from './ToolPage';

const pageConfig = {
  pageTitle: 'AI Title Generator | Best Free SEO & Click-Worthy Titles (2025)',
  pageDescription: 'Generate 5 catchy, SEO-optimized, and click-worthy titles for your YouTube videos, blog posts, or social media content with our free AI title generator for 2025.',
  heroTitle: 'Free AI Title Generator',
  heroSubtitle: 'Never struggle with a boring title again. Our AI generates 5 compelling, SEO-friendly titles to grab attention and boost your click-through rate.',
  introContent: (
    <>
      <p>A great piece of content can fail with a weak title. Our <strong>AI Title Generator</strong> is your secret weapon for crafting headlines that demand to be clicked. Whether for a YouTube video, a blog post, or a social media update, our tool provides five distinct, creative, and SEO-optimized options to ensure your content gets the attention it deserves.</p>
    </>
  ),
  tagGeneratorProps: {
    initialTask: 'titles'
  },
  breadcrumbTrail: [
    { name: 'AI Title Generator', path: '/ai-title-generator' }
  ]
};

const AITitleGeneratorPage = () => <ToolPage pageConfig={pageConfig} />;

export default AITitleGeneratorPage;
