import { useEffect } from 'react';

/**
 * A custom hook to dynamically update page meta tags for SEO.
 * @param {string} title - The new page title.
 * @param {string} description - The new meta description.
 * @param {string} [imageUrl] - The new Open Graph and Twitter image URL.
 */
const usePageMeta = (title, description, imageUrl) => {
  useEffect(() => {
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

    // Update image
    if (imageUrl) {
        document.querySelector('meta[property="og:image"]')?.setAttribute('content', imageUrl);
        document.querySelector('meta[name="twitter:image"]')?.setAttribute('content', imageUrl);
    }

  }, [title, description, imageUrl]);
};

export default usePageMeta;
