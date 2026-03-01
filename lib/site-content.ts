export type ServiceIconName = 'heart' | 'drone' | 'crosshair' | 'wheel' | 'flag'

export const siteContent = {
  // Using || instead of ?? so that empty-string env vars also fall back to defaults.
  seoDescription:
    process.env.NEXT_PUBLIC_SITE_DESCRIPTION
    || 'Portfolio fotografa i operatora wideo — wydarzenia militarne, survival, drony, off-road, śluby i sesje rodzinne.',
  structuredDataDescription:
    process.env.NEXT_PUBLIC_STRUCTURED_DATA_DESCRIPTION
    || 'Fotografia i film — wydarzenia militarne, survival, drony, off-road, śluby i sesje rodzinne.',
  hero: {
    eyebrow: process.env.NEXT_PUBLIC_HERO_EYEBROW || 'Fotografia & Film',
    headlineLine1: process.env.NEXT_PUBLIC_HERO_HEADLINE_LINE_1 || 'Zamrażam',
    headlineLine2: process.env.NEXT_PUBLIC_HERO_HEADLINE_LINE_2 || 'Chwile',
    subtitle:
      process.env.NEXT_PUBLIC_HERO_SUBTITLE
      || 'Dokumentuję to, co warto pamiętać.\nOd pola bitwy po ślubny taniec.',
    ctaLabel: process.env.NEXT_PUBLIC_HERO_CTA_LABEL || 'Skontaktuj się',
    aboutLabel: process.env.NEXT_PUBLIC_HERO_ABOUT_LABEL || 'O mnie',
    social: [
      { platform: 'facebook', href: process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK || '#' },
      { platform: 'instagram', href: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM || '#' },
      { platform: 'tiktok', href: process.env.NEXT_PUBLIC_SOCIAL_TIKTOK || '#' },
      { platform: 'youtube', href: process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE || '#' },
    ],
  },
  about: {
    title: process.env.NEXT_PUBLIC_ABOUT_TITLE || 'O MNIE',
    lead:
      process.env.NEXT_PUBLIC_ABOUT_LEAD
      || 'Jestem fotografem i operatorem wideo. Pracuję tam, gdzie tempo jest wysokie, a emocje prawdziwe.',
    description:
      process.env.NEXT_PUBLIC_ABOUT_DESCRIPTION
      || 'Od eventów militarno-survivalowych i off-roadu po śluby i sesje rodzinne. Niezależnie od kontekstu dostajesz ten sam standard: reportaż, który oddaje klimat wydarzenia bez sztucznego pozowania.',
    highlights: [
      {
        title: 'Dwa światy, jeden styl',
        description: 'Akcja, teren i ruch łączę z uważnością na relacje i emocje ludzi.',
      },
      {
        title: 'Praca w warunkach dynamicznych',
        description: 'Sprawnie działam pod presją czasu, zmiennego światła i nieprzewidywalnego przebiegu wydarzeń.',
      },
      {
        title: 'Materiał gotowy do publikacji',
        description: 'Dostarczam kadry i ujęcia przygotowane pod social media, stronę i materiały promocyjne.',
      },
    ],
    ctaLabel: process.env.NEXT_PUBLIC_ABOUT_CTA_LABEL || 'Sprawdź ofertę',
    imageAlt:
      process.env.NEXT_PUBLIC_ABOUT_IMAGE_ALT
      || 'Fotograf i operator drona — portret z dronem i kontrolerem',
  },
  services: {
    title: process.env.NEXT_PUBLIC_SERVICES_TITLE || 'Oferta',
    subtitle:
      process.env.NEXT_PUBLIC_SERVICES_SUBTITLE
      || 'Od reportażu eventowego po ujęcia z drona. Każdy materiał realizuję z naciskiem na dynamikę, klimat i historię.',
    items: [
      {
        icon: 'heart',
        title: 'Wesela i sesje rodzinne',
        tag: 'Foto + Wideo',
        description:
          'Naturalny reportaż z naciskiem na emocje i autentyczne momenty. Bez sztucznego pozowania i zbędnego chaosu.',
      },
      {
        icon: 'drone',
        title: 'Drony',
        tag: 'Aerial',
        description:
          'Ujęcia lotnicze podkreślające skalę wydarzenia i przestrzeń. Dynamiczne kadry do rolek, relacji i materiałów premium.',
      },
      {
        icon: 'crosshair',
        title: 'Eventy militarne i survival',
        tag: 'Reportaż',
        description:
          'Reportaże terenowe z wydarzeń o podwyższonej dynamice. Ujęcia akcji, detalu sprzętu i atmosfery miejsca.',
      },
      {
        icon: 'wheel',
        title: 'Off-road / Jeepe',
        tag: 'Akcja',
        description:
          'Motoryzacyjne sesje terenowe i relacje z wypraw. Kadry z ruchem, pyłem i tempem, które oddają charakter jazdy.',
      },
      {
        icon: 'flag',
        title: 'Produkcje eventowe',
        tag: 'Content Pack',
        description:
          'Komplet materiałów foto-wideo pod komunikację wydarzeń. Ujęcia do social mediów, portfolio i materiałów promocyjnych.',
      },
    ],
  },
} as const
