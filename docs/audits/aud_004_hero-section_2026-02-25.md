# Audyt sekcji Hero

**Data:** 2026-02-25
**Dotyczy plików:**
- `components/sections/Hero.tsx` (181 linii)
- `components/sections/Hero.module.css` (65 linii)
- `components/sections/hero/useHeroAnimations.ts`
- `components/sections/hero/types.ts`
- `lib/site-content.ts`

---

## KRYTYCZNY

### AH-01 — `aria-labelledby` wskazuje na element ukryty na mobile ✅ ZROBIONE

**Priorytet: Krytyczny**
**Plik:** `Hero.tsx:39`

### Problem

Sekcja używała `aria-labelledby="hero-heading"`, które wskazywało wyłącznie na desktop `<h1>`:

```tsx
/* Hero.tsx */
<section aria-labelledby="hero-heading">  {/* ← referuje desktop h1 */}

{/* Layout mobilny — md:hidden */}
<h1>Zamrażam Chwile</h1>  {/* brak id="hero-heading" */}

{/* Layout desktopowy — hidden md:grid */}
<h1 id="hero-heading">Zamrażam Chwile</h1>  {/* display:none na mobile */}
```

Na urządzeniu mobilnym desktop-div ma `display:none` — element z `id="hero-heading"` jest niewidoczny dla technologii wspomagających (screen readerów). Referencja `aria-labelledby` pozostaje nierozwiązana, sekcja traci dostępną nazwę.

### Fix

Zamieniono na `aria-label="Sekcja główna"` — bezpośredni atrybut niezależny od layoutu. Usunięto `id="hero-heading"` z desktop `<h1>` jako nieużywany.

```tsx
<section aria-label="Sekcja główna">
```

---

## WAŻNE

### AH-02 — `'use client'` na pliku custom hooka ✅ ZROBIONE

**Priorytet: Średni**
**Plik:** `components/sections/hero/useHeroAnimations.ts:1`

### Problem

Plik zawierał dyrektywę `'use client'` mimo że jest custom hookiem, a nie komponentem:

```ts
'use client'          // ← nie jest potrzebne w hooku

import { useEffect } from 'react'
```

Custom hooki nie wyznaczają granicy Server/Client Components — robi to komponent, który je wywołuje. Dyrektywa na hooku jest semantycznie błędna, wprowadza w błąd i może sugerować nieprawidłowy wzorzec przy tworzeniu kolejnych hooków.

### Fix

Usunięto dyrektywę `'use client'` z `useHeroAnimations.ts`. Granica SSR pozostaje poprawnie zdefiniowana w `Hero.tsx`.

---

### AH-03 — Nieprawidłowe `sizes` na mobilnym obrazku ✅ ZROBIONE

**Priorytet: Ważny**
**Plik:** `Hero.tsx:52`

### Problem

Mobilny `<Image>` miał `priority` i `sizes="50vw"`. Na desktopie ten obraz jest ukryty (`md:hidden` → `display:none`), ale Next.js nadal generował `<link rel="preload">` bazując na `sizes="50vw"`. W rezultacie na desktopie 1920px przeglądarka preloadowała zdjęcie o szerokości ~960px mimo że nie jest renderowane.

```tsx
<Image
  src={heroImage}
  priority          {/* preload na każdym urządzeniu */}
  sizes="50vw"      {/* ← 960px preload na desktopie 1920px */}
/>
```

### Fix

Zmieniono na `sizes="(max-width: 767px) 72vw, 1px"`. Wartość `1px` na desktopie sprawia, że Next.js wybiera najmniejszy wariant z srcset — eliminując kosztowny zbędny transfer.

```tsx
sizes="(max-width: 767px) 72vw, 1px"
```

Wartość `72vw` odpowiada faktycznej szerokości obrazu na mobile: kontener `w-[72%]` ze skalowanej ramki `766px` ≈ 72% viewport.

---

## DROBNE

### AH-04 — Dwa elementy `<h1>` w DOM jednocześnie ✅ ZROBIONE

**Priorytet: Niski**
**Plik:** `Hero.tsx:63`, `Hero.tsx:115`

### Problem

Oba layouty miały własny `<h1>`. Oba istniały w DOM jednocześnie — tylko jeden widoczny przez CSS (`display:none`). Crawlery SEO nie uwzględniają `display:none`, więc widziały dwie sekcje `<h1>`.

### Fix

1. Dodano jeden `<h1 className="sr-only">` bezpośrednio w `<section>` — zawsze w drzewie dostępności i widoczny dla crawlerów SEO
2. Oba wizualne nagłówki zmieniono na `<p aria-hidden="true">` — zachowują wygląd i animację GSAP, wykluczone z AT
3. `types.ts` / `Hero.tsx` — typ `headingRef` zaktualizowany z `HTMLHeadingElement` na `HTMLParagraphElement`

