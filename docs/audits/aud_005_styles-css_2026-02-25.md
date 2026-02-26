# Audyt stylów — Strona_002

**Data:** 2026-02-25
**Zakres:** Wszystkie pliki CSS/Tailwind/konfiguracja stylów
**Pliki przeanalizowane:** `globals.css`, `Hero.module.css`, `Services.module.css`, `tailwind.config.ts`, `postcss.config.mjs`, `next.config.mjs`
**Wersja:** Next.js 14.2.35 / Tailwind CSS 3.4.1

---

## 1. Ogólna ocena

Strona jest zbudowana starannie, z widocznymi śladami iteracyjnych optymalizacji wydajnościowych (komentarze w kodzie wyjaśniają usunięte drogie właściwości CSS). Dostępność (prefers-reduced-motion, ARIA, sr-only) jest traktowana poważnie. Główne obszary do poprawy to **spójność systemu kolorów**, **zduplikowany kod między plikami** i **brakująca dokumentacja hierarchii z-index**.

### Metryki

| Plik | Linie | Rozmiar (est.) |
|---|---|---|
| `Services.module.css` | 410 | ~13,8 KB |
| `Hero.module.css` | 65 | ~2,1 KB |
| `globals.css` | 60 | ~1,9 KB |
| **Łącznie CSS** | **535** | **~18 KB** |

---

## 2. Co działa dobrze

### 2.1 Optymalizacje wydajnościowe

Autor świadomie usunął kosztowne właściwości i zostawił komentarze:

- ✅ Usunięto `mix-blend-mode: overlay` — powoduje pixel-per-pixel compositing
- ✅ Usunięto `backdrop-filter: blur` z kart podczas scrolla — drogie GPU compositing
- ✅ Usunięto animacje `box-shadow` i `filter` — wywołują layout recalculation
- ✅ Tekstura ziarna jako statyczny `data:image/svg+xml` zamiast live `filter: url(#n)` — brak osobnego żądania HTTP, cachowalny przez przeglądarkę
- ✅ `will-change: transform` dodawane dopiero przy hover (nie permanentnie)

### 2.2 Dostępność

- ✅ `prefers-reduced-motion: reduce` obsługiwany w 3 miejscach (globals.css, Services.module.css; brakuje tylko w Hero.module.css — patrz § 3.3)
- ✅ `sr-only` na semantycznym `<h1>` w Hero
- ✅ `focus-visible` na przyciskach (Button.tsx)
- ✅ ARIA labels na elementach interaktywnych

### 2.3 Architektura stylów

- ✅ Tailwind do layoutu i typografii, CSS Modules do złożonych komponentów — czyste rozdzielenie odpowiedzialności
- ✅ CSS custom properties w Services.module.css dla spójności kolorów
- ✅ `clamp()` dla responsywnej szerokości paska akcentowego
- ✅ Lenis integration styles prawidłowo zaimportowane i skomentowane
- ✅ Użycie `@layer` w globals.css (base, components) — poprawna kaskada Tailwind

---

## 3. Problemy i obszary do optymalizacji

### 3.1 Niespójność systemu kolorów [ŚREDNI] ✅ ZREALIZOWANE CAŁKOWICIE (2026-02-26)

**Problem:** Kolory zdefiniowane są w trzech miejscach, różnymi metodami, bez jednego źródła prawdy.

| Miejsce | Definicja | Format |
|---|---|---|
| ~~`tailwind.config.ts`~~ | ~~`khaki: '#8B7355'`~~ | ~~HEX~~ |
| ~~`Services.module.css`~~ | ~~`--c-gold: 139 115 85`~~ | ~~RGB channel (bez `rgb()`)~~ |
| ~~`Hero.module.css`~~ | ~~`rgb(74 82 64 / 0.09)`~~ | ~~hardkodowane wartości~~ |

**Rozwiązanie (2026-02-26):**
1. CSS variables `--c-gold`, `--c-olive`, `--c-khaki`, `--c-warm` przeniesione do `:root` w `globals.css`
2. Oba moduły CSS (`Hero`, `Services`) używają `rgb(var(--c-gold) / …)` — brak hardkodowanych wartości
3. Tokeny Tailwind (`khaki`, `military-green`) referencjonują te same zmienne CSS przez `<alpha-value>` pattern:
   ```ts
   'khaki': 'rgb(var(--c-gold) / <alpha-value>)'
   'military-green': 'rgb(var(--c-olive) / <alpha-value>)'
   ```
   Zmiana jednej wartości w `:root` aktualizuje wszystkie użycia — w CSS Modules i w klasach Tailwind.

