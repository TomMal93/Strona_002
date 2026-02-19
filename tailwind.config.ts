import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // design.md — Color Palette
        'black-deep':     '#0D0D0D', // dark section backgrounds
        'anthracite':     '#1A1A1A', // cards, secondary backgrounds
        'ecru':           '#F5F0EB', // light section backgrounds
        'warm-white':     '#FFFFFF',
        'warm-gray':      '#C8C0B4', // secondary text
        'khaki':          '#8B7355', // main accent — buttons, lines
        'military-green': '#4A5240', // secondary accent — hover, tags
      },
      fontFamily: {
        bebas:  ['var(--font-bebas)',  'sans-serif'],
        oswald: ['var(--font-oswald)', 'sans-serif'],
        inter:  ['var(--font-inter)',  'sans-serif'],
      },
      maxWidth: {
        content: '1280px',
      },
      height: {
        'hero-media': '120%',
      },
      borderRadius: {
        micro: '2px',
      },
      letterSpacing: {
        overline: '0.2em',
      },
      fontSize: {
        display: ['80px', { lineHeight: '0.9' }],
        'display-sm': ['100px', { lineHeight: '0.9' }],
        'display-lg': ['120px', { lineHeight: '0.9' }],
      },
    },
  },
  plugins: [],
}

export default config
