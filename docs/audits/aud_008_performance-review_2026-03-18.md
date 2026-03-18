# Audyt wydajności i jakości kodu — Strona_002

**Data:** 2026-03-18
**Numer:** AUD-008
**Zakres:** szybkość ładowania, optymalizacja zasobów, jakość kodu, architektura komponentów, organizacja projektu
**Metoda:** analiza statyczna kodu źródłowego + przegląd struktury plików + inspekcja zasobów

---

## 1. Podsumowanie ogólne

Projekt jest zbudowany solidnie — Next.js 14 (App Router), TypeScript, Tailwind CSS, GSAP, Lenis. Struktura folderów jest logiczna i czytelna. Kod jest dobrze zorganizowany z wydzielonymi hookami animacji, CSS Modules per sekcja i scentralizowaną treścią (`site-content.ts`).

Główne obszary wymagające uwagi to:
1. **Nieoptymalizowane obrazy** (krytyczne — ~17 MB w PNG)
2. **Brak cache headers na wideo** (wysoki)
3. **Zbędne re-rendery** w sekcji About (średni)
4. **Statyczne importy bibliotek animacji** w Navbar/SmoothScroll (średni)
5. **Wszystkie sekcje jako `'use client'`** — brak Server Components (niski)

### Ocena ogólna organizacji kodu: 8/10

Kod jest uporządkowany. Poniżej szczegółowa analiza.

---

## 2. Struktura projektu — ocena

```
Strona_002/
├── app/                    ✅ Standardowy App Router
│   ├── layout.tsx          ✅ Czysty layout, font swap, SEO metadata, JSON-LD
│   ├── page.tsx            ✅ Prosta kompozycja sekcji
│   ├── contact/page.tsx    ✅ Podstrona kontaktowa
│   ├── error.tsx           ✅ Error boundary
│   ├── not-found.tsx       ✅ Custom 404
│   └── globals.css         ✅ Minimalistyczny, @layer base/components
├── components/
│   ├── analytics/          ✅ WebVitals — opcjonalny, czytelny
│   ├── layout/             ✅ Navbar + SmoothScroll — logicznie wydzielone
│   ├── sections/           ✅ Każda sekcja ma swój plik + CSS Module
│   │   ├── hero/           ✅ Sub-komponenty Hero wydzielone
│   │   ├── services/       ✅ Helper functions wydzielone
│   │   ├── promo/          ✅ YouTubeFacade — świetny wzorzec
│   │   └── .../<hook>.ts   ✅ Hooki animacji per sekcja
│   ├── pages/about-me/     ✅ Podstrona about-me z własnymi komponentami
│   └── ui/Button.tsx       ✅ Reusable UI
├── lib/
│   ├── site-content.ts     ✅ Centralna treść + env vars
│   └── utils.ts            ✅ Helpers (cn)
├── docs/                   ✅ Dokumentacja i audyty
├── public/                 ⚠️ Nieoptymalizowane obrazy i wideo
├── scripts/                ✅ Bundle analyzer
└── tests/                  ✅ Testy jednostkowe
```

**Plusy:**
- Jasna separacja: sekcje → sub-komponenty → hooki animacji
- CSS Modules per sekcja — brak kolizji nazw
- Scentralizowane treści w `site-content.ts` z env var overrides
- Dokumentacja i audyty w `docs/`

**Drobne zastrzeżenia:**
- `font-mocks.js` w root — plik testowy, mógłby być w `tests/` lub `__mocks__/`

---

## 3. KRYTYCZNE — Obrazy (rozmiar transferu)

