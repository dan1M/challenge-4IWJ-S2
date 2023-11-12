const animate = require('tailwindcss-animate');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './src/**/*.{ts,tsx,vue}',
    'node_modules/flowbite-vue/**/*.{js,jsx,ts,tsx}',
    'node_modules/flowbite/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        primary: {
          50: '#fdf2f7',
          100: '#fce7f1',
          200: '#fbcfe4',
          300: '#f8a9cd',
          400: '#f373aa',
          500: '#e93d82',
          600: '#d92967',
          700: '#bc1a4e',
          800: '#9c1841',
          900: '#821939',
          950: '#4f081d',
        },
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [animate, require('flowbite/plugin')],
};
