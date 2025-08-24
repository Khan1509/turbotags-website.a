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
          res.setHeader = (key, value) => {
            res.setHeader(key, value);
            return res;
          };
          res.end = (data) => {
            res.end(data);
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
  plugins: [
    react({
      jsxRuntime: 'automatic',
      // Optimize React in production
      babel: {
        plugins: process.env.NODE_ENV === 'production' ? [
          ['@babel/plugin-transform-react-constant-elements'],
          ['@babel/plugin-transform-react-inline-elements']
        ] : []
      }
    }),
    vercelApiDevPlugin()
  ],
  build: {
    target: 'es2020', // Modern browsers for better performance
    minify: 'esbuild', // Fastest minification
    sourcemap: false, // Disable sourcemaps for production
    cssCodeSplit: true, // Split CSS by routes
    chunkSizeWarningLimit: 500, // Smaller chunk warning limit
    rollupOptions: {
      output: {
        // Optimize chunk splitting
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom'],
          'router-vendor': ['react-router-dom'],
          'animation-vendor': ['framer-motion'],
          'icons-vendor': ['lucide-react'],
          // Firebase in separate chunk if large
          'firebase-vendor': ['firebase/app', 'firebase/analytics']
        },
        // Optimize file naming
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const extType = info[info.length - 1];
          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name)) {
            return `assets/images/[name]-[hash].${extType}`;
          }
          if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name)) {
            return `assets/fonts/[name]-[hash].${extType}`;
          }
          return `assets/${extType}/[name]-[hash].${extType}`;
        }
      },
      // Remove unused dependencies
      external: [],
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false
      }
    },
    // Optimize CSS
    cssMinify: 'esbuild',
    cssTarget: 'es2020',
    // Performance optimizations
    reportCompressedSize: false, // Faster builds
    assetsInlineLimit: 4096, // Inline small assets
    emptyOutDir: true
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      'lucide-react'
    ],
    exclude: ['firebase'], // Let firebase be dynamically imported
    esbuildOptions: {
      target: 'es2020'
    }
  },
  // Performance optimizations for dev server
  server: {
    cors: true,
    preTransformRequests: false,
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
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block'
    }
  },
  // CSS optimization
  css: {
    devSourcemap: false,
    postcss: {
      plugins: []
    },
    preprocessorOptions: {
      css: {
        charset: false // Remove charset from CSS
      }
    }
  },
  // Define environment variables
  define: {
    __DEV__: process.env.NODE_ENV === 'development'
  },
  // Resolve optimizations
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})
