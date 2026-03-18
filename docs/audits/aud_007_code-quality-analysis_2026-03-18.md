# Audyt 007 — Analiza czystości kodu

**Data:** 2026-03-18
**Zakres:** Pełny przegląd jakości kodu — wszystkie sekcje, komponenty, style, konfiguracja
**Narzędzie:** Ręczna analiza kodu źródłowego

---

## 1. Ocena ogólna

| Kategoria | Ocena | Komentarz |
|---|---|---|
| Architektura projektu | ★★★★★ | Doskonała separacja odpowiedzialności, spójny App Router |
| Struktura plików | ★★★★★ | Logiczny podział: sections/, layout/, analytics/, pages/ |
| TypeScript | ★★★★☆ | Strict mode, dobre typowanie, ale kilka `null!` w refach |
| CSS / Styling | ★★★☆☆ | Masywna duplikacja między modułami CSS |
| Animacje (GSAP) | ★★★★☆ | Spójny wzorzec, ale duża powtarzalność kodu hooków |
| Dostępność (a11y) | ★★★★★ | aria-label, aria-expanded, reduced-motion, sr-only |
| Bezpieczeństwo | ★★★★★ | CSP, poweredByHeader: false, sanityzacja JSON-LD |
| Wydajność | ★★★★☆ | Lazy imports GSAP, priority images, ale brak dynamicznych importów sekcji |
| Testy | ★★★☆☆ | Tylko 5 testów, brak testów komponentów |
| Dokumentacja | ★★★★★ | 21 plików docs, ADR-y, audyty — wzorcowo |

**Ocena łączna: 4.0 / 5.0** — Kod jest wysokiej jakości z wyraźnym wzorcem architektonicznym. Główne obszary do poprawy: duplikacja CSS i hooków animacji.

---

## 2. Analiza poszczególnych sekcji

### 2.1. Warstwa aplikacji (`app/`)

**page.tsx** — Czysta, minimalna. Brak problemów.

**layout.tsx** — Bardzo dobrze:
- Fonty z `next/font/google` z `display: swap` (CLS-safe)
- JSON-LD z escapowaniem `</` (ochrona przed XSS)
- Zmienne env z fallbackami
- `cn()` do łączenia klas

**error.tsx / not-found.tsx** — Spójny design system z `page-shell`, `page-panel`, `ui-overline`. Brak uwag.

**contact/page.tsx** — Poprawna struktura z oddzielonymi komponentami i metadata.

### 2.2. Hero

| Aspekt | Ocena |
|---|---|
| Rozdzielenie mobile/desktop | ★★★★★ |
| Wydzielenie animacji do hooka | ★★★★★ |
| Lazy import GSAP | ★★★★★ |
| Respekt dla reduced-motion | ★★★★★ |

**Problemy:**
- `HeroTextBlock.tsx:7` — zmienna `ctaBaseClassName` mogłaby być przeniesiona do CSS Module zamiast być inline'owana w JS
- `MobileHeroLayout.tsx:12` — scale trick `scale-[calc(100vw/var(--mobile-frame-w))]` jest sprytny, ale kruchy — zmiana breakpointu md wymaga ręcznej synchronizacji z `--mobile-frame-w`

### 2.3. About

| Aspekt | Ocena |
|---|---|
| Viewfinder HUD concept | ★★★★★ |
| Animacja timera | ★★★★☆ |
| Text splitting logic | ★★☆☆☆ |

**Problemy krytyczne:**

1. **`About.tsx:135-148` / `154-168` / `183-190` — Twarde rozbijanie tekstu przez `.split()` / `.replace()`**

   ```tsx
   siteContent.about.lead.split('historie.').flatMap(...)
   .flatMap((part, index) => {
     const chunks = part.split('pisać.')
     ...
   })
   ```

   Tekst jest dzielony na `<br>` na podstawie konkretnych polskich słów (`"historie."`, `"pisać."`, `"filmem."`, `"wspomnień."`, `"Malxxxxx. "`). To jest **anty-wzorzec** — zmiana treści w `site-content.ts` złamie formatowanie. Każda taka logika powinna korzystać z `\n` w danych źródłowych i prostego `whitespace-pre-line` lub dedykowanego splita po `\n`.

