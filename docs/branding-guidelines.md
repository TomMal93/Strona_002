# Branding Guidelines — Strona_002

> Dokument opisuje branding użyty w sekcji **Hero** oraz zawiera wytyczne projektowe dla kolejnych sekcji strony. Stanowi punkt odniesienia dla zachowania spójności wizualnej i tonalnej całego projektu.

---

## 1. Opis brandingu sekcji Hero

### 1.1 Charakter i nastrój

Hero kreuje klimat **ciemny, militarno-naturalny, premium**. Dominuje głęboka czerń z subtelną fakturą, na tle której złoto i khaki tworzą akcenty ciepła. Całość komunikuje powagę, dynamikę i profesjonalizm — pasujące zarówno do fotografii akcji (eventy militarne, off-road), jak i do uroczystości (śluby).

### 1.2 Paleta kolorów

Wszystkie kolory zdefiniowane są jako zmienne CSS w formacie `R G B` (bez `rgb()`), co umożliwia modyfikatory opacity: `rgb(var(--c-gold) / 0.5)`.

| Token CSS          | Tailwind alias      | Hex       | Zastosowanie                                        |
|--------------------|---------------------|-----------|-----------------------------------------------------|
| `--c-gold`         | `khaki`             | `#8B7355` | Główny akcent — gradienty tekstu, linie dekoracyjne |
| `--c-olive`        | `military-green`    | `#4A5240` | Akcent drugorzędny — wzór pasków tła                |
| `--c-khaki`        | —                   | `#929A75` | Jasny khaki — gradient secondary, buttony secondary |
| `--c-warm`         | —                   | `#B4825A` | Ciepły highlight — punkt startowy gradientu primary |
| `black-deep`       | —                   | `#0D0D0D` | Tło główne sekcji ciemnych                          |
| `anthracite`       | —                   | `#1A1A1A` | Tło kart, powierzchnie drugorzędne                  |
| `ecru`             | —                   | `#F5F0EB` | Tło sekcji jasnych                                  |
| `warm-white`       | —                   | `#FFFFFF` | Tekst na ciemnym tle                                |
| `warm-gray`        | —                   | `#C8C0B4` | Tekst drugorzędny                                   |

#### Gradienty (zdefiniowane w Hero.module.css)

**Primary** — złoto-ciepły (nagłówek, CTA primary):
```css
linear-gradient(130deg, rgb(var(--c-warm)) 0%, rgb(255 238 175) 45%, rgb(var(--c-gold)) 100%)
```

**Secondary** — khaki-zielony (eyebrow, opis, CTA secondary):
```css
linear-gradient(130deg, rgb(var(--c-khaki)) 0%, rgb(218 226 192) 50%, rgb(var(--c-khaki)) 100%)
```

**Tło sekcji** — diagonal stripe pattern (45°, 1px linia co 22px, oliwka 9% opacity):
```css
repeating-linear-gradient(45deg, rgb(var(--c-olive) / 0.09) 0, rgb(var(--c-olive) / 0.09) 1px, transparent 1px, transparent 22px)
```

### 1.3 Typografia

| Element            | Font         | Rozmiar                         | Letter-spacing    | Wagę / styl          |
|--------------------|--------------|---------------------------------|-------------------|----------------------|
| Eyebrow            | Bebas Neue   | `18px`                          | `0.15em` (heading)| uppercase            |
| Headline (display) | Bebas Neue   | `clamp(80px, 10vw, 110px)` desktop / `48px` mobile | `0` (tight)       | uppercase, lh `0.9` |
| Opis / body        | Bebas Neue   | `16px`                          | `0.15em` (heading)| uppercase, lh `1.5` |
| CTA buttons        | Bebas Neue   | `18px`                          | `0.10em`          | uppercase            |
| UI overline        | Inter        | `xs` (12px)                     | `0.2em` (overline)| uppercase, `.ui-overline` |

- **Bebas Neue** — font display dla wszystkich elementów wyrazistych: nagłówki, labele, CTA.
- **Inter** — font ciała tekstu dla długich opisów, metadanych, drobnych etykiet (`.ui-overline`).
- Maksymalna szerokość bloku tekstu: `34ch` (opis), `500px` (kolumna content desktop).

### 1.4 Układ (Layout)

- **Desktop (≥768px):** dwukolumnowy grid `[minmax(280px,380px)_minmax(360px,1300px)]` — content po lewej, portret po prawej; full-viewport height `100dvh`.
- **Mobile (<768px):** portret wycentrowany (72% szerokości), panel tekstowy nałożony na dole; full-viewport height `100svh`.
- Szerokość contentowa: `max-w-[2000px]` dla heros, `1280px` (`max-w-content`) dla pozostałych sekcji.
- Padding poziomy: `px-6` mobile, `px-8` md, `px-12` lg.

### 1.5 Efekty wizualne

