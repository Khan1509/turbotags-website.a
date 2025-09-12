import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { blogPostIndex } from '../data/blogPostIndex';
import usePageMeta from '../hooks/usePageMeta';
import { Calendar, Tag, ArrowRight } from 'lucide-react';
import OptimizedImage from '../components/ui/OptimizedImage';

const BlogIndexPage = () => {
  usePageMeta(
    'TurboTags Blog - Creator Tips, SEO, & Growth Strategies',
    'The official TurboTags blog. Get the latest tips on YouTube SEO, Instagram growth hacks, TikTok trends, and content creation strategies to boost your reach.'
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto max-w-5xl px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl font-extrabold text-tt-dark-violet mb-4">The TurboTags Blog</h1>
          <p className="text-xl text-gray-600">Creator tips, SEO insights, and growth strategies.</p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {blogPostIndex.map((post) => (
            <motion.div
              key={post.slug}
              variants={itemVariants}
              whileHover={{ y: -5, scale: 1.03, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col"
            >
              <Link to={`/blog/${post.slug}`} className="block">
                {/* PERFORMANCE: Use LazyImage component */}
                <OptimizedImage 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-48 object-cover"
                  width={400}
                  height={192}
                />
              </Link>
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center text-xs text-gray-500 mb-2">
                  <Tag className="h-4 w-4 mr-1" />
                  <span>{post.category}</span>
                  <span className="mx-2">|</span>
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{post.date}</span>
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-2 flex-grow">
                  <Link to={`/blog/${post.slug}`} className="hover:text-tt-dark-violet transition-colors">
                    {post.title}
                  </Link>
                </h2>
                <p className="text-sm text-gray-600 mb-4">{post.description}</p>
                <Link to={`/blog/${post.slug}`} className="mt-auto inline-flex items-center font-semibold text-tt-medium-violet hover:text-tt-dark-violet">
                  Read More <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default BlogIndexPage;
