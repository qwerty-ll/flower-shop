/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // основной цвет сайта тёмная зелень
        brand: {
          50: '#F1F6F3',
          100: '#DDEBE3',
          200: '#BBD6C7',
          300: '#8FBBA3',
          400: '#5F9A7C',
          500: '#3F7D5F',
          600: '#2F6A4F',
          700: '#265641',
          800: '#1F4535',
          900: '#18372B',
        },
        // акцент для плашек и сердечек
        blush: {
          50: '#FBF1EE',
          100: '#F6E0D9',
          400: '#E29C86',
          500: '#D98B73',
          600: '#C4735A',
        },
        cream: '#FAF7F2',
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
      },
      keyframes: {
        'sheet-up': { from: { transform: 'translateY(100%)' } },
        'slide-in': { from: { transform: 'translateX(-100%)' } },
        'fade-in': { from: { opacity: '0' } },
      },
      animation: {
        'sheet-up': 'sheet-up 0.25s ease-out',
        'slide-in': 'slide-in 0.25s ease-out',
        'fade-in': 'fade-in 0.2s ease-out',
      },
    },
  },
  plugins: [],
};
