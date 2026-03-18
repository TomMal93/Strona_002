# Audyt wydajności (Performance) — Strona_002

**Data:** 2026-03-18
**Zakres:** szybkość ładowania, rozmiar zasobów, optymalizacja obrazów/wideo, bundle JS, animacje, rendering, Core Web Vitals
**Metoda:** analiza statyczna kodu źródłowego + inspekcja zasobów na dysku

---

## 1. Podsumowanie

Strona jest zbudowana solidnie na Next.js 14 z App Router i zawiera wiele dobrych praktyk (lazy load GSAP, YouTube facade, font swap, CSP, cache headers). Jednak **głównym wąskim gardłem wydajności są nieoptymalizowane obrazy PNG** — łącznie ~17 MB w formacie PNG/JPEG zamiast WebP/AVIF. Drugie kluczowe źródło problemów to ciągłe re-renderowanie komponentów (timer HUD w About, canvas w Hero) oraz brak server components dla statycznych sekcji.

### Ocena ogólna: 6/10

| Kategoria | Ocena | Priorytet |
|---|---|---|
| Obrazy i media | 3/10 | KRYTYCZNY |
| Bundle JS / code splitting | 7/10 | ŚREDNI |
| Rendering React | 6/10 | ŚREDNI |
| Animacje / runtime | 6/10 | ŚREDNI |
| Cache i nagłówki HTTP | 8/10 | NISKI |
| Fonty i typografia | 9/10 | NISKI |
| SEO / metadata | 9/10 | NISKI |

---

## 2. KRYTYCZNE — Nieoptymalizowane obrazy

### 2.1. Rozmiar plików obrazów

| Plik | Rozmiar | Format | Uwagi |
|---|---|---|---|
| `images/services/bieg.png` | **6.2 MB** | PNG | Ekstremalnie duży |
| `images/contact/contact.jpeg` | **2.7 MB** | JPEG | Brak kompresji |
| `images/about_me_001.png` | **2.2 MB** | PNG | Powinien być WebP |
| `images/services/weeding.png` | **1.6 MB** | PNG | Powinien być WebP |
| `images/Hero_v4.png` | **1.4 MB** | PNG | Główny obraz hero, LCP |
| `images/Hero_v3.png` | **1.3 MB** | PNG | **Prawdopodobnie nieużywany** |
| `images/services/montage.png` | **1.2 MB** | PNG | Powinien być WebP |
| `images/promo-poster.jpg` | **456 KB** | JPEG | Akceptowalne |
| `images/hero.webp` | **409 KB** | WebP | OK (OpenGraph) |
| `images/logo_m.webp` | **244 KB** | WebP | Duże jak na logo |
| `images/hero_example.png` | **127 KB** | PNG | **Prawdopodobnie nieużywany** |

**Łączny rozmiar obrazów: ~17.8 MB**

### 2.2. Rekomendacje — obrazy

1. **Konwersja wszystkich PNG do WebP/AVIF** — szacowane oszczędności 70-85%:
   - `services/bieg.png` (6.2 MB) → WebP: ~600 KB–1 MB
   - `about_me_001.png` (2.2 MB) → WebP: ~200-400 KB
   - `Hero_v4.png` (1.4 MB) → WebP: ~150-300 KB
   - Pozostałe PNG proporcjonalnie

2. **Usunięcie nieużywanych plików**:
   - `Hero_v3.png` — nie jest importowany w żadnym komponencie
   - `hero_example.png` — nie jest importowany w żadnym komponencie

3. **Zmniejszenie rozdzielczości** — obrazy serwowane jako zdjęcia tła/portfolio nie potrzebują rozdzielczości > 2000px szerokości

4. **Logo** (`logo_m.webp`, 244 KB) — prawdopodobnie można zmniejszyć do ~20-50 KB. Wyświetlane jest jako 40-48px, a serwowane z `width={96}`.

5. **Poster promo** (`promo-poster.jpg`, 456 KB) — kompresja do ~100-150 KB przy zachowaniu jakości

---

## 3. KRYTYCZNE — Wideo

### 3.1. Rozmiar plików wideo

| Plik | Rozmiar |
|---|---|
| `videos/contact/contact.mp4` | **8.7 MB** |
| `videos/services/bieg.mp4` | **5.1 MB** |
| `videos/promo-reel.mp4` | **3.6 MB** |
| `videos/services/montage.mp4` | **3.6 MB** |
| `videos/services/weeding.mp4` | **1.8 MB** |

