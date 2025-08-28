import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { blogPosts } from '../data/blogPosts';
import usePageMeta from '../hooks/usePageMeta';
import { motion } from 'framer-motion';
import { Calendar, Tag, User, ArrowLeft } from 'lucide-react';

const BlogPostPage = () => {
  const { slug } = useParams();
  const post = blogPosts.find(p => p.slug === slug);

  usePageMeta(post?.title, post?.description, post?.image);

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

          <img src={post.image} alt={post.title} className="w-full h-auto rounded-xl shadow-lg mb-8" />

          <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed">
            {post.content}
          </div>
        </article>
      </div>
    </motion.div>
  );
};

export default BlogPostPage;