#### Halo / Glow
- **Portrait halo:** `radial-gradient` eliptyczny z nierównym `border-radius` (~46/54%) — efekt aureoli za portretem, `blur(24px)`, opacity 0.88.
- **Star halo (canvas):** `radial-gradient(ellipse at center, --c-warm/0.24 ... transparent 70%)`, `blur(22px)`.
- **Mobile text halo:** `linear-gradient(120deg, --c-gold/0.2 ... --c-gold/0.2)` na pseudo-elemencie `::after`, `blur(35px)`, inset `-1.8rem -1.08rem -0.54rem`.
- **Mobile text panel:** `background: rgb(8 8 8 / 0.38)`, `backdrop-filter: blur(4px)`.

#### Linie dekoracyjne
- **Vertical line** (desktop): 1px, `transform-origin: top`, gradient od `transparent` przez `--c-gold/0.35` do `--c-gold/0.70`.
- **Separator line** (poziomy): `h-px`, `bg-gradient-to-r from-khaki/70 to-transparent`.

#### CTA hover
- Podkreślenie wjeżdżające od lewej: `scaleX(0→1)`, `transition: 420ms cubic-bezier(0.22, 1, 0.36, 1)`.
- Opacity: `0.80` (primary) / `0.70` (secondary) na hover.
- Mikroprzesunięcie: `translateY(-1px)` na hover.

### 1.6 Animacje (GSAP entrance)

Sekwencja wejścia na desktopie (~2.8s total, delay 0.7s):

| Element       | Kolejność | Czas    | Metoda             |
|---------------|-----------|---------|--------------------|
| Eyebrow       | 1         | 0.7s    | `autoAlpha 0→1`    |
| Headline      | 2         | overlap | `autoAlpha 0→1`    |
| Description   | 3         | overlap | `autoAlpha 0→1`    |
| Vertical line | 4 (razem z separator) | overlap | `scaleY 0→1` |
| Separator     | 4 (razem) | —       | `scaleX 0→1`       |
| CTA block     | 5         | overlap | `autoAlpha 0→1`    |

Mobile: wejście przez CSS keyframes (`translate3d + scale`, `cubic-bezier(0.22, 1, 0.36, 1)`).

### 1.7 Dostępność

- Semantyczny `<h1>` ukryty wizualnie (`.sr-only`) — widoczny dla screen readerów i SEO.
- `prefers-reduced-motion`: wyłączenie wszystkich animacji CSS, filtrów blur i backdrop-filter.
- Focusable CTA: `focus-visible:outline focus-visible:outline-2 focus-visible:outline-khaki`.

---

## 2. Wytyczne dla kolejnych sekcji

### 2.1 Zasady ogólne

1. **Spójność tła:** Sekcje ciemne używają `.section-dark-bg` (diagonal stripe + `#0D0D0D`). Sekcje jasne używają `bg-ecru` (`#F5F0EB`). Nie wprowadzaj nowych kolorów tła poza paletą.
2. **Kontrast sekcji:** Przeplataj sekcje ciemne i jasne dla rytmu strony. Nigdy dwie jasne lub dwie ciemne pod rząd bez wyraźnej intencji.
3. **Maksymalna szerokość contentu:** Zawsze `max-w-content` (1280px) dla treści sekcji, `px-6 md:px-8 lg:px-12` padding poziomy.

### 2.2 Kolor

- Główny akcent zawsze `khaki` / `--c-gold` (`#8B7355`). Żadnych nowych kolorów akcentów.
- Gradienty używaj zgodnie z semantyką: **primary gradient** (nagłówki, główne CTA), **secondary gradient** (opisy, buttony drugorzędne).
- Tła kart i paneli: `anthracite` (`#1A1A1A`) na ciemnym, `warm-white` (`#FFFFFF`) lub `ecru` na jasnym.
- Tekst na ciemnym tle: `warm-white` (główny), `warm-gray` (`#C8C0B4`) drugorzędny, `khaki` / gradient dla akcentów.
- Opacity na borderach i dekoracjach: `khaki/30` (subtelne), `khaki/50–70` (wyraźne).

### 2.3 Typografia

- **Nagłówki sekcji:** Bebas Neue, uppercase, gradient primary lub secondary. Rozmiar: `text-display` (`clamp(80px,10vw,110px)`) dla kluczowych nagłówków, mniejsze dla podsekcji.
- **Eyebrow / overline:** `.ui-overline` (Inter, `text-xs`, `tracking-overline: 0.2em`, `text-khaki`, uppercase) LUB Bebas Neue `text-[18px]` `tracking-heading` z gradientem secondary — w zależności od wagi elementu.
- **Ciało tekstu:** Inter, `text-warm-gray` lub `text-warm-white`, normalna wielość liter.
- **Labele kart / tagi:** Bebas Neue uppercase z `khaki/60–80` lub gradient secondary.
- Nigdy nie używaj gradientu primary do ciała tekstu — tylko dla nagłówków i CTA.

### 2.4 Linie i separatory

- Separator poziomy między blokami: `h-px bg-gradient-to-r from-khaki/70 to-transparent` (lub `from-transparent via-khaki/50 to-transparent` dla centralnego).
- Akcenty pionowe: 1px gradient `transparent → --c-gold/0.70`, `transform-origin: top`, animacja `scaleY`.
- Border kart: `border border-khaki/30` — subtelny, nierozpraszający.