2. **`About.tsx:22-31` — Nadużycie `null!` w refach**

   ```tsx
   const sectionRef = useRef<HTMLElement>(null!)
   ```

   Wzorzec `useRef<T>(null!)` (non-null assertion) jest stosowany w wielu komponentach (About, Services, Testimonials, Promo, Process, Faq, Cta). Choć jest popularny, ukrywa potencjalne runtime errors jeśli ref nie zostanie przypisany. Lepszym podejściem jest `useRef<T>(null)` z odpowiednim null-checkiem w hookach.

3. **`About.tsx:33-41` — setInterval 80ms dla HUD frame counter**

   Timer `setInterval(() => setHudFrame(c => c + 1), 80)` powoduje re-render co 80ms (12.5 FPS). To niepotrzebne obciążenie — licznik `TC` jest drobnym detalem UI. Zalecenie: użyć `requestAnimationFrame` z `useRef` zamiast `useState`, aby uniknąć re-renderów.

### 2.4. Services

| Aspekt | Ocena |
|---|---|
| Warianty kart (highlight/military) | ★★★★☆ |
| Obiekt VARIANT_CLASSES | ★★★★☆ |
| Video toggle logic | ★★★★★ |

**Problemy:**

1. **`Services.module.css:272-275` / `309-312` / `358-361` / `431-434` / `499-502` — Puste klasy wariantów**

   ```css
   .sceneCardHighlight,
   .sceneCardMilitary {
     /* Variants now share the unified card style — no overrides needed */
   }
   ```

   Wiele klas wariantów (`sceneCardHighlight`, `sceneCardMilitary`, `videoFrameHighlight`, `lensRingHighlight`, etc.) jest zdefiniowanych ale pustych. Te „zombie klasy" zajmują miejsce, dodają szum do CSS bundle i utrudniają czytanie kodu. Powinny zostać usunięte zarówno z CSS jak i z obiektu `VARIANT_CLASSES` w TSX.

2. **`Services.tsx:36-69` — Obiekt `VARIANT_CLASSES` z 13 kluczami** — Nadmiernie rozbudowany mapping, gdzie >50% wartości jest identycznych między wariantami. Sugestia: uprościć do jednego zestawu klas i usunąć rozróżnienie wariantów (skoro wizualnie są identyczne).

### 2.5. Testimonials

| Aspekt | Ocena |
|---|---|
| Carousel z clone-wrap | ★★★★★ |
| GSAP goTo + instant snap | ★★★★★ |
| Infinite loop bez błędów | ★★★★★ |

**Problemy:**

1. **`Testimonials.module.css:394` — `max-height: 300px` dla logo klientów** — Wartość wydaje się za duża dla logo (120×48 zadeklarowane w TSX). Powinna wynosić max ~60-80px.

2. **`Testimonials.tsx:237-239` / `279-282` — Hardkodowane `Array.from({ length: 24 })`** perforacji — magic number. Wyciągnąć do stałej.

### 2.6. Promo

| Aspekt | Ocena |
|---|---|
| YouTubeFacade (lazy iframe) | ★★★★★ |
| Video progress bar | ★★★★☆ |
| Privacy (youtube-nocookie.com) | ★★★★★ |

**Problemy:**

1. **`Promo.tsx:28` — `video.play()` bez `void`** — W `handlePlayPause`, `video.play()` zwraca Promise, ale nie jest obsługiwany (w `Services.tsx:109` poprawnie użyto `void video.play()`). Niespójność.

2. **`YouTubeFacade.tsx:44` — `<img>` zamiast `next/Image`** — YouTube thumbnails ładowane przez zwykły `<img>` omijają optymalizację Next.js Image. Choć to celowe (zewnętrzny URL), warto dodać `width`/`height` atrybuty, aby uniknąć CLS.

### 2.7. Process

Czysta implementacja. Brak uwag oprócz ogólnych (duplikacja CSS, `null!` refy).

### 2.8. FAQ

| Aspekt | Ocena |
|---|---|
| Accordion z clip-path | ★★★★★ |
| Film strip marker | ★★★★☆ |
| Keyboard accessibility | ★★★★☆ |

**Problem:**
- `Faq.tsx:152` — `aria-labelledby="faq-question-${i}"` odnosi się do ID `faq-question-${i}`, ale tego ID nie ma w kodzie (button nie ma `id`). Powinno być dodane `id={`faq-question-${i}`}` do elementu `<button>`.

