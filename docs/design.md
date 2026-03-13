# Design System – Portfolio Fotograficzno-Wideo

## 1. Kierunek wizualny

**Nazwa stylu:** Tactical Elegance
**Nastrój:** Surowy, militarny, premium — z przestrzenią na ciepło i emocje (wesela, rodziny)
**Inspiracje:** Ciemne portfolio fotograficzne, estetyka wojskowa, tekstury terenowe, kinowy klimat

Strona ma łączyć dwa światy: **twardy, terenowy klimat** (survival, drony, off-road) z **elegancją i emocją** (wesela, sesje rodzinne). Spójność osiągamy przez jednolitą paletę kolorów i typografię — klimat zmienia się subtelnie przez dobór zdjęć.

---

## 2. Paleta kolorów

### Kolory główne

| Nazwa              | Hex       | CSS token / Tailwind   | Zastosowanie                                        |
|--------------------|-----------|------------------------|-----------------------------------------------------|
| Czerń / Antracyt   | `#0D0D0D` | `black-deep`           | Tło sekcji ciemnych (Hero, Kim jestem, Proces, FAQ) |
| Antracyt jasny     | `#1A1A1A` | `anthracite`           | Karty, tła pomocnicze w sekcjach dark               |
| Ecru / Ciepła biel | `#F5F0EB` | `ecru`                 | Tło sekcji jasnych (Portfolio)                      |
| Biel               | `#FFFFFF` | `warm-white`           | Teksty na ciemnym tle, ikony                        |
| Ciepły szary       | `#C8C0B4` | `warm-gray`            | Teksty pomocnicze, opisy na ciemnym tle             |

### Kolory akcentów

| Nazwa              | Hex       | CSS token / Tailwind   | Zastosowanie                                           |
|--------------------|-----------|------------------------|--------------------------------------------------------|
| Khaki / Olive Gold | `#8B7355` | `--c-gold` / `khaki`   | Akcent główny: linie, gradienty, focus ring            |
| Khaki jasny        | `#929A75` | `--c-khaki`            | Gradient secondary: eyebrow, opis, CTA secondary       |
| Ciepły highlight   | `#B4825A` | `--c-warm`             | Punkt startowy gradientu primary: headline, CTA        |
| Zieleń militarna   | `#4A5240` | `--c-olive` / `military-green` | Akcent poboczny: wzór pasków tła, tagi      |

> Tokeny CSS zdefiniowane w `app/globals.css` jako format `R G B` (bez `rgb()`), co umożliwia modyfikatory opacity:
> `rgb(var(--c-gold) / 0.5)`. Tailwind aliasy: `khaki`, `military-green`.

### Gradienty (zdefiniowane w Hero.module.css, wspólne dla całej strony)

**Primary** — złoto-ciepły (nagłówki sekcji, CTA primary):
```css
linear-gradient(130deg, rgb(var(--c-warm)) 0%, rgb(255 238 175) 45%, rgb(var(--c-gold)) 100%)
```

**Secondary** — khaki-zielony (eyebrow, opisy, CTA secondary):
```css
linear-gradient(130deg, rgb(var(--c-khaki)) 0%, rgb(218 226 192) 50%, rgb(var(--c-khaki)) 100%)
```

Technika: `-webkit-background-clip: text; color: transparent` — gradient nakładany na tekst.

### Użycie kolorów w sekcjach

| Sekcja             | Tło         | Akcent      |
|--------------------|-------------|-------------|
| Hero               | `#0D0D0D`   | `#8B7355`   |
| Kim jestem         | `#1A1A1A`   | `#8B7355`   |
| Korzyści           | `#0D0D0D`   | `#8B7355`   |
| Oferta             | `#1A1A1A`   | `#8B7355`   |
| Portfolio / Galeria| `#F5F0EB`   | `#4A5240`   |
| Instagram Feed     | `#1A1A1A`   | `#8B7355`   |
| Proces             | `#0D0D0D`   | `#8B7355`   |
| Opinie             | `#1A1A1A`   | `#8B7355`   |
| FAQ + mocne CTA    | `#0D0D0D`   | `#8B7355`   |

