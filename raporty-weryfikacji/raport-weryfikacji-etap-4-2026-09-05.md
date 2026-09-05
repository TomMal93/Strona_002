# Raport weryfikacji przedwdrożeniowej — etap 4

**Projekt:** Strona_002

**Etap:** Wydajność, SEO, analityka i wymagania prawne

**Data wykonania:** 2026-09-05

**Gałąź i commit weryfikowanej implementacji CSP:** `main`, `f67dc1a`
**Wynik:** **FAIL / BRAK ZGODY NA ROZPOCZĘCIE ETAPU 5**

## Podsumowanie wykonawcze

Projekt buduje się produkcyjnie, testy techniczne przechodzą, odpowiedź dla nieistniejącej trasy ma prawidłowy status `404`, a robots, canonicale, Open Graph, Twitter Card, nagłówki, atrybuty `alt` i JSON-LD mają dobre podstawy. Po wdrożeniu CSP z nonce strony aplikacji są renderowane dynamicznie, ponieważ nonce jest unikalny dla każdego żądania.

Etapu 4 nie można jednak zamknąć pozytywnie. Blokery przedwdrożeniowe to:

1. mediana Lighthouse Performance Mobile wynosi 78 i nie spełnia celu ≥ 90; głównym problemem jest LCP 5,50 s dla mobilnego wideo Hero;
2. produkcja kieruje canonicale, sitemapę, JSON-LD i obrazy OG do `https://maleszykmedia.pl`, ale domena zostanie uruchomiona dopiero po zakończeniu testów;
3. polityka prywatności nie zawiera adresu, NIP ani REGON administratora — zadanie zapisano w TODO;
4. odczyt konsoli przeglądarki pod kątem naruszeń CSP nadal wymaga dostępnej sesji przeglądarki;
5. narzędzie `perf:bundle` nie ma zdefiniowanego progu pass/fail, a wspólny JS obecny w HTML tras wynosi około 217,8 kB gzip.

W ramach działań po pierwszym przebiegu poprawiono opisy SEO, dodano `theme-color`, daty `lastmod`, cache obrazu OG i ikon, skrócono preloader do około 1 s oraz wdrożono CSP z nonce. Ponowny skan Mozilla Observatory osiągnął **A+ (120 punktów, 12/12 testów PASS)**. Udokumentowano także decyzję o pozostaniu wyłącznie przy Vercel Speed Insights.

## 1. Metoda i ograniczenia

Wykonano:

- `npm run check` — typecheck, ESLint i 7 testów Node;
- produkcyjny build Next.js 16.3.4 przez Webpack;
- `npm run perf:bundle` i analizę skryptów faktycznie wskazanych w HTML każdej trasy;
- uruchomienie lokalnego serwera produkcyjnego i test odpowiedzi HTTP;
- test publicznego wdrożenia `https://strona-002.vercel.app/` przez HTTP/2;
- ponowny skan Mozilla Observatory po wdrożeniu CSP z nonce;
- serię pomiarów TTFB tras dynamicznych i zasobu statycznego, także na współdzielonym połączeniu HTTP/2;
- analizę wyrenderowanego HTML pięciu tras;
- kontrolę metadanych, canonicali, Open Graph, Twitter Card, nagłówków `h1–h6`, obrazów i JSON-LD;
- kontrolę robots, sitemap, 404, cache, CSP i pozostałych nagłówków bezpieczeństwa;
- przegląd konfiguracji Speed Insights, GA4/GTM, preloadera, polityki prywatności i odnośników prawnych.

Nie wykonano:

- pomiaru terenowego INP ani testu Fast/Slow 3G;
- testów Facebook Sharing Debugger, LinkedIn Post Inspector i X Card Validator;
- Google Rich Results Test;
- SecurityHeaders.com — serwis zwrócił wyzwanie Cloudflare zamiast raportu;
- potwierdzenia metryk w panelu Vercel — brak dostępu do projektu.

