# Coding Standards — Strona_002

**Stack:** Next.js 14+ (App Router) · TypeScript · Tailwind CSS · GSAP · Lenis
**Ostatnia aktualizacja:** 2026-02-19

---

## 1. Struktura projektu

```
app/                        # Next.js App Router — strony i layouty
  layout.tsx                # Root layout (fonty, meta, global providers)
  page.tsx                  # Strona główna
  error.tsx                 # Error boundary
  not-found.tsx             # Strona 404
  globals.css               # TYLKO: Tailwind directives, base, Lenis, reduced-motion
components/
  sections/                 # Sekcje strony (Hero, Services, About…)
    Hero.tsx
    Hero.module.css         # Style specyficzne dla komponentu
  ui/                       # Reużywalne komponenty UI (Button, Card, Tag…)
  layout/                   # Header, Footer, Navigation, SmoothScroll
lib/                        # Helpery, konfiguracja, stałe
  cn.ts                     # clsx + tailwind-merge helper
public/                     # Zasoby statyczne (obrazy, wideo, fonty)
docs/                       # Dokumentacja projektu
```

### Zasady

- Jeden komponent = jeden plik. Nazwy plików w **PascalCase** (`Hero.tsx`, `ServiceCard.tsx`).
- Helpery i utile w katalogu `lib/`, nazwy w **camelCase** (`cn.ts`, `formatDate.ts`).
- Nie tworzyć plików `index.ts` barrel exports — importy mają wskazywać bezpośrednio na plik.
- Każdy nowy komponent sekcji trafia do `components/sections/`, każdy reużywalny element UI do `components/ui/`.

---

## 2. TypeScript

### Tryb strict

`tsconfig.json` ma `"strict": true`. Nie wyłączać żadnych flag strict mode.

### Typowanie

```ts
// Dobrze — explicite typowanie propsów
interface HeroProps {
  title: string
  subtitle?: string
}

export default function Hero({ title, subtitle }: HeroProps) { ... }

// Źle — any, as unknown, @ts-ignore
const data: any = fetchData()        // NIGDY
// @ts-ignore                         // NIGDY
const x = value as unknown as string  // NIGDY
```

### Konwencje

- **Interfejsy** dla propsów komponentów: `interface XxxProps { ... }`.
- **Type** dla union types, utility types i aliasów: `type Status = 'idle' | 'loading' | 'error'`.
- Nie eksportować typów, których nie używają inne moduły.
- Refy typowane explicite: `useRef<HTMLElement>(null)`, nie `useRef(null)`.

---

## 3. Komponenty React

### Server vs Client Components

- Domyślnie komponenty są **Server Components** (brak `'use client'`).
- Dodawać `'use client'` **tylko** gdy komponent wymaga: `useState`, `useEffect`, `useRef`, event handlerów, lub bibliotek klienckich (GSAP, Lenis).
- Nie dodawać `'use client'` do komponentu-rodzica tylko dlatego, że dziecko jest klienckie — importować dziecko w Server Component.

### Struktura komponentu

```tsx
'use client' // tylko gdy potrzebne

import { useEffect, useRef } from 'react'
// 1. Zewnętrzne importy
import { gsap } from 'gsap'
// 2. Wewnętrzne importy
import { cn } from '@/lib/cn'
// 3. Import stylów modułu
import styles from './Hero.module.css'

// 4. Interfejs propsów (jeśli komponent przyjmuje propsy)
interface HeroProps {
  title: string
}

// 5. Komponent
export default function Hero({ title }: HeroProps) {
  // 6. Refy → Stan → Efekty → Handlery → Render
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => { ... }, [])

  return <section ref={sectionRef}>...</section>
}
```

### Zasady

- Jeden eksportowany komponent na plik. Małe helpery (np. `SplitLetters`) mogą żyć w tym samym pliku, ale **nie** są eksportowane.
- Nie używać `React.FC` — zwykłe funkcje z typowanymi propsami.
- Unikać `forwardRef` gdy nie jest potrzebny.
- Cleanup w `useEffect` jest **obowiązkowy** dla timerów, listenerów, instancji GSAP/Lenis.

---

## 4. CSS i Tailwind

### Hierarchia stylów

| Priorytet | Gdzie | Co |
|---|---|---|
| 1 | `tailwind.config.ts` | Design tokens — kolory, fonty, spacing, breakpointy |
| 2 | `globals.css` | Style globalne: Tailwind directives, base, Lenis, `prefers-reduced-motion` |
| 3 | `*.module.css` | Style specyficzne dla komponentu (animacje, keyframes, pseudo-elementy) |
| 4 | `className` w JSX | Utility classes Tailwind — layout, spacing, typografia |

