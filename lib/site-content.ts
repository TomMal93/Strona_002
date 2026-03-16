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
      || 'Nazywam się Przemek Malxxxxx. Tworzę treści audiowizualne, które pokazują Cię tak, jak chcesz być zapamiętany.',
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
  testimonials: {
    title: 'Opinie',
    subtitle:
      'Każda realizacja to czyjaś historia.\nOto, co mówią ci, których historie opowiedziałem.',
    hudLabelLeft: 'FEEDBACK',
    hudLabelRight: 'SCENA 06 / 09',
    items: [
      {
        quote:
          'Szukaliśmy kogoś, kto poradzi sobie w trudnych warunkach terenowych i dostarczy materiał na czas. Efekt? Komplet zdjęć i zmontowany film w dwa tygodnie — bez poprawek.',
        author: 'Karolina Nowicka',
        context: 'Koordynatorka — Manewry Taktyczne Wschód',
        tagline: 'TERMINOWOŚĆ',
      },
      {
        quote:
          'Jesteśmy zachwyceni naszym filmem weselnym! Całość została zmontowana w piękny, emocjonalny sposób i oglądając go znowu czujemy dokładnie te same emocje co w dniu ślubu. To pamiątka na całe życie — dziękujemy!',
        author: 'Maja',
        context: 'Para młoda — Film weselny',
        tagline: 'EMOCJE',
      },
      {
        quote:
          'Relacja została zrealizowana fantastycznie. Kamera idealnie oddała klimat wydarzenia — energię sceny i wyjątkową atmosferę. Montaż jest dynamiczny, a ujęcia bardzo klimatyczne, dzięki czemu film świetnie oddaje charakter całego koncertu.',
        author: 'Echo Rodu',
        context: 'Zespół muzyczny — Relacja z koncertu',
        tagline: 'KLIMAT',
      },
      {
        quote:
          'Film promocyjny przerósł nasze oczekiwania. Ujęcia wyglądają jak z teledysku! Dzięki temu filmowi nasza oferta prezentuje się dużo bardziej efektownie.',
        author: 'Full Moon Flames',
        context: 'Zespół — Film promocyjny',
        tagline: 'EFEKT',
      },
    ],
    trustedBy: {
      label: 'Zaufali mi',
      hudLabel: 'KLIENCI',
      clients: [
        { name: 'Beltor', logo: '/images/testimonials/beltor.png' },
        { name: 'Bieg', logo: '/images/testimonials/bieg.png' },
        { name: 'Dream Team', logo: '/images/testimonials/dreamteam.png' },
        { name: 'Sushi', logo: '/images/testimonials/sushi.png' },
      ],
    },
  },
  services: {
    title: process.env.NEXT_PUBLIC_SERVICES_TITLE || 'Oferta',
    subtitle:
      process.env.NEXT_PUBLIC_SERVICES_SUBTITLE
      || 'Od ważnych wydarzeń po gotowy montaż i materiały dla marki.\nTrzy formaty, jeden cel — obraz, który działa i zostaje w pamięci.',
    ctaLabel:
      process.env.NEXT_PUBLIC_SERVICES_CTA_LABEL
      || 'Skontaktuj się',
    items: [
      {
        icon: 'heart',
        title: 'Film okolicznościowy',
        tag: 'Wydarzenia',
        lead:
          'Zajmuję się realizacją filmów i zdjęć z ważnych wydarzeń, tworząc materiał, który zachowuje emocje, atmosferę i najważniejsze momenty dnia.',
        bullets: [
          'Śluby',
          'Studniówki',
          'Chrzciny',
          'Urodziny',
        ],
        description:
          'Film, który uchwyci Wasze emocje, najpiękniejsze chwile i atmosferę całego dnia — pamiątka na całe życie.',
        video: {
          src: '/videos/services/weeding.mp4',
          poster: '/images/services/weeding.png',
        },
      },
      {
        icon: 'wheel',
        title: 'Profesjonalny montaż',
        tag: 'Postprodukcja',
        lead:
          'Z surowego materiału tworzę spójną, dynamiczną historię — dbam o obraz, dźwięk i rytm, aby Twój film był gotowy do oglądania i zapadał w pamięć.',
        bullets: [
          'Wybór najlepszych ujęć',
          'Dynamiczny montaż',
          'Dodanie efektów wizualnych oraz dźwiękowych',
          'Korekcja kolorów',
        ],
        description:
          'Montuję filmy z Twoich materiałów, od vlogów na YouTube przez rolki na media społecznościowe.',
        video: {
          src: '/videos/services/montage.mp4',
          poster: '/images/services/montage.png',
        },
      },
      {
        icon: 'flag',
        title: 'Materiały promocyjne',
        tag: 'Promo Video',
        lead:
          'Tworzę wideo promocyjne, które pokazuje Twoją markę w najlepszym świetle i przyciąga uwagę odbiorców.',
        bullets: [
          'Kreowanie spójnego wizerunku marki w wideo',
          'Dynamiczne ujęcia dopasowane do charakteru produktu lub usługi',
          'Materiały do mediów społecznościowych i kampanii reklamowych',
        ],
        description:
          'Twoja marka w najlepszym świetle — przyciągnij uwagę odbiorców.',
        video: {
          src: '/videos/services/bieg.mp4',
          poster: '/images/services/bieg.png',
        },
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
  faq: {
    title: 'FAQ',
    subtitle:
      'Najczęściej zadawane pytania.\nOdpowiedzi, zanim zdążysz zapytać.',
    hudLabelLeft: 'ODPOWIEDZI',
    hudLabelRight: 'SCENA 08 / 09',
    items: [
      {
        number: 'Q.01',
        question: 'W jakich filmach się specjalizujesz?',
        answer:
          'Specjalizuję się w reportażu ślubnym oraz w tworzeniu filmów promocyjnych dla firm, poprzez materiały na platformy społecznościowe.',
      },
      {
        number: 'Q.02',
        question: 'Jakiego sprzętu używasz?',
        answer:
          'Nagrania realizuję w oparciu o system kamer Sony, ceniony w branży filmowej za doskonałą jakość obrazu.\n\nZa czysty i wyraźny dźwięk odpowiadają wysokiej jakości mikrofony Rode, które pozwalają precyzyjnie rejestrować głos, muzykę i atmosferę wydarzenia.\n\nPodczas nagrań wykorzystuję również profesjonalne oświetlenie filmowe, dzięki któremu możliwe jest odpowiednie doświetlenie sceny oraz uzyskanie estetycznego, kinowego wyglądu materiału.',
      },
      {
        number: 'Q.03',
        question: 'Czy zajmujesz się montażem filmów?',
        answer:
          'Tak, oferuję również montaż materiałów wideo. Pracuję w programie DaVinci Resolve, który jest jednym z najbardziej zaawansowanych narzędzi do edycji i korekcji kolorów używanych w branży filmowej.\n\nOferuję dynamiczny i dopasowany do charakteru materiału montaż, który podkreśla emocje, tempo wydarzenia oraz najważniejsze momenty nagrania.\n\nMogę zmontować zarówno materiał, który sam nagrałem, jak i ujęcia dostarczone przez Ciebie.',
      },
      {
        number: 'Q.04',
        question: 'Czy potrzebujesz drogiego sprzętu aby stworzyć dobry film?',
        answer:
          '„Drogi" sprzęt zdecydowanie pomaga uzyskać wysoką jakość obrazu i dźwięku, jednak najważniejsze są doświadczenie, pomysł i umiejętność opowiadania historii obrazem. Nawet najlepsza kamera nie zastąpi dobrego kadru, odpowiedniego światła czy przemyślanego montażu.\n\nDlatego w mojej pracy łączę obie te cechy — dobry sprzęt filmowy z doświadczeniem w realizacji i montażu wideo. Dzięki temu powstają materiały, które nie tylko dobrze wyglądają technicznie, ale także oddają klimat wydarzenia i przyciągają uwagę widza.',
      },
      {
        number: 'Q.05',
        question: 'Czy tworzenie filmów jest proste i przyjemne?',
        answer:
          'Tworzenie filmów potrafi być bardzo satysfakcjonujące, szczególnie gdy można uchwycić wyjątkowe chwile lub stworzyć ciekawą historię. W praktyce jednak jest to proces, który wymaga czasu, doświadczenia i zaangażowania.\n\nNa profesjonalnych planach filmowych nad końcowym efektem pracuje cały sztab ludzi: reżyser, operator kamery, oświetleniowiec, dźwiękowiec oraz montażysta.\n\nW przypadku moich realizacji często działam sam na planie zdjęciowym — można powiedzieć, że jestem trochę „one man army".\n\nSpokojnie — panuje nad tym, dzięki czemu cały proces przebiega sprawnie, a efekt końcowy pozostaje na wysokim poziomie.\n\nDlatego choć tworzenie filmów może wyglądać lekko i naturalnie, w rzeczywistości stoi za nim sporo pracy, wiedzy i pasji, które pozwalają stworzyć materiał o wysokiej jakości i ciekawym charakterze.',
      },
      {
        number: 'Q.06',
        question: 'Dlaczego to tyle kosztuje?',
        answer:
          'Na pierwszy rzut oka może się wydawać, że praca filmowca jest bardzo prosta — ktoś przyjeżdża z kamerą, nagrywa kilka godzin wydarzenia, a później inkasuje wynagrodzenie. W rzeczywistości jest to jednak tylko wierzchołek góry lodowej.\n\nProces tworzenia filmu to nie tylko same nagrania. Bardzo dużą część pracy stanowi postprodukcja, czyli selekcja materiału, montaż, korekcja kolorów i obróbka dźwięku.\n\nDla przykładu — w przypadku filmu weselnego przy pracy dwóch operatorów potrafi powstać nawet do 10 godzin surowego materiału. Już sama selekcja najlepszych ujęć potrafi zająć dziesiątki godzin, zanim jeszcze rozpocznie się właściwy montaż.\n\nDopiero później powstaje spójna historia, która oddaje emocje i klimat całego wydarzenia.\n\nNa cenę wpływa także sprzęt, doświadczenie, przygotowanie do realizacji oraz czas poświęcony na postprodukcję. Dzięki temu końcowy film jest dopracowany i staje się pamiątką, do której można wracać przez lata.',
      },
      {
        number: 'Q.07',
        question: 'Czy realizujesz zlecenia poza moim miastem / w terenie?',
        answer:
          'Tak — realizuję zlecenia na terenie całego kraju, a w przypadku większych projektów również za granicą. Eventy militarne, wyprawy off-road czy plenerowe sesje w trudnym terenie to moja codzienność.\n\nKoszty dojazdu ustalamy indywidualnie przed zleceniem, tak żeby nie było niespodzianek.',
      },
      {
        number: 'Q.08',
        question: 'Co jeśli chcę poprawki w zmontowanym filmie?',
        answer:
          'Każdy projekt obejmuje rundę poprawek — po otrzymaniu pierwszej wersji montażu możesz zgłosić uwagi, a ja wprowadzam korekty. Zależy mi na tym, żeby efekt końcowy w pełni odpowiadał Twoim oczekiwaniom.\n\nSzczegóły dotyczące liczby poprawek ustalamy przed rozpoczęciem współpracy.',
      },
      {
        number: 'Q.09',
        question: 'Czy mogę wykorzystać materiał komercyjnie?',
        answer:
          'Tak — po realizacji otrzymujesz pełne prawa do wykorzystania materiału w social mediach, na stronie internetowej, w reklamach i materiałach promocyjnych.\n\nJeśli projekt wymaga szczególnych ustaleń licencyjnych, omawiamy to przed rozpoczęciem współpracy, żeby wszystko było jasne od samego początku.',
      },
    ],
  },
  aboutMe: {
    meta: {
      title: process.env.NEXT_PUBLIC_ABOUTME_META_TITLE || 'O mnie',
      description:
        process.env.NEXT_PUBLIC_ABOUTME_META_DESC
        || 'Poznaj fotografa i operatora wideo stojącego za kamerą — doświadczenie, sprzęt i pasja w jednym.',
    },
    hero: {
      name: process.env.NEXT_PUBLIC_ABOUTME_HERO_NAME || 'Przemek Malxxxxx',
      tagline: process.env.NEXT_PUBLIC_ABOUTME_HERO_TAGLINE || 'Fotograf · Operator · Filmowiec',
      resolution: '4K DCI / 25P',
      backgroundImage:
        process.env.NEXT_PUBLIC_ABOUTME_HERO_BG || '/images/about-me-hero.webp',
      backgroundAlt:
        process.env.NEXT_PUBLIC_ABOUTME_HERO_BG_ALT || 'Fotograf w plenerze z kamerą',
    },
    bio: {
      title: 'O mnie',
      hudLabelLeft: 'NOTES',
      hudLabelRight: 'SCENA 01 / 05',
      text:
        process.env.NEXT_PUBLIC_ABOUTME_BIO
        || 'Jestem fotografem i operatorem kamery z ponad 8-letnim doświadczeniem w branży audiowizualnej. Specjalizuję się w realizacji filmów ślubnych, materiałów promocyjnych oraz relacji z wydarzeń — od kameralnych uroczystości po dynamiczne eventy militarne i sportowe. Łączę pasję do obrazu z solidnym warsztatem technicznym. Pracuję w systemie kamer Sony, wykorzystuję drony, stabilizatory i profesjonalne oświetlenie, aby każdy kadr wyglądał kinowo. Moim celem jest stworzenie materiału, który nie tylko dobrze wygląda, ale przede wszystkim opowiada Twoją historię i zostaje w pamięci na lata.',
    },
    video: {
      title: 'Przedstawiam się',
      hudLabelLeft: 'INTRO',
      hudLabelRight: 'SCENA 02 / 05',
      type: (process.env.NEXT_PUBLIC_ABOUTME_VIDEO_TYPE || 'youtube') as 'youtube' | 'self-hosted',
      youtubeId: process.env.NEXT_PUBLIC_ABOUTME_VIDEO_YT_ID || 'jCpSTtkiKsY',
      src: process.env.NEXT_PUBLIC_ABOUTME_VIDEO_SRC || '/videos/about-me-intro.mp4',
      poster: process.env.NEXT_PUBLIC_ABOUTME_VIDEO_POSTER || '/images/about-me-video-poster.jpg',
    },
    contact: {
      title: 'Kontakt',
      hudLabelLeft: 'CONTACT',
      hudLabelRight: 'SCENA 03 / 05',
      phone: process.env.NEXT_PUBLIC_ABOUTME_PHONE || '+48 123 456 789',
      email: process.env.NEXT_PUBLIC_ABOUTME_EMAIL || 'kontakt@example.com',
      ctaLabel: process.env.NEXT_PUBLIC_ABOUTME_CTA_LABEL || 'Napisz do mnie',
      ctaHref: process.env.NEXT_PUBLIC_ABOUTME_CTA_HREF || 'mailto:kontakt@example.com',
      socials: [
        { platform: 'facebook', href: process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK || '#', label: 'Facebook' },
        { platform: 'instagram', href: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM || '#', label: 'Instagram' },
        { platform: 'tiktok', href: process.env.NEXT_PUBLIC_SOCIAL_TIKTOK || '#', label: 'TikTok' },
        { platform: 'youtube', href: process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE || '#', label: 'YouTube' },
      ],
    },
    gear: {
      title: 'Arsenał',
      hudLabelLeft: 'GEAR',
      hudLabelRight: 'SCENA 04 / 05',
      stats: [
        { value: 500, suffix: '+', label: 'Projektów' },
        { value: 8, suffix: '+', label: 'Lat doświadczenia' },
        { value: 4, suffix: 'K', label: 'Rozdzielczość' },
        { value: 100, suffix: '%', label: 'Zadowolenia' },
      ],
      items: [
        { category: 'KAMERA', name: 'Sony FX3', spec: 'Full-frame / S-Log3 / 4K 120fps' },
        { category: 'DRON', name: 'DJI Mavic 3 Pro', spec: 'Hasselblad / 5.1K / APAS 5.0' },
        { category: 'STABILIZATOR', name: 'DJI RS 3 Pro', spec: '4.5kg payload / LiDAR focus' },
        { category: 'DŹWIĘK', name: 'Rode Wireless PRO', spec: '32-bit float / dual channel' },
        { category: 'OŚWIETLENIE', name: 'Nanlite Forza 60C', spec: 'RGBLAC / 2700-7500K' },
        { category: 'MONTAŻ', name: 'DaVinci Resolve', spec: 'Studio / Color grading / Fusion' },
      ],
    },
  },
} as const