Oficjalne API Google PageSpeed Insights zostało wywołane dla Mobile i Desktop, ale dla obu profili zwróciło HTTP 429 `RESOURCE_EXHAUSTED` (brak dostępnego dziennego limitu API). Pomiary laboratoryjne wykonano następnie lokalnym Lighthouse 13.0.1 i Chrome for Testing 149.0.7827.55. Mozilla Observatory wykonało skan poprawnie.

Wartości nieweryfikowalnych pozycji oznaczono jako `NOT TESTED`, a nie jako PASS.

Domyślny `next build` zatrzymał się po kompilacji na wewnętrznym wywołaniu TypeScript (`Could not parse output from TypeScript's --showConfig`). Samodzielny `tsc --showConfig` i `npm run typecheck` działały poprawnie. Build produkcyjny zakończył się powodzeniem przez Webpack po tymczasowym przełączeniu Next na API TypeScript (`experimental.useTypeScriptCli: false`). Zmianę wycofano natychmiast po buildzie; nie pozostała w kodzie.

## 2. Lighthouse, Core Web Vitals i wolna sieć

2026-09-05 wykonano po trzy sekwencyjne przebiegi strony głównej `https://strona-002.vercel.app/` dla każdego profilu. Lighthouse 13.0.1 korzystał z Chrome for Testing 149.0.7827.55 i symulowanego throttlingu. Mobile: viewport 412×823, RTT 150 ms, 1638,4 Kb/s i spowolnienie CPU ×4. Desktop: viewport 1350×940, RTT 40 ms i 10240 Kb/s.

| Profil / przebieg | Performance | Accessibility | Best Practices | SEO |
|---|---:|---:|---:|---:|
| Mobile 1 | 75 | 96 | 100 | 100 |
| Mobile 2 | 78 | 96 | 100 | 100 |
| Mobile 3 | 79 | 96 | 100 | 100 |
| **Mobile — mediana** | **78** | **96** | **100** | **100** |
| Desktop 1 | 96 | 96 | 100 | 100 |
| Desktop 2 | 98 | 96 | 100 | 100 |
| Desktop 3 | 98 | 96 | 100 | 100 |
| **Desktop — mediana** | **98** | **96** | **100** | **100** |

| Profil / mediana | FCP | LCP | Speed Index | TBT | CLS | Czas odpowiedzi serwera |
|---|---:|---:|---:|---:|---:|---:|
| Mobile | 1,26 s | **5,50 s** | 3,77 s | 47 ms | 0 | 51 ms |
| Desktop | 0,32 s | **1,07 s** | 1,13 s | 0 ms | 0,015 | 48 ms |

| Kryterium | Cel | Mediana | Status |
|---|---:|---:|---|
| Performance Mobile | ≥ 90 | 78 | **FAIL** |
| Accessibility Mobile/Desktop | ≥ 85 | 96 / 96 | PASS |
| SEO Mobile/Desktop | ≥ 90 | 100 / 100 | PASS |
| Performance Desktop | ≥ 90 | 98 | PASS |
| LCP Mobile / Desktop | ≤ 2,5 s | 5,50 s / 1,07 s | **FAIL / PASS** |
| CLS Mobile / Desktop | ≤ 0,1 | 0 / 0,015 | PASS / PASS |
| INP | ≤ 200 ms | brak danych terenowych | NOT TESTED |
| Fast/Slow 3G | brak zawieszenia i blokowania First Paint | brak osobnego pomiaru | NOT TESTED |

Mobile przegrywa przede wszystkim przez element LCP: `<video>` w Hero z `preload="none"`. Lighthouse wskazał, że zasób LCP nie jest odkrywany w początkowym HTML i nie ma `fetchpriority="high"`; LCP pozostawał stabilny w trzech próbach (5,46–5,51 s). Dalsze możliwości to responsywne wersje posterów obrazów (szacowana oszczędność 206 KiB), ograniczenie nieużywanego CSS/JS i skrócenie łańcuchów żądań krytycznych.

