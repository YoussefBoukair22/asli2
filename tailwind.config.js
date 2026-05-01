/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        head: ['"Bebas Neue"', 'sans-serif'],
        body: ['"Outfit"', 'sans-serif'],
      },
      colors: {
        brand: {
          black: '#000000',
          white: '#FFFFFF',
          grey: '#888888',
          dark: '#111111',
          card: '#1a1a1a',
          border: '#222222',
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.7s cubic-bezier(0.4,0,0.2,1) forwards',
        'fade-in': 'fadeIn 0.5s ease forwards',
        'slide-in': 'slideIn 0.4s cubic-bezier(0.4,0,0.2,1) forwards',
        'shimmer': 'shimmer 1.5s infinite',
        'toast': 'slideToast 0.4s cubic-bezier(0.4,0,0.2,1)',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: 0, transform: 'translateY(30px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        slideIn: {
          from: { opacity: 0, transform: 'translateX(-20px)' },
          to: { opacity: 1, transform: 'translateX(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        slideToast: {
          from: { opacity: 0, transform: 'translateX(30px)' },
          to: { opacity: 1, transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}
