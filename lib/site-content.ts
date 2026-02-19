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
  services: {
    overline: process.env.NEXT_PUBLIC_SERVICES_OVERLINE ?? 'Zakres',
    title: process.env.NEXT_PUBLIC_SERVICES_TITLE ?? 'Usługi',
    subtitle:
      process.env.NEXT_PUBLIC_SERVICES_SUBTITLE
      ?? 'Od reportażu eventowego po ujęcia z drona. Każdy materiał realizuję z naciskiem na dynamikę, klimat i historię.',
    items: [
      {
        icon: 'crosshair',
        title: 'Eventy militarne i survival',
        description:
          'Reportaże terenowe z wydarzeń o podwyższonej dynamice. Ujęcia akcji, detalu sprzętu i atmosfery miejsca.',
      },
      {
        icon: 'heart',
        title: 'Wesela i sesje rodzinne',
        description:
          'Naturalny reportaż z naciskiem na emocje i autentyczne momenty. Bez sztucznego pozowania i zbędnego chaosu.',
      },
      {
        icon: 'drone',
        title: 'Drony',
        description:
          'Ujęcia lotnicze podkreślające skalę wydarzenia i przestrzeń. Dynamiczne kadry do rolek, relacji i materiałów premium.',
      },
      {
        icon: 'wheel',
        title: 'Off-road / Jeepe',
        description:
          'Motoryzacyjne sesje terenowe i relacje z wypraw. Kadry z ruchem, pyłem i tempem, które oddają charakter jazdy.',
      },
      {
        icon: 'flag',
        title: 'Produkcje eventowe',
        description:
          'Komplet materiałów foto-wideo pod komunikację wydarzeń. Ujęcia do social mediów, portfolio i materiałów promocyjnych.',
      },
    ],
  },
} as const
