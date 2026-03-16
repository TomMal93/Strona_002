# Redesign sekcji Services/Oferta -- "Director's Reel"

## Context

Sekcja Services jest trzecim blokiem strony portfolio fotografa/wideografa. Hero prezentuje artystę, About pokazuje kamerę (viewfinder UI), a Services powinien dopełnić narrację -- pokaz "finalnych produkcji" / montażownia. Obecna implementacja to prosty grid 2+3 z basic hover effects. Potrzebuje efektu wow na poziomie hero i about.

## Koncept: Film Strip / Editing Timeline

Każda usługa = "scena" na taśmie filmowej. Karty mają estetykę klatki filmowej z elementami HUD-u reżyserskiego.

---

## 1. Layout

### Desktop (lg+)
- **5 kart w jednym rzędzie** z efektem zigzag -- karty nieparzyste (1,3,5) na baseline, parzyste (2,4) przesunięte w dół o `~2.5rem`
- Grid: `grid-template-columns: repeat(5, 1fr)` z `gap: 1.25rem`
- Usunięcie dwurzędowego podziału (bez `splitServiceRows`)
- Horyzontalna "linia montażowa" (1px gold gradient) biegnie za kartami na ~40% wysokości sekcji

### Tablet (md: 768-1023px)
- Grid 2-kolumnowy, 5. karta na pełną szerokość centrowana
- Lekki offset na parzystych kartach (`translateY(1rem)`)

### Mobile (< 768px)
- Jedna kolumna, pełna szerokość
- Bez zigzag, bez timeline line
- Numery scen widoczne

---

## 2. Karta -- estetyka "klatki filmowej"

### Nowe elementy na karcie:
1. **Numer sceny** (top-left): `01`...`05`, monospace, `rgb(255 238 175 / 0.4)`, `0.72rem` -- jak timecode z About
2. **Podwójna linia reel** (top): dwie równoległe linie 1px z 3px gap zamiast obecnej pojedynczej `cardTopLine`
3. **Corner marks** (top-left + bottom-right): reużycie wzorca z About section -- cienkie złote narożniki
4. **Ikona w "soczewce"**: okrągły kontener zamiast kwadratowego badge, z radial gradient imitującym element obiektywu, cienki pierścień border
5. **Scan-line overlay**: ultra-subtelny `repeating-linear-gradient` (linie 1px co 4px, white/0.015) na karcie

### Zachowane:
- Dwa warianty kolorystyczne (highlight/military) -- te same gradienty tła
- Tag, tytuł, opis -- ten sam content
- 5 ikon SVG bez zmian

### Hover (performant -- tylko transform, opacity, border-color):
- `translateY(-8px) scale(1.02)`
- Podwójna linia reel: `scaleX(0.6 -> 1)`
- Corner marks: opacity `0.35 -> 0.7`
- Soczewka ikony: `box-shadow: 0 0 12px rgb(var(--c-gold) / 0.3)`
- Numer sceny: opacity `0.4 -> 0.8`

---

## 3. Animacja wejścia (GSAP Timeline) -- efekt WOW

Wielofazowa choreografia wzorowana na `useAboutAnimations.ts`:

| Faza | Element | Czas | Ease | Offset |
|------|---------|------|------|--------|
| 1 | Tytuł sekcji fade+translate | 0.7s | power3.out | 0 |
| 2 | Accent line scaleX(0->1) | 0.5s | power2.out | -=0.3 |
| 3 | Subtitle fade+translate | 0.6s | power3.out | -=0.2 |
| 4 | Timeline line draw (scaleX L->R) | 0.8s | power2.inOut | -=0.2 |
| 5 | **Karty -- clip-path wipe reveal** | 0.6s each | power3.out | stagger 0.12s |
| 6 | Corner marks + scene numbers | 0.3s | power2.out | -=0.1 |

### Clip-path wipe (kluczowy efekt wow):
- Start: `clipPath: 'inset(0 100% 0 0)'` + `autoAlpha: 0`
- End: `clipPath: 'inset(0 0% 0 0)'` + `autoAlpha: 1`
- Jednocześnie `y: 15 -> 0`
- Efekt "ładowania klatki na timeline" -- kinowy wipe od lewej do prawej

### Mobile uproszczenie:
- Bez clip-path (na full-width wygląda słabo)
- Standard fade+translateY stagger jak dotychczas

### Reduced motion:
- `gsap.set()` -- wszystko widoczne natychmiast (wzorzec z About)

---

## 4. Tło sekcji

- Zachowany `section-dark-bg` (paski 45deg)
- Opcjonalnie: subtelna tekstura film grain (statyczny CSS, zero kosztu perf)

---

## 5. Pliki do modyfikacji

| Plik | Zakres zmian |
|------|-------------|
| `components/sections/Services.module.css` | **Duży rewrite** -- nowy layout zigzag, karty film-frame, soczewka ikony, corner marks, scan lines, timeline line, podwójna reel line |
| `components/sections/Services.tsx` | **Restrukturyzacja** -- flat grid zamiast 2 rowów, scene numbers, corner marks, lens icon, nowe refy dla animacji |
| `components/sections/services/useServicesAnimation.ts` | **Rewrite** -- wielofazowy GSAP timeline z clip-path wipe, wzorzec z useAboutAnimations |
| `components/sections/services/serviceLayout.ts` | **Uproszczenie** -- usunąć `splitServiceRows`, dodać `getSceneNumber` |

### Pliki bez zmian:
- `services/ServiceIcon.tsx` -- ikony te same, inny wrapper
- `lib/site-content.ts` -- dane 5 usług bez zmian

---

## 6. Weryfikacja

1. `npm run build` -- brak błędów TS/lint
2. `npm run dev` -- wizualna inspekcja na localhost
3. Sprawdzić responsywność: mobile (375px), tablet (768px), desktop (1280px+)
4. Sprawdzić `prefers-reduced-motion` (DevTools -> Rendering -> Emulate)
5. Sprawdzić hover states na każdej karcie
6. Sprawdzić animację wejścia przy scroll (powinna odpalić raz)
7. Performance: brak jank przy scroll (no filter/box-shadow transitions during scroll)