**Łączny rozmiar wideo: ~22.8 MB**

### 3.2. Rekomendacje — wideo

1. **Brak cache headers dla wideo** — `next.config.mjs` definiuje cache dla `/images/:path*`, ale brak analogicznego wpisu dla `/videos/:path*`. Dodać:
   ```js
   { source: '/videos/:path*', headers: [{ key: 'Cache-Control', value: 'public, max-age=2592000, stale-while-revalidate=86400' }] }
   ```

2. **Kompresja wideo** — użyć H.265/HEVC lub VP9 zamiast H.264 dla mniejszego rozmiaru. `contact.mp4` (8.7 MB) to dużo na podstronę kontaktową.

3. **Podwójne źródło video** — dodać `<source>` z formatem WebM/VP9 jako fallback z mniejszym rozmiarem.

4. **Rozważyć streaming** — dla wideo >5 MB warto rozważyć adaptywny streaming (HLS) lub CDN z optymalizacją.

---

## 4. WYSOKI — Rendering React i re-rendery

### 4.1. Timer HUD w sekcji About

**Plik:** `components/sections/About.tsx:33-42`

```tsx
useEffect(() => {
  const timer = window.setInterval(() => {
    setHudFrame(current => current + 1)
  }, 80)
  return () => window.clearInterval(timer)
}, [])
```

**Problem:** `setInterval` co 80ms (12.5 fps) powoduje **12.5 re-renderów na sekundę** całego komponentu About, nawet gdy sekcja nie jest widoczna na ekranie. Każdy re-render przelicza `formatHudTime()` i diffuje vDOM całej sekcji.

**Rekomendacja:**
- Wyodrębnić timecode do osobnego mikro-komponentu (`<HudTimecode />`), by ograniczyć zakres re-renderów
- Wstrzymywać timer gdy sekcja nie jest widoczna (IntersectionObserver)
- Rozważyć użycie `requestAnimationFrame` + bezpośrednia mutacja DOM (`textContent`) zamiast React state

### 4.2. Wszystkie sekcje to `'use client'`

**Problem:** Każda sekcja (Hero, About, Promo, Services, Process, Faq, Cta) jest oznaczona `'use client'`, co oznacza że cały kod tych komponentów trafia do bundle'a JS klienta.

Wiele z tych sekcji ma **statyczną strukturę HTML** z niewielką ilością interaktywności (np. Process, Faq header, Cta).

**Rekomendacja:**
- Wydzielić statyczny markup jako Server Component, a interaktywne części (animacje GSAP, accordion FAQ, carousel) jako małe `'use client'` children
- Przykład: Process mogłoby być Server Component z client `useProcessAnimations` hookowanym w wrapper

### 4.3. Testimonials — klonowanie slajdów

**Plik:** `components/sections/Testimonials.tsx:28`

```tsx
const extendedItems = [items[total - 1], ...items, items[0]]
```

Tworzenie duplikatów na krańcach karuzeli jest typowe, ale renderuje się dodatkowe 2 DOM nodes. Przy obecnej małej liczbie elementów (4 opinie) nie jest to problem, ale warto mieć to na uwadze.

---

## 5. WYSOKI — Bundle JS i Code Splitting

### 5.1. GSAP w Navbar — brak lazy load

**Plik:** `components/layout/Navbar.tsx:7`

```tsx
import { gsap } from 'gsap'
```

**Problem:** GSAP (~30 KB gzip) jest importowany statycznie w Navbar, który ładowany jest na każdej stronie. W przeciwieństwie do sekcji Hero i About, gdzie GSAP jest importowany dynamicznie (`await import('gsap')`), Navbar ciągnie GSAP do initial bundle.

**Rekomendacja:** Zastosować dynamic import jak w useHeroAnimations:
```tsx
const runAnimation = async () => {
  const { gsap } = await import('gsap')
  // ...
}
```

### 5.2. Lenis + ScrollTrigger w initial bundle

**Plik:** `components/layout/SmoothScroll.tsx:4-5`

```tsx
import Lenis from 'lenis'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
```

**Problem:** Lenis (~8 KB gzip) i ScrollTrigger (~12 KB gzip) importowane statycznie w SmoothScroll, który opakowuje całą stronę w `layout.tsx`. Trafia do initial bundle.