---

## 3. Typografia

### Czcionki

| Rola              | Font         | Waga          | Zastosowanie                                        |
|-------------------|--------------|---------------|-----------------------------------------------------|
| Display / H1      | `Bebas Neue` | 400 (regular) | Hero hasło, główne tytuły sekcji                    |
| Eyebrow / H2–H3   | `Bebas Neue` | 400 (regular) | Eyebrow, podtytuły sekcji, nazwy usług, CTA, tagi   |
| Body / tekst      | `Inter`      | 300–400       | Długie opisy, akapity, metadane                     |
| UI overline       | `Inter`      | 400           | Małe etykiety (`.ui-overline`): `text-xs uppercase tracking-[0.2em]` |

> **Uwaga:** Font `Oswald` nie jest zainstalowany w projekcie. Wszystkie nagłówki i akcenty używają **Bebas Neue**.

### Skala typografii (desktop)

| Element               | Rozmiar                          | Line-height | Letter-spacing  |
|-----------------------|----------------------------------|-------------|-----------------|
| H1 Display (Hero)     | `clamp(80px, 10vw, 110px)`       | `0.9`       | brak (tight)    |
| Eyebrow / H2–H3       | `18px` (eyebrow), większe wg potrzeb | `1.1`   | `0.15em`        |
| Opis / body Bebas     | `16px`                           | `1.5`       | `0.15em`        |
| CTA / button          | `18px`                           | —           | `0.10em`        |
| UI overline (Inter)   | `12px` (`text-xs`)               | —           | `0.20em`        |
| Body (Inter)          | `16–18px`                        | `1.6`       | domyślny        |
| Small (Inter)         | `13–14px`                        | `1.5`       | domyślny        |

### Klasy Tailwind

- `font-bebas` — Bebas Neue
- `font-inter` — Inter
- `text-display` — `clamp(80px, 10vw, 110px)` z `leading-[0.9]`
- `tracking-heading` — `0.15em`
- `tracking-overline` — `0.20em`
- `.ui-overline` (komponent globalny) — Inter xs uppercase 0.20em khaki

---

## 4. Efekty wizualne

### 4.1 Tło sekcji ciemnych — diagonal stripe

Klasa globalna `.section-dark-bg` (zdefiniowana w `app/globals.css`):

```css
background:
  repeating-linear-gradient(
    45deg,
    rgb(var(--c-olive) / 0.09) 0,
    rgb(var(--c-olive) / 0.09) 1px,
    transparent 1px,
    transparent 22px   /* 1px linia co 22px ≈ 15,5px wizualny rozstaw przy 45deg */
  ),
  rgb(13 13 13);
```

Stosować we wszystkich sekcjach na ciemnym tle. Nie duplikować — używać wyłącznie klasy `.section-dark-bg`.

### 4.2 Gradient-text (technika)

Podstawowa technika kolorowania nagłówków i CTA:

```css
background: linear-gradient(...);
-webkit-background-clip: text;
background-clip: text;
color: transparent;
```

Używać klas `styles.gradientTextPrimary` (primary) i `styles.gradientTextSecondary` (secondary) z `Hero.module.css` lub implementować analogicznie w CSS Modules kolejnych sekcji.

### 4.3 Linie dekoracyjne

**Separator poziomy** — od pełnego khaki do przezroczystości (koniec bloku):
```html
<span class="block h-px w-full bg-gradient-to-r from-khaki/70 to-transparent" />
```

**Separator centralny** — symetryczny (np. między sekcjami):
```html
<span class="block h-px w-full bg-gradient-to-r from-transparent via-khaki/50 to-transparent" />
```

**Pionowa kreska** (desktop, blok tekstowy): 1px, gradient `transparent → --c-gold/0.70`, `transform-origin: top`, animacja wejścia `scaleY 0→1` przez GSAP.

### 4.4 Glow / Halo

