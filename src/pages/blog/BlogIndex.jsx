import React from 'react';
import { Link } from 'react-router-dom';
import { blogData } from '../../data/blogData';
import usePageMeta from '../../hooks/usePageMeta';
import LazyImage from '../../components/ui/LazyImage';

const BlogCard = ({ post }) => (
  <article className="flex flex-col bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:-translate-y-1">
    <Link to={`/blog/${post.slug}`} className="block">
      <LazyImage src={post.imageSrc} alt={`${post.title} Guide`} className="w-full h-48 object-cover" />
    </Link>
    <div className="p-6 flex flex-col flex-grow">
      <h2 className={`text-xl font-semibold ${post.platformColor || 'text-black'} mb-2`}>
        <Link to={`/blog/${post.slug}`} className="hover:underline">{post.title}</Link>
      </h2>
      <p className="text-gray-600 mt-2 flex-grow">
        {post.description}
      </p>
    </div>
  </article>
);


const BlogIndex = () => {
  usePageMeta('TurboTags Creator Resources', 'Proven hashtag strategies, 2025 trends, and AI-powered insights for content creators on YouTube, TikTok, and Instagram.');

  return (
    <>
      <header className="text-center py-6 bg-gray-100">
        <h1 className="text-4xl font-bold text-tt-dark-violet">TurboTags Creator Resources</h1>
        <p className="text-gray-600">Proven Hashtag Strategies • 2025 Trends • AI-Powered Insights</p>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        <section className="mb-8 text-center">
          <p className="text-lg text-gray-700 mb-4">
            Welcome to TurboTags' creator hub! Each week, our AI analyzes <strong>10,000+ trending videos</strong> 
            to bring you actionable hashtag strategies for TikTok, Instagram Reels, and YouTube Shorts.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogData.map(post => <BlogCard key={post.slug} post={post} />)}
        </section>

        <section className="mt-12 bg-gray-50 p-6 rounded-lg text-center">
          <h3 className="text-xl font-semibold mb-4">Ready to Grow?</h3>
          <Link to="/#tag-generator" className="btn-primary">Try our Free AI Tag Generator</Link>
        </section>
      </main>
    </>
  );
};

export default BlogIndex;