**Rekomendacja:** Dynamic import wewnątrz `useEffect`:
```tsx
useEffect(() => {
  const init = async () => {
    const [{ default: Lenis }, { ScrollTrigger }] = await Promise.all([
      import('lenis'),
      import('gsap/ScrollTrigger'),
    ])
    // ...
  }
  void init()
}, [])
```

### 5.3. Szacowany wpływ na bundle

| Biblioteka | Szacowany rozmiar (gzip) | Ładowana w | Rekomendacja |
|---|---|---|---|
| GSAP core | ~30 KB | Navbar (static), sekcje (dynamic) | Dynamic w Navbar |
| ScrollTrigger | ~12 KB | SmoothScroll (static) | Dynamic import |
| Lenis | ~8 KB | SmoothScroll (static) | Dynamic import |
| **Łączne oszczędności initial bundle** | **~50 KB** | | |

---

## 6. ŚREDNI — Animacje i Runtime

### 6.1. Canvas HeroGlowScene — ciągłe rysowanie

**Plik:** `components/sections/hero/HeroGlowScene.tsx`

**Problem:** Canvas rysuje 90 gwiazd (68 + 22) w każdej klatce RAF, z radialnym gradientem, liniami krzyżowymi i kołami. Choć poprawnie wyłączane przy `prefers-reduced-motion`, to na mobile generuje niepotrzebne obciążenie GPU (canvas jest renderowany ale może być za mały by gwiazdy były widoczne).

**Rekomendacja:**
- Dodać `IntersectionObserver` — wstrzymać rysowanie gdy canvas nie jest w viewport
- Rozważyć drossling do ~30 fps zamiast pełnego RAF (~60 fps): `if (time - lastFrame < 33) return`
- Na mobile (<768px) canvas jest renderowany w MobileHeroLayout — sprawdzić czy efekt jest w ogóle widoczny na małych ekranach

### 6.2. Navbar — podwójny scroll listener

**Plik:** `components/layout/Navbar.tsx:48-70` i `116-182`

**Problem:** Navbar rejestruje dwa oddzielne listenery `scroll`:
1. `updateScrolled()` — zmiana tła navbara
2. `updateActiveSection()` — podświetlenie aktywnej sekcji

Oba używają RAF throttle, ale to 2 oddzielne RAF per scroll event.

**Rekomendacja:** Połączyć w jeden listener/RAF callback:
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

### 6.3. Lenis RAF loop

**Plik:** `components/layout/SmoothScroll.tsx:24-30`

Lenis uruchamia ciągły `requestAnimationFrame` loop, nawet gdy użytkownik nie scrolluje. To standardowe zachowanie Lenis, ale warto mieć świadomość koszu ~0.5ms per frame na słabszych urządzeniach.

---

## 7. ŚREDNI — YouTube thumbnails poza Next.js Image

**Plik:** `components/sections/promo/YouTubeFacade.tsx:44`

```tsx
<img
  src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
  alt=""
  className={styles.ytThumbnail}
  loading="lazy"
/>
```

**Problem:** Thumbnails YouTube ładowane przez natywny `<img>` zamiast `<Image>` z Next.js. Tracona jest automatyczna konwersja do AVIF/WebP i optymalizacja rozmiaru.

**Rekomendacja:**
1. Dodać `img.youtube.com` do `remotePatterns` w `next.config.mjs`
2. Użyć `<Image>` z odpowiednim `sizes` i `width`/`height`

---

## 8. NISKI — Hero Desktop Image bez `priority`

**Plik:** `components/sections/Hero.tsx:82-89`

```tsx
<Image
  src="/images/Hero_v4.png"
  loading="eager"
  quality={85}
  ...
/>
```

**Problem:** Obraz hero na desktop ma `loading="eager"` ale nie `priority`. W Next.js `priority` dodaje `<link rel="preload">` w `<head>`, co jest szybsze niż `loading="eager"` sam w sobie. Mobilna wersja (MobileHeroLayout) prawidłowo używa `priority`.

**Rekomendacja:** Dodać `priority` do desktop Image w Hero.tsx.

---

## 9. NISKI — Drobne optymalizacje

### 9.1. Cross-import CSS Modules

About.tsx i Services.tsx importują `Hero.module.css`:
```tsx
import heroStyles from './Hero.module.css'
```