### Tailwind — zasady

```tsx
// Dobrze — krótkie, czytelne klasy
<div className="flex items-center gap-4 p-6">

// Dobrze — cn() helper dla warunkowych klas
<button className={cn('px-6 py-3 font-semibold', isActive && 'bg-khaki')}>

// Źle — 5+ linii klas na jednym elemencie
<button className="mt-10 self-start inline-block font-inter font-semibold
                    text-sm uppercase tracking-widest px-8 py-4 bg-khaki
                    text-warm-white rounded-[2px] transition-colors duration-300
                    hover:bg-military-green focus-visible:outline
                    focus-visible:outline-2 focus-visible:outline-offset-2">
```

**Reguły:**
- Gdy className przekracza **3 linie** — wydzielić do `@apply` w `*.module.css` lub stworzyć komponent UI (`<Button variant="primary">`).
- **Nie** używać arbitrary values (`text-[80px]`, `rounded-[2px]`). Zamiast tego rozszerzyć `tailwind.config.ts`:
  ```ts
  fontSize: { display: ['80px', { lineHeight: '0.9' }] },
  borderRadius: { sm: '2px' },
  ```
- Stałe wartości designu (kolory, fonty, rozmiary) **zawsze** w `tailwind.config.ts` — nigdy hardcodowane w klasach.

### CSS Modules — zasady

- Plik modułu **przy komponencie**: `Hero.tsx` → `Hero.module.css`.
- W module trafiają: `@keyframes`, pseudo-elementy (`::before`, `::after`), złożone selektory, animacje CSS.
- Nazwy klas w **camelCase**: `.grainOverlay`, nie `.grain-overlay`.
- Nie umieszczać w module tego, co robi Tailwind (spacing, kolory, flexbox).
- Elementy z `inset` negatywnym (np. grain `::before` z `inset: -50%`) **muszą** mieć `overflow: hidden` na rodzicu — inaczej renderują się poza widocznym obszarem i marnują GPU (aud_001 #3).

### `cn()` helper

Projekt używa helpera `cn()` (`clsx` + `tailwind-merge`):

```ts
// lib/cn.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

Używać `cn()` gdy:
- Klasy są warunkowe (`cn('base', isActive && 'active-class')`)
- Komponent przyjmuje `className` z zewnątrz (`cn(styles.root, className)`)
- Trzeba mergować klasy Tailwind bez konfliktów

### globals.css — co może tam być

- `@tailwind base / components / utilities`
- `@layer base { ... }` — reset i base styles dla `body`, `html`
- Style Lenis (globalny smooth scroll)
- `@media (prefers-reduced-motion: reduce)` — globalna reguła
- **Nic więcej** — style komponentów idą do CSS Modules

### Unikanie kolizji CSS (aud_001 #2, #7)

- **Nie** deklarować `scroll-behavior: smooth` w CSS gdy Lenis jest aktywny — powoduje podwójne wygładzanie i jank. Lenis jest jedynym źródłem smooth scroll.
- **Nie** pisać ręcznego resetu (`*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0 }`) — Tailwind Preflight (`@tailwind base`) robi to samo. Podwójna deklaracja to redundancja.
- Przed dodaniem reguły do `globals.css` sprawdzić, czy Tailwind Preflight lub `@layer base` nie obsługuje tego już domyślnie.

---

## 5. Animacje (GSAP)

### Kontekst i cleanup

```tsx
useEffect(() => {
  const ctx = gsap.context(() => {
    // wszystkie animacje tu
  })
  return () => ctx.revert() // OBOWIĄZKOWY cleanup
}, [])
```

**Każdy** `useEffect` z GSAP musi tworzyć `gsap.context()` i wracać `ctx.revert()`. Bez tego — memory leaks i zombie animacje.

### Reduced motion

```tsx
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

