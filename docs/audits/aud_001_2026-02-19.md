# Audyt optymalizacyjny — Strona_002

---

## KRYTYCZNY

### 1. Lenis i GSAP ScrollTrigger nie są zsynchronizowane

**Plik:** `components/layout/SmoothScroll.tsx:12-31`

Lenis ma własną pętlę RAF, ale nie przekazuje pozycji scrolla do GSAP ScrollTrigger. Parallax w Hero (i każda przyszła animacja scroll-triggered) **nie będzie działać poprawnie** z Lenis smooth scroll — GSAP "widzi" natywny scroll, a Lenis go przechwytuje.

**Fix:** Podpiąć Lenis do ScrollTrigger przez `lenis.on('scroll', ScrollTrigger.update)` i ustawić `ScrollTrigger.scrollerProxy` lub użyć oficjalnego `lenis/react`.

---

## WYSOKIE

### 2. `scroll-behavior: smooth` koliduje z Lenis

**Plik:** `app/globals.css:21`

CSS `scroll-behavior: smooth` i Lenis jednocześnie powodują podwójne wygładzanie i jank. Lenis powinien być jedynym źródłem smooth scroll.

**Fix:** Usunąć `scroll-behavior: smooth`.

---

### 3. Grain overlay nie jest obcięty

**Plik:** `app/globals.css:48-61`

Pseudo-element `.grain-overlay::before` ma `inset: -50%; width: 200%; height: 200%`, ale rodzic (`<div class="grain-overlay">`) nie ma `overflow: hidden`. Tekstura ziarna rozlewa się poza sekcję Hero, renderując niewidoczne piksele i marnując GPU.

**Fix:** Dodać `overflow: hidden` na `.grain-overlay`.

---

### 4. GSAP animacje ignorują `prefers-reduced-motion`

**Plik:** `components/sections/Hero.tsx:53-125`

CSS media query w globals.css obsługuje tylko animacje CSS. Cała timeline GSAP (stagger, fade-in, parallax) **kompletnie ignoruje** preferencję użytkownika. To problem z dostępnością (WCAG 2.1 SC 2.3.3).

**Fix:** Sprawdzić `matchMedia('(prefers-reduced-motion: reduce)')` i pominąć animacje GSAP.

---

### 5. Metadata API niewykorzystane

**Plik:** `app/layout.tsx:28-32`

Tylko `title` i `description`. Brakuje: Open Graph, Twitter Card, `metadataBase`, `themeColor`, `viewport`, `robots`, `icons`.

**Fix:** Rozbudować obiekt `metadata`.

---

### 6. `next.config.mjs` pusty

**Plik:** `next.config.mjs`

Brakuje: konfiguracja `images` (domains/remotePatterns dla Cloudinary), nagłówki bezpieczeństwa, `poweredByHeader: false`.

**Fix:** Uzupełnić konfigurację.

---

## ŚREDNIE

### 7. Redundantny CSS reset

**Plik:** `app/globals.css:11-17`

`*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0 }` — Tailwind Preflight (`@tailwind base`) robi to samo. Podwójna deklaracja.

**Fix:** Usunąć ręczny reset.

---

### 8. Font Oswald załadowany ale nieużywany

**Plik:** `app/layout.tsx:14-19`

Oswald jest importowany z Google Fonts ale nigdzie w kodzie nie jest użyty (przeznaczony na przyszłe H2-H3). Dodaje ~20-40 KB do initial load.

**Fix:** Odłożyć import do momentu gdy będzie potrzebny, lub załadować go dynamicznie.

---

### 9. Brak CSS Lenis

**Plik:** `components/layout/SmoothScroll.tsx`

Pakiet `lenis` eksportuje plik CSS (`lenis/dist/lenis.css`) z wymaganymi stylami `html.lenis`. Bez niego Lenis może nie działać optymalnie.

**Fix:** Zaimportować `'lenis/dist/lenis.css'` w layout lub SmoothScroll.

---

## NISKIE

### 10. Brak `will-change` na animowanych elementach

Grain overlay i video mogłyby korzystać z `will-change: transform` jako hint dla GPU compositing.

---

### 11. Brak structured data (JSON-LD)

Dla SEO portfolio fotograficznego przydałby się schemat `ProfessionalService` / `LocalBusiness`.

---

### 12. Zmienne CSS `--background`/`--foreground` częściowo redundantne z Tailwind config

Tailwind definiuje te same kolory. Zmienne CSS pełnią tę samą rolę co klasy `bg-black-deep` / `text-warm-white`.

---

## Podsumowanie priorytetów

| Priorytet | Ilość | Kluczowe |
|-----------|-------|----------|
| Krytyczny | 1 | Lenis-ScrollTrigger sync |
| Wysoki | 5 | scroll-behavior, grain overflow, reduced-motion, metadata, next.config |
| Średni | 3 | CSS reset, Oswald, Lenis CSS |
| Niski | 3 | will-change, JSON-LD, CSS vars |