### 2.9. CTA

| Aspekt | Ocena |
|---|---|
| Layered composition (glow/vignette/content) | ★★★★★ |
| Animated conic-gradient border | ★★★★★ |
| `@property --border-angle` | ★★★★★ |

**Problemy:**
- `Cta.tsx:52-58` — 8 osobnych refów dla rogów i krzyżyków. Można uprościć do jednego `shellRef` i querySelectorAll w hooku (tak jak w About).

---

## 3. Problemy systemowe (cross-cutting)

### 3.1. 🔴 Duplikacja CSS — HUD bar, corner marks, gradient text

**Priorytet: WYSOKI**

Następujące bloki CSS są skopiowane niemal identycznie w **6+ modułach**:

| Duplikowany blok | Pliki |
|---|---|
| `.gradientTextPrimary` | Hero.module, Testimonials.module, Process.module, Faq.module, Cta.module |
| `.hudBar` + `.hudLineLeft/Right` + `.hudLabel*` | About.module, Services.module, Promo.module, Testimonials.module, Process.module, Faq.module, Cta.module |
| `.cornerMark` + `.cornerTL/TR/BL/BR` | About.module, Services.module, Promo.module, Testimonials.module, Process.module, Faq.module, Cta.module |
| `.sectionHeader` + `.sectionTitle` | Testimonials.module, Process.module, Faq.module, Cta.module |

**Rekomendacja:** Wyciągnąć wspólne style do `globals.css` (warstwa `@layer components`) lub do dedykowanego `shared.module.css`. Szacunkowa redukcja: ~300-400 linii CSS.

### 3.2. 🔴 Duplikacja hooków animacji

**Priorytet: WYSOKI**

Każda sekcja ma własny hook animacji (`useAboutAnimations`, `useServicesAnimation`, `useProcessAnimations`, `useFaqAnimations`, `useCtaAnimations`, `useTestimonialsAnimation`), które powtarzają identyczny wzorzec:

```
1. Lazy import gsap + ScrollTrigger
2. Check reduced-motion
3. Set initial states (autoAlpha: 0, y: 30)
4. Create timeline with ScrollTrigger
5. Animate: HUD lines → HUD labels → title → content → CTA
6. Cleanup via ctx.revert()
```

**Rekomendacja:** Stworzyć generyczny hook `useSectionEntrance(refs, config)`, który obsłuży 80% przypadków. Sekcje z niestandardową logiką (About z viewfinderem, Testimonials z carousel) mogą go rozszerzyć.

### 3.3. 🟡 `useRef<T>(null!)` — non-null assertion na refach

**Priorytet: ŚREDNI**

Wzorzec `useRef<HTMLElement>(null!)` jest użyty w **~40 miejscach** w projekcie. Choć TypeScript pozwala na to, ukrywa to potencjalne null dereferences. Lepszy wzorzec:

```tsx
const ref = useRef<HTMLElement>(null)
// W hookach: if (!ref.current) return
```

### 3.4. 🟡 Font stack hardkodowany w CSS Modules

**Priorytet: ŚREDNI**

Wiele modułów CSS używa bezpośrednio:
```css
font-family: 'Roboto Mono', 'SFMono-Regular', Consolas, monospace;
```

Ale `Roboto Mono` **nie jest załadowany** w `layout.tsx` (tylko Bebas Neue i Inter). Przeglądarka fallbackuje do SFMono/Consolas, więc podanie 'Roboto Mono' jest mylące. Ponadto font stack powinien być zdefiniowany raz w Tailwind config (np. `fontFamily.mono`) zamiast być kopiowany.

### 3.5. 🟡 Brak testów komponentów

**Priorytet: ŚREDNI**

Istniejące 5 testów pokrywa tylko utility functions (`highlightLayout`, `serviceLayout`, `site-content`, `socialPlatforms`, `tailwind-config`). Brak:
- Testów renderowania komponentów (React Testing Library)
- Testów stron (smoke tests)
- Testów integracyjnych (np. nawigacja)

### 3.6. 🟢 Import React w komponentach

**Priorytet: NISKI**

Kilka komponentów importuje `React` z named import (`import React, { useRef } from 'react'`) — np. Process, Faq, Cta, Testimonials. Przy Next.js 14 z JSX transform nie jest to wymagane (ale też nie szkodzi). Dla spójności — albo wszędzie, albo nigdzie.