if (prefersReducedMotion) {
  // gsap.set() — natychmiast ustaw stan końcowy, bez animacji
  gsap.set(elements, { autoAlpha: 1, y: 0 })
  return
}
// normalne animacje
```

**Obowiązkowe** w każdym komponencie z animacjami. Sprawdzenie na początku `useEffect`, przed rejestracją animacji.

### Stan początkowy

- Ustawiać w JS przez `gsap.set()`, **nie** w CSS.
- Powód: SSR HTML musi być widoczny przed hydracją. Jeśli CSS ukryje elementy, użytkownik bez JS zobaczy pustą stronę.

### ScrollTrigger + Lenis (aud_001 #1)

- Lenis jest zintegrowany z GSAP ticker w `SmoothScroll.tsx`.
- Nie tworzyć własnej instancji Lenis — używać globalnej.
- ScrollTrigger działa automatycznie dzięki `lenis.on('scroll', ScrollTrigger.update)`.
- Lenis **musi** być podpięty do GSAP ticker (`gsap.ticker.add`) i mieć wyłączony `lagSmoothing(0)`.
  Bez tego ScrollTrigger widzi natywną pozycję scrolla, a Lenis ją przechwytuje — parallax i scroll-triggered animacje się rozjadą.
- Integrację utrzymywać w jednym miejscu (`SmoothScroll.tsx`) — nie rozpraszać po komponentach.

### Easing i timing

- Domyślny easing: `power2.out` (zgodnie z design.md).
- UI elements: `300–800ms`.
- Cinematic effects: `1000–2000ms`.
- Stagger: `0.03–0.06` na element.

---

## 6. Next.js — konfiguracja i metadane (aud_001 #5, #6)

### `next.config.mjs`

Plik nie może być pusty. Wymagane minimum:

```js
const nextConfig = {
  poweredByHeader: false,              // ukryj fingerprint
  images: { remotePatterns: [...] },   // CDN / Cloudinary
  async headers() { return [...] },    // nagłówki bezpieczeństwa
}
```

Przy dodawaniu nowych zasobów zewnętrznych (CDN, API, embed) — aktualizować `images.remotePatterns` i `Content-Security-Policy`.

### Metadata API

Używać pełnego Metadata API Next.js w `layout.tsx`:

```ts
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: '...', template: '%s | ...' },
  description: '...',
  robots: { index: true, follow: true },
  openGraph: { type: 'website', locale: 'pl_PL', ... },
  twitter: { card: 'summary_large_image', ... },
  icons: { icon: '/favicon.ico', apple: '/apple-touch-icon.png' },
}
```

**Obowiązkowe pola:** `title`, `description`, `openGraph`, `twitter`, `robots`, `icons`, `metadataBase`.
Przy dodawaniu nowej strony — uzupełniać `metadata` w `page.tsx` (dziedziczenie z layoutu + nadpisania).

### Structured Data (JSON-LD) (aud_001 #11)

- Każda strona publiczna powinna mieć schemat JSON-LD (np. `ProfessionalService`, `ImageGallery`).
- JSON-LD renderować w `<head>` przez `<script type="application/ld+json">`.
- Walidować schemat przez [Google Rich Results Test](https://search.google.com/test/rich-results).

---

## 7. Bezpieczeństwo

### Nagłówki HTTP

Konfiguracja w `next.config.mjs`. Wymagane nagłówki:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- `Content-Security-Policy` — skonfigurowany pod użyte zasoby (fonty, skrypty, media)

### Zmienne środowiskowe

- Sekrety (API keys, tokeny) — **tylko** w `.env.local`, **nigdy** w kodzie.
- `.env.example` — template ze wszystkimi wymaganymi zmiennymi (bez wartości).
- Zmienne publiczne (widoczne w kliencie) — prefix `NEXT_PUBLIC_`.
- Zmienne serwerowe (bez prefixu) — dostępne tylko w Server Components i API Routes.

### `dangerouslySetInnerHTML`

- Unikać. Jedyny akceptowalny przypadek: JSON-LD w `<script type="application/ld+json">`.
- Przy JSON-LD: dane muszą przechodzić przez `JSON.stringify()` z escapowaniem `</`:
  ```ts
  JSON.stringify(jsonLd).replace(/</g, '\\u003c')
  ```

---

## 8. Dostępność (a11y)

### Obowiązkowe

- `lang="pl"` na `<html>`.
- `aria-hidden="true"` na elementach dekoracyjnych (wideo-tła, overlaye, ikony bez znaczenia).
- `focus-visible` outline na **każdym** interaktywnym elemencie (linki, przyciski, inputy).
- `prefers-reduced-motion` — globalna reguła CSS + warunek w GSAP (patrz sekcja 5).
- Alt text na obrazach treściowych. `alt=""` na obrazach dekoracyjnych.
- Semantyczny HTML: `<section>`, `<nav>`, `<main>`, `<header>`, `<footer>` — nie `<div>` na wszystko.
- Kontrast tekstu: minimum WCAG AA (4.5:1 dla body, 3:1 dla dużego tekstu).

### Nawigacja klawiaturą

- Tab order musi być logiczny (góra→dół, lewo→prawo).
- Każdy element klikalny myszką musi być dostępny przez klawiaturę.
- Focus trap w modalach (lightbox).

---

## 9. Wydajność

### Obrazy

- Używać `next/image` — **nigdy** surowego `<img>`.
- Format: WebP (automatycznie przez Next.js Image Optimization).
- `priority` na obrazach above the fold (Hero). Reszta — lazy loading (domyślnie).
- Zawsze podawać `width` i `height` lub `fill` — zapobiega layout shift (CLS).

### Fonty (aud_001 #8)

- Ładowanie przez `next/font/google` z `display: 'swap'`.
- **Nie** importować fontów na zapas — każdy font w `layout.tsx` musi być aktualnie używany w kodzie. Nieużywany font to 20–40 KB dodane do initial load.
- CSS variables (`--font-bebas`, `--font-inter`) — zdefiniowane w `layout.tsx`, używane w `tailwind.config.ts`.
- `font-mocks.js` (CI) musi odpowiadać aktualnym fontom — po usunięciu fontu usunąć też mock.

### Bundle

- Nie instalować paczek "na zapas" — każda zależność w `package.json` musi być używana w kodzie. Nieużywana paczka to martwy balast w `node_modules` i potencjalne ryzyko bezpieczeństwa.
- `'use client'` tylko tam, gdzie potrzebne — Server Components nie trafiają do client bundle.
- Dynamiczne importy (`next/dynamic`) dla ciężkich komponentów below the fold.

### GPU i compositing (aud_001 #10)

- Elementy animowane przez GSAP (`transform`, `opacity`) powinny mieć `will-change: transform` jako hint dla GPU compositing.
- Dodawać `will-change` **tylko** na elementach faktycznie animowanych — nadużywanie powoduje nadmierny memory overhead.
- Elementy poza viewport nie powinny animować się ciągle — używać `ScrollTrigger` do aktywacji/deaktywacji.

### Zewnętrzne biblioteki CSS (aud_001 #9)

- Gdy paczka wymaga własnych stylów (np. Lenis `lenis/dist/lenis.css`), zaimportować je w odpowiednim scope:
  - Globalne style → `globals.css` lub `layout.tsx`
  - Komponentowe style → odpowiedni CSS Module lub Client Component
- Nie odtwarzać ręcznie stylów biblioteki — mogą się zmienić przy aktualizacji paczki.

---

## 10. Git i wersjonowanie

### Commit messages

Format: `<type>: <opis>` (lowercase, bez kropki na końcu)

```
feat: add Services section with scroll-triggered card animations
fix: resolve grain overlay z-index on mobile Safari
refactor: extract Button component from Hero CTA
docs: update coding standards with CSS Modules rules
chore: remove unused framer-motion dependency
```

Typy: `feat`, `fix`, `refactor`, `docs`, `chore`, `test`, `perf`.

### Branches

- `main` — produkcja, stabilny kod.
- `claude/<opis>-<id>` — feature branches.
- Nie pushować bezpośrednio na `main`.

### Lockfile

- `package-lock.json` **musi** być commitowany (nie w `.gitignore`).
- Zapewnia deterministyczne buildy (`npm ci`).

### .gitignore

- Tylko wpisy relevantne dla stacku (Next.js, Node.js, IDE).
- Nie kopiować szablonów z innych technologii.

---

## 11. Struktura pliku konfiguracyjnego Tailwind

```ts
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',         // App Router
    './components/**/*.{ts,tsx}',  // Komponenty
  ],
  theme: {
    extend: {
      colors: {
        // design.md — paleta kolorów (semantyczne nazwy)
        'black-deep':     '#0D0D0D',
        'anthracite':     '#1A1A1A',
        'ecru':           '#F5F0EB',
        'warm-white':     '#FFFFFF',
        'warm-gray':      '#C8C0B4',
        'khaki':          '#8B7355',
        'military-green': '#4A5240',
      },
      fontFamily: {
        bebas: ['var(--font-bebas)', 'sans-serif'],
        inter: ['var(--font-inter)', 'sans-serif'],
      },
      // Wszystkie wartości designu tu — nie w arbitrary values
      fontSize: {
        display: ['80px', { lineHeight: '0.9', letterSpacing: '0.05em' }],
      },
      borderRadius: {
        sm: '2px',
      },
    },
  },
  plugins: [],
}

export default config
```

**Zasada:** Jeśli wartość pojawia się w więcej niż jednym miejscu — trafia do configa jako token. Jeśli pojawia się raz — dopuszczalny arbitrary value, ale preferowany jest token.

---

## Źródła

Zasady oparte na wnioskach z audytów projektu:
- `docs/audits/aud_001_2026-02-19.md` — audyt optymalizacyjny (Lenis/GSAP sync, CSS kolizje, metadane, wydajność)
- `docs/audits/aud_002_code-review_2026-02-19.md` — code review (Tailwind inline, CSS Modules, bezpieczeństwo, a11y)