Accessibility 96 wynika z dwóch powtarzalnych problemów: `aria-label` na dwóch elementach `<div>` bez odpowiedniej roli w CTA oraz niezgodności widocznej etykiety logo „MALESZYK.MEDIA” z nazwą dostępną „Strona główna”. INP nie jest metryką laboratoryjną Lighthouse; przed odbiorem należy potwierdzić go danymi terenowymi z Vercel Speed Insights.

### Preloader i fonty

- `usePreloaderGate` wymusza `MIN_VISIBLE_MS = 600`.
- Wszystkie elementy animacji wyjścia są uruchamiane równolegle, a najdłuższy tween trwa 400 ms. Budżet blokującej sekwencji wynosi około **1,0 s**.
- Powracający użytkownik w tej samej sesji pomija intro dzięki `sessionStorage`.
- Przy `prefers-reduced-motion` wyjście następuje bez animacji po otwarciu gate.
- Treść jest prerenderowana w HTML, więc bot nie musi czekać na JavaScript, ale użytkownik nadal widzi blokującą nakładkę.
- W wygenerowanym CSS potwierdzono `font-display: swap` dla Bebas Neue, Inter i IBM Plex Mono.
- Wideo poniżej fold korzysta z lazy source, a materiały zostały odchudzone w etapie 3, lecz zachowania na ograniczonej sieci nie udało się zmierzyć.

**Status implementacji:** PASS — preloader skrócono do ustalonej 1 s. Lighthouse potwierdza stabilny CLS i niski TBT, ale mobilny LCP wymaga poprawy.

## 3. JavaScript i budżet pakietu

`npm run perf:bundle` zakończył się kodem 0:

| Wielkość | Wynik |
|---|---:|
| Wszystkie chunki JS raw | 1266,6 kB |
| Wszystkie chunki JS gzip | 392,9 kB |
| Największy chunk gzip | 64,1 kB |
| Wspólne skrypty obecne w HTML każdej trasy | ok. 217,8 kB gzip |

Szacowany koszt skryptów wskazanych w HTML (suma gzip plików; bez uwzględnienia cache między trasami):

| Trasa | Skrypty | JS gzip |
|---|---:|---:|
| `/` | 16 | 258,8 kB |
| `/contact` | 15 | 236,1 kB |
| `/o-mnie` | 15 | 243,4 kB |
| `/oferta` | 15 | 235,2 kB |
| `/polityka-prywatnosci` | 13 | 218,2 kB |

Skrypt `scripts/analyze-bundle.mjs` wyłącznie drukuje rozmiary — nie definiuje ani nie egzekwuje budżetu. Nie można więc uznać kryterium „budżet nieprzekroczony” za automatycznie zaliczone. Wartość wspólna przekracza cel `< 75 kB` przyjęty w audycie 007.

**Status:** FAIL — zdefiniować mierzalny budżet CI i ograniczyć globalny JS (szczególnie Lenis, GSAP, navbar, preloader i Speed Insights ładowane z layoutu).

## 4. SEO On-Page

| Trasa | Title | Opis (znaki) | Canonical | H1 | Hierarchia | OG/Twitter |
|---|---|---:|---|---:|---|---|
| `/` | `Portfolio Fotograficzno-Wideo \| Maleszyk Media` | 142 | `https://maleszykmedia.pl` | 1 | bez przeskoków | kompletne, lecz URL odroczony |
| `/contact` | `Kontakt \| Maleszyk Media` | 154 | `https://maleszykmedia.pl/contact` | 1 | bez przeskoków | kompletne, lecz URL odroczony |
| `/o-mnie` | `O mnie \| Maleszyk Media` | 143 | `https://maleszykmedia.pl/o-mnie` | 1 | bez przeskoków | kompletne, lecz URL odroczony |
| `/oferta` | `Oferta filmowa \| Maleszyk Media` | 148 | `https://maleszykmedia.pl/oferta` | 1 | bez przeskoków | kompletne, lecz URL odroczony |
| `/polityka-prywatnosci` | `Polityka prywatności i RODO \| Maleszyk Media` | 145 | `https://maleszykmedia.pl/polityka-prywatnosci` | 1 | bez przeskoków | kompletne, lecz URL odroczony |