- **Halo za elementem medialnym** (portret, zdjęcie sekcji): `radial-gradient` eliptyczny z nieregularnym `border-radius` (~46/54%), `blur(24px)`, opacity < 0.9. Pseudo-element `::before` lub osobny `div` z `aria-hidden="true"`.
- **Glow na bloku tekstowym** (mobile / nakładki): pseudo-element `::after`, `linear-gradient`, `blur(35px)`, `z-index: --z-below`, inset z wyjściem poza rodzica.
- **Glow na kartach**: `radial-gradient(ellipse at 50% 0%, rgb(139 115 85 / 0.12), transparent 60%)` na `::before`, `z-index: --z-base`.
- Nie nakładać więcej niż 2 warstwy blur na jedną sekcję.

### 4.5 Star field canvas (Hero-specific)

Komponent `HeroGlowScene` — animowany canvas z gwiazdkami wokół portretu. Dotyczy wyłącznie sekcji Hero. Gwiazdki z halo, cross-rays i sinusoidalną animacją opacity. Respektuje `prefers-reduced-motion`.

### 4.6 Backdrop blur (mobile panel)

Panel tekstowy na mobile: `background: rgb(8 8 8 / 0.38)`, `backdrop-filter: blur(4px)`. Stosować przy nakładaniu tekstu na zdjęcie/wideo — zapewnia czytelność bez pełnego zaciemnienia.

---

## 5. Animacje

### Zasady ogólne

- Animacje mają być **celowe** — wzmacniają narrację, nie rozpraszają
- Czas trwania: **300–800ms** dla elementów UI, **600–900ms** dla wejść sekcji
- Easing: `cubic-bezier(0.22, 1, 0.36, 1)` (GSAP odpowiednik: `power3.out`)
- Szanujemy `prefers-reduced-motion` — animacje i filtry blur wyłączone globalnie (`app/globals.css`)

### Efekty globalne

| Efekt         | Technologia | Opis                                           |
|---------------|-------------|------------------------------------------------|
| Smooth scroll | Lenis       | Płynne, "maślane" przewijanie całej strony     |
| Star field    | Canvas + JS | Animowane gwiazdki w sekcji Hero (HeroGlowScene) |

### Wejście elementów przy scrollu (ScrollTrigger)

```js
gsap.from(el, {
  autoAlpha: 0,
  y: 20,
  duration: 0.7,
  ease: 'power3.out',
  scrollTrigger: { trigger: el, start: 'top 85%' }
})
```

Stagowanie listy kart: `stagger: 0.12`.

### Hover — standardowe wartości

| Efekt         | Wartość                                           |
|---------------|---------------------------------------------------|
| Uniesienie    | `translateY(-4px)`, `transition: 360ms cubic-bezier(0.22,1,0.36,1)` |
| Scale         | `scale(1.02)`                                     |
| Opacity fade  | `opacity: 0.80` (primary), `0.70` (secondary)     |
| Underline CTA | `scaleX(0→1)` od lewej, `420ms cubic-bezier(0.22,1,0.36,1)` |
| Ikony social  | `text-white/40 → text-white`, `transition: 300ms` |

### Animacje sekcji

#### Hero
- **Text reveal:** `autoAlpha 0→1` + GSAP timeline z overlap; sekwencja: eyebrow → headline → description → linie → CTA
- **Image entrance:** CSS keyframes `translate3d + scale`, `cubic-bezier(0.22,1,0.36,1)` 0.9s

#### Kim jestem
- **Image reveal:** Zdjęcie wjeżdża lub odsłaniane przez clip-path
- **Counter animation:** Liczby animują się przy scroll (opcjonalnie)

#### Korzyści / Oferta
- **Card entrance:** ScrollTrigger `stagger: 0.12`, `autoAlpha 0→1 + y: 20→0`
- **Hover effect:** `translateY(-4px)` + border `khaki/60`

#### Portfolio
- **Filter transition:** GSAP flip przy zmianie kategorii
- **Hover overlay:** Delikatny overlay z tytułem projektu
- **Lightbox:** Skalowanie ze środka

#### Proces
- **Step reveal:** ScrollTrigger sekwencyjny
- **Connector animation:** Linia między krokami rysuje się progressywnie (`scaleX` lub `clip-path`)

#### FAQ
- **Accordion:** height + opacity, `300ms ease`

