import { lazy } from 'react';

// Lazy load components for code splitting. This is where you import your blog post content.
const FacebookStrategy = lazy(() => import('../pages/blog/FacebookStrategy'));
const InstagramGrowth = lazy(() => import('../pages/blog/InstagramGrowth'));
const TiktokHashtags = lazy(() => import('../pages/blog/TiktokHashtags'));
const YoutubeShortsStrategy = lazy(() => import('../pages/blog/YoutubeShortsStrategy'));

/**
 * To add a new blog post:
 * 1. Create your blog post component in `src/pages/blog/`.
 * 2. Import it here using `lazy()`.
 * 3. Add a new object to the `blogData` array below.
 *    - `slug`: The URL for your post (e.g., 'my-new-post').
 *    - `title`: The title of your post.
 *    - `description`: A short summary for SEO and previews.
 *    - `imageSrc`: The URL for the post's header image.
 *    - `component`: The component you imported in step 2.
 *    - `platformColor`: Tailwind CSS color class for the title on the blog index.
 * 4. Run `yarn sitemap` in the terminal to update the sitemap for search engines.
 */
export const blogData = [
  {
    slug: 'tiktok-hashtags-2025',
    title: 'Top TikTok Hashtags to Go Viral in 2025',
    description: 'Discover the most effective TikTok hashtags this month, with real examples showing 37% average view increases.',
    imageSrc: 'https://img-wrapper.vercel.app/image?url=https://images.unsplash.com/photo-1611605698335-8b1569810432?w=600&h=400&fit=crop',
    component: TiktokHashtags,
    platformColor: 'text-black',
  },
  {
    slug: 'instagram-growth-guide',
    title: 'Instagram Reels Hashtag Growth Guide',
    description: 'Our case study reveals how creators gained 500-2,000 followers weekly using strategic hashtag clusters.',
    imageSrc: 'https://img-wrapper.vercel.app/image?url=https://images.unsplash.com/photo-1611262588024-d12430b98920?w=600&h=400&fit=crop',
    component: InstagramGrowth,
    platformColor: 'text-pink-600',
  },
  {
    slug: 'youtube-shorts-strategy',
    title: 'YouTube Shorts Hashtag Strategy',
    description: 'Verified method: Channels using these Shorts tags saw 3-5x more browse features.',
    imageSrc: 'https://img-wrapper.vercel.app/image?url=https://images.unsplash.com/photo-1598550463415-d397fdddc3e0?w=600&h=400&fit=crop',
    component: YoutubeShortsStrategy,
    platformColor: 'text-red-600',
  },
  {
    slug: 'facebook-strategy-2025',
    title: 'Facebook Hashtag Strategy for 2025',
    description: 'Learn how to leverage hashtags on Facebook to increase post reach and engagement in the latest algorithm.',
    imageSrc: 'https://img-wrapper.vercel.app/image?url=https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=600&h=400&fit=crop',
    component: FacebookStrategy,
    platformColor: 'text-blue-600',
  },
];