### 2.5 Efekty i dekoracje

- **Glow na kartach:** pseudo-element `::before` lub `::after` z `radial-gradient` i `blur(20–35px)`, opacity < 0.3, `z-index: --z-below` lub `--z-base`.
- **Halo za elementami medialnymi:** analogicznie do `portraitHalo` — `radial-gradient` eliptyczny z nieregularnym `border-radius`, `blur(24px)`.
- Nie nadużywaj efektów blur — max 2 nakładające się warstwy na sekcję.
- Dekoracyjna faktura tła (diagonal stripe) jest zdefiniowana globalnie w `.section-dark-bg` — używaj klasy, nie duplikuj CSS.

### 2.6 Animacje

- Wejście elementów przy scrollu: GSAP ScrollTrigger, `autoAlpha 0→1` + `y: 20→0`, czas `0.6–0.8s`, `cubic-bezier(0.22, 1, 0.36, 1)`.
- Stagowanie listy kart: `stagger: 0.12s`.
- Hover na kartach: `scale(1.02)` lub `translateY(-4px)`, `transition: 360ms cubic-bezier(0.22, 1, 0.36, 1)`.
- Hover na linkach/ikonach: `opacity 0.4→1` lub zmiana koloru, `transition-duration: 300ms`.
- Zawsze implementuj `prefers-reduced-motion` — wyłącz animacje wejścia i hover transitions.

### 2.7 Przyciski i CTA

- **Primary CTA:** gradient primary na tekście, Bebas Neue 18px, tracking 0.10em, pseudo-underline wjeżdżający od lewej na hover.
- **Secondary CTA:** gradient secondary na tekście, identyczna mechanika hover.
- **Ghost button:** `border border-khaki/50`, tekst `text-khaki`, hover `border-khaki` + `bg-khaki/10`.
- Focus state zawsze: `focus-visible:outline-2 focus-visible:outline-khaki focus-visible:outline-offset-2`.
- Spacing między przyciskami w grupie: `gap-8` (duże) lub `gap-5` (kompaktowe).

### 2.8 Ikonografia

- Ikony SVG inline, `width="18" height="18"` (małe) lub `20/24px` (medium).
- `fill="currentColor"` lub `stroke="currentColor"` — kolor dziedziczy z rodzica.
- Dekoracyjne: `aria-hidden="true"`. Funkcjonalne: `aria-label`.
- Na ciemnym tle: `text-white/40` default, `text-white` hover.
- Na jasnym tle: `text-black-deep/50` default, `text-black-deep` hover.

### 2.9 Responsywność

- Mobile-first: style bazowe dla mobile (`<768px`), modyfikatory `md:` dla desktop.
- Breakpointy Tailwind (domyślne): `sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`.
- Gridy sekcji: na mobile stack (`flex-col`), na desktop grid (`grid-cols-2` lub `grid-cols-3`).
- Padding sekcji: `py-16 md:py-24 lg:py-32`.
- Obrazy: `next/image` z `fill` + `object-contain/cover`, właściwe `sizes` dla optymalizacji.

### 2.10 Semantyka HTML i dostępność

- Każda sekcja: `<section id="nazwa-sekcji" aria-label="...">`.
- Hierarchia nagłówków: `<h1>` tylko w Hero (`.sr-only`), sekcje używają `<h2>`, podsekcje `<h3>`.
- Elementy dekoracyjne: `aria-hidden="true"`.
- Interaktywne ikony bez etykiety tekstowej: `aria-label`.
- Linki zewnętrzne: `target="_blank" rel="noopener noreferrer"`.

---

## 3. Szybka ściągawka — snippety

### Nagłówek sekcji z eyebrow

```tsx
<span className="ui-overline mb-3 block">Kategoria</span>
<h2 className={cn(styles.gradientTextPrimary, 'font-bebas text-display uppercase leading-[0.9]')}>
  Tytuł Sekcji
</h2>
<span aria-hidden="true" className="mt-4 block h-px w-24 bg-gradient-to-r from-khaki/70 to-transparent" />
```

### Karta na ciemnym tle

```tsx
<div className="relative border border-khaki/30 bg-anthracite p-6">
  {/* glow */}
  <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgb(139_115_85/0.12),transparent_60%)]" />
  <div className="relative z-10">
    {/* treść */}
  </div>
</div>
```

### Separator poziomy (centralny)

```tsx
<span aria-hidden="true" className="block h-px w-full bg-gradient-to-r from-transparent via-khaki/50 to-transparent" />
```

### Ghost button

```tsx
<a
  href="#"
  className="border border-khaki/50 px-6 py-2 font-bebas text-[18px] uppercase tracking-[0.10em] text-khaki transition-colors duration-300 hover:border-khaki hover:bg-khaki/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-khaki focus-visible:outline-offset-2"
>
  Label
</a>
```

---

*Dokument wygenerowany na podstawie analizy kodu źródłowego projektu (Next.js 14, Tailwind CSS, GSAP). Aktualizuj przy każdej zmianie design tokenów lub komponentów bazowych.*
