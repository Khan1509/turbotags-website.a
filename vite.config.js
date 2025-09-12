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
        manualChunks: {
          // Vendor chunks for better caching
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['lucide-react', 'framer-motion'],
          'utils-vendor': ['clsx', 'tailwind-merge'],
        }
      }
    },
    // Reduce chunk size warnings threshold
    chunkSizeWarningLimit: 1000,
    // Enable source maps for better debugging
    sourcemap: false,
    // Minify for production
    minify: 'terser',
    // Target modern browsers for smaller bundles
    target: 'es2020'
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
  // Optimize deps
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'lucide-react', 'framer-motion'],
    exclude: ['@vercel/analytics']
  }
})
