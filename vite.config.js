import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv';

// Load .env file
dotenv.config();

// Import the handler function
import apiHandler from './api/generate.js';

// Simple and reliable API middleware plugin
function vercelApiDevPlugin() {
  return {
    name: 'vercel-api-dev-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        // Only handle /api/generate requests
        if (!req.url?.startsWith('/api/generate')) {
          return next();
        }

        console.log(`[API] ${req.method} ${req.url}`);

        // Handle only POST requests
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
            req.body = body ? JSON.parse(body) : {};

            // Add Express-like methods to response
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
            console.error('Request parsing error:', parseError);
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
              error: 'Bad Request',
              message: 'Invalid JSON in request body'
            }));
          }
        });

        req.on('error', (error) => {
          console.error('Request stream error:', error);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({
            error: 'Internal Server Error',
            message: 'Request processing failed'
          }));
        });
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), vercelApiDevPlugin()],
  build: {
    target: 'es2020',
    minify: 'esbuild',
    sourcemap: false,
    cssCodeSplit: true,
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        // REMOVED the manualChunks function.
        // Let Vite handle chunking automatically for optimal performance and to prevent build errors.
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
      },
      external: []
    },
    cssMinify: 'esbuild',
    reportCompressedSize: false
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      'lucide-react'
    ],
    exclude: ['firebase']
  },
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
  css: {
    devSourcemap: false,
    preprocessorOptions: {
      css: {
        charset: false
      }
    }
  }
})
