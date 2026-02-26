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
        // Kolory referencjonują CSS custom properties z :root (globals.css).
        // Składnia <alpha-value> pozwala na modyfikatory opacity: khaki/30, khaki/70 itp.
        'khaki':          'rgb(var(--c-gold) / <alpha-value>)',          // #8B7355 — main accent
        'military-green': 'rgb(var(--c-olive) / <alpha-value>)',         // #4A5240 — secondary accent
      },
      fontFamily: {
        bebas: ['var(--font-bebas)', 'sans-serif'],
        inter: ['var(--font-inter)', 'sans-serif'],
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
        overline: '0.2em', // Inter small caps — used via .ui-overline utility
        heading: '0.15em', // Bebas Neue display/eyebrow contexts
      },
      fontSize: {
        display: ['80px', { lineHeight: '0.9' }],
        'display-sm': ['100px', { lineHeight: '0.9' }],
        'display-lg': ['110px', { lineHeight: '0.9' }],
      },
    },
  },
  plugins: [],
}

export default config
