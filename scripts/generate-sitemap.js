import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { blogData } from '../src/data/blogData.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

const BASE_URL = 'https://turbotags.app';

const staticRoutes = [
  '/',
  '/about',
  '/blog',
  '/legal/cookies',
  '/legal/disclaimer',
  '/legal/privacy',
  '/legal/terms',
];

const generateSitemap = () => {
  const blogRoutes = blogData.map(post => `/blog/${post.slug}`);
  const allRoutes = [...staticRoutes, ...blogRoutes];

  const sitemapContent = `
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allRoutes.map(route => `
  <url>
    <loc>${BASE_URL}${route}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${route === '/' ? '1.0' : '0.8'}</priority>
  </url>
  `).join('')}
</urlset>
  `.trim();

  const sitemapPath = path.join(projectRoot, 'public', 'sitemap.xml');
  fs.writeFileSync(sitemapPath, sitemapContent);

  console.log(`✅ Sitemap generated successfully at ${sitemapPath}`);
};

generateSitemap();
