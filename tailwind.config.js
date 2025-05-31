
// tailwind.config.js
export default {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html',
  ],
  theme: {
    extend: {
      colors: {
        'cafe-brown': '#4A3C31',
        'cafe-beige': '#FAF5F0',
        'cafe-cream': '#E6D5C3',
        'cafe-dark': '#3A2C21',
      },
      animation: {
        'fade-in-out': 'fadeInOut 3s ease-in-out',
      },
      keyframes: {
        fadeInOut: {
          '0%, 100%': { opacity: 0 },
          '10%, 90%': { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};