| Plik | Rozmiar | Format | Problem |
|---|---|---|---|
| `services/bieg.png` | **6.2 MB** | PNG | Ekstremalnie duży, powinien być WebP ≤1 MB |
| `contact/contact.jpeg` | **2.7 MB** | JPEG | Brak kompresji, powinien być ≤300 KB |
| `about_me_001.png` | **2.2 MB** | PNG | Konwersja do WebP: ~200-400 KB |
| `services/weeding.png` | **1.6 MB** | PNG | Konwersja do WebP: ~200 KB |
| `Hero_v4.png` | **1.4 MB** | PNG | LCP image! Konwersja do WebP: ~150-300 KB |
| `Hero_v3.png` | **1.3 MB** | PNG | **NIEUŻYWANY** — do usunięcia |
| `services/montage.png` | **1.2 MB** | PNG | Konwersja do WebP: ~150 KB |
| `hero_example.png` | **127 KB** | PNG | **NIEUŻYWANY** — do usunięcia |
| `logo_m.webp` | **244 KB** | WebP | Za duże na logo 48px, powinno ≤30 KB |

**Łączny rozmiar obrazów: ~17.8 MB → po optymalizacji: ~2-3 MB (oszczędność ~85%)**

### Rekomendacje:
1. Konwersja wszystkich PNG/JPEG do WebP (Next.js i tak konwertuje przez `<Image>`, ale source files nadal ładują się przy SSG/ISR)
2. Usunięcie `Hero_v3.png` i `hero_example.png` (~1.4 MB)
3. Zmniejszenie rozdzielczości source images do max 2000-2500px szerokości
4. Logo: przeskalować do faktycznego rozmiaru wyświetlania

---

## 4. WYSOKI — Wideo (brak cache, duże pliki)

| Plik | Rozmiar |
|---|---|
| `videos/contact/contact.mp4` | **8.7 MB** |
| `videos/services/bieg.mp4` | **5.1 MB** |
| `videos/promo-reel.mp4` | **3.6 MB** |
| `videos/services/montage.mp4` | **3.6 MB** |
| `videos/services/weeding.mp4` | **1.8 MB** |

**Łącznie: ~22.8 MB**

### Problemy:
1. **Brak cache headers** — `next.config.mjs` cache'uje `/images/:path*`, ale **nie** `/videos/:path*`
2. Pliki wideo nie mają alternatywnego formatu (WebM/VP9)
3. `contact.mp4` (8.7 MB) — bardzo duży jak na podstronę kontaktową

### Rekomendacje:
1. Dodać cache header dla `/videos/:path*` w `next.config.mjs`
2. Kompresja wideo (H.265 lub VP9), target: ≤2 MB per plik
3. Rozważyć CDN dla wideo

---

## 5. WYSOKI — Rendering i re-rendery React

### 5.1. Timer HUD w About — 12.5 re-renderów/s

**Lokalizacja:** `components/sections/About.tsx:33-42`

```tsx
useEffect(() => {
  const timer = window.setInterval(() => {
    setHudFrame(current => current + 1)  // ← re-render co 80ms!
  }, 80)
  return () => window.clearInterval(timer)
}, [])
```

**Problem:** `setInterval` co 80ms powoduje 12.5 re-renderów/s całego komponentu About, nawet gdy sekcja jest poza viewport. Każdy re-render:
- Przelicza `formatHudTime()`
- Wykonuje `.split()` i `.flatMap()` na tekście (linie 136-168) — operacje stringowe **w każdym renderze**
- Diffuje cały vDOM sekcji

**Rekomendacje:**
1. Wyodrębnić `<HudTimecode />` jako osobny mikro-komponent
2. Wstrzymywać timer gdy sekcja poza viewport (IntersectionObserver)
3. Alternatywnie: bezpośrednia mutacja DOM (`ref.current.textContent = ...`) zamiast React state
4. Przenieść `.split().flatMap()` do `useMemo()` lub stałej

### 5.2. String splitting w About render — zbędna praca

**Lokalizacja:** `components/sections/About.tsx:136-168`

Łańcuchowe `.split().flatMap().split().flatMap()` wykonywane w **każdym renderze** (12.5/s z powodu timera). Dane są statyczne — wynik nigdy się nie zmienia.

**Rekomendacja:** Wynieść do `useMemo()` bez dependencies lub do stałej poza komponentem.

---

## 6. ŚREDNI — Bundle JS

