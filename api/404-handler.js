// Define all valid static routes
const VALID_STATIC_ROUTES = new Set([
  '/',
  '/about',
  '/features',
  '/faq',
  '/legal',
  '/legal/terms',
  '/legal/privacy',
  '/legal/disclaimer',
  '/legal/cookies',
  '/blog',
  '/youtube-hashtag-generator',
  '/instagram-hashtag-generator',
  '/tiktok-hashtag-generator',
  '/facebook-hashtag-generator',
  '/ai-title-generator',
  '/free-hashtag-generator',
  '/how-hashtags-work',
  '/instagram-reels-hashtags',
  '/tiktok-viral-hashtags'
]);

// Valid blog post slugs (dynamically generated routes)
const VALID_BLOG_SLUGS = new Set([
  'best-youtube-seo-and-title-hashtag-generator-2025',
  'best-youtube-tag-generator-2025',
  'instagram-trending-hashtag-generator-2025',
  'best-tiktok-hashtag-generator-2025',
  'best-facebook-hashtag-generator-2025',
  'how-to-get-1m-views-with-turbotags',
  'youtube-seo-for-indian-gamers-2025',
  'instagram-hashtag-strategy-for-fashion-brazil',
  'tiktok-seo-guide-2025',
  'turbotags-rapidtags-tubebuddy-tag-generator-2025',
  'facebook-for-creators-2025'
]);

// Special redirects
const REDIRECTS = {
  '/generator': '/'
};

export default async function handler(req) {
  const url = new URL(req.url);
  const pathname = url.pathname;

  // Handle redirects first
  if (REDIRECTS[pathname]) {
    return Response.redirect(new URL(REDIRECTS[pathname], req.url), 301);
  }

  // Check if it's a valid static route
  if (VALID_STATIC_ROUTES.has(pathname)) {
    return fetch(new URL('/index.html', req.url));
  }

  // Check if it's a valid blog post route
  const blogMatch = pathname.match(/^\/blog\/(.+)$/);
  if (blogMatch) {
    const slug = blogMatch[1];
    if (VALID_BLOG_SLUGS.has(slug)) {
      return fetch(new URL('/index.html', req.url));
    }
  }

  // If we get here, it's a 404 - return actual 404 status
  return new Response('Not Found', { 
    status: 404,
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    }
  });
}