Wszystkie tytuły są unikalne i mają wymagany format marki. Wszystkie opisy są unikalne i mieszczą się w przyjętym zakresie 140–160 znaków.

Na wszystkich trasach:

- `robots` ma `index, follow`;
- `og:title`, `og:description`, bezwzględny `og:image` i `twitter:card=summary_large_image` są obecne;
- `og:image` wskazuje `https://maleszykmedia.pl/og-image.jpg`;
- brak obrazów `<img>` bez atrybutu `alt` w HTML SSR (puste `alt` są używane dla elementów dekoracyjnych);
- dokładnie jeden `<h1>` i brak przeskoku poziomu nagłówków.

### Open Graph, favicony i theme color

- `public/og-image.jpg`: PASS — 1200×630 px, JPEG, 33 470 B, poniżej 300 kB.
- `favicon.ico`: PASS — istnieje i zawiera warianty ikon.
- `apple-touch-icon.png`: PASS — 180×180 px.
- Podglądy Facebook/LinkedIn/X w oficjalnych UI: NOT TESTED — brak sterowalnej przeglądarki.
- Funkcjonalność OG na produkcji: **FAIL** — bezpośredni `/og-image.jpg` na Vercel zwraca 200, ale metadane wskazują nierozwiązującą się domenę `maleszykmedia.pl`, więc bot społecznościowy nie pobierze miniatury.
- `theme-color`: PASS — `#0a0a0a` na wszystkich pięciu trasach.
- Cache `og-image.jpg`, favicony i Apple Touch Icon: PASS — `public, max-age=2592000, stale-while-revalidate=86400`.

## 5. Robots, sitemap, 404 i dane strukturalne

### Robots i sitemap

- `/robots.txt` zwraca 200, `User-Agent: *`, `Allow: /`, `Host: https://maleszykmedia.pl` i adres sitemap w tej samej domenie.
- `/sitemap.xml` zwraca 200 i obejmuje `/`, `/oferta`, `/o-mnie`, `/contact`, `/polityka-prywatnosci`.
- Wszystkie adresy używają HTTPS.
- **FAIL:** host robots, adresy sitemap, canonicale, `og:url`, `og:image` i URL-e JSON-LD wskazują `maleszykmedia.pl`, która w czasie audytu zwracała błąd DNS `Could not resolve host`. Działający adres `strona-002.vercel.app` nie jest wskazany jako źródło kanoniczne.
- Wpisy sitemap zawierają 5 dat `lastmod`, kontrolowanych zmienną `SITE_LAST_MODIFIED` — PASS.

### 404

`HEAD /nieistnieje-test-etap-4` zwrócił:

```text
HTTP/1.1 404 Not Found
Cache-Control: private, no-cache, no-store, max-age=0, must-revalidate
```

**Status:** PASS — brak Soft 404 w lokalnym serwerze produkcyjnym.

### JSON-LD

| Trasa | Liczba bloków | Typy | Parsowanie JSON |
|---|---:|---|---|
| `/` | 1 | WebSite, Organization, Person, ImageObject, WebPage | PASS |
| `/contact` | 1 | ContactPage, BreadcrumbList | PASS |
| `/o-mnie` | 1 | AboutPage, BreadcrumbList | PASS |
| `/oferta` | 1 | CollectionPage, BreadcrumbList | PASS |
| `/polityka-prywatnosci` | 1 | WebPage, BreadcrumbList | PASS |

Testy jednostkowe `structured-data` przechodzą, a wszystkie bloki z HTML dają się sparsować jako JSON. Oficjalny Google Rich Results Test pozostaje `NOT TESTED`; poprawność składniowa nie jest równoznaczna z kwalifikacją do rich result.

## 6. Analityka

### Vercel Speed Insights