```css
/* globals.css — propozycja */
:root {
  --raw-gold:    139 115 85;
  --raw-olive:    74  82 64;
  --raw-khaki:   146 154 117;
  --raw-warm:    180 130 90;
}
```

---

### 3.2 Zduplikowany kod grain texture [NISKI] ✅ ZREALIZOWANE (2026-02-26)

**Problem:** Identyczny blok grain texture (SVG data-URI + background-size + opacity) powtarzał się niezmieniony w dwóch plikach (`Hero.module.css` i `Services.module.css`), z drobną niekonsekwencją (`z-index: 1` tylko w Hero).

**Rozwiązanie:** Wydzielono klasę `.section-dark-bg` (diagonal pattern + grain texture `::before`) do `globals.css` poza `@layer` — analogicznie do CSS Modules, nadpisuje utility classes Tailwind. Oba moduły CSS i komponenty (`Hero.tsx`, `Services.tsx`) używają teraz `section-dark-bg`. Niekonsekwencja z-index rozwiązana na korzyść wersji Hero (`z-index: 1`).

---

### 3.3 Brakująca reguła prefers-reduced-motion w Hero.module.css [NISKI]

**Problem:** `Services.module.css` i `globals.css` mają blok `@media (prefers-reduced-motion: reduce)`, ale `Hero.module.css` nie ma go wcale, mimo że `.mobileTextHalo::after` używa `filter: blur(35px)`, a `.mobileTextPanel` korzysta z `backdrop-filter: blur(4px)`.

Na urządzeniach z aktywną preferencją reduced motion te efekty nadal będą renderowane.

---

### 3.4 Magic numbers bez dokumentacji [NISKI] ✅ ZREALIZOWANE (2026-02-26)

**Problem:** Kilka wartości w kodzie nie miało wyjaśnienia skąd pochodzi.

**Rozwiązanie:** Dodano komentarze inline wyjaśniające logikę obliczeń:
- `inset: -1.8rem -1.08rem -0.54rem` — bleed bazuje na `border-radius: 0.9rem` (×2.0 / ×1.2 / ×0.6)
- `22px` — okres paska diagonal: 1px linia co 22px ≈ 15,5px rozstaw wizualny przy 45°
- `height/width: 2.2rem` na `.iconBadge` — 2× rozmiar ikony (≈1rem) + margines wzrokowy
- `min-height: 14rem` na `.serviceCard` — zapobiega zapadaniu przy krótkim tekście w siatce 3-kol
- `scaleX(0.72)` na `.cardTopLine` — linia startuje w 72% szerokości, hover → 100%

---

### 3.5 Brak zdefiniowanej hierarchii z-index [NISKI] ✅ ZREALIZOWANE (2026-02-26)

**Problem:** Wartości z-index były ad-hoc, bez systemu i dokumentacji.

**Rozwiązanie:** Dodano tokeny CSS do `:root` w `globals.css` i zastąpiono wszystkie hardkodowane wartości:

```css
--z-below:  -1;  /* pseudo-elementy za rodzicem: glows (mobileTextHalo::after, sectionHeaderShell::after) */
--z-base:    0;  /* pseudo-elementy w tle karty: gradient overlays (serviceCard::before/::after) */
--z-above:   1;  /* treść nad tłem sekcji: contentLayer kart, grain texture (section-dark-bg::before) */
```

Globalny kontekst (Tailwind, bez zmian): `z-10` = layout divs w Hero, `z-50` = Navbar.

---

### 3.6 Responsywna typografia bez płynnego skalowania [NISKI] ✅ ZREALIZOWANE (2026-02-26)

**Problem:** `tailwind.config.ts` definiowało trzy statyczne rozmiary (`80px`, `100px`, `110px`) bez płynnego skalowania. `display-sm` (100px) był nieużywany. Hero skakał z 80px na 110px przy przekroczeniu breakpointu lg.

**Rozwiązanie:** Trzy tokeny zastąpiono jednym fluid tokenem:

```typescript
fontSize: {
  // clamp(80px, 10vw, 110px): min=80px @ 768px → fluid → max=110px @ ~1100px
  display: ['clamp(80px, 10vw, 110px)', { lineHeight: '0.9' }],
}
```

W `Hero.tsx` usunięto `lg:text-display-lg` — `md:text-display` teraz obsługuje cały zakres płynnie.

**Uwaga (bez zmian):** Mobile layout Hero nadal używa `scale-[calc(100vw/766px)]` (scale-trick). Zmiana tego podejścia wykracza poza zakres tego audytu.

---

### 3.7 Gradient complexity w wariantach kart [NISKI — do monitorowania]

