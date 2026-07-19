# Audyt 007 — Analiza kodu strony (2026-07-19)

Pełny przegląd kodu repozytorium Strona_002 (Next.js 14, App Router, TypeScript, Tailwind, GSAP + Lenis).
Zakres: architektura, jakość kodu, wydajność, SEO, dostępność, bezpieczeństwo, zasoby statyczne.

## 1. Wyniki weryfikacji automatycznej

| Kontrola | Wynik |
| --- | --- |
| `npm run typecheck` (tsc, strict) | ✅ 0 błędów |
| `npm run lint` (ESLint + jsx-a11y + tailwindcss) | ✅ 0 ostrzeżeń |
| `npm test` (node:test) | ✅ 9/9 testów przechodzi |
| `npm run build` (produkcyjny) | ✅ 6/6 stron statycznych |

Rozmiary bundle (First Load JS): strona główna **134 kB**, `/contact` **119 kB**, `/oferta` **159 kB**, shared **87.5 kB**. To dobre wartości jak na stronę z GSAP i Lenis.

## 2. Ocena ogólna

**Ocena: dobra (4/5).** Kod jest spójny, dobrze zorganizowany i przechodzi wszystkie kontrole. Widać dbałość o wydajność (lazy loading wideo, fasada YouTube, cache headers, `next/font`) i dostępność (aria-atrybuty, `prefers-reduced-motion` respektowane w 21 plikach, `sr-only` h1, `focus-visible`). Główne ryzyka to: placeholderowe dane kontaktowe w domyślnej konfiguracji, błędny `type="video/mp4"` przy plikach `.webm`, ciężkie zasoby graficzne używane jako favicon/OG oraz braki SEO (sitemap, robots.txt).

## 3. Mocne strony

- **Architektura**: czytelny podział `app/` → `components/sections|pages|layout|ui` → `lib/`. Każda sekcja ma wydzielony hook animacji (`useXxxAnimations`) i CSS Module — łatwo znaleźć odpowiedzialny kod.
- **Centralizacja treści**: cała treść strony w `lib/site-content.ts` z możliwością nadpisania przez zmienne środowiskowe (`|| fallback` zamiast `??` — świadoma decyzja, skomentowana).
- **Wydajność**:
  - lazy loading wideo przez `IntersectionObserver` (`useLazyVideoSource`, rootMargin 400px),
  - fasada YouTube (`YouTubeFacade`) — iframe montowany dopiero po kliknięciu, domena `youtube-nocookie.com`,
  - nagłówki cache (immutable dla `/_next/static`, 30 dni + SWR dla obrazów), AVIF/WebP w `next/image`,
  - preloader z gate'em (fonty + hero asset + window.load, limit 6 s, minimum 1,1 s) i pomijaniem dla powracających w sesji (`sessionStorage` + synchroniczny skrypt w `<head>` przeciw FOUC),
  - reporter Web Vitals za flagą środowiskową.
- **Bezpieczeństwo**: CSP, `X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`, `poweredByHeader: false`, escapowanie `</` w JSON-LD.
- **Dostępność**: aria-labels na kontrolkach wideo i nawigacji, `aria-expanded`/`aria-controls` na hamburgerze, `aria-current` na aktywnym linku, Escape zamyka menu mobilne, animacje wyłączane przy `prefers-reduced-motion`.
- **Higiena**: TypeScript strict, ESLint z pluginami a11y i Tailwind, skrypt `check` łączący typecheck+lint+test, dokumentacja w `docs/` (ADR, audyty, standardy).

## 4. Problemy — priorytet wysoki

### 4.1. `type="video/mp4"` przy źródłach `.webm` (bug)

W 4 miejscach `<source>` ma na stałe wpisany typ MP4, mimo że realne pliki to WebM
(`/videos/promo-reel.webm`, `/videos/services/*.webm`):

- `components/ui/CinematicVideoPlayer.tsx:159`
- `components/sections/Services.tsx:154`
- `components/pages/about-me/AboutMeVideo.tsx:139`
- `components/pages/about-me/WhyIDoThisVideo.tsx:138`

Przeglądarka wybiera źródło na podstawie atrybutu `type` — błędna deklaracja może spowodować pominięcie źródła lub nieprzewidywalne zachowanie. **Rekomendacja**: wyprowadzać typ z rozszerzenia pliku (`.webm` → `video/webm`) albo usunąć atrybut `type` przy pojedynczym `<source>`.