- `@vercel/speed-insights` 2.0.0 jest zależnością produkcyjną.
- `<SpeedInsights />` jest osadzony globalnie w `app/layout.tsx`.
- produkcyjny `/_vercel/speed-insights/script.js` zwraca HTTP 200 i ma cache `public, max-age=2678400`;
- wygenerowany klient ładuje `/_vercel/speed-insights/script.js` i nie znaleziono w jego kodzie zapisu `document.cookie` ani trwałego identyfikatora użytkownika;
- lokalna CSP ogranicza `connect-src` do `'self'` i `https://vitals.vercel-insights.com`;
- widoczność LCP/INP/CLS w panelu Vercel: NOT TESTED — brak dostępu do panelu i brak aktywnej domeny.

### GA4 / GTM

- brak zależności, identyfikatorów, skryptów i domen GA4/GTM w kodzie;
- nie ma Consent Mode v2 ani banera cookies;
- przy obecnym zakresie aplikacji nie wykryto własnych cookies analitycznych lub marketingowych;
- polityka opisuje `sessionStorage`, Speed Insights oraz YouTube w trybie `youtube-nocookie.com`;
- decyzja biznesowa została udokumentowana: projekt pozostaje wyłącznie przy Vercel Speed Insights, bez GA4/GTM.

**Status:** PASS dla obecnego wariantu bez GA4/GTM. Jeżeli decyzja zostanie zmieniona, przed uruchomieniem należy wdrożyć Consent Mode v2, mechanizm zgody, domeny CSP i zaktualizować politykę.

## 7. Cache i nagłówki bezpieczeństwa

### Cache-Control na publicznym wdrożeniu Vercel

| Zasób | Oczekiwane | Otrzymane | Status |
|---|---|---|---|
| `/_next/static/chunks/*.js` | `max-age=31536000, immutable` | `public, max-age=31536000, immutable` | PASS |
| `/images/Hero.webp` | `max-age=2592000, stale-while-revalidate=86400` | zgodne | PASS |
| `/videos/promo-reel.webm` | `max-age=2592000, stale-while-revalidate=86400` | zgodne | PASS |
| `/og-image.jpg` | `max-age=2592000, stale-while-revalidate=86400` | zgodne lokalnie po poprawce; wdrożenie oczekuje publikacji | PASS implementacji |

Po wdrożeniu mechanizmu nonce HTML jest renderowany dynamicznie i zwraca `private, no-cache, no-store, max-age=0, must-revalidate` wraz z `x-vercel-cache: MISS`. Zasoby statyczne pozostają cache'owane; kontrolny `/images/logo.jpg` zwrócił `x-vercel-cache: HIT` i `public, max-age=2592000, stale-while-revalidate=86400`.

Na współdzielonym połączeniu HTTP/2 mediana TTFB strony głównej wyniosła **303 ms**, a kontrolnego zasobu statycznego **36 ms**. Różnica około **267 ms** pokazuje narzut renderowania dynamicznego i obsługi żądania po stronie aplikacji. W osobnych połączeniach mediany TTFB pięciu tras HTML mieściły się w zakresie **387–498 ms**. Pierwsze żądanie strony głównej osiągnęło **1,89 s** i było pojedynczym wynikiem odstającym, zgodnym z możliwym zimnym startem lub uruchomieniem nowego wdrożenia. Typowy TTFB jest akceptowalny, ale dynamiczne renderowanie jest zauważalnie wolniejsze od odpowiedzi z cache CDN.

### CSP i pozostałe nagłówki

Na publicznym wdrożeniu obecne są:

- `X-Content-Type-Options: nosniff`;
- `X-Frame-Options: DENY`;
- `Referrer-Policy: strict-origin-when-cross-origin`;
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`;
- `frame-ancestors 'none'`, `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`;
- `frame-src https://www.youtube-nocookie.com` — zgodne z embedami;
- `img-src` dopuszcza wyłącznie zasoby własne, `data:`, `blob:` i `https://img.youtube.com`, a `media-src` zasoby własne, `data:` i `blob:`.

Vercel dodaje prawidłowy nagłówek `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`, mimo że nie jest on zdefiniowany w `next.config.mjs`. Żądanie HTTP zwraca `308 Permanent Redirect` do HTTPS. Przekierowanie HTTP → HTTPS i HSTS są zaliczone.

