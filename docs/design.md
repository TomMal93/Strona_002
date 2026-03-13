# Design System – Portfolio Fotograficzno-Wideo

> Kompletny dokument designu projektu. Jedyne źródło prawdy dla wszystkich decyzji wizualnych, typograficznych i interakcyjnych.
>
> Powiązane dokumenty: `docs/branding.md` — strategia marki, pozycjonowanie, tone of voice (warstwa narracyjna, nie implementacyjna).

---

## Spis treści

1. [Fundament marki](#1-fundament-marki)
2. [Kierunek wizualny](#2-kierunek-wizualny)
3. [Paleta kolorów](#3-paleta-kolorów)
4. [Typografia](#4-typografia)
5. [Efekty wizualne](#5-efekty-wizualne)
6. [Animacje](#6-animacje)
7. [Komponenty UI](#7-komponenty-ui)
8. [Układ i siatka](#8-układ-i-siatka)
9. [Obrazy i media](#9-obrazy-i-media)
10. [Responsywność](#10-responsywność)
11. [Dostępność](#11-dostępność)
12. [Wytyczne sekcji](#12-wytyczne-sekcji)

---

## 1. Fundament marki

> Skrót do szybkiego kontekstu. Pełna wersja w `docs/branding.md`.

- **Obietnica:** "Prawdziwe emocje i prawdziwa dynamika, bez sztuczności."
- **Archetyp:** Odkrywca (akcja, teren, ruch) + Opiekun (uważność na emocje i relacje)
- **Claim:** `Kadry z charakterem. Historie z emocją.`
- **Tone of voice:** konkretny, prosty, obrazowy; pewny i spokojny; bez patosu i korpo-słownictwa
- **Zasady copy:** krótkie zdania, czasowniki czynne, mniej przymiotników — więcej scen i efektu; każda sekcja odpowiada na pytanie: "co z tego ma klient?"

---

## 2. Kierunek wizualny

**Nazwa stylu:** Tactical Elegance

**Nastrój:** Surowy, militarny, premium — z przestrzenią na ciepło i emocje (wesela, rodziny)

**Inspiracje:** Ciemne portfolio fotograficzne, estetyka wojskowa, tekstury terenowe, kinowy klimat

Strona łączy dwa światy: **twardy, terenowy klimat** (survival, drony, off-road) z **elegancją i emocją** (wesela, sesje rodzinne). Spójność osiągamy przez jednolitą paletę i typografię — klimat zmienia się wyłącznie przez dobór zdjęć.

---

## 3. Paleta kolorów

### Tokeny

Wszystkie tokeny zdefiniowane w `app/globals.css` jako format `R G B` (bez `rgb()`), co umożliwia modyfikatory opacity: `rgb(var(--c-gold) / 0.5)`. Tailwind aliasy: `khaki`, `military-green`.

#### Kolory bazowe

| Nazwa              | Hex       | Tailwind       | Zastosowanie                                         |
|--------------------|-----------|----------------|------------------------------------------------------|
| Czerń              | `#0D0D0D` | `black-deep`   | Tło sekcji ciemnych                                  |
| Antracyt           | `#1A1A1A` | `anthracite`   | Karty, tła pomocnicze                                |
| Ecru               | `#F5F0EB` | `ecru`         | Tło sekcji jasnych                                   |
| Biel               | `#FFFFFF` | `warm-white`   | Teksty na ciemnym tle, ikony                         |
| Ciepły szary       | `#C8C0B4` | `warm-gray`    | Teksty drugorzędne                                   |

#### Kolory akcentów

| Nazwa              | Hex       | CSS token      | Tailwind           | Zastosowanie                                   |
|--------------------|-----------|----------------|--------------------|------------------------------------------------|
| Khaki / Olive Gold | `#8B7355` | `--c-gold`     | `khaki`            | Akcent główny: linie, gradienty, focus ring    |
| Khaki jasny        | `#929A75` | `--c-khaki`    | —                  | Gradient secondary: eyebrow, opis, CTA secondary |
| Ciepły highlight   | `#B4825A` | `--c-warm`     | —                  | Punkt startowy gradientu primary               |
| Zieleń militarna   | `#4A5240` | `--c-olive`    | `military-green`   | Wzór pasków tła, tagi kategorii                |

### Gradienty

Zdefiniowane jako klasy CSS Modules (`Hero.module.css`). Stosować w całym projekcie przez te klasy lub implementując analogicznie w CSS Modules danej sekcji.

**Primary** — złoto-ciepły; użycie: nagłówki sekcji, CTA primary:
```css
linear-gradient(130deg, rgb(var(--c-warm)) 0%, rgb(255 238 175) 45%, rgb(var(--c-gold)) 100%)
```

**Secondary** — khaki-zielony; użycie: eyebrow, opisy, CTA secondary:
```css
linear-gradient(130deg, rgb(var(--c-khaki)) 0%, rgb(218 226 192) 50%, rgb(var(--c-khaki)) 100%)
```

Technika nakładania gradientu na tekst:
```css
-webkit-background-clip: text;
background-clip: text;
color: transparent;
```

### Tło sekcji ciemnych

Klasa globalna `.section-dark-bg` (`app/globals.css`) — stosować na wszystkich sekcjach z ciemnym tłem. Nie duplikować CSS.

```css
background:
  repeating-linear-gradient(
    45deg,
    rgb(var(--c-olive) / 0.09) 0,
    rgb(var(--c-olive) / 0.09) 1px,
    transparent 1px,
    transparent 22px
  ),
  rgb(13 13 13);
```

### Mapowanie sekcji

| Sekcja              | Tło         | Klasa tła            | Akcent      |
|---------------------|-------------|----------------------|-------------|
| Hero                | `#0D0D0D`   | `.section-dark-bg`   | `#8B7355`   |
| Kim jestem          | `#1A1A1A`   | `bg-anthracite`      | `#8B7355`   |
| Korzyści            | `#0D0D0D`   | `.section-dark-bg`   | `#8B7355`   |
| Oferta              | `#1A1A1A`   | `bg-anthracite`      | `#8B7355`   |
| Portfolio / Galeria | `#F5F0EB`   | `bg-ecru`            | `#4A5240`   |
| Instagram Feed      | `#1A1A1A`   | `bg-anthracite`      | `#8B7355`   |
| Proces              | `#0D0D0D`   | `.section-dark-bg`   | `#8B7355`   |
| Opinie              | `#1A1A1A`   | `bg-anthracite`      | `#8B7355`   |
| FAQ + mocne CTA     | `#0D0D0D`   | `.section-dark-bg`   | `#8B7355`   |

---

## 4. Typografia

### Fonty

| Rola             | Font         | Klasa Tailwind | Zastosowanie                                               |
|------------------|--------------|----------------|------------------------------------------------------------|
| Display / H1–H3  | `Bebas Neue` | `font-bebas`   | Nagłówki, eyebrow, CTA, tagi, labele kart                  |
| Body / UI        | `Inter`      | `font-inter`   | Długie opisy, akapity, metadane, `.ui-overline`            |

### Skala (desktop)

| Element               | Rozmiar                    | Line-height | Letter-spacing     | Klasa Tailwind               |
|-----------------------|----------------------------|-------------|---------------------|------------------------------|
| H1 Display            | `clamp(80px, 10vw, 110px)` | `0.9`       | tight (brak)        | `text-display`               |
| Eyebrow / H2–H3       | `18px`                     | `1.1`       | `0.15em`            | `text-[18px] tracking-heading` |
| Opis Bebas (body)     | `16px`                     | `1.5`       | `0.15em`            | `text-[16px] tracking-heading` |
| CTA / button          | `18px`                     | —           | `0.10em`            | `text-[18px] tracking-[0.10em]` |
| UI overline (Inter)   | `12px`                     | —           | `0.20em`            | `.ui-overline`               |
| Body (Inter)          | `16–18px`                  | `1.6`       | domyślny            | —                            |
| Small (Inter)         | `13–14px`                  | `1.5`       | domyślny            | —                            |

### Klasy niestandardowe (Tailwind config)

```
text-display       → clamp(80px, 10vw, 110px), leading-[0.9]
tracking-heading   → letter-spacing: 0.15em
tracking-overline  → letter-spacing: 0.20em
.ui-overline       → font-inter text-xs uppercase tracking-overline text-khaki
```

### Zasady

- **Bebas Neue** — wszystkie elementy wyraziste: nagłówki, eyebrow, CTA, labele kart, tagi.
- **Inter** — ciało tekstu, długie opisy, elementy UI małego rozmiaru (`.ui-overline`).
- Gradient **primary** tylko na nagłówkach i CTA primary — nigdy na ciele tekstu.
- Gradient **secondary** na eyebrow, opisach Bebas i CTA secondary.
- Maksymalna szerokość bloku tekstu: `max-w-[34ch]` (opis), `max-w-[500px]` (kolumna content).

---

## 5. Efekty wizualne

### 5.1 Linie dekoracyjne

**Separator poziomy prawostrony** (koniec bloku tekstu):
```html
<span aria-hidden="true" class="block h-px w-full bg-gradient-to-r from-khaki/70 to-transparent" />
```

**Separator poziomy centralny** (między sekcjami):
```html
<span aria-hidden="true" class="block h-px w-full bg-gradient-to-r from-transparent via-khaki/50 to-transparent" />
```

**Pionowa kreska** (blok tekstowy desktop): 1px, gradient `transparent → --c-gold/0.70`, `transform-origin: top center`, animacja wejścia `scaleY 0→1` przez GSAP.

### 5.2 Glow i halo

**Halo za elementem medialnym** (portret, zdjęcie sekcji):
```css
/* Oddzielny div z aria-hidden="true", z-index pod obrazem */
background:
  radial-gradient(ellipse at 52% 34%, rgb(255 238 175 / 0.34) 0%, rgb(var(--c-gold) / 0.24) 30%, transparent 70%),
  radial-gradient(ellipse at 50% 62%, rgb(var(--c-khaki) / 0.16) 0%, transparent 66%);
border-radius: 46% 54% 44% 56% / 52% 44% 56% 48%; /* nieregularny kształt */
filter: blur(24px);
```

**Glow na kartach** (pseudo-element `::before`, `z-index: --z-base`):
```css
background: radial-gradient(ellipse at 50% 0%, rgb(139 115 85 / 0.12), transparent 60%);
```

**Glow za blokiem tekstowym** (pseudo-element `::after`, `z-index: --z-below`):
```css
background: linear-gradient(120deg, rgb(var(--c-gold) / 0.2) 0%, rgb(var(--c-gold) / 0.08) 50%, rgb(var(--c-gold) / 0.2) 100%);
filter: blur(35px);
```

Limit: maksymalnie **2 nakładające się warstwy blur** na jedną sekcję.

### 5.3 Backdrop blur (panel tekstowy na mobile)

Przy nakładaniu tekstu na zdjęcie lub wideo:
```css
background: rgb(8 8 8 / 0.38);
backdrop-filter: blur(4px);
```

### 5.4 Star field canvas (tylko Hero)

Komponent `HeroGlowScene` — animowany canvas z gwiazdkami wokół portretu (68 skupionych + 22 rozproszone). Wyłącznie sekcja Hero. Respektuje `prefers-reduced-motion`.

---

## 6. Animacje

### Zasady ogólne

- Animacje wzmacniają narrację — nie są dekoracją.
- Czas trwania: `300–800ms` UI, `600–900ms` wejścia sekcji.
- Easing: `cubic-bezier(0.22, 1, 0.36, 1)` (GSAP: `power3.out`).
- `prefers-reduced-motion`: globalny reset w `app/globals.css` + wyłączenie `blur`/`backdrop-filter` lokalnie w komponentach.

### Wejście przy scrollu — wzorzec

```js
gsap.from(element, {
  autoAlpha: 0,
  y: 20,
  duration: 0.7,
  ease: 'power3.out',
  scrollTrigger: { trigger: element, start: 'top 85%' },
})
// Lista kart: dodać stagger: 0.12
```

### Hover — standardowe wartości

| Efekt           | Wartość                                                       |
|-----------------|---------------------------------------------------------------|
| Uniesienie karty | `translateY(-4px)`, `transition: 360ms cubic-bezier(0.22,1,0.36,1)` |
| Scale karty      | `scale(1.02)`                                                 |
| CTA opacity      | `0.80` primary, `0.70` secondary                              |
| CTA underline    | `scaleX(0→1)` od lewej, `420ms cubic-bezier(0.22,1,0.36,1)`  |
| Ikony/linki      | `opacity: 0.4 → 1`, `transition: 300ms`                      |

### Efekty globalne

| Efekt         | Technologia  | Opis                                             |
|---------------|--------------|--------------------------------------------------|
| Smooth scroll | Lenis        | Płynne przewijanie całej strony                  |
| Star field    | Canvas + JS  | Animowane gwiazdki w sekcji Hero                 |

### Animacje per sekcja

#### Hero
- Entrance GSAP timeline (delay 0.7s): eyebrow → headline → description → linie (razem) → CTA; każdy element `autoAlpha 0→1`, overlap `−=0.3s`
- Image: CSS keyframes `translate3d + scale`, `0.9s cubic-bezier(0.22,1,0.36,1)`

#### Kim jestem
- Zdjęcie: clip-path reveal lub fade + slide
- Liczniki statystyk: animacja przy ScrollTrigger (opcjonalnie)
- Bloki highlight: stagger 0.12

#### Korzyści / Oferta
- Karty: ScrollTrigger stagger 0.12, `autoAlpha 0→1 + y: 20→0`
- Hover: `translateY(-4px)` + `border-khaki/60`

#### Portfolio
- Zmiana kategorii: GSAP flip
- Hover: overlay z tytułem
- Lightbox: scale ze środka

#### Proces
- Kroki: ScrollTrigger sekwencyjny
- Connector: linia rysuje się progresywnie (`scaleX` lub `clip-path`)

#### Opinie
- Cytaty: stagger reveal, aktywna opinia — subtelne podbicie kontrastu

#### FAQ
- Accordion: `height + opacity`, `300ms ease`

#### Końcowe CTA
- Przycisk z wyraźnym akcentem; opcjonalnie delikatny pulse attention-grabber

---

## 7. Komponenty UI

### Przyciski

| Typ           | Styl implementacji                                                                   |
|---------------|--------------------------------------------------------------------------------------|
| Primary CTA   | Gradient primary na tekście, transparent bg, Bebas Neue 18px, tracking 0.10em, underline `scaleX` od lewej na hover |
| Secondary CTA | Gradient secondary na tekście, identyczna mechanika hover                            |
| Ghost         | `border border-khaki/50`, `text-khaki`, hover: `border-khaki bg-khaki/10`            |

Focus state (wszystkie): `focus-visible:outline-2 focus-visible:outline-khaki focus-visible:outline-offset-2`

Spacing między przyciskami: `gap-8` (duże) / `gap-5` (kompaktowe).

**Snippet — Ghost button:**
```tsx
<a
  href="#"
  className="border border-khaki/50 px-6 py-2 font-bebas text-[18px] uppercase tracking-[0.10em] text-khaki transition-colors duration-300 hover:border-khaki hover:bg-khaki/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-khaki focus-visible:outline-offset-2"
>
  Label
</a>
```

### Nagłówek sekcji

**Snippet:**
```tsx
<span className="ui-overline mb-3 block">Kategoria</span>
<h2 className={cn(styles.gradientTextPrimary, 'font-bebas text-display uppercase leading-[0.9]')}>
  Tytuł Sekcji
</h2>
<span aria-hidden="true" className="mt-4 block h-px w-24 bg-gradient-to-r from-khaki/70 to-transparent" />
```

### Karta na ciemnym tle

- Tło: `bg-anthracite`
- Border: `border border-khaki/30`
- Glow: `radial-gradient` na `::before`, `z-index: --z-base`
- Hover: `border-khaki/60` + `translateY(-4px)`
- Ikona: SVG inline, `currentColor`, `aria-hidden="true"`, 20–24px

**Snippet:**
```tsx
<div className="relative border border-khaki/30 bg-anthracite p-6">
  <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgb(139_115_85/0.12),transparent_60%)]" />
  <div className="relative z-10">
    {/* treść */}
  </div>
</div>
```

### Ikony

- SVG inline, `fill="currentColor"` lub `stroke="currentColor"`
- Rozmiar: `18px` małe, `20–24px` medium
- Dekoracyjne: `aria-hidden="true"` / funkcjonalne: `aria-label`
- Na ciemnym tle: `text-white/40` default → `text-white` hover, `transition: 300ms`
- Na jasnym tle: `text-black-deep/50` default → `text-black-deep` hover

### Tagi kategorii (Portfolio)

- Aktywny: `bg-military-green text-white`
- Nieaktywny: `border border-warm-gray/50 text-warm-gray`
- Transition: `300ms ease`

---

## 8. Układ i siatka

- **Max-width contentu:** `1280px` (`max-w-content`)
- **Max-width Hero:** `2000px` (full-bleed z wewnętrznym gridem)
- **Padding poziomy:** `px-6` mobile → `px-8` md → `px-12` lg
- **Padding pionowy sekcji:** `py-16 md:py-24 lg:py-32`
- **Gap między sekcjami:** `py-24 md:py-32` (każda sekcja ma własny padding)
- **Grid dwukolumnowy:** `grid-cols-2` symetryczny lub `grid-cols-[minmax(280px,380px)_1fr]` asymetryczny (jak Hero)
- **Grid kart:** `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`, `gap-6`

---

## 9. Obrazy i media

- **Format:** PNG dla elementów z przezroczystością (portret), WebP dla galerii i zdjęć, JPEG fallback
- **Komponent:** `next/image` z `fill` + `object-contain` / `object-cover`, atrybut `sizes` dostosowany do layoutu
- **Loading:** `loading="eager"` dla hero, `loading="lazy"` dla pozostałych
- **Quality:** `quality={85}` dla dużych zdjęć
- **Alt text:** opisowy — zawiera kontekst, temat i istotne elementy zdjęcia
- **Priorytet kadrów:** ruch, emocja, skala, detal — zgodnie z DNA marki

---

## 10. Responsywność

| Breakpoint  | Szerokość   | Zmiany layoutu                                              |
|-------------|-------------|-------------------------------------------------------------|
| Mobile      | < 768px     | Jedna kolumna, CSS keyframe animations, brak vertical line  |
| Tablet / md | ≥ 768px     | Grid dwukolumnowy, GSAP entrance, pełne efekty              |
| Desktop / lg| ≥ 1024px    | Pełny layout, większe paddingi                              |
| Wide / xl   | ≥ 1280px    | Centered, `max-w-content` ogranicza content                 |

Breakpointy: `sm: 640px` · `md: 768px` · `lg: 1024px` · `xl: 1280px`

Mobile-first: style bazowe dla mobile, modyfikatory `md:` i `lg:` dla większych ekranów.

---

## 11. Dostępność

- Jeden `<h1>` na stronie — w Hero jako `.sr-only`, widoczny dla screen readerów
- Hierarchia: `<h1>` Hero → `<h2>` tytuły sekcji → `<h3>` podsekcje
- Każda sekcja: `<section id="nazwa" aria-label="Opis sekcji">`
- Elementy dekoracyjne (linie, halo, gwiazdki): `aria-hidden="true"`
- Ikony interaktywne bez tekstu: `aria-label`
- Linki zewnętrzne: `target="_blank" rel="noopener noreferrer"`
- `prefers-reduced-motion`: globalny reset animacji w `app/globals.css` + wyłączenie `blur` / `backdrop-filter` lokalnie w komponentach
- Focus visible: `focus-visible:outline-2 focus-visible:outline-khaki focus-visible:outline-offset-2`

---

## 12. Wytyczne sekcji

### Tło i rytm

1. Sekcje ciemne: `.section-dark-bg`. Sekcje jasne: `bg-ecru`. Żadnych innych kolorów tła.
2. Przeplataj ciemne i jasne dla rytmu strony — nie stawiaj dwóch identycznych pod rząd bez intencji.

### Kolor

- Jedyny akcent: `khaki` / `--c-gold`. Żadnych nowych kolorów akcentów.
- Gradient primary → nagłówki, CTA primary. Gradient secondary → eyebrow, opisy, CTA secondary.
- Nigdy gradient primary na ciele tekstu.
- Opacity borderów i dekoracji: `khaki/30` subtelne, `khaki/50–70` wyraźne.

### Typografia

- Nagłówki sekcji: Bebas Neue uppercase, gradient primary lub secondary.
- Eyebrow: `.ui-overline` (Inter) lub Bebas Neue 18px z gradientem secondary — zależnie od wagi elementu.
- Ciało tekstu: Inter, `text-warm-gray` lub `text-warm-white`.
- Labele, tagi: Bebas Neue uppercase, `khaki/60–80` lub gradient secondary.

### Animacje

- Wejście przy scrollu: ScrollTrigger, `autoAlpha 0→1 + y: 20→0`, `0.6–0.8s`.
- Lista kart: `stagger: 0.12`.
- Zawsze implementuj `prefers-reduced-motion`.

### Semantyka

- Każda sekcja: `<section id="nazwa-sekcji" aria-label="...">`.
- Nie pomijaj poziomów w hierarchii nagłówków.
