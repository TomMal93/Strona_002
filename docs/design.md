# Design System – Portfolio Fotograficzno-Wideo

## 1. Kierunek wizualny

**Nazwa stylu:** Tactical Elegance
**Nastrój:** Surowy, militarny, premium — z przestrzenią na ciepło i emocje (wesela, rodziny)
**Inspiracje:** Ciemne portfolio fotograficzne, estetyka wojskowa, tekstury terenowe, kinowy klimat

Strona ma łączyć dwa światy: **twardy, terenowy klimat** (survival, drony, off-road) z **elegancją i emocją** (wesela, sesje rodzinne). Spójność osiągamy przez jednolitą paletę kolorów i typografię — klimat zmienia się subtelnie przez dobór zdjęć.

---

## 2. Paleta kolorów

### Kolory główne

| Nazwa            | Hex       | Zastosowanie                                      |
|------------------|-----------|---------------------------------------------------|
| Czerń / Antracyt | `#0D0D0D` | Tło sekcji ciemnych (Hero, Usługi, Instagram, Kontakt) |
| Antracyt jasny   | `#1A1A1A` | Karty, tła pomocnicze w sekcjach dark             |
| Ecru / Ciepła biel | `#F5F0EB` | Tło sekcji jasnych (Portfolio)                  |
| Biel             | `#FFFFFF` | Teksty na ciemnym tle, ikony                      |
| Ciepły szary     | `#C8C0B4` | Teksty pomocnicze, opisy na ciemnym tle           |

### Kolory akcentów

| Nazwa            | Hex       | Zastosowanie                                      |
|------------------|-----------|---------------------------------------------------|
| Khaki / Olive Gold | `#8B7355` | Akcent główny: przyciski, linie, podkreślenia   |
| Zieleń militarna | `#4A5240` | Akcent poboczny: hover, tagi kategorii           |

### Użycie kolorów w sekcjach

| Sekcja         | Tło         | Akcent      |
|----------------|-------------|-------------|
| Hero           | `#0D0D0D`   | `#8B7355`   |
| Usługi         | `#1A1A1A`   | `#8B7355`   |
| O mnie         | `#0D0D0D`   | `#8B7355`   |
| Portfolio      | `#F5F0EB`   | `#4A5240`   |
| Instagram Feed | `#1A1A1A`   | `#8B7355`   |
| Pokaz wideo    | `#0D0D0D`   | `#8B7355`   |
| Kontakt        | `#1A1A1A`   | `#8B7355`   |

---

## 3. Typografia

### Czcionki

| Rola         | Font          | Waga        | Zastosowanie                             |
|--------------|---------------|-------------|------------------------------------------|
| Nagłówki H1  | `Bebas Neue`  | 400 (regular) | Hero hasło, tytuły sekcji              |
| Nagłówki H2–H3 | `Oswald`   | 500–700     | Podtytuły sekcji, nazwy usług            |
| Body / tekst | `Inter`       | 300–400     | Opisy, treść formularza, akapity         |
| Akcenty      | `Inter`       | 600         | Etykiety, przyciski, tagi               |

### Skala typografii (desktop)

| Element    | Rozmiar  | Line-height |
|------------|----------|-------------|
| H1 (Hero)  | 96–120px | 0.95        |
| H2         | 48–64px  | 1.1         |
| H3         | 28–36px  | 1.2         |
| Body       | 16–18px  | 1.6         |
| Small      | 13–14px  | 1.5         |

---

## 4. Animacje

### Zasady ogólne
- Animacje mają być **celowe** — wzmacniają narrację, nie rozpraszają
- Czas trwania: **300–800ms** dla elementów UI, **1000–2000ms** dla efektów cinematic
- Easing: preferujemy `power2.out` (GSAP) i `easeOut` (Framer Motion)
- Szanujemy `prefers-reduced-motion` — animacje wyłączone gdy użytkownik tego wymaga

### Efekty globalne