Historyczny skan Mozilla Observatory `119015166`, wykonany przed wdrożeniem poprawki CSP, uzyskał **B+ (80/100, 11/12 PASS)**. Jedynym niezaliczonym testem była Content Security Policy.

Ponowny [skan Mozilla Observatory `119083516`](https://developer.mozilla.org/en-US/observatory/analyze?host=strona-002.vercel.app), wykonany 2026-09-05 po wdrożeniu poprawki:

| Wynik | Wartość |
|---|---:|
| Ocena | **A+** |
| Punkty | **120** |
| Testy | **12/12 PASS** |
| Testy niezaliczone | **0** |

Problemy zarejestrowane na publicznym wdrożeniu przed poprawką:

- `connect-src 'self' https:` dopuszcza dowolny endpoint HTTPS zamiast minimalnej listy;
- `script-src` i `style-src` zawierają `'unsafe-inline'`; Observatory odjęło 20 punktów za CSP `csp-implemented-with-unsafe-inline`.

Wdrożona poprawka generuje osobny kryptograficzny nonce dla każdego żądania i przekazuje go do skryptów Next.js, boot skryptu preloadera oraz JSON-LD. Produkcyjna dyrektywa `script-src` nie zawiera `'unsafe-inline'`, a `connect-src` dopuszcza wyłącznie `'self'` i `https://vitals.vercel-insights.com`. `style-src` akceptuje tylko arkusze własne i bloki z nonce; `'unsafe-inline'` pozostaje wyłącznie w wąskiej dyrektywie `style-src-attr`, wymaganej przez dynamiczne style animacji. Kontrola produkcyjnego HTML potwierdziła nonce w nagłówku CSP oraz ten sam nonce we wszystkich 18 tagach `<script>`; nie wykryto skryptów bez nonce ani z inną wartością.

SecurityHeaders.com: NOT TESTED z powodu ochrony Cloudflare. Mozilla Observatory i statyczna kontrola produkcyjnego HTML: PASS. Odczyt konsoli runtime pozostaje **NOT TESTED**, ponieważ podczas weryfikacji nie była dostępna sesja przeglądarki; nie należy utożsamiać kontroli HTML z potwierdzeniem braku komunikatów CSP w konsoli.

## 8. Polityka prywatności i RODO

Pozytywne elementy:

- administrator ma ustawioną nazwę `Maleszyk.Media — Przemysław Maleszyk`;
- podano e-mail i telefon;
- opisano cele i podstawy przetwarzania, odbiorców, okresy retencji, prawa osoby, UODO, brak profilowania, sessionStorage, Speed Insights i YouTube;
- stopka na każdej trasie zawiera odnośnik do polityki prywatności;
- nie znaleziono placeholdera administratora w aktywnych plikach środowiskowych.

Braki blokujące kryterium etapu:

- kod i pliki env obsługują adres, NIP oraz REGON, ale ich wartości pozostają puste do czasu przekazania oficjalnych danych;
- e-mail do spraw ochrony danych jest podłączony przez `PRIVACY_CONTACT_EMAIL` i tymczasowo używa `kontakt@maleszyk.media`;
- dokument pokazuje datę z `PRIVACY_POLICY_UPDATED_AT` (`2026-09-05`);
- dane firmy powinny zostać zatwierdzone przez klienta i — z uwagi na charakter prawny — przez osobę odpowiedzialną za zgodność prawną.

**Status:** FAIL.

## 9. Checklista akceptacyjna

- [ ] Lighthouse: Desktop spełnia cele (Performance 98, Accessibility 96, SEO 100), lecz Mobile Performance ma medianę 78 przy celu ≥ 90 — FAIL.
- [ ] `robots.txt` i `sitemap.xml` działają i używają HTTPS, ale wskazują domenę bez DNS — FAIL.
- [x] Sitemap zawiera daty ostatniej modyfikacji — PASS po poprawce.
- [x] Każda podstrona ma title, opis 140–160 znaków i deklarację OG image; działanie docelowego URL OG pozostaje odroczone z domeną.
- [ ] Debuggery Facebook/LinkedIn/X — UI NOT TESTED; pobranie OG z adresu w metadanych FAIL przez DNS.
- [x] Favicona i Apple Touch Icon są poprawnymi zasobami.
- [x] `theme-color: #0a0a0a` — PASS.
- [x] Nieistniejąca trasa zwraca rzeczywiste 404.
- [x] JSON-LD jest poprawnym JSON i ma oczekiwane typy.
- [ ] Google Rich Results Test — NOT TESTED.
- [x] Dokładnie jeden H1 na każdej trasie, bez przeskoków hierarchii.
- [x] Wszystkie obrazy SSR mają atrybut `alt`.
- [ ] Speed Insights raportuje w panelu Vercel — komponent PASS, panel NOT TESTED.
- [x] Cache JS/CSS, obrazów i wideo jest zgodny na publicznym wdrożeniu.
- [x] HSTS i produkcyjna CSP — PASS; Mozilla Observatory **A+**, 120 punktów, 12/12 testów PASS.
- [ ] Brak naruszeń CSP w konsoli przeglądarki — NOT TESTED z powodu braku dostępnej sesji przeglądarki; zgodność nonce w HTML PASS.
- [x] Decyzja klienta w sprawie GA4/GTM — tylko Vercel Speed Insights, bez GA4/GTM.
- [ ] Polityka zawiera zatwierdzone dane firmy: adres, NIP, REGON — FAIL.
- [ ] Strona działa poprawnie na Fast 3G — NOT TESTED; preloader skrócony do około 1 s.

## 10. Lista działań przed ponownym odbiorem etapu 4

### P0 — blokery formalne i bezpieczeństwa

1. Uzupełnić i zatwierdzić w polityce: pełną nazwę podmiotu, adres, NIP, REGON i kontakt ds. danych.
2. Po zakończeniu testów podłączyć i uruchomić DNS/TLS dla `maleszykmedia.pl`. Canonicale, robots, sitemap, JSON-LD i OG muszą wtedy wskazywać działający host.
3. Sprawdzić konsolę dostępnej przeglądarki pod kątem naruszeń CSP. Wdrożenie CSP, skan Observatory A+ i pomiary wpływu dynamicznego renderowania na TTFB są zakończone.

### P1 — SEO i wydajność

1. Poprawić mobilny element LCP w Hero: zapewnić wczesne odkrywanie zasobu/postera, właściwy priorytet pobierania i zweryfikować zasadność `preload="none"` dla elementu above the fold.
2. Dodać egzekwowany budżet `perf:bundle` i stopniowo zmniejszać globalny JS.
3. Poprawić dwa błędy dostępności wskazane przez Lighthouse: etykiety grup CTA i nazwę dostępną linku-logo.

### P2 — odbiór na publicznym URL

1. Po optymalizacji Hero powtórzyć po 3–5 pomiarów Lighthouse i potwierdzić Mobile Performance ≥ 90 oraz LCP ≤ 2,5 s.
2. Wykonać Fast/Slow 3G, pierwszą i kolejną wizytę, reduced motion oraz Save-Data.
3. Zweryfikować Google Rich Results, Facebook, LinkedIn i X.
4. Powtórzyć SecurityHeaders.com; Mozilla Observatory po zmianie CSP osiągnęło A+, a realne nagłówki CDN są potwierdzone.
5. Potwierdzić dane LCP/INP/CLS w Vercel Speed Insights po zebraniu ruchu.

## Decyzja

**Brak zgody na rozpoczęcie procedury wdrożeniowej (Etap 5).**

Po usunięciu braków P0/P1 i wykonaniu pomiarów na działającym publicznym URL należy powtórzyć etap 4. Aktualny build jest technicznie stabilny, lecz kryteria wydajnościowe, bezpieczeństwa produkcyjnego i kompletności prawnej nie mają jeszcze wymaganych dowodów albo są niespełnione.