**Problem:** `.serviceCardMilitary` i `.serviceCardHighlight` mają po 5 warstw gradientów:

```css
background:
  radial-gradient(...)      /* warstwa 1 */
  radial-gradient(...)      /* warstwa 2 */
  linear-gradient(...)      /* warstwa 3 */
  repeating-linear-gradient(...)  /* warstwa 4 */
  linear-gradient(...);     /* warstwa 5 */
```

Obecne GPU mogą to obsłużyć bez problemu, ale warto profilować na mid-range Android przy pełnym scrollu. Usunięto już `backdrop-filter` (dobry krok), ale repeating-linear-gradient w tle kart + animacje GSAP mogą kumulować się na wolniejszych urządzeniach.

**Sugestia:** Sprawdzić w Chrome DevTools → Rendering → Paint Flashing przy scrollowaniu przez sekcję Services.

---

### 3.8 Nieużywany styl `.rowDivider` na mobile [KOSMETYCZNY] ✅ ZREALIZOWANE (2026-02-26)

**Problem:** `.rowDivider` ma `display: none` jako default, a `display: block` dopiero od `min-width: 1024px`. Komponent renderował element DOM niezależnie od breakpointa.

**Rozwiązanie:** Warunkowe renderowanie w `Services.tsx` — `useState(false)` + `useEffect` nasłuchujący `matchMedia('(min-width: 1024px)')`. Element renderowany tylko gdy `isLg === true`. SSR-safe: startuje jako `false`, aktualizuje się po mount. Element jest `aria-hidden` i czysto dekoracyjny, więc przejście SSR→CSR bez efektów ubocznych.

---

### 3.9 border-image i kompatybilność [INFORMACYJNY] ✅ ZREALIZOWANE (2026-02-26)

**Użycie:**
```css
border-image: linear-gradient(...) 1;
```

Border-image nie jest animowalny (brak płynnej tranzycji). Hover state zmieniał `border-color` na `.serviceCard`, ale `::after` z `border-image` zakrywał solid border — `transition: border-color` był bezużyteczny.

**Rozwiązanie:** `.serviceCard::after` dostał `opacity: 0` w stanie spoczynku i `transition: opacity 340ms`. Na hover `opacity: 1` — gradient border płynnie się pojawia. Solid `border-color` jest teraz widoczny w spoczynku i faktycznie animuje transition przy hover (::after go nie zakrywa). Warianty Military i Highlight dziedziczą te same właściwości przez kaskadę CSS.

---

### 3.10 CSP headers a Tailwind inline styles [INFORMACYJNY]

**Observation:** `next.config.mjs` ma `Content-Security-Policy` z `'unsafe-inline'` dla stylów. To konieczne dla Tailwind + Next.js (JSX inline styles), ale warto odnotować jako trade-off bezpieczeństwa.

---

## 4. Podsumowanie priorytetów

| # | Problem | Priorytet | Wysiłek | Wpływ |
|---|---|---|---|---|
| 3.1 | Niespójny system kolorów | ŚREDNI | Średni | Maintainability | ✅ Tailwind + CSS Modules przez :root |
| 3.2 | Zduplikowany grain texture | NISKI | Mały | DRY | ✅ |
| 3.3 | Brak reduced-motion w Hero | NISKI | Bardzo mały | Dostępność | ✅ |
| 3.4 | Magic numbers | NISKI | Mały | Czytelność | ✅ |
| 3.5 | Brak z-index scale | NISKI | Mały | Maintainability | ✅ |
| 3.6 | Statyczna typografia display | NISKI | Średni | UX | ✅ |
| 3.7 | Gradient complexity | DO MONITOROWANIA | — | Perf (mobile) |
| 3.8 | rowDivider DOM na mobile | KOSMETYCZNY | Mały | Bundle | ✅ |
| 3.9 | border-image animowalność | INFORMACYJNY | — | — | ✅ |
| 3.10 | CSP unsafe-inline | INFORMACYJNY | — | Security trade-off |

---

## 5. Sugerowana kolejność działań

1. **Bez ryzyka, szybkie zyski:**
   - Dodać `@media (prefers-reduced-motion)` do `Hero.module.css` (§ 3.3)
   - Dodać komentarze do magic numbers (§ 3.4)

2. **Refactoring systemu kolorów** (§ 3.1): ✅ ZREALIZOWANE CAŁKOWICIE
   - ~~Zdefiniować CSS custom properties w `:root` dla raw channel values~~
   - ~~Zsynchronizować z tokenami Tailwind (opcjonalne — do decyzji)~~

3. **DRY — grain texture** (§ 3.2): ✅ ZREALIZOWANE
   - ~~Wydzielić do wspólnej klasy lub pliku~~

