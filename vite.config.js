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
      clientPort: 443,
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
    // Optimize bundle size and splitting
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks for better caching
          if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
            return 'react-vendor';
          }
          if (id.includes('framer-motion')) {
            return 'animation-vendor';
          }
          if (id.includes('lucide-react')) {
            return 'icons-vendor';
          }
          if (id.includes('firebase')) {
            return 'firebase-vendor';
          }
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
        // Better file naming for caching
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    // Reduce chunk size warnings threshold
    chunkSizeWarningLimit: 500,
    // Disable source maps for production performance
    sourcemap: false,
    // Use esbuild for faster builds and better tree shaking
    minify: 'esbuild',
    // Target modern browsers for smaller bundles
    target: ['es2020', 'chrome80', 'firefox78', 'safari14', 'edge88'],
    // Enable aggressive tree shaking
    treeShake: true
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
