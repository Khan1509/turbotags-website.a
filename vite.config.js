import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// API middleware plugin to emulate Vercel's serverless functions IN DEVELOPMENT.
// This plugin intercepts requests to /api/* and forwards them to the corresponding
// function in the /api directory. It DOES NOT affect the production build on Vercel.
function vercelApiDevPlugin() {
  return {
    name: 'vercel-api-dev-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url.startsWith('/api/')) {
          return next();
        }
        
        // Add Express-like methods to response for convenience
        res.status = (code) => { res.statusCode = code; return res; };
        res.json = (data) => { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(data)); return res; };

        try {
          if (req.url.startsWith('/api/generate') && req.method === 'POST') {
            const { default: handler } = await import('./api/generate.js');
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', async () => {
              req.body = body ? JSON.parse(body) : {};
              await handler(req, res);
            });
          } else if (req.url.startsWith('/api/trending') && req.method === 'GET') {
            const { default: handler } = await import('./api/trending.js');
            req.body = {};
            await handler(req, res);
          } else {
            res.status(404).json({ error: 'Not Found', message: `Cannot ${req.method} ${req.url}` });
          }
        } catch (error) {
          console.error(`[API DEV] Error handling ${req.url}:`, error);
          res.status(500).json({ error: 'Internal Server Error', message: error.message });
        }
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  process.env = { ...process.env, ...env };

  return {
    plugins: [react(), vercelApiDevPlugin()],
    define: {
      global: 'globalThis',
    },
    build: {
      target: 'es2020',
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
          passes: 3,
          pure_funcs: ['console.log', 'console.warn'],
          unsafe_arrows: true,
          unsafe_methods: true,
          reduce_vars: true,
          reduce_funcs: true
        },
        mangle: {
          safari10: true,
          toplevel: true,
          properties: {
            regex: /^_/
          }
        },
        format: {
          comments: false
        }
      },
      sourcemap: false,
      cssCodeSplit: true,
      chunkSizeWarningLimit: 200,
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
              if (id.includes('@vercel/analytics')) return 'vendor-analytics';
              return 'vendor-core';
            }
            if (id.includes('/src/pages/tools/')) return 'tools-pages';
            if (id.includes('/src/pages/')) return 'pages';
            if (id.includes('/src/components/selectors/')) return 'selectors';
            if (id.includes('/src/components/TagGenerator')) return 'tag-generator';
            if (id.includes('/src/components/')) return 'components';
            if (id.includes('/src/services/')) return 'services';
          }
        }
      },
      cssMinify: 'esbuild',
      reportCompressedSize: true,
      assetsInlineLimit: 8192,
      modulePreload: {
        polyfill: false
      }
    },
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        'lucide-react'
      ],
      exclude: ['framer-motion'],
      esbuildOptions: {
        target: 'es2020',
        ignoreAnnotations: true
      }
    },
    server: {
      host: '0.0.0.0',
      port: 5000,
      cors: true,
      allowedHosts: true,
      hmr: false,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    },
    preview: {
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    },
    css: {
      devSourcemap: false
    }
  }
})
