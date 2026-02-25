# Raport refactoringu — sekcja Services

**Data:** 2026-02-25
**Dotyczy plików:**
- `components/sections/Services.tsx` (275 linii)
- `components/sections/Services.module.css` (393 linii)
- `lib/site-content.ts` (61 linii)

---

## Podsumowanie

Sekcja Services jest napisana czytelnie i działa poprawnie. Poniższe propozycje mają na celu poprawę **maintainability**, **spójności** i **separacji odpowiedzialności** — bez zmiany funkcjonalności ani wyglądu.

---

## RF-01 — CSS: brak zmiennych dla powtarzających się wartości kolorów

**Priorytet: Wysoki**
**Plik:** `Services.module.css`

### Problem

Te same wartości kolorów RGB są dosłownie wklejone w kilkudziesięciu miejscach pliku CSS. Przykład: kolor `rgb(139 115 85 / ...)` (złoto/khaki) pojawia się w co najmniej 15 deklaracjach z różnymi wartościami przezroczystości, ale bez żadnego wspólnego punktu definicji.

```css
/* Obecny stan — powtórzony w ~15 regułach */
background: radial-gradient(… rgb(139 115 85 / 0.16), …);
border: 1px solid rgb(139 115 85 / 0.32);
border-color: rgb(139 115 85 / 0.7);
background: linear-gradient(… rgb(139 115 85 / 0.2) …);
```

### Propozycja

Wprowadzić CSS Custom Properties (zmienne) na poziomie `:root` lub selektora `.sectionBackground`:

```css
.sectionBackground {
  --c-gold: 139 115 85;       /* bazowy kolor złota (wartości R G B) */
  --c-khaki: 146 154 117;     /* militarny khaki */
  --c-warm: 180 130 90;       /* ciepły akcent highlight */
}

/* Użycie: */
border: 1px solid rgb(var(--c-gold) / 0.32);
border-color: rgb(var(--c-gold) / 0.7);
```

### Uzasadnienie

Zmiana jednej wartości koloru w brandingu (np. z `139 115 85` na `145 120 88`) wymaga dziś edycji w ~15 miejscach z ryzykiem pominięcia. Po refactoringu — 1 miejsce.

---

## RF-02 — CSS: niespójna indentacja w regule hover ✅ ZROBIONE

**Priorytet: Niski**
**Plik:** `Services.module.css`, linia 358

### Problem

Reguła `.serviceCard:hover .iconBadge` ma zbędną wiodącą spację, co narusza spójność formatowania pliku:

```css
  .serviceCard:hover .iconBadge {   /* ← nadmiarowy indent (linia 358) */
  transform: scale(1.06);
```

### Propozycja

```css
.serviceCard:hover .iconBadge {
  transform: scale(1.06);
```

---

## RF-03 — CSS: reguły hover wariantu highlight rozdzielone od bazy

**Priorytet: Niski**
**Plik:** `Services.module.css`

### Problem

Styl bazowy `.serviceCardHighlight:hover .iconBadgeHighlight` jest zdefiniowany przy `.iconBadgeHighlight` (linia 269–275), ale analogiczna reguła dla `.serviceCardMilitary` nie istnieje — hover obsługuje tylko wspólny `.serviceCard:hover .iconBadge`. Brak symetrii utrudnia śledzenie, które stany hover dotyczą każdego wariantu.

### Propozycja

Pogrupować reguły hover przy odpowiadających im blokach wariantów. Stworzyć brakującą regułę `.serviceCardMilitary:hover .iconBadgeMilitary`, by logika obu wariantów była równoważna i jawna.

---

## RF-04 — TS: niespójność operatorów `||` i `??` w `site-content.ts` ✅ ZROBIONE

**Priorytet: Średni**
**Plik:** `lib/site-content.ts`

### Problem

Plik używa dwóch różnych operatorów fallback w podobnych kontekstach:

```typescript
// Linie 3–16: używa ||
seoDescription: process.env.NEXT_PUBLIC_SITE_DESCRIPTION || 'Portfolio…'
hero: { eyebrow: process.env.NEXT_PUBLIC_HERO_EYEBROW || 'Fotografia & Film' }

// Linie 19–22: używa ??
title: process.env.NEXT_PUBLIC_SERVICES_TITLE ?? 'Oferta',
subtitle: process.env.NEXT_PUBLIC_SERVICES_SUBTITLE ?? 'Od reportażu…'
```

