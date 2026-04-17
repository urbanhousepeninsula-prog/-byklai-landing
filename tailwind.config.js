/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink:      '#0a0a0a',
        ink2:     '#3a3a3a',
        ink3:     '#888888',
        surface:  '#fafaf8',
        surface2: '#f2f1ed',
        line:     'rgba(0,0,0,0.08)',
        green:    '#2d6a4f',
        'green-bg': '#d8f3dc',
      },
      fontFamily: {
        sans:  ['Outfit', 'sans-serif'],
        serif: ['DM Serif Display', 'serif'],
        mono:  ['DM Mono', 'monospace'],
      },
      maxWidth: {
        '4xl': '900px',
      },
    },
  },
  plugins: [],
}