---

### AH-05 — `alt=""` na hero image (oba layouty) ✅ ZROBIONE

**Priorytet: Niski**
**Plik:** `Hero.tsx:47`, `Hero.tsx:168`

Oba obrazy hero miały `alt=""`. Zdjęcie przedstawia autora z dronem i kontrolerem — portret marki, nie obraz dekoracyjny. Dodano opisowy alt na obu instancjach:
```tsx
alt="Fotograf i operator drona — portret z dronem i kontrolerem"
```

---

### AH-06 — Zduplikowany SVG arrow w obu layoutach ✅ ZROBIONE

**Priorytet: Niski**
**Plik:** `Hero.tsx:81-96`, `Hero.tsx:143-158`

Ten sam blok 16 linii SVG (ikona strzałki w CTA) był skopiowany dosłownie do mobilnego i desktopowego wariantu przycisku. Rozwiązane razem z AH-08 — wyodrębniono do stałej `ArrowIcon` na górze pliku, obie instancje `<a>` (→ `<Button>`) korzystają z tej samej ikony.

---

### AH-07 — Custom font sizes z Tailwind config nieużywane w Hero ✅ ZROBIONE

**Priorytet: Niski**
**Plik:** `Hero.tsx:118`, `tailwind.config.ts`

### Problem

Konfiguracja Tailwind definiowała klasy `display`, `display-sm`, `display-lg`, ale `<h1>` w Hero używał inline wartości `text-[80px]` i `text-[110px]`. `display-lg` miał wartość 120px — niezgodną z faktycznym użyciem.

### Fix

1. `tailwind.config.ts` — skorygowano `display-lg` z `120px` na `110px` (token odzwierciedla faktyczne użycie; był nigdzie indziej nieużywany)
2. `Hero.tsx` — zastąpiono `md:text-[80px]` → `md:text-display`, `lg:text-[110px]` → `lg:text-display-lg`

`text-[48px]` na mobile pozostaje jako wartość arbitralna — brak odpowiedniego tokenu w skali display.

---

### AH-08 — Komponent `Button.tsx` nieużywany w Hero ✅ ZROBIONE

**Priorytet: Niski**
**Plik:** `Hero.tsx:76`, `Hero.tsx:137`, `components/ui/Button.tsx`

### Problem

`Button.tsx` zawierał wariant `hero`, ale jego styl (`bg-khaki rounded-micro`) całkowicie odbiegał od faktycznego designu CTA (`border border-khaki/70 rounded-full`). CTA były surowym `<a>` z ręcznie wpisanymi klasami.

Dodatkowo `baseClassName` w `Button.tsx` zawierał `text-sm font-semibold uppercase tracking-widest` — właściwości typograficzne specyficzne dla `primary`/`outline`, które kolidowały z wymaganiami wariantu `hero` (`text-[18px] font-medium`, bez uppercase).

### Fix

1. `Button.tsx` — wyjęto `text-sm font-semibold uppercase tracking-widest` z `baseClassName` do wariantów `primary` i `outline`
2. `Button.tsx` — zaktualizowano wariant `hero` do faktycznego designu CTA: `rounded-full border border-khaki/70 px-7 py-3.5 text-[18px] font-medium text-white hover:bg-white/10` z prawidłowym focus ring dla ciemnego tła
3. `Hero.tsx` — oba surowe `<a>` zastąpiono `<Button as="a" variant="hero">`; przy okazji rozwiązano AH-06 (wyodrębniona stała `ArrowIcon`)

---

## Zestawienie

| ID    | Opis                                                | Priorytet  | Status   |
|-------|-----------------------------------------------------|------------|----------|
| AH-01 | `aria-labelledby` wskazuje na ukryty element        | Krytyczny  | ✅ ZROBIONE |
| AH-02 | `'use client'` na pliku custom hooka                | Średni     | ✅ ZROBIONE |
| AH-03 | `sizes="50vw"` na ukrytym obrazku — zbędny preload  | Ważny      | ✅ ZROBIONE |
| AH-04 | Dwa `<h1>` w DOM jednocześnie (SEO)                 | Niski      | ✅ ZROBIONE |
| AH-05 | `alt=""` na hero image                              | Niski      | ✅ ZROBIONE |
| AH-06 | Zduplikowany SVG arrow w mobile/desktop             | Niski      | ✅ ZROBIONE |
| AH-07 | Custom font sizes z Tailwind nieużywane w Hero      | Niski      | ✅ ZROBIONE |
| AH-08 | `Button.tsx` nieużywany — surowy `<a>` zamiast niego | Niski     | ✅ ZROBIONE |