### 6.1. GSAP w Navbar — statyczny import

**Lokalizacja:** `components/layout/Navbar.tsx:7`

```tsx
import { gsap } from 'gsap'  // ~30 KB gzip w initial bundle
```

Sekcje (Hero, About, Promo itd.) dynamicznie importują GSAP w hookach, ale Navbar importuje go statycznie. Navbar jest w `layout.tsx`, więc GSAP trafia do initial bundle każdej strony.

### 6.2. Lenis + ScrollTrigger — statyczny import

**Lokalizacja:** `components/layout/SmoothScroll.tsx:4-5`

```tsx
import Lenis from 'lenis'                    // ~8 KB gzip
import { ScrollTrigger } from 'gsap/ScrollTrigger'  // ~12 KB gzip
```

Oba trafiają do initial bundle, choć są potrzebne dopiero po hydratacji.

### Szacowane oszczędności po dynamic import:

| Biblioteka | Rozmiar gzip | Obecny import | Rekomendacja |
|---|---|---|---|
| GSAP core | ~30 KB | Navbar (static) | `await import('gsap')` |
| ScrollTrigger | ~12 KB | SmoothScroll (static) | Dynamic import w useEffect |
| Lenis | ~8 KB | SmoothScroll (static) | Dynamic import w useEffect |
| **Łącznie** | **~50 KB** | | Usunięte z initial bundle |

---

## 7. ŚREDNI — Hero Desktop Image bez `priority`

**Lokalizacja:** `components/sections/Hero.tsx:82-89`

Desktop hero image ma `loading="eager"` ale brak `priority`. Mobile wersja (MobileHeroLayout) prawidłowo używa `priority`.

Atrybut `priority` w Next.js dodaje `<link rel="preload">` w `<head>`, co jest szybsze niż samo `loading="eager"` (~100-300ms różnicy w LCP).

**Rekomendacja:** Dodać `priority` do desktop Image.

---

## 8. ŚREDNI — YouTube thumbnails poza Next.js Image

**Lokalizacja:** `components/sections/promo/YouTubeFacade.tsx:44`

