import React, { Suspense } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { blogData } from '../../data/blogData';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import usePageMeta from '../../hooks/usePageMeta';

const BlogPostPage = () => {
  const { slug } = useParams();
  const post = blogData.find(p => p.slug === slug);

  if (!post) {
    // If post is not found, redirect to the main blog page
    return <Navigate to="/blog" replace />;
  }

  // Set the meta tags for this specific blog post for SEO and social sharing
  usePageMeta(post.title, post.description, post.imageSrc);

  const PostComponent = post.component;

  return (
    <Suspense fallback={<div className="w-full h-screen flex items-center justify-center"><LoadingSpinner /></div>}>
      <PostComponent />
    </Suspense>
  );
};

export default BlogPostPage;
