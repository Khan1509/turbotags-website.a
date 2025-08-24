import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { blogData } from '../src/data/blogData.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

const BASE_URL = 'https://turbotags.app';

const staticRoutes = [
  { url: '/', priority: '1.0', changefreq: 'daily' },
  { url: '/generator', priority: '0.9', changefreq: 'weekly' },
  { url: '/about', priority: '0.7', changefreq: 'monthly' },
  { url: '/blog', priority: '0.8', changefreq: 'weekly' },
  { url: '/features', priority: '0.8', changefreq: 'weekly' },
  { url: '/legal/cookies', priority: '0.3', changefreq: 'yearly' },
  { url: '/legal/disclaimer', priority: '0.3', changefreq: 'yearly' },
  { url: '/legal/privacy', priority: '0.3', changefreq: 'yearly' },
  { url: '/legal/terms', priority: '0.3', changefreq: 'yearly' },
];

const generateSitemap = () => {
  const blogRoutes = blogData.map(post => ({
    url: `/blog/${post.slug}`,
    priority: '0.8',
    changefreq: 'monthly',
    lastmod: post.lastModified || new Date().toISOString().split('T')[0]
  }));

  const allRoutes = [...staticRoutes, ...blogRoutes];

  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
  ${allRoutes.map(route => `
  <url>
    <loc>${BASE_URL}${route.url}</loc>
    <lastmod>${route.lastmod || new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>
  `).join('')}
</urlset>`.trim();

  const sitemapPath = path.join(projectRoot, 'public', 'sitemap.xml');
  fs.writeFileSync(sitemapPath, sitemapContent);

  console.log(`✅ Sitemap generated successfully at ${sitemapPath}`);
};

generateSitemap();
