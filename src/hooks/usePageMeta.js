import { useEffect } from 'react';

/**
 * A custom hook to dynamically update page meta tags for SEO.
 * @param {string} title - The new page title.
 * @param {string} description - The new meta description.
 * @param {string} [imageUrl] - The new Open Graph and Twitter image URL.
 */
const usePageMeta = (title, description, imageUrl) => {
  useEffect(() => {
    // Get current URL for canonical and OG URL
    const currentUrl = window.location.href;
    
    // Update title
    if (title) {
      document.title = title;
      document.querySelector('meta[property="og:title"]')?.setAttribute('content', title);
      document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', title);
    }

    // Update description
    if (description) {
      document.querySelector('meta[name="description"]')?.setAttribute('content', description);
      document.querySelector('meta[property="og:description"]')?.setAttribute('content', description);
      document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', description);
    }

    // Update canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = currentUrl;

    // Update OG URL
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) {
      ogUrl.setAttribute('content', currentUrl);
    } else {
      const newOgUrl = document.createElement('meta');
      newOgUrl.setAttribute('property', 'og:url');
      newOgUrl.setAttribute('content', currentUrl);
      document.head.appendChild(newOgUrl);
    }

    // Update image
    if (imageUrl) {
        document.querySelector('meta[property="og:image"]')?.setAttribute('content', imageUrl);
        document.querySelector('meta[name="twitter:image"]')?.setAttribute('content', imageUrl);
    } else {
        // SEO: Set a default image if none is provided for a page
        const defaultImageUrl = 'https://turbotags.app/turbotags_header_logo_1000x320_thick.svg';
        document.querySelector('meta[property="og:image"]')?.setAttribute('content', defaultImageUrl);
        document.querySelector('meta[name="twitter:image"]')?.setAttribute('content', defaultImageUrl);
    }

  }, [title, description, imageUrl]);
};

export default usePageMeta;