### 4.2. Placeholderowe dane kontaktowe jako fallback

Jeśli zmienne środowiskowe nie są ustawione na produkcji, strona wyświetli fikcyjne dane:

- telefon `tel:+48123456789` (hero CTA, CTA końcowe, WhatsApp `wa.me/48123456789`),
- e-mail `kontakt@example.com` (CTA, sekcja kontakt),
- `SITE_URL` → `https://example.com` (metadataBase, OG, JSON-LD), `AUTHOR_NAME` → „Autor".

Kliknięcie „Zadzwoń" u realnego klienta wybierze nieistniejący numer. **Rekomendacja**: przy braku wymaganych zmiennych przerywać build (walidacja env np. w `next.config.mjs`) albo wpisać prawdziwe dane jako fallback.

### 4.3. Favicon i obraz OG to 1,4 MB PNG

`app/layout.tsx` używa `/images/Hero_v4.png` (1,4 MB) jednocześnie jako favicon, apple-touch-icon, obraz OpenGraph i Twitter Card. Skutki: wolne ładowanie podglądów przy udostępnianiu (część serwisów odrzuca obrazy > 1 MB), ciężka ikona karty. **Rekomendacja**: dedykowany `favicon.ico`/`icon.png` (≤ 32 kB), `apple-icon.png` 180×180 oraz obraz OG 1200×630 w JPG/WebP (< 300 kB) — Next.js App Router obsługuje pliki `icon.png` / `opengraph-image.png` w `app/`.

### 4.4. Preloader pobiera niezoptymalizowany obraz hero

`usePreloaderGate.ts` preładowuje surowy `/images/Hero_v4.png` (1,4 MB), podczas gdy `Hero.tsx` renderuje ten obraz przez `next/image` (zoptymalizowany AVIF/WebP pod innym URL-em `/_next/image?...`). Efekt: użytkownik pobiera **dwa różne pliki** — pełny PNG na potrzeby preloadera i osobno wersję zoptymalizowaną, a preloader czeka na wolniejszy z nich. **Rekomendacja**: preładowywać ten sam URL, który renderuje `next/image` (np. przez `getImageProps` z `next/image`), albo zrezygnować z preloadu obrazu i oprzeć gate o `window.load`.

## 5. Problemy — priorytet średni

### 5.1. Brak `sitemap.ts` i `robots.ts`

W `app/` nie ma generowania `sitemap.xml` ani `robots.txt` (meta `robots` jest tylko w metadanych HTML). Dla strony wizytówkowej to szybki zysk SEO. **Rekomendacja**: dodać `app/sitemap.ts` (3 trasy statyczne) i `app/robots.ts`.

### 5.2. Martwy zasób: `public/videos/services/bieg.mp4` (5,1 MB)

Kod odwołuje się wyłącznie do `bieg.webm`; plik MP4 nie jest nigdzie używany — powiększa repozytorium i deployment. **Rekomendacja**: usunąć (ewentualnie z historii gita — `.git` waży już 91 MB, głównie przez binarne wideo w historii commitów; warto rozważyć Git LFS dla `public/videos/`).

### 5.3. Ciężkie wideo serwowane z własnego hostingu

`contact.mp4` 8,7 MB, `bieg.webm` 6,7 MB, `promo-reel.webm` 4,3 MB, pozostałe po ~3,8 MB (razem ~27 MB w `public/videos/`). Lazy loading ogranicza koszt początkowy, ale na Vercelu wideo zjada transfer i nie ma adaptacyjnej jakości. **Rekomendacja**: mocniejsza kompresja (CRF 32–36 dla VP9/AV1, 720p wystarczy dla kart usług) lub zewnętrzny hosting wideo (Mux/Cloudinary/bunny.net) — w `next.config.mjs` jest już przygotowany komentarz pod Cloudinary.

### 5.4. CSP dopuszcza `unsafe-inline` dla skryptów

`script-src 'self' 'unsafe-inline'` osłabia główną wartość CSP (ochronę przed XSS). Przy statycznej stronie ryzyko jest niskie, ale docelowo warto przejść na nonce (Next.js wspiera nonce przez middleware) lub hashe dla dwóch inline skryptów w `layout.tsx`. Szerokie są też `img-src https:`, `font-src https:`, `media-src https:` — można zawęzić do faktycznie używanych domen (`img.youtube.com`).

### 5.5. Duplikacja logiki w hookach animacji

