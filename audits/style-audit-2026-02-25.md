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

### 3.1 Niespójność systemu kolorów [ŚREDNI]

**Problem:** Kolory zdefiniowane są w trzech miejscach, różnymi metodami, bez jednego źródła prawdy.

| Miejsce | Definicja | Format |
|---|---|---|
| `tailwind.config.ts` | `khaki: '#8B7355'` | HEX |
| `Services.module.css` | `--c-gold: 139 115 85` | RGB channel (bez `rgb()`) |
| `Hero.module.css` | `rgb(74 82 64 / 0.09)` | hardkodowane wartości |

`--c-gold` (`139 115 85`) i kolor `khaki` z Tailwind (`#8B7355` = `139 115 85`) to **ta sama wartość**, ale zdefiniowana dwukrotnie, niezależnie. Jeśli paleta zostanie zmieniona, trzeba pamiętać o aktualizacji w obu miejscach.

**Ryzyko:** Desync kolorów przy przyszłych zmianach palety.

**Sugestia:** Przenieść raw channel values do zmiennych CSS w `:root` (np. w `globals.css`), a tokeny Tailwind generować z tych samych wartości.

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

### 3.2 Zduplikowany kod grain texture [NISKI]

**Problem:** Identyczny blok grain texture (SVG data-URI + background-size + opacity) powtarza się niezmieniony w dwóch plikach:

- `Hero.module.css` linia 21–33
- `Services.module.css` linia 18–28

Różnica: brak `z-index: 1` i `pointer-events: none` w wersji Services (drobna niekonsekwencja).

**Sugestia:** Wydzielić do reużywalnej klasy Tailwind (np. `@apply` w globals.css) lub CSS Module dziedziczonego przez oba komponenty.

---

### 3.3 Brakująca reguła prefers-reduced-motion w Hero.module.css [NISKI]

**Problem:** `Services.module.css` i `globals.css` mają blok `@media (prefers-reduced-motion: reduce)`, ale `Hero.module.css` nie ma go wcale, mimo że `.mobileTextHalo::after` używa `filter: blur(35px)`, a `.mobileTextPanel` korzysta z `backdrop-filter: blur(4px)`.

Na urządzeniach z aktywną preferencją reduced motion te efekty nadal będą renderowane.

---

### 3.4 Magic numbers bez dokumentacji [NISKI]

**Problem:** Kilka wartości w kodzie nie ma wyjaśnienia skąd pochodzi:

```css
/* Hero.module.css */
inset: -1.8rem -1.08rem -0.54rem;  /* co to jest? jaka logika? */

/* Services.module.css */
inset: -1.8rem -1.08rem -0.54rem;  /* to samo — znowu zduplikowane */
rgb(0 0 0 / 0) 22px                /* 22px — dlaczego nie 20 ani 24? */

/* Services.module.css */
height: 2.2rem; width: 2.2rem;     /* .iconBadge — niestandardowy rozmiar */
min-height: 14rem;                  /* .serviceCard — skąd ta liczba? */
```

**Sugestia:** Komentarz wyjaśniający obliczenia lub ekstrakcja do nazwanych zmiennych CSS.

---

### 3.5 Brak zdefiniowanej hierarchii z-index [NISKI]

**Problem:** Wartości z-index są ad-hoc, bez systemu:

| Element | z-index |
|---|---|
| `.sectionBackground::before` | 1 (Hero) / brak (Services) |
| `.contentLayer` | 1 |
| pseudo-elementy kart | 0 |
| `z-index: -1` | `.sectionHeaderShell::after`, `.mobileTextHalo::after` |
| Tailwind klasy | `z-10`, `z-50` (Navbar) |

Brak dokumentacji stacking contexts może prowadzić do trudnych do debugowania konfliktów przy dodawaniu nowych sekcji.

**Sugestia:** Token z-index w `:root` lub Tailwind config.

---

### 3.6 Responsywna typografia bez płynnego skalowania [NISKI]

