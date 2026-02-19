export const siteContent = {
  seoDescription:
    process.env.NEXT_PUBLIC_SITE_DESCRIPTION
    ?? 'Portfolio fotografa i operatora wideo — wydarzenia militarne, survival, drony, off-road, śluby i sesje rodzinne.',
  structuredDataDescription:
    process.env.NEXT_PUBLIC_STRUCTURED_DATA_DESCRIPTION
    ?? 'Fotografia i film — wydarzenia militarne, survival, drony, off-road, śluby i sesje rodzinne.',
  hero: {
    headlineLine1: process.env.NEXT_PUBLIC_HERO_HEADLINE_LINE_1 ?? 'Zamrażam',
    headlineLine2: process.env.NEXT_PUBLIC_HERO_HEADLINE_LINE_2 ?? 'Chwile',
    subtitle:
      process.env.NEXT_PUBLIC_HERO_SUBTITLE
      ?? 'Fotografia i film — wydarzenia militarne, drony, ślub, off-road i sesje rodzinne.',
    ctaLabel: process.env.NEXT_PUBLIC_HERO_CTA_LABEL ?? 'Skontaktuj się',
  },
} as const