14 hooków animacji ma łącznie ~3 650 linii i powtarza ten sam szkielet: dynamiczny import GSAP, sprawdzenie `prefers-reduced-motion`, `gsap.context`, sprzątanie przez `ctx.revert()`, flagi `shouldCleanup`. **Rekomendacja**: wydzielić wspólny helper (np. `useGsapSection(sectionRef, buildTimeline)`), co usunie kilkaset linii boilerplate'u i ujednolici obsługę reduced-motion (dziś część hooków ustawia stany końcowe ręcznie, każdy inaczej).

### 5.6. Bardzo duże pliki CSS Modules

Łącznie 8 061 linii CSS; największe: `About.module.css` (850), `Testimonials.module.css` (822), `Services.module.css` (769). Projekt miesza dwie konwencje stylowania (Tailwind w JSX + rozbudowane CSS Modules), co utrudnia utrzymanie — te same tokeny (kolory, gradienty) są powielane w obu miejscach. **Rekomendacja**: przy kolejnych sekcjach trzymać się jednej konwencji; wspólne wzory (HUD-owe ramki, corner-marki, gradienty) wydzielić do współdzielonych klas/komponentów.

## 6. Problemy — priorytet niski

- **`Navbar.tsx`**: `NAV_ITEMS` definiuje 9 pozycji, ale renderowane są tylko 3 (`DESKTOP_NAV_ITEMS`); pozostałe 6 to martwa konfiguracja używana już tylko przez scroll-spy. Sama nazwa `DESKTOP_NAV_ITEMS` jest myląca, bo lista służy też menu mobilnemu. Dodatkowo scroll-spy czyta `offsetTop`/`offsetHeight` wszystkich sekcji przy każdym scrollu (w rAF, więc koszt akceptowalny, ale pozycje można cache'ować i odświeżać przy `resize`).
- **Brak polskich znaków w copy stron błędów**: `app/error.tsx` („Wystapil blad", „Sprobuj ponownie") i analogicznie `app/not-found.tsx` — wygląda na niezamierzone.
- **`app/error.tsx` pokazuje `error.message` użytkownikowi** — w produkcji może ujawnić szczegóły techniczne; lepiej pokazać ogólny komunikat i logować szczegóły.
- **Strona `/contact` renderuje komponenty `about-me`** (`AboutMeHero`, `AboutMeBio`…) — treściowo to spójne (bio + kontakt), ale nazewnictwo ścieżka↔komponenty rozjeżdża się; utrudni to dodanie osobnej strony „O mnie" przewidzianej w `site-content.ts` (`aboutMe.meta`).
- **`AboutMeHero` z `imageUnoptimized: true`** — obraz tła hero omija optymalizację `next/image` (świadomy trade-off?, warto zweryfikować wagę `contact-hero.webp` na produkcji).
- **Ostrzeżenie Node przy testach**: brak `"type": "module"` w `package.json` powoduje re-parsowanie plików testowych jako ESM (`MODULE_TYPELESS_PACKAGE_JSON`).
- **Testy pokrywają tylko dane i konfigurację** (site-content, layouty, tokeny Tailwind). Brak testów komponentów i E2E — przy tak animowanej stronie choć jeden smoke test Playwright (strona się ładuje, preloader znika, nawigacja działa) wychwyciłby regresje, których testy danych nie widzą.
- **README nieaktualne**: wymienia sekcje „Portfolio / Galeria", „Instagram Feed", których nie ma w `app/page.tsx` (komentarz w kodzie mówi, że będą dodane później — warto ujednolicić).

## 7. Rekomendowane następne kroki (w kolejności)

1. Poprawić `type` źródeł wideo (4 pliki) — 15 minut, realny bug.
2. Uzupełnić prawdziwe dane kontaktowe / walidację env na produkcji.
3. Dodać dedykowany favicon i obraz OG; przestać używać `Hero_v4.png` do tego celu.
4. Zsynchronizować preload hero z URL-em `next/image`.
5. Dodać `app/sitemap.ts` + `app/robots.ts`.
6. Usunąć `bieg.mp4`; skompresować pozostałe wideo lub przenieść na CDN.
7. (Refaktor) wspólny helper GSAP dla hooków animacji; cache pozycji sekcji w scroll-spy.
8. (Jakość) smoke test Playwright + `"type": "module"` w `package.json`.

---

*Audyt wykonany automatycznie (analiza statyczna + build + testy), stan repo: commit `76bcaa2`.*
