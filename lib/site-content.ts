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
    headlineLine1: process.env.NEXT_PUBLIC_HERO_HEADLINE_LINE_1 || 'Zatrzymuję czas',
    headlineLine2: process.env.NEXT_PUBLIC_HERO_HEADLINE_LINE_2 || 'Zapisuję emocje',
    subtitle:
      process.env.NEXT_PUBLIC_HERO_SUBTITLE
      || 'Dokumentuję to, co warto pamiętać.\nOd pola bitwy po weselny taniec.',
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
    title: process.env.NEXT_PUBLIC_ABOUT_TITLE || 'O mnie',
    lead:
      process.env.NEXT_PUBLIC_ABOUT_LEAD
      || 'Człowiek od zawsze opowiadał historie.\nNajpierw słowem.\nPotem obrazem.\nZ czasem nauczyliśmy się pisać.\nA dziś…',
    description:
      process.env.NEXT_PUBLIC_ABOUT_DESCRIPTION
      || 'Dziś opowiadamy historie filmem.\nW XXI wieku to właśnie film stał się językiem emocji, marek i wspomnień.\n\nI tutaj zaczyna się moja rola.',
    statement:
      process.env.NEXT_PUBLIC_ABOUT_STATEMENT
      || 'Nie chodzi mi tylko o ładne kadry, ale o to, żeby zatrzymać to, co w danym momencie było naprawdę ważne.',
    ctaLabel: process.env.NEXT_PUBLIC_ABOUT_CTA_LABEL || 'Zobacz jak pracuję',
    imageAlt:
      process.env.NEXT_PUBLIC_ABOUT_IMAGE_ALT
      || 'Fotograf i operator drona — portret z dronem i kontrolerem',
  },
  promo: {
    title: process.env.NEXT_PUBLIC_PROMO_TITLE || 'Moja praca w akcji',
    subtitle:
      process.env.NEXT_PUBLIC_PROMO_SUBTITLE
      || 'Krótki przegląd tego, co robię — od pola po montażownię.',
    heroVideo: {
      src: process.env.NEXT_PUBLIC_PROMO_VIDEO_SRC || '/videos/promo-reel.mp4',
      poster: process.env.NEXT_PUBLIC_PROMO_VIDEO_POSTER || '/images/promo-poster.jpg',
    },
    youtubeVideos: [
      {
        id: process.env.NEXT_PUBLIC_PROMO_YT_1_ID || 'jCpSTtkiKsY',
        title: process.env.NEXT_PUBLIC_PROMO_YT_1_TITLE || 'Przeprawa',
      },
      {
        id: process.env.NEXT_PUBLIC_PROMO_YT_2_ID || 'z-CdD24c2Sc',
        title: process.env.NEXT_PUBLIC_PROMO_YT_2_TITLE || 'Wesele — highlight',
      },
      {
        id: process.env.NEXT_PUBLIC_PROMO_YT_3_ID || 'm3ncwB9JCXk',
        title: process.env.NEXT_PUBLIC_PROMO_YT_3_TITLE || 'Moon Flames',
      },
      {
        id: process.env.NEXT_PUBLIC_PROMO_YT_4_ID || 'we_wTV-xELQ',
        title: process.env.NEXT_PUBLIC_PROMO_YT_4_TITLE || 'Echo Rodu - koncert',
      },
    ],
  },
  services: {
    title: process.env.NEXT_PUBLIC_SERVICES_TITLE || 'Oferta',
    subtitle:
      process.env.NEXT_PUBLIC_SERVICES_SUBTITLE
      || 'Pięć ścieżek, jeden cel — materiał, który zostaje w pamięci.\nWybierz scenę, która pasuje do Twojej historii.',
    items: [
      {
        icon: 'heart',
        title: 'Wesela i rodzina',
        tag: 'Foto + Wideo',
        description:
          'Naturalny reportaż pełen emocji i prawdziwych momentów. Bez sztucznego pozowania i zbędnego chaosu.',
      },
      {
        icon: 'drone',
        title: 'Drony',
        tag: 'Aerial',
        description:
          'Ujęcia z powietrza pokazujące skalę wydarzeń i przestrzeń. Dynamiczne kadry do rolek i materiałów premium.',
      },
      {
        icon: 'crosshair',
        title: 'Militaria i survival',
        tag: 'Reportaż',
        description:
          'Reportaże terenowe z wydarzeń o wysokiej dynamice. Ujęcia akcji, sprzętu i surowej atmosfery miejsca.',
      },
      {
        icon: 'wheel',
        title: 'Off-road i Jeep',
        tag: 'Akcja',
        description:
          'Motoryzacyjne sesje terenowe i relacje z wypraw. Kadry z ruchem, pyłem i tempem jazdy. Materiał oddaje charakter trasy i emocje za kierownicą.',
      },
      {
        icon: 'flag',
        title: 'Eventy',
        tag: 'Content Pack',
        description:
          'Komplet materiałów foto-wideo do promocji wydarzeń. Ujęcia do social mediów, portfolio i kampanii.',
      },
    ],
  },
  process: {
    title: 'Proces',
    subtitle:
      'Od pierwszego kontaktu do gotowego materiału — cztery proste kroki.\nBez niespodzianek, bez zbędnego czekania.',
    hudLabelLeft: 'WORKFLOW',
    hudLabelRight: 'SCENA 07 / 09',
    steps: [
      {
        number: '01',
        label: 'KONTAKT',
        title: 'Napisz do mnie',
        description:
          'Opisujesz swoje wydarzenie, termin i lokalizację. Odpowiadam w ciągu 24h z wstępnym planem.',
        timeline: 'do 24h',
      },
      {
        number: '02',
        label: 'PLAN',
        title: 'Ustalamy szczegóły',
        description:
          'Omawiamy zakres, harmonogram dnia i Twoje oczekiwania. Dostajesz jasny plan bez niespodzianek.',
        timeline: '1–3 dni',
      },
      {
        number: '03',
        label: 'REALIZACJA',
        title: 'Dzień zdjęć',
        description:
          'Przyjeżdżam przygotowany, z pełnym zestawem. Pracuję dyskretnie, ale łapię każdy moment.',
        timeline: 'w ustalonym terminie',
      },
      {
        number: '04',
        label: 'DOSTAWA',
        title: 'Odbierasz materiał',
        description:
          'Gotowe zdjęcia lub zmontowany film trafiają do Ciebie w umówionym terminie. Bez przeciągania.',
        timeline: '2–4 tygodnie',
      },
    ],
  },
} as const