| Efekt              | Technologia   | Opis                                              |
|--------------------|---------------|---------------------------------------------------|
| Smooth scroll      | Lenis         | Płynne, "maślane" przewijanie całej strony        |
| Grain texture      | CSS / Canvas  | Subtelny szum filmowy na hero i ciemnych sekcjach |
| Custom cursor      | CSS + JS      | Crosshair zamiast domyślnego kursora (opcjonalnie)|
| Page transition    | Framer Motion | Płynne przejście przy starcie strony              |

### Animacje sekcji

#### Hero
- **Text reveal:** Litery/słowa wjeżdżają od dołu (GSAP `stagger`)
- **Video fade-in:** Tło wideo pojawia się z opóźnieniem po załadowaniu
- **Scroll indicator:** Animowana strzałka / linia pulsująca w dół
- **Parallax:** Tło przesuwa się wolniej niż scroll (efekt głębi)

#### Usługi
- **Card entrance:** Karty wjeżdżają z dołu po wejściu w widok (`ScrollTrigger`)
- **Hover effect:** Podświetlenie krawędzi w kolorze `#8B7355` + lekkie uniesienie

#### O mnie
- **Image reveal:** Zdjęcie odsłaniane przez "kurtynę" (clip-path animation)
- **Counter animation:** Liczby (np. "500+ eventów") animują się przy scroll

#### Portfolio
- **Filter transition:** Płynne przetasowanie zdjęć przy zmianie kategorii (GSAP flip)
- **Hover overlay:** Delikatny overlay z tytułem projektu
- **Lightbox:** Płynne otwarcie/zamknięcie ze skalowaniem

#### Instagram Feed
- **Stagger reveal:** Miniatury wjeżdżają jedna po drugiej
- **Hover:** Lekkie powiększenie + overlay z ikoną Instagrama

#### Pokaz wideo
- **Scroll-triggered play:** Odtwarzacz staje się widoczny przy scroll
- **Cinematic reveal:** Sekcja otwiera się jak obiektyw (clip-path circle)

#### Kontakt
- **Form entrance:** Pola formularza wjeżdżają z lewej strony
- **Submit animation:** Przycisk z efektem wypełnienia + potwierdzenie

---

## 5. Komponenty UI

### Przyciski

| Typ           | Styl                                                    |
|---------------|---------------------------------------------------------|
| Primary CTA   | Tło `#8B7355`, biały tekst, border-radius 2px, uppercase |
| Secondary      | Transparent, border `#8B7355`, tekst `#8B7355`         |
| Ghost          | Tylko tekst z animowanym podkreśleniem                  |

### Karty usług
- Ciemne tło `#1A1A1A`
- Górna linia w kolorze `#8B7355`
- Ikona w stylu militarnym (SVG)
- Hover: border podświetlony + uniesienie (transform: translateY)

### Tagi kategorii (Portfolio)
- Tło `#4A5240`, biały tekst — aktywny
- Tło transparent, border `#C8C0B4` — nieaktywny
- Transition: smooth 300ms

---

## 6. Układ i siatka

- **Max-width:** 1440px (centered)
- **Content width:** 1280px
- **Padding mobile:** 16–24px
- **Padding desktop:** 80–120px
- **Gap sekcji:** 120–160px (desktop), 80px (mobile)

---

## 7. Obrazy i media

- Format: **WebP** (priorytet) + JPEG fallback
- Lazy-loading: natywny Next.js `<Image>` + blur placeholder
- Galeria: zdjęcia poziome i pionowe — układ masonry lub równy grid z `aspect-ratio`
- Wideo hero: skompresowany MP4 (<10MB), ładowany w tle

---

## 8. Responsywność

| Breakpoint | Szerokość  | Zmiany layoutu                              |
|------------|------------|---------------------------------------------|
| Mobile     | < 768px    | Jedna kolumna, uproszczone animacje          |
| Tablet     | 768–1024px | Dwie kolumny, pełne animacje                |
| Desktop    | > 1024px   | Pełny layout, wszystkie efekty aktywne      |
| Wide       | > 1440px   | Centered, max-width ograniczony             |