---

## 6. Komponenty UI

### Przyciski

| Typ           | Styl implementacji                                                        |
|---------------|---------------------------------------------------------------------------|
| Primary CTA   | Gradient primary na tekście (transparent bg), Bebas Neue 18px, `tracking-[0.10em]`, underline wjeżdżający od lewej na hover |
| Secondary CTA | Gradient secondary na tekście, identyczna mechanika hover                 |
| Ghost         | `border border-khaki/50`, tekst `text-khaki`, hover `bg-khaki/10 border-khaki` |

> **Uwaga:** Primary CTA nie ma solidnego tła `#8B7355` — używa gradient-text na przezroczystym tle.

Focus state (wszystkie przyciski): `focus-visible:outline-2 focus-visible:outline-khaki focus-visible:outline-offset-2`

### Karty usług

- Tło: `bg-anthracite` (`#1A1A1A`)
- Border: `border border-khaki/30`
- Glow: `radial-gradient` na `::before`, `z-index: --z-base`
- Hover: `border-khaki/60` + `translateY(-4px)`
- Ikona: SVG inline, `currentColor`, `aria-hidden="true"`, 20–24px

### Tagi kategorii (Portfolio)

- Aktywny: `bg-military-green`, biały tekst
- Nieaktywny: transparent, `border border-warm-gray/50`
- Transition: `300ms ease`

### Separatory sekcji

```html
<!-- Prawostronne (domyślne) -->
<span aria-hidden="true" class="block h-px w-full bg-gradient-to-r from-khaki/70 to-transparent" />

<!-- Centralne -->
<span aria-hidden="true" class="block h-px w-full bg-gradient-to-r from-transparent via-khaki/50 to-transparent" />
```

---

## 7. Układ i siatka

- **Max-width contentu:** `1280px` (`max-w-content` w Tailwind)
- **Max-width Hero:** `2000px` (full-bleed z wewnętrznym gridem)
- **Padding poziomy:** `px-6` mobile, `px-8` md, `px-12` lg
- **Padding pionowy sekcji:** `py-16 md:py-24 lg:py-32`
- **Gap sekcji:** `120–160px` desktop, `80px` mobile
- **Grid desktop:** `grid-cols-2` lub `grid-cols-[minmax(280px,380px)_1fr]` (asymetryczny jak w Hero)

---

## 8. Obrazy i media

- Format: **PNG** (portret hero, przezroczystość), **WebP** (galeria, zdjęcia) + JPEG fallback
- Komponent: `next/image` z `fill` + `object-contain/cover`, `sizes` dostosowane do layoutu
- Lazy-loading: `loading="eager"` dla hero, `loading="lazy"` dla pozostałych
- Quality: `quality={85}` dla dużych zdjęć
- Alt text: opisowy, zawiera kontekst i temat zdjęcia

---

## 9. Responsywność

| Breakpoint | Szerokość   | Zmiany layoutu                               |
|------------|-------------|----------------------------------------------|
| Mobile     | < 768px     | Jedna kolumna, CSS keyframe animations, brak vertical line |
| Tablet/md  | ≥ 768px     | Grid dwukolumnowy, GSAP entrance, pełne efekty |
| Desktop/lg | ≥ 1024px    | Pełny layout, większe paddingi               |
| Wide       | ≥ 1280px    | Centered, `max-w-content` ogranicza content  |

Breakpointy Tailwind (domyślne): `sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`.

---

## 10. Dostępność

- Semantyczny `<h1>` jeden na stronie — w Hero jako `.sr-only`, widoczny dla screen readerów
- Hierarchia nagłówków: `<h1>` Hero, `<h2>` tytuły sekcji, `<h3>` podsekcje
- Elementy dekoracyjne: `aria-hidden="true"`
- Interaktywne ikony bez tekstu: `aria-label`
- Linki zewnętrzne: `target="_blank" rel="noopener noreferrer"`
- `prefers-reduced-motion`: globalny reset animacji + wyłączenie `blur`/`backdrop-filter` w komponentach
- Focus visible: zawsze `focus-visible:outline-2 focus-visible:outline-khaki`
