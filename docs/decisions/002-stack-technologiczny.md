# ADR-002: Wybór stosu technologicznego

**Data:** 2026-02-19
**Status:** Zaakceptowana (zaktualizowana)

---

## Kontekst

Projekt to strona portfolio dla fotografa i operatora wideo. Wymagania kluczowe:
- Dynamiczna, nowoczesna strona pełna animacji
- Szybkie ładowanie dużej ilości zdjęć i wideo
- SEO (klienci wyszukują fotografów przez Google)
- Brak backendu / bazy danych — strona prezentacyjna
- Budżet i czas: rozwiązania open-source, szybki deployment

---

## Rozważane opcje

### Framework

1. **Next.js 14+**
   - Zalety: SSG/SSR, wbudowana optymalizacja obrazów (`next/image`), TypeScript, App Router, duże community, natywna integracja z Vercel
   - Wady: Większa złożoność niż Astro dla prostej strony statycznej

2. **Astro**
   - Zalety: Minimalny JS, bardzo szybkie ładowanie, Islands Architecture
   - Wady: Słabsza integracja z bibliotekami React (GSAP), mniej zasobów community

3. **Nuxt.js (Vue)**
   - Zalety: Analogiczne możliwości do Next.js
   - Wady: Mniejsze community, mniej bibliotek animacyjnych zoptymalizowanych pod Vue

### Animacje

1. **GSAP + ScrollTrigger**
   - Zalety: Industry standard, niesamowita precyzja, timeline animations, scroll-triggered, używany przez Awwwards-level studia
   - Wady: Licencja biznesowa dla niektórych pluginów (ScrollTrigger jest darmowy)

2. **CSS Animations + Intersection Observer**
   - Zalety: Zero zależności, szybkie
   - Wady: Ograniczone możliwości, brak płynnych timeline

### Smooth Scroll

1. **Lenis**
   - Zalety: Natywny scroll z premium feel, lekki, dobra integracja z GSAP ScrollTrigger
   - Wady: Dodatkowa zależność

2. **Natywny scroll CSS (`scroll-behavior: smooth`)**
   - Zalety: Zero JS
   - Wady: Brak kontroli nad prędkością i easing, brak integracji z animacjami

---

## Decyzja

Wybraliśmy **Next.js 14+ + GSAP + Lenis**, ponieważ:

1. **Next.js** zapewnia optymalizację obrazów out-of-the-box (kluczowe dla galerii fotograficznej) oraz SEO przez SSG — bez dodatkowej konfiguracji
2. **GSAP** daje pełną kontrolę nad złożonymi animacjami scroll-based, których nie osiągniemy samym CSS-em
3. **Lenis** to standard de facto dla portfolio premium — efekt przewijania bezpośrednio wpływa na postrzeganie jakości strony
4. **Vercel** jako deploy — zero konfiguracji, darmowy plan wystarczający, automatyczny CI/CD z git

---

## Konsekwencje

- Pozytywne:
  - Bardzo wysokie możliwości animacyjne
  - Optymalna wydajność dla mediów (zdjęcia, wideo)
  - Dobry SEO
  - Szybki deployment i iteracja
- Negatywne / kompromisy:
  - Wyższy próg wejścia niż Astro (Next.js + TypeScript)
  - GSAP wymaga znajomości API (bardziej imperatywny model pracy)
