# Raport: Analiza strony i 10 pomysłów na rozwój

**Data:** 2026-07-19
**Zakres:** Analiza całego repozytorium (kod, treści, dokumentacja) + rekomendacje rozwojowe

---

## 1. Stan obecny — podsumowanie analizy

### Czym jest strona

Portfolio fotografa i operatora wideo (Maleszyk Media) zbudowane w oparciu o:

- **Next.js 14 (App Router) + TypeScript** — SSG, optymalizacja obrazów, Metadata API
- **Tailwind CSS + CSS Modules** — spójny system stylowania
- **GSAP + ScrollTrigger + Lenis** — animacje scrollowe i smooth scroll klasy premium
- **Testy jednostkowe** (`node --test`), lint, typecheck, skrypt analizy bundla

Struktura stron: **strona główna** (Hero, O mnie, Promo, Oferta, Proces, Opinie, FAQ, CTA), **/oferta** (rozszerzona oferta) oraz **/contact** (strona "O mnie" z bio, wideo i kontaktem).

### Mocne strony

- Bardzo dopracowana warstwa wizualna: kinowa estetyka "HUD/SCENE", preloader, cinematic video player, animacje per-sekcja.
- Dobra higiena kodu: rozbite hooki animacji, testy, audyty w `docs/audits/`, standardy kodowania.
- Treści marketingowe są kompletne i przemyślane (FAQ z 9 pytaniami, proces w 4 krokach, opinie klientów).
- Podstawy SEO: metadata, OpenGraph, JSON-LD (`ProfessionalService`), lazy YouTube facade.

### Zidentyfikowane luki (podstawa dla pomysłów poniżej)

| # | Luka | Dowód w repo |
|---|------|--------------|
| 1 | Brak strony portfolio/galerii z filtrowaniem | cel w `docs/tech-spec.md` §2, komentarz w `app/page.tsx` ("Portfolio, Instagram — kolejne iteracje") |
| 2 | Brak formularza kontaktowego — tylko `mailto:`/`tel:` | `lib/site-content.ts` (cta, aboutMe.contact) |
| 3 | Dane kontaktowe to placeholdery (`+48 123 456 789`, `kontakt@example.com`, `example.com`) | `lib/site-content.ts:19,305,307,428-431`, `app/layout.tsx:28` |
| 4 | Brak `sitemap.ts`, `robots.ts`; favicon = pełnowymiarowy PNG hero | katalog `app/`, `app/layout.tsx:60-63` |
| 5 | Feed z Instagrama zaplanowany, nie wdrożony | `docs/integrations.md`, `docs/open-questions.md` Q-2 |
| 6 | Media (wideo) serwowane z `/public`, brak CDN | `public/videos/*`, otwarta kwestia Q-1 (Cloudinary vs Vercel Blob) |
| 7 | Brak analityki produkcyjnej (jest tylko opcjonalny WebVitalsReporter) | `components/analytics/WebVitalsReporter.tsx`, flaga env |
| 8 | Brak cennika / pakietów na stronie oferty | `components/pages/oferta/*` |
| 9 | Brak bloga / podstron realizacji (case studies) | `docs/tech-spec.md` — "poza zakresem v1" |
| 10 | Strona wyłącznie po polsku, mimo deklaracji projektów zagranicznych | `lib/site-content.ts` (aboutMe.profile.locationText), tech-spec §2 |

---

## 2. Dziesięć pomysłów na rozwój strony

### Pomysł 1 — Strona "Portfolio / Realizacje" z galerią i filtrowaniem

**Priorytet: wysoki · Nakład: średni**

Portfolio to serce strony fotografa, a obecnie jedyną prezentacją prac są 3 filmy YouTube w sekcji Promo. Nowa podstrona `/portfolio` z siatką realizacji (zdjęcia + wideo) i filtrowaniem po kategoriach (śluby, eventy, off-road, dron, promo) — cel zapisany w tech-spec od początku projektu. Estetykę "SCENE XX/XX" można naturalnie rozszerzyć na kafelki galerii (lightbox z animacją GSAP Flip).