4. **Monitoring wydajności** (§ 3.7):
   - Sprawdzić Paint Flashing na urządzeniach mobilnych przy scrollu

---

## 6. Co przenieść do `globals.css`

### 6.1 CSS custom properties → `:root` [SILNY KANDYDAT] ✅ ZREALIZOWANE (2026-02-26)

**Teraz:** `--c-gold`, `--c-olive`, `--c-khaki`, `--c-warm` zdefiniowane są na selektorze `.sectionBackground` w `Services.module.css`. Przez to `Hero.module.css` nie ma do nich dostępu i używa tych samych wartości hardkodowanych.

**Przenieść do `globals.css`:**

```css
/* globals.css — dodać przed @tailwind base lub w @layer base */
:root {
  --c-gold:  139 115 85;
  --c-olive:  74  82 64;
  --c-khaki: 146 154 117;
  --c-warm:  180 130 90;
}
```

Po tej zmianie `Hero.module.css` może używać `rgb(var(--c-olive) / 0.09)` zamiast hardkodowanego `rgb(74 82 64 / 0.09)`, co rozwiązuje problem z § 3.1.

---

### 6.2 Klasa bazowa sekcji (diagonal pattern + grain texture) → `@layer components` [SILNY KANDYDAT]

**Teraz:** Blok `.sectionBackground` i jego `::before` (grain texture) jest skopiowany identycznie w `Hero.module.css` i `Services.module.css`. Każda nowa sekcja musiałaby kopiować te ~25 linii po raz kolejny.

**Przenieść do `globals.css` jako reużywalna klasa:**

```css
/* globals.css */
@layer components {
  .section-dark-bg {
    position: relative;
    overflow: hidden;
    background:
      repeating-linear-gradient(
        45deg,
        rgb(var(--c-olive) / 0.09) 0,
        rgb(var(--c-olive) / 0.09) 1px,
        rgb(var(--c-olive) / 0) 1px,
        rgb(var(--c-olive) / 0) 22px
      ),
      rgb(13 13 13);
  }

  /*
   * Grain texture overlay — SVG feTurbulence jako statyczny background-image.
   * Efektywna opacity = 0.12 (SVG rect) × 0.5 (CSS) ≈ 6%.
   */
  .section-dark-bg::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    background-image: url("data:image/svg+xml,...");
    background-repeat: repeat;
    background-size: 256px 256px;
    opacity: 0.5;
  }
}
```

Komponenty usuwają własny `.sectionBackground` i używają `className={`... section-dark-bg`}`. Każdy może nadal dodawać wariant CSS Module nadpisujący tylko to co potrzebuje.

**Drobna niezgodność do rozstrzygnięcia przed implementacją:** `Hero.module.css` ma `z-index: 1` na `::before`, `Services.module.css` nie ma — trzeba wybrać jedną wersję dla klasy globalnej.

---

### 6.3 Blok `@media (prefers-reduced-motion)` z `Services.module.css` → do usunięcia [ZBĘDNY]

**Teraz:** `Services.module.css` ma własny blok (linie 401–409):

```css
@media (prefers-reduced-motion: reduce) {
  .serviceCard,
  .serviceCard::before,
  .cardTopLine,
  .iconBadge,
  .iconDock {
    transition: none;
  }
}
```

**Problem:** `globals.css` już zawiera regułę globalną z `!important`:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
  }
}
```

Reguła globalna z `!important` pokrywa selector `*`, czyli wszystkie elementy z Services. Blok w module jest **redundantny** — można go usunąć bez zmiany zachowania w przeglądarce.

---

### Podsumowanie zmian w globals.css

| Co | Akcja | Efekt |
|---|---|---|
| `--c-gold`, `--c-olive`, `--c-khaki`, `--c-warm` | Dodać do `:root` | Jeden punkt prawdy dla palety |
| Diagonal pattern + grain texture `::before` | ~~Dodać jako `.section-dark-bg` w `@layer components`~~ Dodano poza `@layer` | ✅ Usunięto duplikat z Hero i Services |
| `@media (prefers-reduced-motion)` w Services | Usunąć z modułu | Globalny reset już to robi |

**Co zostaje w modułach bez zmian:** wszystkie style specyficzne dla kart (warianty Military/Highlight), `.mobileTextPanel`, `.mobileTextHalo`, `.sectionHeaderShell` i pozostałe klasy Hero — mają tylko jedno miejsce użycia i nie zyskują nic na globalizacji.

---

*Audyt nie zawiera żadnych zmian w kodzie. Wszystkie sugestie wymagają osobnej decyzji przed implementacją.*
