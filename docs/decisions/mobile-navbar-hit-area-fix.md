# Mobile: nieklikalne elementy poniżej Navbara

## Problem

Na widoku mobilnym (DevTools + telefon) **klika się tylko Navbar**. Cała reszta strony (CTA Hero, ikony social, miniatury YouTube w Promo, akordeon FAQ, linki w About) nie reaguje na tap ani swipe.

## Diagnoza

W konsoli DevTools (mobile view):

```js
document.elementFromPoint(200, 100)
// → <header class="fixed top-0 left-0 right-0 z-50">
```

Header z `z-50` przykrywa cały górny pas ekranu — choć wizualnie widać tylko pasek nawigacji.

## Root cause

`components/layout/Navbar.tsx` zawiera w `<header>` zarówno pasek nawigacji, jak i zwijany dropdown mobilny `#mobile-menu`:

```tsx
<header className="fixed top-0 left-0 right-0 z-50">
  <div ...>...navbar bar...</div>
  <div
    ref={mobileMenuRef}
    id="mobile-menu"
    className="invisible md:hidden border-t border-white/10 bg-[#0f0f12]/90 backdrop-blur-md"
    aria-hidden={!mobileOpen}
  >
    <nav>... 9 linków po ~50 px ...</nav>
  </div>
</header>
```

Tailwindowy `invisible` to `visibility: hidden` — element wciąż **zajmuje miejsce w layout flow**. Header rośnie do wysokości paska + ~450 px ukrytego menu ≈ **500 px** i przykrywa górną połowę widoku.

`visibility: hidden` blokuje pointer-events na samym elemencie, **ale nie na rodzicu** — `<header>` nadal łapie wszystkie tapnięcia w swoim obszarze.

## Fix

Wyciągnąć dropdown z layout flow przez `position: absolute`, żeby header zwijał się tylko do wysokości paska. Animacja GSAP (`autoAlpha` + `translateY`) działa bez zmian.

`components/layout/Navbar.tsx` — w klasie `mobile-menu`:

```diff
- className="invisible md:hidden border-t border-white/10 bg-[#0f0f12]/90 backdrop-blur-md"
+ className="invisible md:hidden absolute left-0 right-0 top-full border-t border-white/10 bg-[#0f0f12]/90 backdrop-blur-md"
```

- `absolute` — wyjmuje z flow.
- `left-0 right-0 top-full` — pełna szerokość, tuż pod paskiem (bez zmian wizualnych).
- Dziedziczy `position:fixed` rodzica, więc nadal scroll-locked.

## Weryfikacja

1. `npm run dev` → DevTools → Device Toolbar.
2. `document.elementFromPoint(window.innerWidth/2, window.innerHeight*0.5)` powinien zwracać element sekcji, nie `<header>`.
3. Smoke test mobile: CTA About → scroll do Promo, miniatura YouTube → iframe, FAQ → akordeon, swipe pionowy płynny, hamburger nadal działa.
4. Test na realnym urządzeniu.

## Lekcja na przyszłość

W komponencie z `position: fixed` i `z-index` wysoko, **nigdy nie wkładać do flow elementów które tylko czasem są widoczne**. Albo `display: none` (znika z flow), albo `position: absolute` (wychodzi z flow). `visibility: hidden` / Tailwindowe `invisible` zostawia layout-box i sprawia, że rodzic łapie pointer-events na "pustym" obszarze.
