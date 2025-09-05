import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Import the handler functions
import generateApiHandler from './api/generate.js';
import trendingApiHandler from './api/trending.js';

// API middleware plugin to emulate Vercel's serverless functions in development
function vercelApiDevPlugin() {
  return {
    name: 'vercel-api-dev-plugin',
    configureServer(server) {
      server.middlewares.use('/api', async (req, res, next) => {
        console.log(`[API DEV] ${req.method} ${req.url}`);

        // Add Express-like methods to response for convenience
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
          // Route to the correct handler based on URL and method
          if (req.url.startsWith('/generate') && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', async () => {
              try {
                req.body = body ? JSON.parse(body) : {};
                await generateApiHandler(req, res);
              } catch (e) {
                console.error('[API DEV] Body parsing error:', e);
                res.status(400).json({ error: 'Bad Request', message: 'Invalid JSON in request body' });
              }
            });
          } else if (req.url.startsWith('/trending') && req.method === 'GET') {
            req.body = {}; // Ensure req.body exists for handler compatibility
            await trendingApiHandler(req, res);
          } else {
            // If no route matches, return a 404
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
      chunkSizeWarningLimit: 500, // Lowered warning limit
      rollupOptions: {
        output: {
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
          manualChunks: (id) => {
            if (id.includes('node_modules')) {
              if (id.includes('react')) return 'vendor-react';
              if (id.includes('framer-motion')) return 'vendor-motion';
              if (id.includes('lucide-react')) return 'vendor-icons';
              return 'vendor-core';
            }
            if (id.includes('/src/pages/')) return 'pages';
            if (id.includes('/src/components/')) return 'components';
          }
        }
      },
      cssMinify: 'esbuild',
      reportCompressedSize: true,
      assetsInlineLimit: 4096
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
      cors: true
    },
    css: {
      devSourcemap: false
    }
  }
})
