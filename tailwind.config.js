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
        // Enhanced Futuristic Color Palette
        'brand': {
          'text': '#070304',       // Almost black for main text
          'background': '#e2e2f3', // Light lavender background  
          'primary': '#162059',    // Deep navy primary
          'secondary': '#192340',  // Dark navy secondary
          'accent': '#344973',     // Steel blue accent
        },
        
        // Futuristic palette integration
        'futuristic': {
          'primary': '#162059',    // Deep navy
          'secondary': '#192340',  // Dark navy
          'accent': '#344973',     // Steel blue
          'glow': '#4a90e2',       // Light blue glow
          'text-light': '#e5e7eb', // Light text
          'text-muted': '#cbd5e1', // Muted text
        },
        
        // Keep old names for backward compatibility (mapped to new colors)
        'brand-dark-blue': '#162059',  // Maps to new primary
        'brand-blue': '#192340',       // Maps to new secondary
        'brand-light-grey': '#e2e2f3', // Maps to background
        'brand-dark-grey': '#070304',  // Maps to text
        'brand-medium-grey': '#344973',// Maps to new accent
        
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
