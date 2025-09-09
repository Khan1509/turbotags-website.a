/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./public/**/*.html",
  ],
  theme: {
    extend: {
      colors: {
        // New simplified and professional color palette
        'brand-dark-blue': '#1e3a8a', // A professional, dark blue inspired by logos
        'brand-blue': '#2563eb',       // A vibrant, accessible blue for primary actions
        'brand-light-grey': '#f1f5f9', // A clean, light grey for backgrounds (slate-100)
        'brand-dark-grey': '#1f2937',  // A strong, dark grey for primary text (gray-800)
        'brand-medium-grey': '#6b7280',// A softer grey for secondary text (gray-500)
        
        // Functional colors
        'tt-success': '#10b981',
        'tt-warning': '#f59e0b',
        'tt-error': '#ef4444',
        'tt-info': '#06b6d4',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'rocket-float': 'rocket-float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
        'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
      },
      keyframes: {
        'rocket-float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'shimmer': {
          '100%': { transform: 'translateX(100%)' },
        },
        'fade-in-up': {
          '0%': {
            opacity: '0',
            transform: 'translate3d(0, 20px, 0)'
          },
          '100%': {
            opacity: '1',
            transform: 'translate3d(0, 0, 0)'
          },
        },
      }
    },
  },
  plugins: [],
}