**Efekt:** dłuższy czas na stronie, materiał dowodowy dla klienta przed kontaktem, więcej podstron do indeksacji.

### Pomysł 2 — Formularz kontaktowy z wyceną wstępną

**Priorytet: wysoki · Nakład: średni**

Obecnie kontakt wymaga wyjścia ze strony (mailto/tel/WhatsApp), co gubi część leadów. Formularz (Route Handler + np. Resend/Formspree) z polami: typ usługi (select z oferty), data wydarzenia, lokalizacja, budżet, wiadomość. To domyka obietnicę "Napisz — odpowiem w ciągu 24h" z sekcji CTA i daje mierzalny punkt konwersji. Warto dodać ochronę antyspamową (honeypot/Turnstile).

**Efekt:** wyższa konwersja, ustrukturyzowane zapytania (mniej dopytywania), dane do analityki.

### Pomysł 3 — Domknięcie fundamentów SEO (sitemap, robots, favikony, dane strukturalne)

**Priorytet: wysoki · Nakład: niski**

Szybkie wygrane w jednym pakiecie:

- `app/sitemap.ts` i `app/robots.ts` (natywne API Next.js),
- prawdziwy zestaw ikon (favicon.ico, apple-touch-icon) zamiast pełnowymiarowego `Hero_v4.png`,
- dedykowany obraz OG 1200×630 (obecnie hero),
- rozszerzenie JSON-LD: `FAQPage` (treści już są w `siteContent.faq`), `LocalBusiness` z realnym adresem/obszarem działania, `VideoObject` dla filmów promo,
- uzupełnienie realnej domeny w `SITE_URL` i danych kontaktowych (usunięcie placeholderów — patrz luka #3).

**Efekt:** lepsza indeksacja i wygląd w wynikach wyszukiwania (rich results dla FAQ) przy minimalnym koszcie.

### Pomysł 4 — Cennik / pakiety usług na stronie oferty

**Priorytet: wysoki · Nakład: niski–średni**

FAQ już broni ceny ("Dlaczego to tyle kosztuje?"), ale strona nie podaje żadnych widełek. Sekcja pakietów na `/oferta` (np. dla ślubów: Basic / Standard / Premium z zakresem — liczba operatorów, dron, teledysk, czas realizacji) plus ceny "od…". Nawet orientacyjne widełki filtrują niedopasowane zapytania i budują zaufanie.

**Efekt:** lepsza jakość leadów, mniej rozmów kończących się na cenie, sygnał profesjonalizmu.

### Pomysł 5 — Podstrony case studies pojedynczych realizacji

**Priorytet: średni · Nakład: średni**

Dla 3–5 najlepszych projektów osobne podstrony `/realizacje/[slug]`: historia zlecenia, wyzwania, film, kadry, opinia klienta (opinie już istnieją w `siteContent.testimonials` — można je połączyć z realizacjami). To długi ogon SEO ("film ślubny Lublin", "relacja z biegu OCR") i najlepszy materiał sprzedażowy — pokazuje proces, nie tylko efekt.

**Efekt:** ruch organiczny na frazy lokalne/niszowe, silniejszy social proof.

### Pomysł 6 — Integracja feedu z Instagramem

**Priorytet: średni · Nakład: średni**

Zaplanowana od początku (`docs/integrations.md`, otwarta kwestia Q-2). Sekcja na stronie głównej z ostatnimi postami z `@maleszyk.media` (Instagram Basic Display API lub prostszy wariant: statyczna rewalidacja co X godzin przez ISR). Strona "żyje" bez ręcznej aktualizacji treści i domyka lukę między statycznym portfolio a bieżącą aktywnością.

**Efekt:** świeżość treści, dowód aktywności, ruch między stroną a social mediami w obie strony.

### Pomysł 7 — Rezerwacja terminu online / kalendarz dostępności

**Priorytet: średni · Nakład: niski (integracja) lub średni (własne)**

Proces w 4 krokach zaczyna się od "Napisz do mnie" — można go skrócić: przycisk "Umów rozmowę" osadzający Calendly/Cal.com (15-minutowa konsultacja) + opcjonalnie prosty widok zajętych terminów w sezonie ślubnym. Tech-spec wykluczał to w v1, ale jako lekka integracja zewnętrzna nie wymaga budowy systemu.

**Efekt:** niższy próg pierwszego kontaktu, mniej pingpongu mailowego przy umawianiu.

### Pomysł 8 — Migracja mediów na CDN + optymalizacja wideo

**Priorytet: średni · Nakład: średni**

Wszystkie wideo (hero, promo-reel, usługi) leżą w `/public` i obciążają hosting oraz LCP. Rozstrzygnięcie otwartej kwestii Q-1 (Cloudinary vs Vercel Blob — przy dużej wadze wideo Cloudinary/Bunny wypada korzystniej), adaptacyjne strumieniowanie lub warianty rozdzielczości (mobile/desktop), poster images w AVIF. Repo ma już `perf:report` — warto dołożyć budżety wydajności (np. limit wagi strony głównej) do CI.

**Efekt:** szybsze ładowanie na mobile (główny ruch z social mediów!), niższe koszty transferu, lepsze Core Web Vitals → SEO.

### Pomysł 9 — Analityka konwersji i pomiar skuteczności

**Priorytet: wysoki · Nakład: niski**

Jest raportowanie Web Vitals za flagą, ale brak analityki zachowań. Wdrożenie lekkiego, bezcookiesowego narzędzia (Plausible/Umami — bez banera zgód) ze zdarzeniami na kluczowych akcjach: kliknięcia CTA, tel/WhatsApp, odtworzenia wideo, wysłanie formularza, scroll-depth sekcji. Bez tego nie da się ocenić, które z pozostałych pomysłów działają.

**Efekt:** decyzje rozwojowe oparte na danych; wiedza, skąd przychodzą klienci i gdzie odpadają.

### Pomysł 10 — Wersja angielska strony (i18n)

**Priorytet: niski–średni · Nakład: średni–wysoki**

Strona deklaruje realizacje zagraniczne ("większe projekty realizuję także za granicą"), ale jest wyłącznie po polsku. Architektura już sprzyja tłumaczeniu — praktycznie wszystkie teksty są scentralizowane w `lib/site-content.ts`. Wdrożenie `next-intl` z routingiem `/en`, `hreflang` w metadata i przetłumaczenie kluczowych stron (home, oferta, kontakt). Do rozważenia po domknięciu pomysłów 1–4.

**Efekt:** dostępność dla klientów zagranicznych (eventy, marki), szerszy rynek na usługi dronowe/promo.

---

## 3. Proponowana kolejność wdrożenia

| Etap | Pomysły | Uzasadnienie |
|------|---------|--------------|
| 1. Fundamenty (1–2 tyg.) | #3 SEO, #9 analityka, realne dane kontaktowe | Niski koszt, warunek mierzenia reszty |
| 2. Konwersja (2–4 tyg.) | #2 formularz, #4 cennik, #7 rezerwacja | Bezpośredni wpływ na pozyskiwanie klientów |
| 3. Treść i zasięg (1–2 mies.) | #1 portfolio, #5 case studies, #6 Instagram | Budowa ruchu organicznego i social proof |
| 4. Skala (później) | #8 CDN wideo, #10 wersja EN | Optymalizacja i ekspansja po ustabilizowaniu treści |

> **Uwaga:** przed publikacją którejkolwiek zmiany warto w pierwszej kolejności podmienić placeholderowe dane (telefon `+48 123 456 789`, `kontakt@example.com`, domena `example.com`) na prawdziwe — obecnie część CTA prowadzi donikąd.