### 3.7. 🟢 Pusta reguła CSS

**Priorytet: NISKI**

`About.module.css:511` — pusta reguła `.ctaLink:hover {}`. Powinna zostać usunięta.

---

## 4. Analiza konfiguracji

### 4.1. `next.config.mjs`
- ✅ CSP z dynamic dev/prod
- ✅ Agresywne cache headers (immutable 1 year)
- ✅ AVIF/WebP image optimization
- ✅ Security headers (X-Frame-Options, Referrer-Policy, Permissions-Policy)
- ⚠️ Brak `X-XSS-Protection: 0` (nowsze przeglądarki go nie potrzebują, ale warto dodać jawnie)

### 4.2. `tailwind.config.ts`
- ✅ Referencje do CSS variables z `<alpha-value>`
- ✅ Custom design tokens (colors, fonts, spacing)
- ✅ Fluid typography z `clamp()`
- ⚠️ `plugins: []` — brak plugin'a `@tailwindcss/typography` (opcjonalne)

### 4.3. `tsconfig.json`
- ✅ `strict: true`
- ✅ Path aliases `@/*`
- ✅ Bundler resolution

### 4.4. `.eslintrc.json`
- ✅ `jsx-a11y/recommended`
- ✅ `@typescript-eslint/recommended`
- ⚠️ Wyłączone 3 reguły Tailwind — rozważyć włączenie `classnames-order` dla spójności

### 4.5. `package.json`
- ✅ Script `check` = typecheck + lint + test
- ✅ Minimalna lista dependencies
- ⚠️ Brak `engines` field (zalecane dla wersji Node.js)

---

## 5. Podsumowanie rekomendacji

### Priorytet WYSOKI (wpływ na utrzymywalność)
| # | Rekomendacja | Szacunkowy zysk |
|---|---|---|
| 1 | Wyciągnąć wspólne style (HUD, corners, gradient) do shared CSS | -300-400 linii CSS |
| 2 | Stworzyć generyczny hook `useSectionEntrance()` | -500+ linii TS, łatwiejsze dodawanie sekcji |
| 3 | Zastąpić `.split('historie.')` w About.tsx użyciem `\n` + `whitespace-pre-line` | Odporność na zmiany treści |

### Priorytet ŚREDNI (jakość kodu)
| # | Rekomendacja | Szacunkowy zysk |
|---|---|---|
| 4 | Zamienić `useRef<T>(null!)` na `useRef<T>(null)` + null checks | Bezpieczeństwo typów |
| 5 | Zdefiniować font-family `mono` w Tailwind config, usunąć 'Roboto Mono' | Spójność, mniej kodu |
| 6 | Usunąć puste klasy wariantów w Services.module.css | Czystość CSS |
| 7 | Dodać `id` do FAQ button dla `aria-labelledby` | Dostępność |
| 8 | Dodać testy komponentów (smoke rendering) | Pokrycie testami |
| 9 | Naprawić `video.play()` bez `void` w Promo.tsx | Spójność |

### Priorytet NISKI (porządki)
| # | Rekomendacja | Szacunkowy zysk |
|---|---|---|
| 10 | Ujednolicić import React (usunąć lub dodać wszędzie) | Spójność |
| 11 | Usunąć pustą regułę `.ctaLink:hover {}` | Czystość |
| 12 | Wyciągnąć magic number `24` (perforacje) do stałej | Czytelność |
| 13 | Dodać `width`/`height` do `<img>` w YouTubeFacade | CLS |
| 14 | Zamienić `setInterval` na `requestAnimationFrame` w About HUD timer | Wydajność |

---

## 6. Metryki kodu

| Metryka | Wartość |
|---|---|
| Pliki TSX/TS | ~52 |
| Pliki CSS Module | 8 |
| Linie CSS (modules) | ~2800 |
| Szacunkowa duplikacja CSS | ~400 linii (14%) |
| Linie TypeScript (components) | ~2200 |
| Szacunkowa duplikacja TS (hooki) | ~500 linii (23%) |
| Zależności produkcyjne | 6 (minimalna) |
| Pokrycie testami | ~15% (tylko utility) |

---

*Raport wygenerowany na podstawie pełnej analizy kodu źródłowego projektu Strona_002.*
