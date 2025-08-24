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
      server.middlewares.use('/api/generate', (req, res) => {
        let body = '';
        req.on('data', chunk => {
          body += chunk.toString();
        });
        req.on('end', async () => {
          if (req.method === 'POST' && body) {
            try {
              req.body = JSON.parse(body);
            } catch (e) {
              req.body = {};
            }
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
          
          try {
            await apiHandler(req, res);
          } catch (error) {
            console.error('Error in API handler middleware:', error);
            res.status(500).json({ error: 'Internal Server Error' });
          }
        });
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
    chunkSizeWarningLimit: 1000, // Warn for chunks larger than 1MB
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
