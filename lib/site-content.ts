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
      || 'Dokumentuję to, co warto pamiętać.\nOd teledysku po weselny taniec.',
    ctaLabel: process.env.NEXT_PUBLIC_HERO_CTA_LABEL || 'Zapytaj o termin',
    ctaHref: process.env.NEXT_PUBLIC_HERO_CTA_HREF || '#contact',
    aboutLabel: process.env.NEXT_PUBLIC_HERO_ABOUT_LABEL || 'Poznajmy się',
    serviceTags: ['SESJE ZDJĘCIOWE', 'ŚLUB I WESELE', 'FILMY PROMOCYJNE'],
    social: [
      { platform: 'facebook', href: process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK || '#' },
      { platform: 'youtube', href: process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE || '#' },
      { platform: 'instagram', href: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM || '#' },
      { platform: 'whatsapp', href: process.env.NEXT_PUBLIC_SOCIAL_WHATSAPP || '#' },
      { platform: 'messenger', href: process.env.NEXT_PUBLIC_SOCIAL_MESSENGER || '#' },
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
      || 'Tworzę treści audiowizualne, które pokazują Cię tak, jak chcesz być zapamiętany.',
    ctaLabel: process.env.NEXT_PUBLIC_ABOUT_CTA_LABEL || 'Dowiedz się więcej o mnie',
    imageAlt:
      process.env.NEXT_PUBLIC_ABOUT_IMAGE_ALT
      || 'Fotograf i operator drona — portret z dronem i kontrolerem',
    photographerNote:
      process.env.NEXT_PUBLIC_ABOUT_PHOTOGRAPHER_NOTE
      || 'Specjalizuję się w produkcji filmowej, fotografii, ujęciach z drona oraz montażu. Od ponad 3 lat realizuję projekty w całej Polsce, a większe produkcje także za granicą.',
  },
  promo: {
    title: process.env.NEXT_PUBLIC_PROMO_TITLE || 'Moja praca w akcji',
    subtitle:
      process.env.NEXT_PUBLIC_PROMO_SUBTITLE
      || 'Krótki przegląd tego, co robię - od scenariusza po montażownię.',
    heroVideo: {
      src: process.env.NEXT_PUBLIC_PROMO_VIDEO_SRC || '/videos/promo-reel.webm',
      poster: process.env.NEXT_PUBLIC_PROMO_VIDEO_POSTER || '/images/portfolio/promo-poster.webp',
    },
    youtubeVideos: [
      {
        id: process.env.NEXT_PUBLIC_PROMO_YT_1_ID || 'jCpSTtkiKsY',
        title: process.env.NEXT_PUBLIC_PROMO_YT_1_TITLE || 'Przeprawa',
      },
      {
        id: process.env.NEXT_PUBLIC_PROMO_YT_2_ID || 'z-CdD24c2Sc',
        title: process.env.NEXT_PUBLIC_PROMO_YT_2_TITLE || 'Prolog filmu ślubnego',
      },
      {
        id: process.env.NEXT_PUBLIC_PROMO_YT_3_ID || 'm3ncwB9JCXk',
        title: process.env.NEXT_PUBLIC_PROMO_YT_3_TITLE || 'Full moon flames',
      },
    ],
  },
  testimonials: {
    title: 'Opinie',
    subtitle:
      'Każda realizacja to czyjaś historia.\nOto, co mówią ci, których historie opowiedziałem.',
    hudLabelLeft: 'FEEDBACK',
    hudLabelRight: 'SCENE 06 / 08',
    items: [
      {
        quote:
          'Jesteśmy zachwyceni naszym filmem weselnym! Całość została zmontowana w piękny, emocjonalny sposób i oglądając go znowu czujemy dokładnie te same emocje co w dniu ślubu. To pamiątka na całe życie — dziękujemy!',
        author: 'Maja',
        context: 'Para młoda - Film weselny',
        tagline: 'EMOCJE',
      },
      {
        quote:
          'Relacja została zrealizowana fantastycznie. Kamera idealnie oddała klimat wydarzenia — energię sceny i wyjątkową atmosferę. Montaż jest dynamiczny, a ujęcia bardzo klimatyczne, dzięki czemu film świetnie oddaje charakter całego koncertu.',
        author: 'Echo Rodu',
        context: 'Zespół muzyczny - Relacja z koncertu',
        tagline: 'KLIMAT',
      },
      {
        quote:
          'Film promocyjny przerósł nasze oczekiwania. Ujęcia wyglądają jak z teledysku! Dzięki temu filmowi nasza oferta prezentuje się dużo bardziej efektownie.',
        author: 'Full Moon Flames',
        context: 'Zespół - Film promocyjny',
        tagline: 'EFEKT',
      },
    ],
    socialProof: {
      hudLabel: 'STATS',
      items: [
        { value: 100, suffix: '+', label: 'Zrealizowanych projektów', tag: 'PROJECTS' },
        { value: 3, suffix: '+', label: 'Lat doświadczenia', tag: 'EXPERIENCE' },
        { value: 100, suffix: '%', label: 'Zadowolonych klientów', tag: 'SATISFACTION' },
        { value: 4, suffix: 'K', label: 'Jakość obrazu', tag: 'RESOLUTION' },
      ],
    },
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
      || 'Od pierwszego ujęcia po finalny montaż.\nTworzę filmy, które budzą emocje i zostają w pamięci.',
    ctaLabel:
      process.env.NEXT_PUBLIC_SERVICES_CTA_LABEL
      || 'Zapytaj o termin',
    ctaHref:
      process.env.NEXT_PUBLIC_SERVICES_CTA_HREF
      || '#cta',
    secondaryCtaLabel:
      process.env.NEXT_PUBLIC_SERVICES_SECONDARY_CTA_LABEL
      || 'Pełna oferta',
    secondaryCtaHref:
      process.env.NEXT_PUBLIC_SERVICES_SECONDARY_CTA_HREF
      || '/oferta',
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
          'Tworzę film, który pozwala wrócić do atmosfery wydarzenia i ponownie poczuć jego najważniejsze momenty.',
        video: {
          src: '/videos/services/weeding.webm',
          poster: '/images/services/weeding.webp',
        },
      },
      {
        icon: 'wheel',
        title: 'Profesjonalny montaż',
        tag: 'Postprodukcja',
        lead:
          'Porządkuję materiał, wydobywam z niego najmocniejsze momenty i nadaję całości profesjonalną formę.',
        bullets: [
          'Wybór najlepszych ujęć',
          'Dynamiczny montaż',
          'Efekty i dźwięk',
          'Korekcja kolorów',
        ],
        description:
          'Montuję filmy z Twoich materiałów, od vlogów na YouTube przez rolki na media społecznościowe.',
        video: {
          src: '/videos/services/montage.webm',
          poster: '/images/services/montage.webp',
        },
      },
      {
        icon: 'flag',
        title: 'Materiały promocyjne',
        tag: 'Promo Video',
        lead:
          'Tworzę wideo promocyjne, które pokazuje Twoją markę w najlepszym świetle i przyciąga uwagę odbiorców.',
        bullets: [
          'Spójny wizerunek marki',
          'Dynamiczne ujęcia',
          'Kampanie social media',
          'Filmy produktowe',
        ],
        description:
          'Zamieniam wartości Twojej marki w obraz, który angażuje, buduje rozpoznawalność i zostaje w pamięci.',
        video: {
          src: '/videos/services/bieg.webm',
          poster: '/images/services/bieg.webp',
        },
      },
    ],
  },
  process: {
    title: 'Proces',
    subtitle:
      'Ty przynosisz historię, ja dbam o każdy kolejny kadr.\nRazem przechodzimy od pomysłu do premiery.',
    hudLabelLeft: 'WORKFLOW',
    hudLabelRight: 'SCENE 05 / 08',
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
    hudLabelLeft: 'ANSWERS',
    hudLabelRight: 'SCENE 07 / 08',
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
          'Tak - realizuję zlecenia na terenie całego kraju, a w przypadku większych projektów również za granicą.\nEventy, wyprawy off-road czy plenerowe sesje w trudnym terenie to moja codzienność.\nKoszty dojazdu ustalamy indywidualnie przed zleceniem, tak żeby nie było niespodzianek.',
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
  cta: {
    title: 'Gotowi,\u00A0żeby\u00A0opowiedzieć\nWaszą historię?',
    subtitle:
      'Wasze najważniejsze momenty zasługują na to, by przeżywać je wciąż na nowo.\n\nBądźcie w pełni sobą i cieszcie się tym dniem, a ja zadbam o kadry pełne uśmiechu i wzruszeń.\n\nNapiszcie już dziś — sprawdźmy wolny termin i stwórzmy razem coś wyjątkowego!',
    hudLabelLeft: 'FINAL CTA',
    hudLabelRight: 'SCENE 08 / 08',
    ctaLabel: process.env.NEXT_PUBLIC_CTA_LABEL || 'Zapytaj o termin',
    ctaHref: process.env.NEXT_PUBLIC_CTA_HREF || '#contact',
    phoneLabel: process.env.NEXT_PUBLIC_CTA_PHONE_LABEL || 'Zadzwoń',
    phoneHref: process.env.NEXT_PUBLIC_CTA_PHONE_HREF || '#contact',
    secondaryLabel: process.env.NEXT_PUBLIC_CTA_SECONDARY_LABEL || 'Poznaj proces',
    secondaryHref: process.env.NEXT_PUBLIC_CTA_SECONDARY_HREF || '#process',
    features: [
      { label: 'Film + montaż' },
      { label: 'Cała Polska' },
      { label: 'Naturalne kadry' },
    ],
    social: [
      { platform: 'facebook' as const, href: process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK || '#' },
      { platform: 'youtube' as const, href: process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE || '#' },
      { platform: 'instagram' as const, href: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM || '#' },
      { platform: 'whatsapp' as const, href: process.env.NEXT_PUBLIC_SOCIAL_WHATSAPP || '#' },
      { platform: 'messenger' as const, href: process.env.NEXT_PUBLIC_SOCIAL_MESSENGER || '#' },
    ],
  },
  offerPage: {
    meta: {
      title: process.env.NEXT_PUBLIC_OFFER_META_TITLE || 'Oferta — Maleszyk Media',
      description:
        process.env.NEXT_PUBLIC_OFFER_META_DESC
        || 'Film okolicznościowy, profesjonalny montaż i materiały promocyjne — pełna oferta usług filmowych.',
    },
    hero: {
      eyebrow: 'Usługi',
      title: 'Oferta',
      lead:
        'Słucham, obserwuję i szukam tego, co najważniejsze.\nPotem zamieniam to w film pełen prawdziwych emocji.',
    },
    cta: {
      title: 'Porozmawiajmy o Twoim projekcie',
      lead: 'Napisz, zadzwoń albo umów krótką rozmowę — powiem Ci, co mogę zrobić, a Ty zdecydujesz.',
      label: 'Zapytaj o termin',
      href: '/contact',
    },
  },
  contactPage: {
    meta: {
      title: process.env.NEXT_PUBLIC_CONTACT_META_TITLE || 'Kontakt',
      description:
        process.env.NEXT_PUBLIC_CONTACT_META_DESC
        || 'Porozmawiajmy o filmie, fotografii lub materiale promocyjnym dla Twojej marki.',
    },
    hero: {
      eyebrow: 'Kontakt',
      titleLine1: 'Masz historię',
      titleLine2: 'do opowiedzenia?',
      lead:
        'Napisz, co chcesz stworzyć.\nOpowiedz mi o swoim pomyśle, terminie i miejscu realizacji.\nOdezwę się z konkretną propozycją dopasowaną do Twojej historii.',
      availability: 'Odpowiadam zwykle w ciągu 24 godzin',
      location: 'Polska / realizacje w całym kraju',
      image: '/images/contact/contact-camera-sunset.webp',
      imageAlt: 'Profesjonalna kamera filmowa rejestrująca górski krajobraz o zachodzie słońca',
    },
  },
  aboutMe: {
    meta: {
      title: process.env.NEXT_PUBLIC_ABOUTME_META_TITLE || 'O mnie',
      description:
        process.env.NEXT_PUBLIC_ABOUTME_META_DESC
        || 'Poznaj fotografa i operatora wideo stojącego za kamerą — doświadczenie, sprzęt i pasja w jednym.',
    },
    hero: {
      name: process.env.NEXT_PUBLIC_ABOUTME_HERO_NAME || 'Fotograf i filmowiec',
      tagline: process.env.NEXT_PUBLIC_ABOUTME_HERO_TAGLINE || 'Fotograf · Operator · Filmowiec',
      resolution: '4K DCI / 25P',
      backgroundImage:
        process.env.NEXT_PUBLIC_ABOUTME_HERO_BG || '/images/contact/contact-hero.webp',
      backgroundAlt:
        process.env.NEXT_PUBLIC_ABOUTME_HERO_BG_ALT || 'Fotograf w plenerze z kamerą',
    },
    profile: {
      title: process.env.NEXT_PUBLIC_ABOUTME_PROFILE_TITLE || 'Kim jestem',
      hudLabelLeft: 'PROFILE',
      hudLabelRight: 'SCENE 02 / 03',
      subtitle: 'Profile',
      intro:
        process.env.NEXT_PUBLIC_ABOUTME_PROFILE_INTRO
        || 'Tworzę filmy z wydarzeń, w których liczą się prawdziwe emocje i tempo chwili. Szukam gestów, spojrzeń i momentów, które łatwo przeoczyć.\nPracuję spokojnie, reaguję szybko i nie próbuję reżyserować tego, co powinno wydarzyć się naturalnie. Dzięki temu otrzymujesz nie tylko zapis wydarzenia, ale film, który pozwala poczuć jego atmosferę jeszcze raz.',
      locationLabel: 'Gdzie pracuję',
      locationText:
        process.env.NEXT_PUBLIC_ABOUTME_PROFILE_LOCATION
        || 'Pracuję w całej Polsce. Chętnie realizuję również projekty zagraniczne. Dobrze czuję się zarówno w terenie i błocie, jak i na ślubie, koncercie czy planie marki.',
      specialtiesLabel: 'W czym się specjalizuję',
      specialties: [
        'Filmy ślubne i rodzinne historie',
        'Relacje z eventów i koncertów',
        'Filmy promocyjne dla firm i marek',
        'Produkcje terenowe, off-road i ujęcia z drona',
        'Montaż materiałów z charakterem',
      ],
      gearLabel: 'Zaplecze techniczne',
      gear: [
        'Obraz — realizacja w jakości 4K',
        'Dźwięk — czyste i wyraźne nagrania',
        'Ujęcia z powietrza — filmowa perspektywa',
        'Światło — praca w plenerze i na planie',
      ],
      statsLabel: 'Liczby',
      stats: [
        { value: '3+', label: 'lata doświadczenia' },
        { value: '100+', label: 'zrealizowanych projektów' },
        { value: '4K', label: 'jakość obrazu' },
        { value: '24h', label: 'czas odpowiedzi' },
      ],
      cta: {
        label: 'Zapytaj o termin',
        href: '#aboutme-contact-heading',
      },
    },
    bio: {
      title: 'Dlaczego to robię',
      hudLabelLeft: 'NOTES',
      hudLabelRight: 'SCENE 01 / 03',
      text:
        process.env.NEXT_PUBLIC_ABOUTME_BIO
        || 'Wszystko zaczęło się od kurzu na bezdrożach\ni chęci zatrzymania w kadrze surowego klimatu moich terenowych wypraw.\n\nTrzy lata temu kamera i dron były dla mnie tylko narzędziami – cyfrowym pamiętnikiem z podróży, który miał cieszyć głównie moje oko.\nZ czasem jednak zauważyłem, że między jednym a drugim ujęciem dzieje się coś więcej.\n\nOdkryłem, że film to nie tylko suma ładnych obrazków, ale potężny język, którym można opowiadać o tym, co niewidoczne: o napięciu przed trudnym podjazdem, o ciszy poranka w lesie i o ulotnych emocjach, które znikają szybciej niż dym z ogniska.\n\nDziś nie tylko nagrywam – ja buduję opowieści.\nSzukam w obiektywie autentyczności, by każdy film był powrotem do chwil, które zasługują na to, by trwać wiecznie.',
    },
    video: {
      title: 'Przedstawiam się',
      hudLabelLeft: 'INTRO',
      hudLabelRight: 'SCENE 01 / 02',
      type: (process.env.NEXT_PUBLIC_ABOUTME_VIDEO_TYPE || 'self-hosted') as 'youtube' | 'self-hosted',
      youtubeId: process.env.NEXT_PUBLIC_ABOUTME_VIDEO_YT_ID || 'jCpSTtkiKsY',
      src: process.env.NEXT_PUBLIC_ABOUTME_VIDEO_SRC || '/videos/contact/contact.mp4',
      poster: process.env.NEXT_PUBLIC_ABOUTME_VIDEO_POSTER || '/images/contact/bio.webp',
      highlightsLeft: [
        'Wyczucie\nchwili',
        'Naturalne emocje',
        'Filmowe spojrzenie',
        'Spokój w działaniu',
        'Uważność na detal',
      ],
      highlightsRight: [
        'Przyjazna atmosfera',
        'Prawdziwe tempo',
        'Gra\nświatłem',
        'Kadry z charakterem',
        'Opowieść w obrazie',
      ],
    },
    contact: {
      title: 'Kontakt',
      hudLabelLeft: 'CONTACT',
      hudLabelRight: 'SCENE 03 / 03',
      phone: process.env.NEXT_PUBLIC_ABOUTME_PHONE || '',
      email: process.env.NEXT_PUBLIC_ABOUTME_EMAIL || '',
      ctaLabel: process.env.NEXT_PUBLIC_ABOUTME_CTA_LABEL || 'Porozmawiajmy',
      ctaHref: process.env.NEXT_PUBLIC_ABOUTME_CTA_HREF || '#contact',
      socials: [
        { platform: 'facebook', href: process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK || '#', label: 'Facebook' },
        { platform: 'youtube', href: process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE || '#', label: 'YouTube' },
        { platform: 'instagram', href: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM || '#', label: 'Instagram' },
        { platform: 'whatsapp', href: process.env.NEXT_PUBLIC_SOCIAL_WHATSAPP || '#', label: 'WhatsApp' },
        { platform: 'messenger', href: process.env.NEXT_PUBLIC_SOCIAL_MESSENGER || '#', label: 'Messenger' },
      ],
    },
  },
} as const
