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
        // Updated color palette based on Realtime Colors reference
        'brand': {
          'text': '#070304',       // Almost black for main text
          'background': '#e2e2f3', // Light lavender background  
          'primary': '#15143e',    // Dark navy for primary elements
          'secondary': '#5c6284',  // Medium blue-gray for secondary elements
          'accent': '#282e43',     // Dark blue-gray for accents
        },
        
        // Keep old names for backward compatibility (mapped to new colors)
        'brand-dark-blue': '#15143e',  // Maps to primary
        'brand-blue': '#5c6284',       // Maps to secondary
        'brand-light-grey': '#e2e2f3', // Maps to background
        'brand-dark-grey': '#070304',  // Maps to text
        'brand-medium-grey': '#5c6284',// Maps to secondary
        
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