```tsx
<img src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`} />
```

Natywny `<img>` zamiast Next.js `<Image>` — brak automatycznej konwersji AVIF/WebP i brak responsive sizes.

**Rekomendacja:**
1. Dodać `img.youtube.com` do `remotePatterns` w `next.config.mjs`
2. Zmienić na `<Image>` z `width`/`height` i `sizes`

---

## 9. NISKI — Architektura komponentów

### 9.1. Wszystkie sekcje `'use client'`

Każda sekcja (Hero, About, Promo, Services, Process, Faq, Cta) jest `'use client'`. Wiele z nich ma głównie statyczny markup z niewielką interaktywnością.

**Potencjalna optymalizacja:** Wydzielić statyczny HTML jako Server Component, a interaktywne części jako małe `'use client'` children. Przykład: Process mogłoby być RSC z client wrapper na GSAP.

**Priorytet:** Niski — aktualna architektura działa poprawnie.

### 9.2. Cross-import Hero.module.css

About.tsx i Services.tsx importują `heroStyles from './Hero.module.css'` (dla `gradientTextPrimary`). CSS Hero trafia do chunk'ów About i Services.

**Rekomendacja:** Wynieść `gradientTextPrimary` do `globals.css` lub `shared.module.css`.

### 9.3. Navbar — dwa scroll listenery

**Lokalizacja:** `components/layout/Navbar.tsx` (linie 48-70 i 116-182)

Dwa oddzielne `addEventListener('scroll', ...)` z osobnymi RAF throttle. Mogą być połączone w jeden listener/RAF:

```tsx
const onScroll = () => {
  if (rafId) return
  rafId = requestAnimationFrame(() => {
    updateScrolled()
    updateActiveSection()
    rafId = 0
  })
}
```

---

## 10. INFORMACYJNE — Pozytywne praktyki (do zachowania)

| Praktyka | Ocena | Lokalizacja |
|---|---|---|
| YouTube Facade (lazy iframe) | Doskonałe | `YouTubeFacade.tsx` |
| `font-display: swap` | Doskonałe | `layout.tsx` |
| Dynamic import GSAP w hookach | Dobre | `useHeroAnimations.ts` i inne |
| `prefers-reduced-motion` | Doskonałe | Wszędzie (hooki + globals.css) |
| IntersectionObserver przed GSAP | Dobre | `useAboutAnimations`, `usePromoAnimations` |
| Video `preload="metadata"` | Dobre | Services, Promo |
| Immutable cache 1y na statykach | Doskonałe | `next.config.mjs` |
| CSP headers | Doskonałe | `next.config.mjs` |
| JSON-LD structured data | Dobre | `layout.tsx` |
| Scentralizowana treść z env vars | Dobre | `lib/site-content.ts` |
| CSS Modules per sekcja | Dobre | Wszystkie sekcje |
| WebVitals monitoring | Dobre | `WebVitalsReporter.tsx` |
| Bundle analyzer | Dobre | `scripts/analyze-bundle.mjs` |
| Testy jednostkowe | Dobre | `tests/` |
| Custom error/404 pages | Dobre | `app/error.tsx`, `app/not-found.tsx` |
| a11y: aria-labels, sr-only, semantic HTML | Dobre | Wszystkie sekcje |

---

## 11. Plan działania — priorytetyzowany

### Faza 1 — Quick wins (wpływ: KRYTYCZNY)
- [ ] Konwersja obrazów PNG/JPEG → WebP (~85% oszczędności transferu)
- [ ] Usunięcie nieużywanych: `Hero_v3.png`, `hero_example.png`
- [ ] Dodanie `priority` do desktop hero image
- [ ] Dodanie cache headers dla `/videos/:path*`

### Faza 2 — Bundle (wpływ: WYSOKI)
- [ ] Dynamic import GSAP w Navbar
- [ ] Dynamic import Lenis + ScrollTrigger w SmoothScroll
- [ ] YouTube thumbnails przez Next.js `<Image>`

### Faza 3 — Runtime (wpływ: ŚREDNI)
- [ ] Izolacja timera HUD w About do mikro-komponentu
- [ ] `useMemo` / stała na string splitting w About
- [ ] IntersectionObserver na HeroGlowScene canvas
- [ ] Połączenie scroll listenerów w Navbar
- [ ] Wyodrębnienie `gradientTextPrimary` do shared CSS

### Faza 4 — Architektura (wpływ: NISKI)
- [ ] Refactor wybranych sekcji na Server Components
- [ ] Kompresja wideo (H.265/VP9), target ≤2 MB/plik
- [ ] Przeniesienie `font-mocks.js` do `tests/` lub `__mocks__/`

---

## 12. Podsumowanie organizacji kodu

| Aspekt | Ocena | Komentarz |
|---|---|---|
| Struktura folderów | 9/10 | Logiczna, spójna, łatwa do nawigacji |
| Separacja logiki | 8/10 | Hooki animacji wydzielone, treść scentralizowana |
| Typowanie TypeScript | 8/10 | Typy zdefiniowane, brak `any` |
| Nazewnictwo plików | 9/10 | PascalCase komponenty, camelCase hooki, konsekwentne |
| CSS / styling | 8/10 | CSS Modules + Tailwind, brak konfliktów |
| a11y / dostępność | 8/10 | aria-labels, sr-only, semantic HTML |
| SEO / metadata | 9/10 | OG tags, Twitter cards, JSON-LD, robots |
| Testy | 6/10 | Istnieją, ale pokrycie ograniczone |
| Dokumentacja | 8/10 | Dobrze udokumentowane decyzje i audyty |
| **Ogółem** | **8/10** | Dobrze zorganizowany kod, główne ryzyko to zasoby medialne |

---

*Raport wygenerowany na podstawie analizy kodu źródłowego w dniu 2026-03-18. Uzupełnić danymi z Lighthouse/PageSpeed Insights po deploy.*