To powoduje, że CSS Hero jest dołączany do chunk'ów About i Services, zwiększając rozmiar CSS.

**Rekomendacja:** Wyodrębnić wspólne klasy (np. `gradientTextPrimary`) do dedykowanego `shared.module.css` lub do `globals.css`.

### 9.2. Nieużywane zasoby

- `images/Hero_v3.png` (1.3 MB) — nie jest importowany w żadnym komponencie
- `images/hero_example.png` (127 KB) — nie jest importowany w żadnym komponencie

**Rekomendacja:** Usunąć z repozytorium, zmniejszy rozmiar checkout/deploy.

### 9.3. About — string splitting w render

**Plik:** `components/sections/About.tsx:136-168`

Tekst jest dzielony przez `.split()` i `.flatMap()` w każdym renderze (co 80ms przez timer!). Powinno to być wykonane raz i zapamiętane.

**Rekomendacja:** Przenieść do `useMemo()` lub stałej poza komponentem.

---

## 10. Pozytywne praktyki (do zachowania)

| Praktyka | Gdzie |
|---|---|
| YouTube Facade pattern (lazy iframe) | `YouTubeFacade.tsx` |
| `font-display: swap` na fontach | `layout.tsx` — Bebas Neue, Inter |
| Dynamic import GSAP w animation hooks | `useHeroAnimations.ts`, `useAboutAnimations.ts`, `usePromoAnimations.ts` |
| `prefers-reduced-motion` respektowane wszędzie | Wszystkie hooki animacji + globals.css |
| IntersectionObserver przed ładowaniem GSAP | `useAboutAnimations`, `usePromoAnimations` |
| Video `preload="metadata"` | Services, Promo |
| Immutable cache headers na statykach (1 rok) | `next.config.mjs` |
| Kompresja (gzip/brotli) włączona | `next.config.mjs` |
| Image formats AVIF + WebP | `next.config.mjs` |
| Bundle analyzer script | `scripts/analyze-bundle.mjs` |
| WebVitals monitoring (opcjonalne) | `WebVitalsReporter.tsx` |

---

## 11. Plan działania — priorytetyzacja

### Faza 1 — Quick wins (szacowany wpływ: bardzo duży)
- [ ] Konwersja obrazów PNG → WebP (oszczędność ~15 MB)
- [ ] Usunięcie `Hero_v3.png` i `hero_example.png` (~1.4 MB)
- [ ] Dodanie `priority` do desktop hero image
- [ ] Cache headers dla `/videos/:path*`

### Faza 2 — Bundle size (szacowany wpływ: duży)
- [ ] Dynamic import GSAP w Navbar
- [ ] Dynamic import Lenis i ScrollTrigger w SmoothScroll
- [ ] YouTube thumbnails przez `<Image>` z Next.js

### Faza 3 — Runtime performance (szacowany wpływ: średni)
- [ ] Izolacja timera HUD w About (osobny komponent lub DOM mutation)
- [ ] IntersectionObserver na HeroGlowScene canvas
- [ ] Połączenie scroll listenerów w Navbar
- [ ] `useMemo` na string splitting w About
- [ ] Wyodrębnienie wspólnych klas CSS z Hero.module.css

### Faza 4 — Architektura (szacowany wpływ: niski-średni)
- [ ] Refactor sekcji na Server Components z client wrapperami
- [ ] Kompresja wideo (H.265/VP9)
- [ ] Rozważenie CDN dla dużych plików wideo

---

## 12. Szacowane oszczędności

| Obszar | Przed | Po optymalizacji | Oszczędności |
|---|---|---|---|
| Obrazy (transfer) | ~17.8 MB | ~2-3 MB | ~15 MB (85%) |
| Wideo (cache) | brak cache | 30-dniowy cache | powtórne wizyty |
| Initial JS bundle | +~50 KB (GSAP+Lenis) | dynamic import | ~50 KB gzip |
| Re-rendery About | 12.5/s | 0/s (gdy poza viewport) | CPU/bateria mobile |
| LCP (hero image) | brak preload | `<link rel="preload">` | ~100-300ms szybszy LCP |

---

*Raport wygenerowany na podstawie analizy kodu źródłowego. Zalecane jest uzupełnienie o dane z Lighthouse/PageSpeed Insights po deploy.*
