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
        ink3:     '#6b6b6b',
        surface:  '#fafaf8',
        surface2: '#f2f1ed',
        line:     'rgba(0,0,0,0.08)',
        accent:      '#E08A00',
        'accent-ink': '#8A5300',
        'accent-bg':  '#FCEFD9',
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
