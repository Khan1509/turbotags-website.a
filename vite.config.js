import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv';

// Load .env file
dotenv.config();

// Import the handler function
import apiHandler from './api/generate.js';

// Custom Vite plugin to emulate Vercel's serverless functions in development
function vercelApiDevPlugin() {
  return {
    name: 'vercel-api-dev-plugin',
    configureServer(server) {
      server.middlewares.use('/api/generate', async (req, res, next) => {
        try {
          // Ensure we're only handling POST requests
          if (req.method !== 'POST') {
            res.statusCode = 405;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
              error: 'Method Not Allowed',
              message: 'Only POST requests are supported'
            }));
            return;
          }

          // Parse request body
          let body = '';
          req.setEncoding('utf8');

          req.on('data', chunk => {
            body += chunk;
          });

          req.on('end', async () => {
            try {
              // Parse JSON body
              if (body) {
                req.body = JSON.parse(body);
              } else {
                req.body = {};
              }

              // Shim Express-like res methods onto Node's native res object
              res.status = (code) => {
                res.statusCode = code;
                return res;
              };

              res.json = (data) => {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(data));
                return res;
              };

              // Call the API handler
              await apiHandler(req, res);

            } catch (parseError) {
              console.error('Error parsing request body:', parseError);
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                error: 'Bad Request',
                message: 'Invalid JSON in request body'
              }));
            }
          });

          req.on('error', (error) => {
            console.error('Request error:', error);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
              error: 'Internal Server Error',
              message: 'Request processing failed'
            }));
          });

        } catch (error) {
          console.error('Error in API handler middleware:', error);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({
            error: 'Internal Server Error',
            message: 'Middleware error'
          }));
        }
      });
    },
  };
}


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), vercelApiDevPlugin()],
  build: {
    target: 'es2015', // Better compatibility while still modern
    minify: 'esbuild', // Faster build times
    sourcemap: false,
    cssCodeSplit: true,
    chunkSizeWarningLimit: 500, // Warn for chunks larger than 500KB
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Core React chunks
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            if (id.includes('react-router-dom')) {
              return 'router';
            }
            if (id.includes('framer-motion')) {
              return 'animations';
            }
            if (id.includes('lucide-react')) {
              return 'icons';
            }
            if (id.includes('firebase')) {
              return 'firebase';
            }
            // Group all other vendor dependencies
            return 'vendor';
          }
          // Split pages into separate chunks
          if (id.includes('/pages/')) {
            return 'pages';
          }
          if (id.includes('/components/')) {
            return 'components';
          }
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
      },
      external: [] // Keep all dependencies bundled for better caching
    },
    // Optimize CSS
    cssMinify: true,
    // Better tree shaking
    reportCompressedSize: false // Faster builds
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      'lucide-react'
    ],
    exclude: ['firebase'] // Let firebase be dynamically imported
  },
  // Performance optimizations
  server: {
    cors: true,
    headers: {
      'Cache-Control': 'max-age=31536000',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block'
    }
  },
  preview: {
    headers: {
      'Cache-Control': 'max-age=31536000, immutable',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY'
    }
  },
  // CSS optimization
  css: {
    devSourcemap: false,
    preprocessorOptions: {
      css: {
        charset: false // Remove charset from CSS
      }
    }
  }
})
