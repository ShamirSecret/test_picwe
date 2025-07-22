/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      spacing: {
        4.5: '1.125rem', // 18
        5.5: '1.375rem', // 22
        6.5: '1.625rem', // 26
        7.5: '1.875rem', // 30
        12.5: '3.125rem', // 50
        15: '3.75rem', // 60
        18: '4.5rem', // 72
        25: '6.25rem', // 100
        30: '7.5rem', // 120
      },
      lineHeight: {
        1: '1em',
        1.1: '1.1em',
        1.2: '1.2em',
        1.3: '1.3em',
        1.4: '1.4em',
        1.5: '1.5em',
        1.6: '1.6em',
        1.8: '1.8em',
        2: '2em',
      },
      letterSpacing: {
        1: '.01em',
        2: '.02em',
      },
      borderColor: {
        DEFAULT: '#000',
        light: '#e4e7ed',
      },
    },
  },
  plugins: [],
}
