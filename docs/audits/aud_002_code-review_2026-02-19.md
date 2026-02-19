# Code Review — branch `main`

**Data:** 2026-02-19
**Zakres:** Pełna analiza kodu pod kątem dobrych praktyk
**Commit:** bb78cc2 (Merge pull request #7)

---

## CO JEST DOBRE

### 1. Architektura i struktura projektu
- Czytelna struktura katalogów Next.js App Router (`app/`, `components/sections/`, `components/layout/`).
- Sensowny podział komponentów — `Hero`, `SmoothScroll` mają jasno określone odpowiedzialności.
- Aliasy importów `@/*` w `tsconfig.json`.

### 2. Bezpieczeństwo (`next.config.mjs`)
- `poweredByHeader: false` — ukrywa fingerprint technologii.
- Nagłówki: `X-Content-Type-Options`, `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy`.
- `.env` w `.gitignore`, `.env.example` z opisami.

### 3. SEO i metadane (`layout.tsx`)
- Rozbudowany `metadata` z Open Graph, Twitter Cards, `robots`, `icons`.
- JSON-LD `ProfessionalService` — dane strukturalne.
- `metadataBase` ustawione.
- `SITE_URL` / `AUTHOR_NAME` wyciągnięte do env z fallbackami.

### 4. Typografia i fonty
- `next/font/google` z `display: 'swap'` — brak FOIT.
- CSS variables (`--font-bebas`, `--font-inter`).
- `font-mocks.js` dla CI.

### 5. Dostępność (a11y)
- `lang="pl"` na `<html>`.
- `aria-hidden="true"` na dekoracyjnych elementach.
- `focus-visible` outline na CTA.
- `prefers-reduced-motion` w CSS i JS (WCAG 2.1 SC 2.3.3).

### 6. Animacje (`Hero.tsx`)
- GSAP context + `ctx.revert()` cleanup — brak memory leaków.
- Animacje inicjowane w JS — SSR HTML widoczny przed hydracją.
- Parallax `ScrollTrigger` + integracja Lenis.

### 7. CSS (`globals.css`)
- `will-change: transform` na grain overlay.
- `@media (prefers-reduced-motion: reduce)` — globalna redukcja.
- Style Lenis wydzielone z komentarzami.

### 8. TypeScript
- `strict: true`.
- Poprawne typowanie refów.
- `isolatedModules: true`.

### 9. Tailwind (`tailwind.config.ts`)
- Semantyczne nazwy kolorów (`black-deep`, `khaki`, `military-green`).
- Font family przez CSS variables.

---

## CO JEST ZŁE / DO POPRAWY

### KRYTYCZNE

#### K1. `framer-motion` w dependencies ale nigdzie nieużywany
- **Plik:** `package.json`
- ~50 KB gzipped w bundle bez powodu. Projekt używa GSAP.
- **Fix:** `npm uninstall framer-motion`

#### K2. `font-mocks.js` zawiera mock Oswald — font usunięty
- **Plik:** `font-mocks.js`
- Oswald usunięty w commicie `9f4bd72`, ale mock nadal istnieje.
- **Fix:** Usunąć wpis Oswald z `font-mocks.js`.

### WAŻNE

#### W1. Rozbudowane łańcuchy klas Tailwind inline — brak abstrakcji
- **Pliki:** `components/sections/Hero.tsx`, `app/layout.tsx`
- Długie className strings (do 9 linii na jednym elemencie) utrudniają czytelność
  i będą się powtarzać w kolejnych sekcjach (Services, About, Portfolio).
- Przykład — CTA button (`Hero.tsx:161-170`):
  ```
  className="mt-10 self-start inline-block
             font-inter font-semibold text-sm uppercase tracking-widest
             px-8 py-4 bg-khaki text-warm-white rounded-[2px]
             transition-colors duration-300 hover:bg-military-green
             focus-visible:outline focus-visible:outline-2
             focus-visible:outline-khaki focus-visible:outline-offset-2"
  ```
- Arbitrary values (`rounded-[2px]`, `text-[80px]`, `leading-[0.9]`) łamią system
  design tokenów Tailwind — powinny być w `tailwind.config.ts` jako rozszerzenia.
- Brak `cn()` helpera (`clsx` + `tailwind-merge`) — warunkowe klasy i merge propsów
  będą problematyczne przy rozbudowie komponentów.
- **Fix:**
  1. Powtarzalne wzorce (button, heading) wydzielić przez `@apply` lub `cva` (class-variance-authority).
  2. Arbitrary values przenieść do `tailwind.config.ts`:
     ```ts
     borderRadius: { sm: '2px' },
     fontSize: { display: ['80px', { lineHeight: '0.9' }] },
     ```
  3. Dodać `cn()` helper: `npm install clsx tailwind-merge`.

#### W2. Brak CSS Modules — style komponentów w `globals.css`
- **Pliki:** `app/globals.css`, `components/sections/Hero.tsx`
- `@keyframes grain`, `.grain-overlay` i `::before` to style specyficzne dla Hero,
  ale żyją w `globals.css`. Przy kolejnych sekcjach (Services, About, Portfolio, Contact)
  globals stanie się workiem na style wszystkich komponentów.
- Next.js natywnie wspiera CSS Modules — brak dodatkowych zależności.
- **Fix:** Przenieść style komponentowe do plików `*.module.css` przy komponentach:
  ```
  components/sections/
    Hero.tsx
    Hero.module.css      ← @keyframes grain, .grain-overlay, ::before
    Services.tsx
    Services.module.css
  ```
  W `globals.css` zostawić tylko: Tailwind directives, base body styles, Lenis styles,
  `prefers-reduced-motion`.

#### W3. `package-lock.json` w `.gitignore`
- **Plik:** `.gitignore` (ostatnia linia)
- Bez lockfile buildy nie są deterministyczne. `npm ci` nie zadziała.
- **Fix:** Usunąć `package-lock.json` z `.gitignore`, wygenerować i scommitować lockfile.

#### W4. `.gitignore` z szablonu Visual Studio (~250+ linii zbędnych reguł)
- **Plik:** `.gitignore`
- Reguły dla C#, VB.NET, Azure, NuGet, Silverlight, F# — nieużywane.
- **Fix:** Zastąpić czystym `.gitignore` dla Next.js (~20-30 linii).

#### W5. `SplitLetters` nie obsługuje spacji
- **Plik:** `components/sections/Hero.tsx:17-29`
- `inline-block` na spacji kolapsuje ją wizualnie.
- **Fix:** `{char === ' ' ? '\u00A0' : char}` lub warunek na `&nbsp;`.

#### W6. Brak `Content-Security-Policy`
- **Plik:** `next.config.mjs`
- Pozostałe nagłówki bezpieczeństwa są, ale CSP — najważniejszy — brakuje.
- **Fix:** Dodać bazowy CSP header.

### ŚREDNIE

#### S1. `dangerouslySetInnerHTML` dla JSON-LD z env vars
- **Plik:** `app/layout.tsx:74-77`
- Zmienne env w JSON-LD mogą zawierać `</script>` — brak sanityzacji.
- **Fix:** Escapować `</` w JSON.stringify output.

#### S2. Brak `error.tsx` i `not-found.tsx`
- Next.js App Router potrzebuje tych plików do obsługi błędów.
- **Fix:** Dodać oba pliki z minimalnymi komponentami.

#### S3. `<video>` bez `<source>` — pusta sekcja
- **Plik:** `components/sections/Hero.tsx:137`
- Zakomentowany `<source>`, brak fallbacku (statyczny obraz).
- **Fix:** Dodać fallback image jako tło do czasu dodania pliku wideo.

### DROBNE

#### D1. Brak testów
- Brak `jest.config`, `vitest.config`, plików `*.test.tsx`.

#### D2. ESLint tylko `next/core-web-vitals`
- **Plik:** `.eslintrc.json`
- Brak `jsx-a11y`, `tailwindcss`, `@typescript-eslint/recommended`.

#### D3. Tailwind content zawiera `./pages/**` — niepotrzebne
- **Plik:** `tailwind.config.ts:5`
- Projekt używa App Router, nie Pages Router.

#### D4. Zbyt szerokie wersje zależności
- **Plik:** `package.json`
- `"react": "^18"`, `"typescript": "^5"` — brak minor versions.

#### D5. Brak komentarza przy `lenis.raf(time * 1000)`
- **Plik:** `components/layout/SmoothScroll.tsx:23`
- Przeliczenie sekund→ms poprawne, ale nieintuicyjne bez wyjaśnienia.

---

## PODSUMOWANIE

| Kategoria | Ocena |
|---|---|
| Struktura projektu | Dobra |
| Bezpieczeństwo | Dobra (brak CSP) |
| SEO / Metadane | Bardzo dobra |
| Dostępność | Bardzo dobra |
| Typografia / Fonty | Bardzo dobra |
| Animacje / GSAP | Dobra |
| CSS / Tailwind | Średnia (inline classes, arbitrary values) |
| TypeScript | Dobra |
| Konfiguracja buildu | Średnia |
| Testy | Brak |
| Higiena kodu | Średnia |

### Priorytety napraw
1. Usunąć `framer-motion` z dependencies (K1)
2. Wydzielić powtarzalne klasy Tailwind — `cn()` helper, `@apply` / `cva`, tokeny w config (W1)
3. Przenieść style komponentowe do CSS Modules — odchudzić `globals.css` (W2)
4. Commitować `package-lock.json` (W3)
5. Wyczyścić `.gitignore` (W4)
6. Dodać `Content-Security-Policy` (W6)
7. Dodać `error.tsx` i `not-found.tsx` (S2)
8. Usunąć Oswald z `font-mocks.js` (K2)
