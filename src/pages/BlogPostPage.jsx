import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { blogPostIndex } from '../data/blogPostIndex';
import usePageMeta from '../hooks/usePageMeta';
import { motion } from 'framer-motion';
import { Calendar, Tag, User, ArrowLeft } from 'lucide-react';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import LazyImage from '../components/ui/LazyImage';
import InternalLinkSuggestions from '../components/ui/InternalLinkSuggestions';

const ContentRenderer = ({ content }) => {
  return content.map((block, index) => {
    switch (block.type) {
      case 'p':
        return <p key={index} dangerouslySetInnerHTML={{ __html: block.children }}></p>;
      case 'h2':
        return <h2 key={index} className="h2 font-bold mt-10 mb-6">{block.children}</h2>;
      case 'h3':
        return <h3 key={index} className="h3 font-bold mt-8 mb-4">{block.children}</h3>;
      case 'ul':
        return (
          <ul key={index} className="list-disc list-inside space-y-2 pl-4">
            {block.items.map((item, i) => <li key={i} dangerouslySetInnerHTML={{ __html: item }}></li>)}
          </ul>
        );
      case 'image':
        return <LazyImage key={index} src={block.src} alt={block.alt || 'Blog post image'} className="w-full h-auto rounded-xl shadow-lg my-8" />;
      case 'example':
        return <p key={index} className="p-4 bg-gray-100 rounded-lg text-sm font-mono my-4 break-words">{block.children}</p>;
      case 'table':
        return (
          <div key={index} className="overflow-x-auto my-8">
            <table className="min-w-full border border-gray-300 divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  {block.headers.map((header, hIndex) => (
                    <th key={hIndex} scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {block.rows.map((row, rIndex) => (
                  <tr key={rIndex} className="hover:bg-gray-50">
                    {row.map((cell, cIndex) => (
                      <td key={cIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      default:
        return null;
    }
  });
};

const BlogPostPage = () => {
  const { slug } = useParams();
  const post = blogPostIndex.find(p => p.slug === slug);
  
  const [content, setContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  usePageMeta(post?.title, post?.description, post?.image);

  useEffect(() => {
    if (post) {
      setIsLoading(true);
      fetch(`/data/blog/${slug}.json`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch blog content');
          }
          return response.json();
        })
        .then(data => {
          setContent(data);
          setError(null);
        })
        .catch(err => {
          console.error(err);
          setError('Could not load the article content.');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [slug, post]);

  if (!post) {
    return <Navigate to="/404" replace />;
  }

  const breadcrumbTrail = [
    { name: 'Blog', path: '/blog' },
    { name: post.title, path: `/blog/${post.slug}` }
  ];

  return (
    <motion.div 
      className="bg-white py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto max-w-3xl px-4">
        <div className="mb-8">
          <Breadcrumbs trail={breadcrumbTrail} />
        </div>
        
        <article>
          <header className="mb-8">
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <Tag className="h-4 w-4 mr-1" />
              <span>{post.category}</span>
            </div>
            <h1 className="h1 font-extrabold text-tt-dark-violet leading-tight mb-4">{post.title}</h1>
            <div className="flex items-center text-sm text-gray-500">
              <div className="flex items-center mr-4">
                <User className="h-4 w-4 mr-1" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{post.date}</span>
              </div>
            </div>
          </header>

          <LazyImage 
            src={post.image} 
            alt={post.title} 
            className="w-full h-auto rounded-xl shadow-lg mb-8" 
            fetchpriority="high"
          />
          
          <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed space-y-6 break-words">
            {isLoading && <LoadingSpinner />}
            {error && <p className="text-red-500">{error}</p>}
            {content && <ContentRenderer content={content} />}
          </div>
        </article>

        <InternalLinkSuggestions />
      </div>
    </motion.div>
  );
};

export default BlogPostPage;
