import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5000,
    strictPort: true,
    allowedHosts: true,
    hmr: {
      port: 5001,
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
    proxy: {
      '/api': {
        target: 'https://turbotags.app',
        changeOrigin: true,
        secure: true
      }
    }
  },
  preview: {
    host: '0.0.0.0',
    port: 5000,
    strictPort: true,
  },
  base: './',
  build: {
    // Optimize bundle size and splitting with improved chunking strategy
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Critical React chunks - keep minimal for initial load
          if (id.includes('react/jsx-runtime') || id.includes('react-dom/client')) {
            return 'react-critical';
          }
          if (id.includes('react-router-dom')) {
            return 'react-router';
          }
          
          // Heavy animation libraries - defer loading
          if (id.includes('framer-motion')) {
            return 'framer-motion';
          }
          
          // Icon libraries - large bundle, defer loading  
          if (id.includes('lucide-react')) {
            return 'lucide-icons';
          }
          
          // Analytics - non-critical
          if (id.includes('@vercel/analytics') || id.includes('firebase')) {
            return 'analytics';
          }
          
          // Utilities - small but separate
          if (id.includes('clsx') || id.includes('tailwind-merge')) {
            return 'ui-utils';
          }
          
          // Only group remaining small vendors together
          if (id.includes('node_modules') && 
              !id.includes('react') && 
              !id.includes('framer-motion') && 
              !id.includes('lucide-react') &&
              !id.includes('firebase') &&
              !id.includes('@vercel/analytics')) {
            return 'vendor';
          }
        },
        // Optimized file naming for better caching
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    // Reduce chunk size warnings threshold for mobile optimization
    chunkSizeWarningLimit: 300,
    // Disable source maps for production performance
    sourcemap: false,
    // Use esbuild for faster builds and smaller bundles
    minify: 'esbuild',
    // Target modern browsers for maximum optimization
    target: ['es2020', 'chrome80', 'firefox78', 'safari14', 'edge88'],
    // Enable aggressive tree shaking
    treeShake: true,
    // Additional optimizations for mobile
    cssCodeSplit: true,
    assetsInlineLimit: 2048, // Inline smaller assets to reduce requests
  },
  // Alias for shorter imports
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
      '@pages': '/src/pages',
      '@utils': '/src/utils',
      '@assets': '/src/assets'
    }
  },
  // Optimize deps for better startup performance
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'react-router-dom', 
      'react/jsx-runtime',
      'lucide-react', 
      'framer-motion', 
      'clsx',
      'tailwind-merge'
    ],
    exclude: ['@vercel/analytics'],
    // Force pre-bundling for better performance
    force: false,
    // Enable esbuild optimizations
    esbuildOptions: {
      target: 'es2020'
    }
  }
})
