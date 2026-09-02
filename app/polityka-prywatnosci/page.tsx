import type { Metadata } from 'next'
import Link from 'next/link'
import { siteContent } from '@/lib/site-content'
import styles from './PrivacyPolicy.module.css'

const pageTitle = 'Polityka prywatności i RODO | Maleszyk Media'
const pageDescription =
  'Zasady przetwarzania danych osobowych, prawa użytkowników oraz informacje o technologiach używanych w serwisie Maleszyk Media.'

export const metadata: Metadata = {
  title: { absolute: pageTitle },
  description: pageDescription,
  alternates: {
    canonical: '/polityka-prywatnosci',
  },
  openGraph: {
    type: 'website',
    locale: 'pl_PL',
    url: '/polityka-prywatnosci',
    siteName: 'Maleszyk Media',
    title: pageTitle,
    description: pageDescription,
    images: [
      {
        url: '/images/Hero.webp',
        alt: 'Maleszyk Media — fotografia i film',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: pageTitle,
    description: pageDescription,
    images: ['/images/Hero.webp'],
  },
}

export default function PrivacyPolicyPage() {
  const email = siteContent.aboutMe.contact.email
  const phone = siteContent.aboutMe.contact.phone
  const cardClassName = `${styles.documentCard} relative overflow-hidden rounded-micro border border-khaki/25 bg-anthracite/90 p-6 transition-colors duration-300 hover:border-khaki/40 sm:p-8`
  const compactCardClassName = `${styles.documentCard} ${styles.compactCard} relative overflow-hidden rounded-micro border border-khaki/25 bg-anthracite/90 p-6 transition-colors duration-300 hover:border-khaki/40 sm:p-8`

  return (
    <div className={`${styles.page} section-dark-bg min-h-screen`}>
      <div aria-hidden="true" className={styles.ambientGlow} />
      <div aria-hidden="true" className={styles.sideTelemetry}>
        <span>PRIVACY PROTOCOL</span>
        <span>MM / DATA / 2026</span>
      </div>

      {/* Top Header / Hero */}
      <section className={`${styles.hero} relative px-6 pb-8 pt-24 sm:pb-10 sm:pt-28 lg:px-20 lg:pt-32`}>
        <div className={`${styles.heroInner} mx-auto max-w-4xl text-center`}>
          <h1 className={`${styles.heroTitle} bg-[linear-gradient(130deg,rgb(var(--c-warm))_0%,rgb(255_238_175)_45%,rgb(var(--c-gold))_100%)] bg-clip-text font-bebas text-4xl uppercase leading-[0.95] tracking-wide text-transparent sm:text-5xl md:text-6xl`}>
            <span>Polityka prywatności</span>
            <span>&amp; RODO</span>
          </h1>

          <p className={`${styles.heroLead} mx-auto mt-3.5 max-w-xl font-mono text-xs leading-relaxed text-white/50 sm:text-[13px]`}>
            Zasady ochrony prywatności, celów przetwarzania danych osobowych oraz praw przysługujących odwiedzającym i klientom Maleszyk.Media.
          </p>
        </div>
      </section>

      {/* Main Content Sections */}
      <main className={`${styles.main} px-6 pb-24 lg:px-20`}>
        <div className={`${styles.content} mx-auto max-w-4xl space-y-8`}>
          
          {/* Section 1: Administrator */}
          <article className={cardClassName}>
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgb(139_115_85/0.12),transparent_65%)]" />
            
            <div className="relative z-10">
              <div className="mb-4 flex items-center justify-between border-b border-warm-gray/10 pb-3">
                <span className="font-mono text-xs uppercase tracking-widest text-khaki">
                  SEKCJA 01
                </span>
                <span className="font-mono text-[11px] text-warm-gray/60">
                  ART. 13 RODO
                </span>
              </div>

              <h2 className="font-bebas text-3xl uppercase tracking-wide text-warm-white sm:text-4xl">
                Administrator Danych Osobowych
              </h2>

              <p className="mt-3 font-inter text-sm leading-relaxed text-warm-white/80 sm:text-base">
                Administratorem Twoich danych osobowych w rozumieniu Rozporządzenia Parlamentu Europejskiego i Rady (UE) 2016/679 z dnia 27 kwietnia 2016 r. (RODO) jest:
              </p>

              <div className="mt-5 rounded-micro border border-khaki/30 bg-black-deep/70 p-5 font-mono text-xs leading-relaxed text-warm-white/90 sm:text-sm">
                <p className="font-bebas text-xl uppercase tracking-wider text-khaki">
                  Maleszyk.Media — Przemysław Maleszyk
                </p>
                <div className="mt-3 space-y-1.5 text-warm-white/80">
                  <p className="flex flex-wrap items-center gap-2">
                    <span className="text-khaki/80">E-mail:</span>
                    <a href={`mailto:${email}`} className="text-warm-white underline decoration-khaki/50 underline-offset-4 transition-colors hover:text-khaki">
                      {email}
                    </a>
                  </p>
                  <p className="flex flex-wrap items-center gap-2">
                    <span className="text-khaki/80">Telefon:</span>
                    <a href={`tel:${phone.replace(/\s/g, '')}`} className="text-warm-white underline decoration-khaki/50 underline-offset-4 transition-colors hover:text-khaki">
                      {phone}
                    </a>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-khaki/80">Obszar działalności:</span>
                    <span>Polska oraz produkcje międzynarodowe</span>
                  </p>
                </div>
              </div>

              <p className="mt-4 font-inter text-xs text-warm-gray/80 sm:text-sm">
                Wszelkie pytania, wnioski lub wątpliwości dotyczące ochrony prywatności możesz kierować bezpośrednio na wskazany adres e-mail.
              </p>
            </div>
          </article>

          {/* Section 2: Zbieranie danych */}
          <article className={cardClassName}>
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgb(139_115_85/0.10),transparent_65%)]" />
            
            <div className="relative z-10">
              <div className="mb-4 flex items-center justify-between border-b border-warm-gray/10 pb-3">
                <span className="font-mono text-xs uppercase tracking-widest text-khaki">
                  SEKCJA 02
                </span>
                <span className="font-mono text-[11px] text-warm-gray/60">
                  ZAKRES DANYCH
                </span>
              </div>

              <h2 className="font-bebas text-3xl uppercase tracking-wide text-warm-white sm:text-4xl">
                Jakie dane przetwarzamy i jak je pozyskujemy?
              </h2>

              <p className="mt-3 font-inter text-sm leading-relaxed text-warm-white/80 sm:text-base">
                Dane osobowe pozyskujemy bezpośrednio od Ciebie podczas kontaktu lub nawiązywania współpracy:
              </p>

              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-micro border border-warm-gray/10 bg-black-deep/50 p-4">
                  <span className="font-mono text-xs uppercase tracking-wider text-khaki">01 · Kontakt</span>
                  <p className="mt-1 font-inter text-xs text-warm-white/75">
                    Wiadomości e-mail, połączenia telefoniczne, WhatsApp, komunikatory social media (imię, numer, e-mail).
                  </p>
                </div>

                <div className="rounded-micro border border-warm-gray/10 bg-black-deep/50 p-4">
                  <span className="font-mono text-xs uppercase tracking-wider text-khaki">02 · Oferta & Wycena</span>
                  <p className="mt-1 font-inter text-xs text-warm-white/75">
                    Szczegóły planowanego projektu wideo/foto, lokalizacja, termin, budżet oraz preferencje realizacji.
                  </p>
                </div>

                <div className="rounded-micro border border-warm-gray/10 bg-black-deep/50 p-4">
                  <span className="font-mono text-xs uppercase tracking-wider text-khaki">03 · Umowa & Faktura</span>
                  <p className="mt-1 font-inter text-xs text-warm-white/75">
                    Dane niezbędne do zawarcia umowy oraz wystawienia rachunku lub faktury (w tym NIP, adres firmy/zamieszkania).
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-micro border border-warm-gray/10 bg-black-deep/50 p-4 font-inter text-xs leading-relaxed text-warm-white/75 sm:text-sm">
                <p>
                  Podanie danych na etapie zapytania jest dobrowolne, ale bez danych kontaktowych i informacji o projekcie możemy nie być w stanie odpowiedzieć ani przygotować wyceny. Dane wymagane do zawarcia i wykonania umowy oraz wystawienia dokumentu księgowego są niezbędne do współpracy; ich niepodanie może uniemożliwić zawarcie lub realizację umowy.
                </p>
              </div>
            </div>
          </article>

          {/* Section 3: Podstawy prawne */}
          <article className={cardClassName}>
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgb(139_115_85/0.10),transparent_65%)]" />
            
            <div className="relative z-10">
              <div className="mb-4 flex items-center justify-between border-b border-warm-gray/10 pb-3">
                <span className="font-mono text-xs uppercase tracking-widest text-khaki">
                  SEKCJA 03
                </span>
                <span className="font-mono text-[11px] text-warm-gray/60">
                  ART. 6 RODO
                </span>
              </div>

              <h2 className="font-bebas text-3xl uppercase tracking-wide text-warm-white sm:text-4xl">
                Cele i podstawy prawne przetwarzania danych
              </h2>

              <div className="mt-5 space-y-4">
                <div className="rounded-micro border-l-2 border-khaki bg-black-deep/60 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-bebas text-xl uppercase tracking-wide text-warm-white">
                      Obsługa zapytań i przygotowanie wyceny
                    </h3>
                    <span className="rounded-micro border border-khaki/40 bg-khaki/10 px-2 py-0.5 font-mono text-[11px] text-khaki">
                      Art. 6 ust. 1 lit. b oraz f RODO
                    </span>
                  </div>
                  <p className="mt-1.5 font-inter text-xs leading-relaxed text-warm-white/75 sm:text-sm">
                    Podjęcie działań na Twoje żądanie przed ewentualnym zawarciem umowy oraz prawnie uzasadniony interes Administratora polegający na sprawnej komunikacji z potencjalnymi klientami.
                  </p>
                </div>

                <div className="rounded-micro border-l-2 border-khaki bg-black-deep/60 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-bebas text-xl uppercase tracking-wide text-warm-white">
                      Realizacja umowy na produkcję wideo i fotografię
                    </h3>
                    <span className="rounded-micro border border-khaki/40 bg-khaki/10 px-2 py-0.5 font-mono text-[11px] text-khaki">
                      Art. 6 ust. 1 lit. b RODO
                    </span>
                  </div>
                  <p className="mt-1.5 font-inter text-xs leading-relaxed text-warm-white/75 sm:text-sm">
                    Niezbędność do wykonania umowy o świadczenie usług audiowizualnych, w tym organizacji planu zdjęciowego, montażu i przekazania gotowego materiału.
                  </p>
                </div>

                <div className="rounded-micro border-l-2 border-khaki bg-black-deep/60 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-bebas text-xl uppercase tracking-wide text-warm-white">
                      Wypełnienie obowiązków księgowo-podatkowych
                    </h3>
                    <span className="rounded-micro border border-khaki/40 bg-khaki/10 px-2 py-0.5 font-mono text-[11px] text-khaki">
                      Art. 6 ust. 1 lit. c RODO
                    </span>
                  </div>
                  <p className="mt-1.5 font-inter text-xs leading-relaxed text-warm-white/75 sm:text-sm">
                    Ciążący na Administratorze obowiązek prawny wynikający z przepisów ustawy o rachunkowości oraz ordynacji podatkowej (wystawianie faktur, ewidencja księgowa).
                  </p>
                </div>

                <div className="rounded-micro border-l-2 border-khaki bg-black-deep/60 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-bebas text-xl uppercase tracking-wide text-warm-white">
                      Obrona przed roszczeniami lub ich dochodzenie
                    </h3>
                    <span className="rounded-micro border border-khaki/40 bg-khaki/10 px-2 py-0.5 font-mono text-[11px] text-khaki">
                      Art. 6 ust. 1 lit. f RODO
                    </span>
                  </div>
                  <p className="mt-1.5 font-inter text-xs leading-relaxed text-warm-white/75 sm:text-sm">
                    Prawnie uzasadniony interes Administratora polegający na zabezpieczeniu dowodów wykonania zlecenia i ochronie interesu prawnego.
                  </p>
                </div>

                <div className="rounded-micro border-l-2 border-khaki bg-black-deep/60 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-bebas text-xl uppercase tracking-wide text-warm-white">
                      Publikacja wizerunku w portfolio i social mediach
                    </h3>
                    <span className="rounded-micro border border-khaki/40 bg-khaki/10 px-2 py-0.5 font-mono text-[11px] text-khaki">
                      Art. 6 ust. 1 lit. a RODO
                    </span>
                  </div>
                  <p className="mt-1.5 font-inter text-xs leading-relaxed text-warm-white/75 sm:text-sm">
                    Dobrowolna, wyraźna zgoda wyrażona w umowie lub osobnym oświadczeniu (z możliwością jej wycofania w dowolnym momencie).
                  </p>
                </div>
              </div>
            </div>
          </article>

          {/* Section 4 & 5: Odbiorcy i czas przechowywania */}
          <div className={`${styles.splitGrid} grid grid-cols-1 gap-8 md:grid-cols-2`}>
            {/* Odbiorcy */}
            <article className={compactCardClassName}>
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgb(139_115_85/0.08),transparent_65%)]" />
              
              <div className="relative z-10">
                <span className="font-mono text-xs uppercase tracking-widest text-khaki">
                  SEKCJA 04 · ODBIORCY
                </span>
                <h2 className="mt-2 font-bebas text-2xl uppercase tracking-wide text-warm-white sm:text-3xl">
                  Kto może otrzymać dane?
                </h2>
                <p className="mt-3 font-inter text-xs leading-relaxed text-warm-white/75 sm:text-sm">
                  Dane mogą otrzymywać podmioty wspierające Administratora oraz inni uprawnieni odbiorcy, wyłącznie w zakresie niezbędnym do danego celu:
                </p>
                <ul className="mt-4 space-y-2 font-inter text-xs text-warm-white/70 sm:text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-khaki">›</span>
                    <span>Dostawcy hostingu, poczty elektronicznej i usług IT — jako podmioty przetwarzające na podstawie umowy powierzenia, gdy jest ona wymagana</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-khaki">›</span>
                    <span>Biuro księgowe, banki, operatorzy płatności oraz doradcy prawni — zgodnie z zakresem świadczonych usług i ich rolą prawną</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-khaki">›</span>
                    <span>Google Ireland Ltd. (YouTube) oraz dostawcy wybranego przez Ciebie komunikatora lub serwisu społecznościowego</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-khaki">›</span>
                    <span>Uprawnione organy publiczne — wyłącznie wtedy, gdy obowiązek udostępnienia wynika z prawa</span>
                  </li>
                </ul>

                <p className="mt-4 font-inter text-xs leading-relaxed text-warm-white/70 sm:text-sm">
                  Niektórzy dostawcy technologiczni mogą przetwarzać dane poza Europejskim Obszarem Gospodarczym. W takim przypadku transfer odbywa się na podstawie mechanizmu dopuszczonego przez RODO, w szczególności decyzji stwierdzającej odpowiedni stopień ochrony albo standardowych klauzul umownych Komisji Europejskiej. Zakres transferu zależy od użytej usługi i wybranego kanału kontaktu.
                </p>
              </div>
            </article>

            {/* Czas przechowywania */}
            <article className={compactCardClassName}>
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgb(139_115_85/0.08),transparent_65%)]" />
              
              <div className="relative z-10">
                <span className="font-mono text-xs uppercase tracking-widest text-khaki">
                  SEKCJA 05 · RETENCJA
                </span>
                <h2 className="mt-2 font-bebas text-2xl uppercase tracking-wide text-warm-white sm:text-3xl">
                  Okres przechowywania
                </h2>
                <p className="mt-3 font-inter text-xs leading-relaxed text-warm-white/75 sm:text-sm">
                  Dane przechowujemy tylko tak długo, jak to niezbędne:
                </p>
                <ul className="mt-4 space-y-2 font-inter text-xs text-warm-white/70 sm:text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-khaki">›</span>
                    <span><strong>Zapytania ofertowe:</strong> do 12 miesięcy od zakończenia kontaktu</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-khaki">›</span>
                    <span><strong>Umowy i realizacja zleceń:</strong> przez czas wykonywania umowy, a następnie do upływu terminów przedawnienia roszczeń</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-khaki">›</span>
                    <span><strong>Dokumentacja podatkowa:</strong> co do zasady 5 lat od końca roku kalendarzowego, w którym upłynął termin płatności podatku; okres może ulec wydłużeniu w przypadkach przewidzianych prawem</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-khaki">›</span>
                    <span><strong>Portfolio:</strong> do czasu wycofania zgody lub wcześniejszego osiągnięcia celu przetwarzania</span>
                  </li>
                </ul>
              </div>
            </article>
          </div>

          {/* Section 6: Prawa użytkownika */}
          <article className={cardClassName}>
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgb(139_115_85/0.10),transparent_65%)]" />
            
            <div className="relative z-10">
              <div className="mb-4 flex items-center justify-between border-b border-warm-gray/10 pb-3">
                <span className="font-mono text-xs uppercase tracking-widest text-khaki">
                  SEKCJA 06
                </span>
                <span className="font-mono text-[11px] text-warm-gray/60">
                  TWOJE UPRAWNIENIA
                </span>
              </div>

              <h2 className="font-bebas text-3xl uppercase tracking-wide text-warm-white sm:text-4xl">
                Twoje prawa zgodnie z RODO
              </h2>

              <p className="mt-3 font-inter text-sm leading-relaxed text-warm-white/80 sm:text-base">
                W zależności od podstawy i okoliczności przetwarzania możesz skorzystać z praw przewidzianych w RODO:
              </p>

              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-micro border border-warm-gray/10 bg-black-deep/60 p-4">
                  <span className="font-bebas text-lg uppercase tracking-wide text-khaki">Prawo dostępu i kopii</span>
                  <p className="mt-1 font-inter text-xs text-warm-white/70">
                    Masz prawo uzyskać potwierdzenie, czy Twoje dane są przetwarzane, oraz otrzymać ich kompletną kopię.
                  </p>
                </div>

                <div className="rounded-micro border border-warm-gray/10 bg-black-deep/60 p-4">
                  <span className="font-bebas text-lg uppercase tracking-wide text-khaki">Prawo do sprostowania</span>
                  <p className="mt-1 font-inter text-xs text-warm-white/70">
                    Możesz żądać niezwłocznego poprawienia nieprawidłowych lub uzupełnienia niekompletnych danych.
                  </p>
                </div>

                <div className="rounded-micro border border-warm-gray/10 bg-black-deep/60 p-4">
                  <span className="font-bebas text-lg uppercase tracking-wide text-khaki">Prawo do usunięcia („bycia zapomnianym”)</span>
                  <p className="mt-1 font-inter text-xs text-warm-white/70">
                    Możesz wnioskować o usunięcie danych, o ile brak jest obowiązku prawnego ich dalszego przechowywania.
                  </p>
                </div>

                <div className="rounded-micro border border-warm-gray/10 bg-black-deep/60 p-4">
                  <span className="font-bebas text-lg uppercase tracking-wide text-khaki">Prawo do sprzeciwu</span>
                  <p className="mt-1 font-inter text-xs text-warm-white/70">
                    Możesz w dowolnym momencie wnieść sprzeciw wobec przetwarzania opartego na prawnie uzasadnionym interesie.
                  </p>
                </div>

                <div className="rounded-micro border border-warm-gray/10 bg-black-deep/60 p-4">
                  <span className="font-bebas text-lg uppercase tracking-wide text-khaki">Prawo do ograniczenia przetwarzania</span>
                  <p className="mt-1 font-inter text-xs text-warm-white/70">
                    W przypadkach wskazanych w RODO możesz żądać czasowego ograniczenia sposobu wykorzystywania danych.
                  </p>
                </div>

                <div className="rounded-micro border border-warm-gray/10 bg-black-deep/60 p-4">
                  <span className="font-bebas text-lg uppercase tracking-wide text-khaki">Prawo do przenoszenia danych</span>
                  <p className="mt-1 font-inter text-xs text-warm-white/70">
                    Gdy przetwarzanie odbywa się na podstawie zgody lub umowy i w sposób zautomatyzowany, możesz otrzymać przekazane dane w ustrukturyzowanym formacie.
                  </p>
                </div>

                <div className="rounded-micro border border-warm-gray/10 bg-black-deep/60 p-4 sm:col-span-2">
                  <span className="font-bebas text-lg uppercase tracking-wide text-khaki">Prawo do wycofania zgody</span>
                  <p className="mt-1 font-inter text-xs text-warm-white/70">
                    Zgodę możesz wycofać w dowolnym momencie. Nie wpływa to na zgodność z prawem przetwarzania dokonanego przed jej wycofaniem.
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-micro border border-warm-gray/10 bg-black-deep/40 p-4 font-inter text-xs text-warm-gray/80 sm:text-sm">
                <p>
                  Jeżeli uważasz, że Twoje dane są przetwarzane niezgodnie z prawem, przysługuje Ci prawo do wniesienia skargi do organu nadzorczego: <strong>Prezes Urzędu Ochrony Danych Osobowych (UODO)</strong>, ul. Stawki 2, 00-193 Warszawa.
                </p>
              </div>

              <div className="mt-3 rounded-micro border border-warm-gray/10 bg-black-deep/40 p-4 font-inter text-xs text-warm-gray/80 sm:text-sm">
                <p>
                  Administrator nie podejmuje wobec Ciebie decyzji opartych wyłącznie na zautomatyzowanym przetwarzaniu, które wywoływałyby skutki prawne lub w podobny sposób istotnie na Ciebie wpływały, i nie prowadzi profilowania w takim celu.
                </p>
              </div>
            </div>
          </article>

          {/* Section 7: Cookies i SessionStorage */}
          <article className={cardClassName}>
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgb(139_115_85/0.10),transparent_65%)]" />
            
            <div className="relative z-10">
              <div className="mb-4 flex items-center justify-between border-b border-warm-gray/10 pb-3">
                <span className="font-mono text-xs uppercase tracking-widest text-khaki">
                  SEKCJA 07
                </span>
                <span className="font-mono text-[11px] text-warm-gray/60">
                  TECHNOLOGIA
                </span>
              </div>

              <h2 className="font-bebas text-3xl uppercase tracking-wide text-warm-white sm:text-4xl">
                Pliki Cookies i technologie przeglądarki
              </h2>

              <p className="mt-3 font-inter text-sm leading-relaxed text-warm-white/80 sm:text-base">
                Serwis korzysta z poniższych technologii pamięci przeglądarki i integracji zewnętrznych:
              </p>

              <div className="mt-4 space-y-3 font-inter text-xs leading-relaxed text-warm-white/75 sm:text-sm">
                <div className="rounded-micro border border-warm-gray/10 bg-black-deep/50 p-4">
                  <div className="flex items-center gap-2 font-mono text-xs text-khaki">
                    <span className="rounded bg-khaki/15 px-1.5 py-0.5">sessionStorage</span>
                    <span>Pamięć sesyjna interfejsu</span>
                  </div>
                  <p className="mt-2 text-warm-white/70">
                    Służy wyłącznie do zapamiętania, czy podczas obecnej wizyty odtworzono animację powitalną (preloader). Pozwala to uniknąć uciążliwego ponownego ładowania animacji przy przechodzeniu między podstronami. Dane te znikają po zamknięciu karty przeglądarki.
                  </p>
                </div>

                <div className="rounded-micro border border-warm-gray/10 bg-black-deep/50 p-4">
                  <div className="flex items-center gap-2 font-mono text-xs text-khaki">
                    <span className="rounded bg-khaki/15 px-1.5 py-0.5">Multimedia</span>
                    <span>Osadzone wideo YouTube</span>
                  </div>
                  <p className="mt-2 text-warm-white/70">
                    Miniatury filmów są wyświetlane bez uruchamiania odtwarzacza. Dopiero po wybraniu przycisku odtwarzania przeglądarka nawiązuje połączenie z odtwarzaczem YouTube w trybie zwiększonej prywatności. Google może wtedy otrzymać informacje techniczne, w tym adres IP, dane urządzenia i informacje o odtworzeniu, oraz stosować własne identyfikatory zgodnie ze swoją polityką prywatności.
                  </p>
                </div>

                <div className="rounded-micro border border-warm-gray/10 bg-black-deep/50 p-4">
                  <div className="flex items-center gap-2 font-mono text-xs text-khaki">
                    <span className="rounded bg-khaki/15 px-1.5 py-0.5">Cookies</span>
                    <span>Brak własnych cookies analitycznych i marketingowych</span>
                  </div>
                  <p className="mt-2 text-warm-white/70">
                    Serwis nie zapisuje własnych cookies analitycznych ani marketingowych. Jeżeli zakres używanych technologii zostanie rozszerzony, informacja zostanie zaktualizowana, a tam, gdzie wymaga tego prawo, użytkownik otrzyma możliwość wyrażenia zgody przed ich uruchomieniem.
                  </p>
                </div>
              </div>
            </div>
          </article>

          {/* Section 8: Podsumowanie i CTA */}
          <div className={`${styles.ctaCard} rounded-micro border border-khaki/40 bg-gradient-to-br from-anthracite via-black-deep to-anthracite p-8 text-center sm:p-10`}>
            <h2 className="font-bebas text-3xl uppercase tracking-wide text-warm-white sm:text-4xl">
              Masz pytania dotyczące swoich danych?
            </h2>
            <p className="mx-auto mt-2 max-w-xl font-mono text-xs text-warm-gray sm:text-sm">
              Skontaktuj się bezpośrednio ze mną — chętnie odpowiem na wszelkie pytania dotyczące ochrony prywatności i realizacji projektów.
            </p>
            <div className={`${styles.ctaActions} mt-6 flex flex-wrap items-center justify-center gap-4`}>
              <a
                href={`mailto:${email}`}
                className={`${styles.ctaSecondary} inline-flex items-center justify-center rounded-micro border border-khaki/50 bg-transparent px-6 py-3 font-bebas text-lg uppercase tracking-wider text-khaki transition-all duration-300 hover:border-khaki hover:bg-khaki/10 hover:text-warm-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-khaki`}
              >
                Napisz wiadomość e-mail
              </a>
              <Link
                href="/contact"
                className={`${styles.ctaSecondary} inline-flex items-center justify-center rounded-micro border border-khaki/50 bg-transparent px-6 py-3 font-bebas text-lg uppercase tracking-wider text-khaki transition-all duration-300 hover:border-khaki hover:bg-khaki/10 hover:text-warm-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-khaki`}
              >
                Przejdź do kontaktu
              </Link>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