**Problem:** `tailwind.config.ts` definiuje stałe rozmiary display:

```typescript
fontSize: {
  display:    ['80px',  { lineHeight: '0.9' }],
  'display-sm': ['100px', { lineHeight: '0.9' }],
  'display-lg': ['110px', { lineHeight: '0.9' }],
}
```

Te rozmiary są statyczne — nie skalują się płynnie między breakpointami. Dla porównania, `.sectionTitleAccent` już używa `clamp()`, ale tytuły Hero nie.

**Uwaga:** Mobile layout Hero używa `scale-[calc(100vw/766px)]` (scale-trick), co skutecznie skaluje wizualnie, ale nie jest typowym podejściem i może powodować problemy z `text-overflow` i selectable text.

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

### 3.8 Nieużywany styl `.rowDivider` na mobile [KOSMETYCZNY]

**Problem:** `.rowDivider` ma `display: none` jako default, a `display: block` dopiero od `min-width: 1024px`. Nie ma żadnego CSS zapamiętującego ten element na mobile, ale komponent renderuje element DOM niezależnie od breakpointa.

Nie jest to problem CSS, ale wskazuje na możliwość warunkowego renderowania w React (`{isLg && <div className={styles.rowDivider} />}`).

---

### 3.9 border-image i kompatybilność [INFORMACYJNY]

**Użycie:**
```css
border-image: linear-gradient(...) 1;
```

Border-image nie jest animowalny (brak płynnej tranzycji). Hover state zmienia `border-color` na `.serviceCard`, ale `::after` z `border-image` pozostaje statyczny — efekt jest prawidłowy wizualnie, ale może być mylący przy czytaniu kodu.

---

### 3.10 CSP headers a Tailwind inline styles [INFORMACYJNY]

**Observation:** `next.config.mjs` ma `Content-Security-Policy` z `'unsafe-inline'` dla stylów. To konieczne dla Tailwind + Next.js (JSX inline styles), ale warto odnotować jako trade-off bezpieczeństwa.

---

## 4. Podsumowanie priorytetów

| # | Problem | Priorytet | Wysiłek | Wpływ |
|---|---|---|---|---|
| 3.1 | Niespójny system kolorów | ŚREDNI | Średni | Maintainability |
| 3.2 | Zduplikowany grain texture | NISKI | Mały | DRY |
| 3.3 | Brak reduced-motion w Hero | NISKI | Bardzo mały | Dostępność |
| 3.4 | Magic numbers | NISKI | Mały | Czytelność |
| 3.5 | Brak z-index scale | NISKI | Mały | Maintainability |
| 3.6 | Statyczna typografia display | NISKI | Średni | UX |
| 3.7 | Gradient complexity | DO MONITOROWANIA | — | Perf (mobile) |
| 3.8 | rowDivider DOM na mobile | KOSMETYCZNY | Mały | Bundle |
| 3.9 | border-image animowalność | INFORMACYJNY | — | — |
| 3.10 | CSP unsafe-inline | INFORMACYJNY | — | Security trade-off |

---

## 5. Sugerowana kolejność działań

1. **Bez ryzyka, szybkie zyski:**
   - Dodać `@media (prefers-reduced-motion)` do `Hero.module.css` (§ 3.3)
   - Dodać komentarze do magic numbers (§ 3.4)

2. **Refactoring systemu kolorów** (§ 3.1):
   - Zdefiniować CSS custom properties w `:root` dla raw channel values
   - Zsynchronizować z tokenami Tailwind

3. **DRY — grain texture** (§ 3.2):
   - Wydzielić do wspólnej klasy lub pliku

4. **Monitoring wydajności** (§ 3.7):
   - Sprawdzić Paint Flashing na urządzeniach mobilnych przy scrollu

---

*Audyt nie zawiera żadnych zmian w kodzie. Wszystkie sugestie wymagają osobnej decyzji przed implementacją.*
