import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { blogPostIndex } from '../data/blogPostIndex';
import usePageMeta from '../hooks/usePageMeta';
import { motion } from 'framer-motion';
import { Calendar, Tag, User, ArrowLeft, Loader2 } from 'lucide-react';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const ContentRenderer = ({ content }) => {
  return content.map((block, index) => {
    switch (block.type) {
      case 'p':
        return <p key={index}>{block.children}</p>;
      case 'h2':
        return <h2 key={index} className="text-4xl font-bold mt-10 mb-6">{block.children}</h2>;
      case 'h3':
        return <h3 key={index} className="text-3xl font-bold mt-8 mb-4">{block.children}</h3>;
      case 'ul':
        return (
          <ul key={index} className="list-disc list-inside space-y-2 pl-4">
            {block.items.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        );
      case 'image':
        return <img key={index} src={block.src} alt={block.alt || 'Blog post image'} className="w-full h-auto rounded-xl shadow-lg my-8" loading="lazy" decoding="async" />;
      case 'example':
        return <p key={index} className="p-4 bg-gray-100 rounded-lg text-sm font-mono my-4 break-words">{block.children}</p>;
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

  return (
    <motion.div 
      className="bg-white py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto max-w-3xl px-4">
        <Link to="/blog" className="inline-flex items-center text-tt-medium-violet hover:text-tt-dark-violet font-semibold mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Blog
        </Link>
        
        <article>
          <header className="mb-8">
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <Tag className="h-4 w-4 mr-1" />
              <span>{post.category}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-tt-dark-violet leading-tight mb-4">{post.title}</h1>
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

          <img 
            src={post.image} 
            alt={post.title} 
            className="w-full h-auto rounded-xl shadow-lg mb-8" 
            fetchpriority="high"
          />

          <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed space-y-6">
            {isLoading && <LoadingSpinner />}
            {error && <p className="text-red-500">{error}</p>}
            {content && <ContentRenderer content={content} />}
          </div>
        </article>
      </div>
    </motion.div>
  );
};

export default BlogPostPage;
