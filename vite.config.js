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
      server.middlewares.use(async (req, res, next) => {
        // Only handle requests to /api/*
        if (!req.url?.startsWith('/api/')) {
          return next();
        }

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

        // Route to the correct handler based on URL and method
        if (req.url.startsWith('/api/generate') && req.method === 'POST') {
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
        } else if (req.url.startsWith('/api/trending') && req.method === 'GET') {
          try {
            req.body = {}; // Ensure req.body exists for handler compatibility
            await trendingApiHandler(req, res);
          } catch (e) {
            console.error('[API DEV] Trending handler error:', e);
            res.status(500).json({ error: 'Internal Server Error' });
          }
        } else {
          // If no route matches, return a 404
          res.status(404).json({ error: 'Not Found', message: `Cannot ${req.method} ${req.url}` });
        }
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables for the current mode and make them available to process.env
  // This ensures that server-side code (like our API handlers) can access them.
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
          pure_funcs: ['console.log', 'console.info'],
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
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          chunkFileNames: (chunkInfo) => {
            const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/').pop().replace('.jsx', '').replace('.js', '') : 'chunk';
            return `assets/js/${facadeModuleId}-[hash].js`;
          },
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
          manualChunks: {
            // Core React libraries
            'react-vendor': ['react', 'react-dom'],
            'router': ['react-router-dom'],
            // Animation library
            'animations': ['framer-motion'],
            // Icons library
            'icons': ['lucide-react'],
            // Utilities and API
            'utils': ['src/services/apiService.js', 'src/data/blogPosts.js', 'src/data/shareServices.js', 'src/data/trendingTopicsData.js']
          }
        },
        external: []
      },
      cssMinify: 'esbuild',
      reportCompressedSize: false,
      assetsInlineLimit: 2048 // Inline small assets
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
  }
})
