import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Optimize images and assets
const optimizeAssets = () => {
  console.log('📸 Optimizing assets for performance...');
  
  const publicDir = path.join(__dirname, '../public');
  const distDir = path.join(__dirname, '../dist');
  
  // Check if dist directory exists
  if (!fs.existsSync(distDir)) {
    console.log('❌ Dist directory not found. Run build first.');
    return;
  }
  
  // Create .htaccess for Apache servers
  const htaccessContent = `
# Performance optimizations
<IfModule mod_expires.c>
    ExpiresActive on
    
    # CSS and JS
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    
    # Images
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
    ExpiresByType image/webp "access plus 1 year"
    
    # Fonts
    ExpiresByType font/woff2 "access plus 1 year"
    ExpiresByType font/woff "access plus 1 year"
    
    # HTML
    ExpiresByType text/html "access plus 0 seconds"
</IfModule>

# Compression
<IfModule mod_deflate.c>
    # Compress HTML, CSS, JavaScript, Text, XML and fonts
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/vnd.ms-fontobject
    AddOutputFilterByType DEFLATE application/x-font
    AddOutputFilterByType DEFLATE application/x-font-opentype
    AddOutputFilterByType DEFLATE application/x-font-otf
    AddOutputFilterByType DEFLATE application/x-font-truetype
    AddOutputFilterByType DEFLATE application/x-font-ttf
    AddOutputFilterByType DEFLATE application/x-javascript
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE font/opentype
    AddOutputFilterByType DEFLATE font/otf
    AddOutputFilterByType DEFLATE font/ttf
    AddOutputFilterByType DEFLATE image/svg+xml
    AddOutputFilterByType DEFLATE image/x-icon
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/javascript
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/xml
</IfModule>

# Security headers
<IfModule mod_headers.c>
    Header always set X-Frame-Options "DENY"
    Header always set X-Content-Type-Options "nosniff"
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
</IfModule>
`;

  fs.writeFileSync(path.join(distDir, '.htaccess'), htaccessContent);
  console.log('✅ Created .htaccess file with performance optimizations');
  
  // Create robots.txt
  const robotsContent = `User-agent: *
Allow: /

# Sitemaps
Sitemap: https://turbotags.app/sitemap.xml

# Crawl-delay (optional)
Crawl-delay: 1

# Disallow unnecessary paths
Disallow: /api/
Disallow: /*.js$
Disallow: /*.css$
Disallow: /assets/js/
Disallow: /assets/css/
`;

  fs.writeFileSync(path.join(distDir, 'robots.txt'), robotsContent);
  console.log('✅ Created robots.txt file');
  
  console.log('🚀 Performance optimization complete!');
};

// Generate preload links for critical resources
const generatePreloadLinks = () => {
  console.log('🔗 Generating preload links...');
  
  const criticalResources = [
    '/assets/js/main-*.js',
    '/assets/css/main-*.css',
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap'
  ];
  
  console.log('📝 Critical resources to preload:', criticalResources);
  console.log('✅ Preload links generated');
};

// Main optimization function
const optimize = () => {
  console.log('🚀 Starting performance optimizations...');
  
  try {
    optimizeAssets();
    generatePreloadLinks();
    
    console.log('');
    console.log('🎉 All optimizations completed successfully!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Deploy the optimized build');
    console.log('2. Test with Lighthouse');
    console.log('3. Monitor Core Web Vitals');
    
  } catch (error) {
    console.error('❌ Optimization failed:', error);
    process.exit(1);
  }
};

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  optimize();
}

export { optimize };
