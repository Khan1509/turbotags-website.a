import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Import the handler functions
import generateApiHandler from './api/generate.js';
import trendingApiHandler from './api/trending.js';

console.log('[Vite Config] Loading API handlers...');
console.log('[Vite Config] Generate handler type:', typeof generateApiHandler);
console.log('[Vite Config] Trending handler type:', typeof trendingApiHandler);

// API middleware plugin to emulate Vercel's serverless functions in development
function vercelApiDevPlugin() {
  return {
    name: 'vercel-api-dev-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url.startsWith('/api/')) {
          return next();
        }
        
        console.log(`[API DEV] ${req.method} ${req.url}`);

        // Add Express-like methods to response for convenience
        if (!res.status) {
          res.status = (code) => {
            res.statusCode = code;
            return res;
          };
        }
        if (!res.json) {
          res.json = (data) => {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
            return res;
          };
        }

        try {
          // Route to the correct handler based on URL and method
          if (req.url.startsWith('/api/generate') && req.method === 'POST') {
            console.log('[API DEV] Routing to generate handler');
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', async () => {
              try {
                req.body = body ? JSON.parse(body) : {};
                console.log('[API DEV] Calling generateApiHandler with body:', req.body);
                await generateApiHandler(req, res);
              } catch (e) {
                console.error('[API DEV] Body parsing error:', e);
                res.status(400).json({ error: 'Bad Request', message: 'Invalid JSON in request body' });
              }
            });
          } else if (req.url.startsWith('/api/trending') && req.method === 'GET') {
            console.log('[API DEV] Routing to trending handler');
            req.body = {}; // Ensure req.body exists for handler compatibility
            await trendingApiHandler(req, res);
          } else {
            // If no route matches, return a 404
            console.log(`[API DEV] No route found for ${req.method} ${req.url}`);
            res.status(404).json({ error: 'Not Found', message: `Cannot ${req.method} ${req.url}` });
          }
        } catch (error) {
          console.error('[API DEV] Middleware error:', error);
          res.status(500).json({ error: 'Internal Server Error', message: error.message });
        }
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables for the current mode and make them available to process.env
  const env = loadEnv(mode, process.cwd(), '');
  process.env = { ...process.env, ...env };

  return {
    plugins: [react(), vercelApiDevPlugin()],
    build: {
      target: 'es2020',
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
          passes: 2
        },
        mangle: {
          safari10: true
        },
        format: {
          comments: false
        }
      },
      sourcemap: false,
      cssCodeSplit: true,
      chunkSizeWarningLimit: 300, // Further reduced for better performance
      rollupOptions: {
        output: {
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
          manualChunks: (id) => {
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) return 'vendor-react';
              if (id.includes('framer-motion')) return 'vendor-motion';
              if (id.includes('lucide-react')) return 'vendor-icons';
              if (id.includes('firebase')) return 'vendor-firebase';
              return 'vendor-core';
            }
            if (id.includes('/src/pages/tools/')) return 'tools-pages';
            if (id.includes('/src/pages/')) return 'pages';
            if (id.includes('/src/components/TagGenerator')) return 'tag-generator';
            if (id.includes('/src/components/')) return 'components';
            if (id.includes('/src/services/')) return 'services';
          }
        }
      },
      cssMinify: 'esbuild',
      reportCompressedSize: true,
      assetsInlineLimit: 2048
    },
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        'framer-motion',
        'lucide-react'
      ],
      esbuildOptions: {
        target: 'es2020'
      }
    },
    server: {
      host: '0.0.0.0',
      port: 5000,
      cors: true,
      allowedHosts: 'all',
      headers: {
        'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.google.com https://*.googleapis.com https://*.gstatic.com https://www.googletagmanager.com https://www.google-analytics.com https://pagead2.googlesyndication.com https://*.doubleclick.net https://ep1.adtrafficquality.google https://ep2.adtrafficquality.google; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://*.googleapis.com https://img-wrapper.vercel.app https://placehold.co https://pagead2.googlesyndication.com https://*.doubleclick.net; font-src 'self'; connect-src 'self' https://openrouter.ai https://*.google.com https://*.googleapis.com https://firebase.googleapis.com https://*.firebaseio.com https://*.doubleclick.net https://ep1.adtrafficquality.google https://ep2.adtrafficquality.google https://www.google-analytics.com https://pagead2.googlesyndication.com; frame-src 'self' https://*.google.com https://*.googleapis.com https://*.doubleclick.net https://googleads.g.doubleclick.net; object-src 'none'; base-uri 'self';",
        'X-Frame-Options': 'SAMEORIGIN',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
      }
    },
    css: {
      devSourcemap: false
    }
  }
})
