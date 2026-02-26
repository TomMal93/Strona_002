# Audyt optymalizacji kodu — Strona_002

**Data:** 2026-02-26  
**Zakres:** architektura renderowania, bundle JS, animacje, SEO i wydajność runtime  
**Metoda:** analiza statyczna kodu + walidacja komendami `npm run check` i `npm run build`

---

## 1. Podsumowanie

Projekt ma dobrą bazę pod wydajność (optymalizacja obrazów przez `next/image`, podział sekcji, obsługa `prefers-reduced-motion`, cache headers i rozsądna struktura komponentów). Największe rezerwy są w **zmniejszeniu JavaScriptu po stronie klienta** i **odłożeniu części kodu animacji do ładowania warunkowego**.

### Ocena ogólna

- **Wydajność (potencjał):** 7.5/10
- **Maintainability:** 8/10
- **SEO/metadata:** 7/10

---

## 2. Najważniejsze obserwacje i rekomendacje

## 2.1 [WYSOKI] Zbyt szeroki zakres komponentów `use client`

**Status realizacji (2026-02-26):** ❌ Niezrealizowane

### Obserwacja
`Hero` i `Services` są komponentami klienckimi, mimo że tylko część ich logiki (animacje) wymaga klienta. Obecnie cała struktura HTML tych sekcji jest hydratowana po stronie przeglądarki. W `Hero` i `Services` dużo treści jest statyczne i mogłoby być renderowane jako Server Components. 

### Wpływ
- większy bundle JS,
- dłuższy czas hydratacji,
- większe obciążenie CPU na słabszych urządzeniach.

### Rekomendacja
Rozdzielić warstwę prezentacji od animacji:
1. `Hero`/`Services` jako Server Components (markup + treści),
2. małe komponenty klienckie tylko do podpinania GSAP (`HeroAnimationsClient`, `ServicesAnimationsClient`).

**Szacowany efekt:** redukcja JS inicjalnego i krótszy TTI/INP na mobile.

---

## 2.2 [WYSOKI] GSAP + ScrollTrigger ładowane globalnie dla sekcji, które można leniwie uruchamiać

**Status realizacji (2026-02-26):** ✅ Zrealizowane

### Obserwacja
Hooki animacji importują GSAP bezpośrednio i uruchamiają go od razu po montażu komponentu. Przy rozbudowie strony (kolejne sekcje) to zwiększy koszt startowy.

### Rekomendacja
- Zastosować `dynamic import('gsap')` i `dynamic import('gsap/ScrollTrigger')` wewnątrz `useEffect`.
- W przypadku `Services` opóźnić inicjalizację do momentu wejścia sekcji w viewport (IntersectionObserver).

**Szacowany efekt:** mniejszy koszt JS przy pierwszym renderze i lepszy LCP/TBT.

---

## 2.3 [ŚREDNI] Dodatkowy re-render sekcji `Services` przez `matchMedia` + `useState`

**Status realizacji (2026-02-26):** ✅ Zrealizowane

### Obserwacja
W `Services` wartość `isLg` jest utrzymywana w stanie i aktualizowana listenerem `matchMedia`, ale służy tylko do warunkowego renderowania separatora między rzędami kart. To wymusza logikę JS dla efektu, który może być w pełni CSS-owy.

### Rekomendacja
- Usunąć `isLg` i listener.
- Renderować separator zawsze, a widoczność kontrolować klasami responsywnymi (`hidden lg:block`).

**Szacowany efekt:** prostszy kod, mniej listenerów i mniej pracy runtime.

---

## 2.4 [ŚREDNI] `Navbar` stale nasłuchuje scroll, mimo że zmiana progu jest binarna

**Status realizacji (2026-02-26):** ✅ Zrealizowane

### Obserwacja
`Navbar` używa handlera `scroll` + `requestAnimationFrame` tylko po to, by ustawić `scrolled` przy progu `window.scrollY > 40`.

### Rekomendacja
Zastąpić to IntersectionObserverem z 1px sentinel elementem pod hero. Observer wywołuje zmianę stanu tylko przy przekroczeniu progu, bez ciągłego nasłuchu scroll.

**Szacowany efekt:** mniejszy koszt CPU przy przewijaniu i bardziej przewidywalne odświeżanie stanu.

---

## 2.5 [ŚREDNI] Braki w zasobach SEO deklarowanych w metadata

**Status realizacji (2026-02-26):** ✅ Zrealizowane

### Obserwacja
Pierwotnie layout deklarował `og-image.jpg`, `favicon.ico`, `apple-touch-icon.png`, mimo że w repo dostępne były głównie obrazy sekcji (`hero.webp`, `logo_m.png`, `menu_icon.jpg`).

### Ryzyko
- 404 dla części assetów SEO,
- słabszy preview linków i sygnały jakości technicznej.

### Rekomendacja
Dodać brakujące pliki do `public/` albo skorygować ścieżki w metadata.

---

## 2.6 [NISKI] `Navbar` używa `<a href="#...">` zamiast `next/link`

**Status realizacji (2026-02-26):** ❌ Niezrealizowane

### Obserwacja
Dla anchorów na tej samej stronie to nie jest błąd krytyczny. Jednak przy przyszłym przejściu do tras wielostronicowych i prefetchingu lepiej zachować spójność przez `Link`.

### Rekomendacja
Dla nawigacji sekcyjnej można zostawić `<a>`, ale dla przyszłych linków między trasami używać `next/link` i rozdzielić oba przypadki.

---

## 2.7 [NISKI] Możliwa dalsza optymalizacja obrazu logo

**Status realizacji (2026-02-26):** ✅ Zrealizowane

### Obserwacja
Logo w `Navbar` renderowane jest jako obraz 192×192 upakowany w kontener 40–48 px. Na większości urządzeń to lekki overfetch.

### Rekomendacja
Dla logo użyć mniejszego pliku źródłowego (np. 96×96 webp/avif) lub doprecyzować `sizes`/warianty.

---

### Zbiorczy status realizacji (2026-02-26)

- **Zrealizowane:** 5 / 7
- **Częściowo zrealizowane:** 0 / 7
- **Niezrealizowane:** 2 / 7

## 3. Plan wdrożenia (kolejność)

1. **Quick wins (1-2h)**
   - Usunięcie `isLg` + `matchMedia` z `Services`.
   - Weryfikacja i uzupełnienie assetów SEO (`og-image`, favicon, apple-touch-icon).

2. **Średni etap (0.5-1 dnia)**
   - Lazy import GSAP/ScrollTrigger.
   - Refactor `Navbar` scroll state → IntersectionObserver.

3. **Największy zysk (1-2 dni)**
   - Rozdzielenie `Hero` i `Services` na część server-rendered + cienki klientowy adapter animacji.

---

## 4. Co już jest zrobione dobrze

- `next/image` z sensownymi `sizes`, `priority` dla hero i konfiguracją formatów AVIF/WebP.
- Rozsądne nagłówki cache i security policy w `next.config.mjs`.
- Dbałość o `prefers-reduced-motion` i semantykę (`h1` sr-only, aria labels).
- Umiarkowanie konsekwentna separacja treści (`lib/site-content.ts`) od komponentów.

---

## 5. Wniosek końcowy

Kod jest w dobrym stanie i jest przygotowany pod skalowanie. Największa dźwignia optymalizacji to **zmniejszenie udziału klientowego Reacta** i **opóźnienie inicjalizacji animacji**, co powinno dać najlepszy zwrot wydajnościowy bez zmiany UI.