Komentarz na linii 2 wyjaśnia intencję użycia `||` (`empty-string env vars also fall back to defaults`), ale ta sama logika nie jest zastosowana do pól `services`.

### Propozycja

Zunifikować do jednego operatora na podstawie świadomej decyzji:

- **Jeśli** pusty string w env powinien traktować się jak brak wartości → użyć `||` wszędzie
- **Jeśli** tylko `null`/`undefined` ma triggerować fallback → użyć `??` wszędzie i zaktualizować komentarz

---

## RF-05 — TS: brak jawnego typu unii dla `icon` ✅ ZROBIONE

**Priorytet: Średni**
**Plik:** `lib/site-content.ts` / `components/sections/Services.tsx`

### Problem

Typ `ServiceIconName` jest dziś wywodzony strukturalnie z danych:

```typescript
// Services.tsx linia 13
type ServiceIconName = ServiceItem['icon']
// → "heart" | "drone" | "crosshair" | "wheel" | "flag"
```

Oznacza to, że dodanie nowej ikony wymaga najpierw dodania jej do tablicy `items`, a dopiero potem TypeScript "widzi" nową wartość w unii. Ponadto `ServiceIcon` używa `switch` z `default: return null` — compiler nie ostrzeże przy brakującej gałęzi, bo typ pochodzi z danych.

### Propozycja

Zdefiniować jawny typ unii w jednym miejscu (np. w `site-content.ts` lub dedykowanym `types.ts`):

```typescript
export type ServiceIconName = 'heart' | 'drone' | 'crosshair' | 'wheel' | 'flag'
```

Dzięki temu `switch` w `ServiceIcon` może być exhaustively checked — usunięcie `default` lub użycie `satisfies` sprawi, że TypeScript ostrzeże przy brakującej gałęzi.

---

## RF-06 — TS: `getCardStyleClassNames` — if-else zamiast lookup table

**Priorytet: Niski**
**Plik:** `components/sections/Services.tsx`, linie 46–66

### Problem

Funkcja `getCardStyleClassNames` używa `if-else` dla 2 wariantów. Przy rozbudowie o trzeci wariant wymaga dodania kolejnego bloku `if`.

```typescript
function getCardStyleClassNames(variant: CardVariant): CardStyleClassNames {
  if (variant === 'highlight') { return { … } }
  return { … } // domyślny: military
}
```

### Propozycja

Zastąpić mapą obiektową (lookup table), co eliminuje logikę warunkową i ułatwia dodanie wariantów:

```typescript
const CARD_STYLE_MAP: Record<CardVariant, CardStyleClassNames> = {
  highlight: {
    card: styles.serviceCardHighlight,
    line: styles.cardTopLineHighlight,
    title: styles.highlightTitle,
    text: styles.highlightText,
    badge: styles.iconBadgeHighlight,
    icon: styles.iconHighlight,
  },
  military: {
    card: styles.serviceCardMilitary,
    line: styles.cardTopLineMilitary,
    title: styles.militaryTitle,
    text: styles.militaryText,
    badge: styles.iconBadgeMilitary,
    icon: styles.iconMilitary,
  },
}

function getCardStyleClassNames(variant: CardVariant): CardStyleClassNames {
  return CARD_STYLE_MAP[variant]
}
```

---

## RF-07 — TS: wyodrębnienie logiki animacji do custom hooka

**Priorytet: Średni**
**Plik:** `components/sections/Services.tsx`, linie 202–229

### Problem

Blok `useEffect` z animacją GSAP (28 linii) jest osadzony bezpośrednio w głównym komponencie `Services`. Logika animacji dotyczy implementacji technicznej, a nie struktury UI — ich mieszanie obniża czytelność komponentu i utrudnia testowanie.

```typescript
// Obecny stan — animacja wewnątrz Services()
useEffect(() => {
  const prefersReducedMotion = …
  const ctx = gsap.context(() => { … }, sectionRef)
  return () => ctx.revert()
}, [])
```

### Propozycja

