export const heroClassNames = {
  section: 'relative w-full h-screen overflow-hidden bg-black-deep',
  media: 'absolute inset-0 h-hero-media w-full will-change-transform',
  gradientOverlay: 'absolute inset-0 bg-gradient-to-b from-black-deep/50 via-transparent to-black-deep/85',
  grainOverlay: 'absolute inset-0 z-10 pointer-events-none',
  contentWrapper: 'relative z-20 mx-auto flex h-full max-w-content flex-col justify-center px-6 lg:px-20',
  headline: 'font-bebas uppercase tracking-wider text-display sm:text-display-sm lg:text-display-lg text-warm-white',
  subtitle: 'mt-6 max-w-lg font-inter text-lg font-light text-warm-gray lg:text-xl',
  cta: 'mt-10 self-start inline-block',
  scrollIndicator: 'absolute bottom-10 left-1/2 z-20 -translate-x-1/2 flex flex-col items-center gap-2',
} as const