Wyodrębnić do `components/sections/services/useServicesAnimation.ts` (analogicznie do istniejącego `hero/useHeroAnimations.ts`):

```typescript
// components/sections/services/useServicesAnimation.ts
export function useServicesAnimation(sectionRef: RefObject<HTMLElement>) {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>('[data-service-card]')
      if (prefersReducedMotion) { gsap.set(cards, { autoAlpha: 1, y: 0 }); return }
      gsap.set(cards, { autoAlpha: 0, y: 40 })
      gsap.to(cards, {
        autoAlpha: 1, y: 0,
        duration: 0.7, ease: 'power2.out', stagger: 0.08,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [sectionRef])
}

// W Services.tsx:
useServicesAnimation(sectionRef)
```

Komponent `Services` staje się czysto deklaratywny.

---

## RF-08 — TS: wyodrębnienie `ServiceIcon` do osobnego pliku

**Priorytet: Niski**
**Plik:** `components/sections/Services.tsx`, linie 68–117

### Problem

Komponent `ServiceIcon` (50 linii z pięcioma SVG) jest osadzony w `Services.tsx`. Jego definicja nie ma bezpośredniego związku z logiką układu sekcji. Przy dodaniu nowych ikon plik rośnie.

### Propozycja

Przenieść do `components/sections/services/ServiceIcon.tsx`. Efekt uboczny: zmniejszenie `Services.tsx` z 275 do ~225 linii i lepsza testowalność ikon w izolacji.

---

## RF-09 — TS: nazwane stałe dla wartości magicznych animacji ✅ ZROBIONE

**Priorytet: Niski**
**Plik:** `components/sections/Services.tsx`, linie 213–225

### Problem

Wartości animacji (`0.7`, `0.08`, `'top 75%'`) są dosłownie wpisane w kodzie bez nazwy:

```typescript
gsap.to(cards, {
  duration: 0.7,         // ← magic number
  stagger: 0.08,         // ← magic number
  scrollTrigger: { start: 'top 75%' },  // ← magic string
})
```

### Propozycja

```typescript
const ANIMATION = {
  DURATION: 0.7,
  STAGGER: 0.08,
  SCROLL_START: 'top 75%',
} as const
```

---

## Zestawienie propozycji

| ID    | Opis                                            | Priorytet | Ryzyko |
|-------|-------------------------------------------------|-----------|--------|
| RF-01 | CSS custom properties dla kolorów               | Wysoki    | Niskie | ✅ |
| RF-02 | Naprawa indentacji w hover (linia 358)          | Niski     | Brak   | ✅ |
| RF-03 | Symetryczne reguły hover dla wariantów CSS      | Niski     | Niskie |    |
| RF-04 | Zunifikowanie `||` / `??` w site-content.ts     | Średni    | Niskie | ✅ |
| RF-05 | Jawny typ unii `ServiceIconName`                | Średni    | Niskie | ✅ |
| RF-06 | Lookup table zamiast if-else w getCardStyle…    | Niski     | Brak   |    |
| RF-07 | Custom hook `useServicesAnimation`              | Średni    | Niskie |    |
| RF-08 | Ekstrakcja `ServiceIcon` do osobnego pliku      | Niski     | Brak   |    |
| RF-09 | Nazwane stałe dla wartości animacji             | Niski     | Brak   | ✅ |

### Rekomendowana kolejność wdrożenia

1. ~~**RF-02**~~ ✅ — poprawka kosmetyczna, bez ryzyka, 1 linia
2. ~~**RF-04**~~ ✅ — eliminacja nieczytelnej niespójności, 1–2 linie
3. ~~**RF-01**~~ ✅ — największy zwrot z utrzymania, ~20 linii CSS
4. ~~**RF-05**~~ ✅ + **RF-06** — spójne usprawnienie systemu typów
5. **RF-07** + **RF-08** — strukturalna separacja odpowiedzialności, wykonać razem
6. ~~**RF-09**~~ ✅ — opcjonalne, po RF-07

### Czego celowo NIE ujęto

- Zmian w logice układu kart (kolejność, grid) — działa poprawnie
- Zmian w animacjach GSAP — parametry są wyważone i przetestowane
- Zmian w treści (`site-content.ts`) — są poza zakresem refactoringu
- Dodawania nowych funkcji ani wariantów kart
