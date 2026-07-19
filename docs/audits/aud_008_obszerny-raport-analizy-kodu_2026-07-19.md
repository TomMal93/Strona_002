# Audyt 008 — Obszerny raport z analizy kodu (2026-07-19)

> Rozszerzenie audytu `aud_007`. Pokrywa **cały kod źródłowy** repozytorium: każdy moduł
> aplikacji, warstwę stylów, konfigurację, testy, zasoby statyczne i dokumentację.
> Stan repozytorium: commit `76bcaa2` (branch `claude/analiza-kodu-strony-675f62`).

---

## Spis treści

1. [Zakres i metodologia](#1-zakres-i-metodologia)
2. [Podsumowanie wykonawcze](#2-podsumowanie-wykonawcze)
3. [Wyniki weryfikacji automatycznej](#3-wyniki-weryfikacji-automatycznej)
4. [Architektura projektu](#4-architektura-projektu)
5. [Analiza modułów](#5-analiza-modułów)
6. [Jakość kodu i wzorce](#6-jakość-kodu-i-wzorce)
7. [Wydajność](#7-wydajność)
8. [SEO i metadane](#8-seo-i-metadane)
9. [Dostępność (a11y)](#9-dostępność-a11y)
10. [Bezpieczeństwo](#10-bezpieczeństwo)
11. [Testy i automatyzacja](#11-testy-i-automatyzacja)
12. [Zasoby statyczne i repozytorium](#12-zasoby-statyczne-i-repozytorium)
13. [Dokumentacja](#13-dokumentacja)
14. [Zbiorcza lista znalezisk](#14-zbiorcza-lista-znalezisk)
15. [Plan naprawczy](#15-plan-naprawczy)

---

## 1. Zakres i metodologia

Analiza objęła:

- **Kod źródłowy**: 31 komponentów `.tsx`, 14 hooków animacji, 20 plików CSS Modules
  (8 061 linii CSS), `lib/`, `app/`, konfiguracje (`next.config.mjs`, `tailwind.config.ts`,
  `tsconfig.json`, `.eslintrc.json`, `postcss.config.mjs`).
- **Weryfikację automatyczną**: `tsc --noEmit`, `next lint`, `node --test` (9 testów),
  produkcyjny `next build` z pomiarem bundle.
- **Zasoby**: `public/` (35 MB), historia gita (91 MB), zależności.
- **Przegląd ręczny** każdego komponentu pod kątem poprawności, wydajności, dostępności
  i bezpieczeństwa.

Stack: **Next.js 14.2 (App Router) · React 18.3 · TypeScript 5.9 (strict) · Tailwind CSS 3.4 ·
GSAP 3.12 + ScrollTrigger · Lenis 1.1**. Trzy statyczne trasy: `/`, `/oferta`, `/contact`.

## 2. Podsumowanie wykonawcze

**Ocena ogólna: dobra (4/5).** Projekt jest w stanie produkcyjnym pod względem technicznym:
wszystkie kontrole przechodzą, bundle jest lekki, architektura spójna, a poziom dbałości
o wydajność i dostępność wyraźnie powyżej średniej dla stron portfolio.

Najważniejsze ryzyka (szczegóły w sekcjach niżej):

| # | Ryzyko | Waga |
| --- | --- | --- |
| 1 | Placeholderowe dane kontaktowe (`tel:+48123456789`, `kontakt@example.com`) jako fallback env | 🔴 wysoka |
| 2 | `<source type="video/mp4">` przy plikach `.webm` w 4 komponentach | 🔴 wysoka |
| 3 | Favicon + obraz OG = 1,4 MB PNG (`Hero_v4.png`) | 🔴 wysoka |
| 4 | Preloader pobiera niezoptymalizowany obraz hero (podwójny transfer, wolniejszy gate) | 🔴 wysoka |
| 5 | Formatowanie treści w `About.tsx` sprzężone z dokładnym brzmieniem tekstu (łamie się przy zmianie env) | 🟠 średnia |
| 6 | Sekcja About re-renderuje się co 80 ms przez timer HUD — także poza ekranem | 🟠 średnia |
| 7 | Logika karuzeli zduplikowana w 3 sekcjach (~350 linii powtórzonego kodu) | 🟠 średnia |
| 8 | Błąd a11y: `aria-labelledby` w FAQ wskazuje nieistniejące id | 🟠 średnia |
| 9 | Brak `sitemap.ts`, `robots.ts`, dedykowanego OG image | 🟠 średnia |
| 10 | Brak CI, testy pokrywają wyłącznie dane/konfigurację | 🟡 niska |

## 3. Wyniki weryfikacji automatycznej

| Kontrola | Wynik | Uwagi |
| --- | --- | --- |
| `npm run typecheck` | ✅ | TypeScript strict, 0 błędów |
| `npm run lint` | ✅ | ESLint + `jsx-a11y` + `tailwindcss`, 0 ostrzeżeń |
| `npm test` | ✅ 9/9 | ostrzeżenie `MODULE_TYPELESS_PACKAGE_JSON` (brak `"type": "module"`) |
| `npm run build` | ✅ | 6/6 stron statycznych, bez ostrzeżeń |

Bundle produkcyjny (First Load JS):

| Trasa | Rozmiar strony | First Load JS |
| --- | --- | --- |
| `/` | 18,6 kB | **134 kB** |
| `/contact` | 9,69 kB | 119 kB |
| `/oferta` | 4,13 kB | 159 kB |
| `/_not-found` | 142 B | 87,6 kB |
| shared | — | 87,5 kB |

Ocena: **bardzo dobra** jak na stronę z GSAP + Lenis + rozbudowanymi animacjami.
Największy pojedynczy chunk to framework React (53,6 kB). Trasa `/oferta` jest najcięższa —
ładuje `CinematicVideoPlayer` i pełne warianty ofertowe; wciąż w bezpiecznym zakresie.

## 4. Architektura projektu

```
app/                    # App Router: layout + 3 trasy + error/not-found
components/
  layout/               # Navbar, SectionRail, SmoothScroll (Lenis), Footer
  sections/             # 8 sekcji strony głównej + hooki animacji per sekcja
  pages/                # komponenty tras /oferta i /contact (katalog "about-me")
  ui/                   # Preloader (+gate), CinematicVideoPlayer, Button, useLazyVideoSource
  analytics/            # WebVitalsReporter
lib/                    # site-content.ts (cała treść), utils.ts (cn)
tests/                  # 5 plików testów danych/konfiguracji (node:test)
docs/                   # tech-spec, design, ADR, standardy, 6 wcześniejszych audytów
scripts/                # analyze-bundle.mjs (raport chunków)
public/                 # obrazy (~2,4 MB) i wideo (~27 MB)
```

Przepływ danych jest jednokierunkowy i przewidywalny: **`site-content.ts` → komponenty
sekcji → hooki animacji**. Każda sekcja to trójka: `Sekcja.tsx` (markup) +
`useSekcjaAnimations.ts` (GSAP) + `Sekcja.module.css` (style). Konwencja jest konsekwentnie
utrzymana w całym projekcie — to duża zaleta przy utrzymaniu.

Mocne decyzje architektoniczne:

- **Centralizacja treści** w `lib/site-content.ts` z nadpisywaniem przez env
  (`||` zamiast `??` — świadome, skomentowane: pusty string też ma robić fallback).
- **Separacja animacji od markupu** — hooki przyjmują refy, markup zostaje czytelny.
- **Brak zbędnych zależności**: 7 pakietów runtime, zero bibliotek UI, ikony inline SVG.
- **Dokumentacja decyzji**: ADR-y, standardy kodowania, historia audytów w `docs/`.

Słabsze punkty:

- Katalog `components/pages/about-me/` obsługuje trasę **`/contact`** — nazewnictwo
  ścieżka↔komponenty rozjechało się po zmianach koncepcji (w `site-content.ts` wciąż
  istnieje osobna gałąź `aboutMe.meta` na przyszłą stronę „O mnie").
- Dwie równoległe konwencje stylowania (Tailwind inline + rozbudowane CSS Modules)
  z powielonymi tokenami — patrz §6.4.

## 5. Analiza modułów

### 5.1. `app/` — layout i trasy

**`layout.tsx`** — poprawna konfiguracja `next/font` (Bebas Neue + Inter, `display: swap`,
zmienne CSS), metadane z szablonem tytułu, OpenGraph/Twitter, JSON-LD (`ProfessionalService`)
z escapowaniem `</`. Dwa inline skrypty: JSON-LD i synchroniczny boot preloadera
(klasa `intro-played` z `sessionStorage` przed pierwszym paintem — eleganckie rozwiązanie
przeciw FOUC). Zastrzeżenia:

- `icons.icon` i `openGraph.images` wskazują na `/images/Hero_v4.png` (1,4 MB) — §8.
- Fallbacki `SITE_URL=https://example.com`, `AUTHOR_NAME='Autor'` — §10/§8.
- `suppressHydrationWarning` na `<html>` jest uzasadnione (klasa `intro-played` dodawana
  przed hydracją).

**`page.tsx`** — czysta kompozycja 8 sekcji. Komentarz deklaruje sekcje „w kolejnych
iteracjach" (Benefits, Portfolio, Instagram) — spójne z tech-spec, ale niespójne z README (§13).

**`error.tsx` / `not-found.tsx`** — poprawne użycie konwencji App Router, wspólne klasy
`page-shell`/`page-panel`. Dwa problemy: kopia bez polskich znaków („Wystapil blad",
„Sprobuj ponownie") oraz wyświetlanie `error.message` użytkownikowi (§10.3).

**`contact/page.tsx`** — składa komponenty `about-me/*`; przekazuje `heroOverride`
z `imageUnoptimized: true` (obraz tła omija optymalizację `next/image` — do weryfikacji wagi).
**`oferta/page.tsx`** — prosta kompozycja Hero + Services + CTA, poprawne metadane.

### 5.2. `components/layout/`

**`Navbar.tsx`** (316 linii) — dopracowany: rAF-throttling scrolla, GSAP entrance,
menu mobilne z animacją, Escape zamyka, poprawne `aria-expanded`/`aria-controls`/`aria-current`,
logo odsłaniane po przewinięciu. Zastrzeżenia:

- `NAV_ITEMS` definiuje 9 pozycji, renderowane są 3 (`DESKTOP_NAV_ITEMS`); pozostałe służą
  już tylko scroll-spy — martwa konfiguracja. Nazwa `DESKTOP_NAV_ITEMS` myli, bo lista
  zasila też menu mobilne.
- Scroll-spy czyta `offsetTop`/`offsetHeight` **wszystkich** sekcji przy każdym scrollu
  (w rAF). Pozycje można cache'ować i unieważniać przy `resize`.

**`SectionRail.tsx`** — boczna nawigacja sekcji (desktop). Poprawna (aria-current,
motion-reduce, ukrywanie poza `/`), ale **duplikuje scroll-spy z Navbara** trzecim
listenerem scrolla i inną metodą pomiaru (`getBoundingClientRect` vs `offsetTop`).
Wspólny hook `useActiveSection` usunąłby rozjazd i podwójną pracę na scrollu.

**`SmoothScroll.tsx`** — wzorcowa integracja Lenis: własna pętla rAF (uniezależniona od
tickera GSAP), `ScrollTrigger.update` na scroll, stop/start na eventach `intro:active`/`intro:done`,
pełne sprzątanie, wyłączenie przy `prefers-reduced-motion`. Bez zastrzeżeń.

**`Footer.tsx`** — server component (jedyny obok stron — reszta to `'use client'`),
ikony inline, `rel="noopener noreferrer"` na linkach zewnętrznych. Drobiazg:
`new Date().getFullYear()` zamraża rok w momencie builda (strona statyczna) — praktycznie
bez znaczenia przy regularnych deployach.

### 5.3. `components/ui/`

**`Preloader.tsx` + `usePreloaderGate.ts`** — najbardziej dopracowany moduł projektu.
Gate czeka na: fonty (`document.fonts.ready`), zasób hero (obraz desktop / wideo mobile),
`window.load`; minimum 1,1 s widoczności, twardy limit 6 s, `AbortController` w sprzątaniu,
obsługa `prefers-reduced-motion` i braku `sessionStorage`. Problemy:

- **Preloaduje surowy `/images/Hero_v4.png` (1,4 MB)**, podczas gdy Hero renderuje wersję
  zoptymalizowaną przez `next/image` (inny URL) — użytkownik pobiera obraz dwukrotnie,
  a gate czeka na wolniejszy z nich (§7.2).
- `MIN_VISIBLE_MS = 1100` to świadomy koszt UX: każda pierwsza wizyta ma LCP opóźnione
  o ≥1,1 s. Decyzja biznesowa — warto ją odnotować przy pomiarach Lighthouse.

**`CinematicVideoPlayer.tsx`** — reużywalny odtwarzacz (play/pauza, seek, głośność,
fullscreen, timecode) z poprawnymi aria-labels; użyty w Promo i OfertaServices.
Problemy: hard-coded `type="video/mp4"` (§6.1); pasek postępu jako `<button>` obsługuje
tylko klik myszy — brak obsługi klawiatury dla seek (§9).

**`Button.tsx`** — polimorficzny (`as: 'button' | 'a'`) z dyskryminowaną unią typów,
3 warianty. Poprawny; używany głównie na stronach błędów — sekcje używają własnych
klas linków (niewykorzystany potencjał ujednolicenia CTA).

**`useLazyVideoSource.ts`** — zwięzły, poprawny (fallback bez `IntersectionObserver`,
disconnect po trafieniu, `rootMargin` 400px).

### 5.4. `components/sections/` — strona główna

**`Hero.tsx`** — podwójny markup mobile/desktop (oba w DOM, przełączane CSS), `sr-only h1`
dla SEO, obraz `loading="eager"` + `sizes`, animacje wejścia z dynamicznym importem GSAP.
Poprawny; koszt podwójnego DOM akceptowalny.

**`About.tsx`** — najbardziej „kreatywny" markup (viewfinder HUD z baterią, REC, timecode).
Dwa istotne problemy:

1. **Formatowanie sprzężone z treścią**: łamanie linii przez `split('historie.')`,
   `split('pisać.')`, `split('filmem.')`, `split('wspomnień.')`,
   `split('I tutaj zaczyna się moja rola.')`, a nawet `replace('Malxxxxx. ', …)` —
   zakodowane na stałe fragmenty **domyślnego** tekstu. Treść jest nadpisywalna przez
   env (`NEXT_PUBLIC_ABOUT_*`), więc każda zmiana treści w env po cichu psuje formatowanie
   (tekst wyrenderuje się bez łamań lub z uciętym fragmentem). Rekomendacja: przenieść
   łamania do treści (`\n` + `whitespace-pre-line`, jak robią to inne sekcje).
2. **Timer HUD**: `setInterval(…, 80)` aktualizuje stan React co 80 ms → **cała sekcja
   re-renderuje się ~12,5×/s przez cały czas życia strony**, także gdy sekcja jest poza
   ekranem. Rekomendacja: aktualizować bezpośrednio `textContent` w ref (bez stanu React)
   i uruchamiać tylko, gdy sekcja jest widoczna (`IntersectionObserver`).

**`Promo.tsx` / `Services.tsx` / `Testimonials.tsx`** — trzy sekcje z karuzelami
implementują **tę samą logikę niezależnie** (§6.2): klony brzegowe
(`[last, ...items, first]`), indeks DOM vs logiczny, blokada `isAnimatingRef`,
gesty pointer (identyczny próg 36px, identyczne handlery `handlePointerDown/Up/Cancel`),
reset transformacji po `transitionend` przez podwójny `requestAnimationFrame`.
Dodatkowo w `Services.tsx` mobile-karuzela i desktop-grid renderują karty **podwójnie**
(5 + 3 instancje `SceneCard`, każda z własnym `<video>`) — klony w karuzeli mogą pobierać
ten sam plik wideo wielokrotnie.

**`Process.tsx` / `Faq.tsx` / `Cta.tsx`** — najczystsze sekcje; wspólny wzorzec nagłówka
(tytuł + HUD bar + podtytuł) powtórzony w markupie 6 sekcji (kandydat na komponent
`SectionHeader`). W FAQ błąd a11y — §9.1. Akordeon FAQ poprawnie używa
`aria-expanded`/`aria-controls`, animacja przez CSS.

### 5.5. `components/pages/` — trasy `/oferta` i `/contact`

Struktura analogiczna do sekcji (komponent + hook animacji + CSS Module). `OfertaServices`
reużywa `CinematicVideoPlayer` (dobra zmiana z commita `e873016`). Sześć hooków animacji
`about-me/*` (127–234 linii każdy) powiela ten sam szkielet — patrz §6.3.

### 5.6. `lib/` i `components/analytics/`

**`site-content.ts`** (441 linii) — pojedyncze źródło prawdy dla treści; typowane `as const`,
typ `ServiceIconName` eksportowany. Uwagi: placeholderowe fallbacki kontaktu (§10.1);
duplikacja listy social linków między `hero.social`, `cta.social` i `aboutMe.contact.socials`
(3 kopie tych samych URL-i — warto wydzielić raz).

**`utils.ts`** — standardowe `cn()` (clsx + tailwind-merge). **`WebVitalsReporter.tsx`** —
poprawny, za flagą env, `sendBeacon` do opcjonalnego endpointu.

## 6. Jakość kodu i wzorce

### 6.1. Bug: deklaracja typu MIME niezgodna z plikiem

`<source src="*.webm" type="video/mp4">` w 4 miejscach:

| Plik | Linia |
| --- | --- |
| `components/ui/CinematicVideoPlayer.tsx` | 159 |
| `components/sections/Services.tsx` | 154 |
| `components/pages/about-me/AboutMeVideo.tsx` | 139 |
| `components/pages/about-me/WhyIDoThisVideo.tsx` | 138 |

Atrybut `type` służy przeglądarce do selekcji źródła **przed** pobraniem. Błędna deklaracja
może skutkować pominięciem źródła lub nadmiarowym pobraniem. Naprawa: wyprowadzić typ
z rozszerzenia (`src.endsWith('.webm') ? 'video/webm' : 'video/mp4'`) albo usunąć atrybut
przy pojedynczym `<source>`.

### 6.2. Duplikacja: logika karuzeli w 3 sekcjach

`Promo.tsx` (~90 linii), `Services.tsx` (~120 linii) i `Testimonials.tsx` (~80 linii)
zawierają niemal identyczny kod: klony brzegowe, podwójny indeks (logiczny/DOM), blokada
animacji, 3 handlery pointer z tym samym progiem 36 px, reset po `transitionend`
(w Testimonials wariant GSAP-owy przez `goTo`). Łącznie ~350 linii potrójnie utrzymywanego
kodu — każda poprawka (np. obsługa klawiatury, a11y) musi być wprowadzana 3 razy.
**Rekomendacja**: wspólny hook `useLoopingCarousel({ total })` zwracający indeksy, handlery
i propsy tracka.

### 6.3. Duplikacja: szkielet hooków animacji

14 hooków (~3 650 linii) powtarza: dynamiczny import GSAP, flagę `shouldCleanup`,
`gsap.context` + `revert`, sprawdzenie `prefers-reduced-motion` z ręcznym ustawianiem
stanów końcowych (każdy hook robi to nieco inaczej), zbieranie elementów przez
`querySelectorAll('[data-*]')`. **Rekomendacja**: helper
`useGsapSection(sectionRef, build, { reducedMotionFinalState })` — usunie kilkaset linii
i ujednolici zachowanie reduced-motion.

### 6.4. Styl i konwencje

- **Dwie konwencje stylowania równolegle**: Tailwind w JSX + 8 061 linii CSS Modules.
  Tokeny (gradienty złota, HUD bary, corner-marki, perforacje) powielone w wielu plikach;
  `heroStyles.gradientTextPrimary` importowany między sekcjami (sprzężenie między modułami CSS).
  Największe pliki: `About.module.css` (850), `Testimonials.module.css` (822),
  `Services.module.css` (769).
- **Wzorzec nagłówka sekcji** (tytuł + HUD bar + podtytuł `font-mono`) skopiowany w 6+
  sekcjach — naturalny kandydat na komponent `SectionHeader` z propsami `hudLeft/hudRight`.
- **Refy `useRef<T>(null!)`** — non-null assertion w większości sekcji (Hero używa `null`).
  Działa, ale maskuje null-safety; warto ujednolicić.
- **Nazewnictwo**: hooki raz `useXxxAnimation`, raz `useXxxAnimations` (liczba pojedyncza/mnoga
  niekonsekwentna).
- Poza tym kod jest czytelny, dobrze skomentowany (komentarze wyjaśniają „dlaczego",
  np. wybór `||` vs `??`, powody `suppressHydrationWarning`) i w pełni typowany — bez
  `any`, bez wyłączania strict.

## 7. Wydajność

### 7.1. Co działa dobrze

- Lekki bundle (87–159 kB First Load JS), zero ciężkich zależności UI.
- Lazy loading wideo (`IntersectionObserver`, 400 px marginesu) i fasada YouTube
  (iframe dopiero po kliknięciu, `youtube-nocookie.com`, miniatura przez `next/image`).
- `next/font` (self-hosted, `display: swap`), AVIF/WebP, `minimumCacheTTL` 30 dni,
  nagłówki `immutable` dla `/_next/static`.
- Scroll handlery z throttlingiem rAF, animacje na transformach/opacity (kompozytor).
- Dynamiczny import GSAP w hookach sekcji.

### 7.2. Problemy

1. **Podwójne pobieranie obrazu hero** (§5.3): preloader ładuje surowy PNG 1,4 MB, strona —
   wersję zoptymalizowaną. Na wolnym łączu preloader realnie **wydłuża** czas do treści,
   zamiast go maskować. Naprawa: preload URL-a z `getImageProps` (next/image) albo
   rezygnacja z preloadu obrazu.
2. **Timer HUD w About** (§5.4): re-render sekcji co 80 ms na stałe. Naprawa: `textContent`
   przez ref + start/stop na widoczności.
3. **Podwójny render kart Services**: 8 instancji `SceneCard` (5 mobile + 3 desktop) w DOM
   jednocześnie, każda z `<video>`; klony mogą dublować pobrania wideo.
4. **Wideo self-hosted ~27 MB** (`contact.mp4` 8,7 MB, `bieg.webm` 6,7 MB,
   `promo-reel.webm` 4,3 MB, 2× 3,8 MB): lazy loading ogranicza koszt początkowy, ale na
   Vercelu wideo konsumuje transfer i nie ma adaptacyjnej jakości. Rekomendacja: mocniejsza
   kompresja (VP9/AV1, CRF 32–36, 720p dla kart) lub hosting wideo (Mux/Cloudinary/bunny.net).
5. **`imageUnoptimized: true`** dla tła hero na `/contact` — omija pipeline optymalizacji.
6. **3 niezależne listenery scrolla** (Navbar ×2, SectionRail) mierzące sekcje różnymi
   metodami — do konsolidacji we wspólnym hooku z cache pozycji.
7. `MIN_VISIBLE_MS = 1100` preloadera = świadome opóźnienie LCP pierwszej wizyty o ≥1,1 s.

## 8. SEO i metadane

| Element | Stan | Uwagi |
| --- | --- | --- |
| Tytuły + szablon (`%s \| Autor`) | ✅ | per trasa |
| Meta description | ✅ | z env/fallback |
| OpenGraph + Twitter Card | ⚠️ | skonfigurowane, ale obraz = 1,4 MB PNG (część crawlerów odrzuca > 1 MB; brak wymiarów 1200×630) |
| JSON-LD | ✅ | `ProfessionalService`, escapowane `</` |
| `lang="pl"`, `locale: pl_PL` | ✅ | |
| Favicon / apple-icon | ❌ | ten sam 1,4 MB PNG; brak dedykowanych plików `app/icon.png`, `app/apple-icon.png` |
| `sitemap.xml` | ❌ | brak `app/sitemap.ts` (3 trasy — 10 minut pracy) |
| `robots.txt` | ❌ | brak `app/robots.ts` (meta robots jest tylko w HTML) |
| Canonical | ⚠️ | `metadataBase` jest, ale bez ustawionego `SITE_URL` wskazuje `example.com` — wtedy OG/canonical są wręcz szkodliwe |
| Semantyka nagłówków | ✅ | jeden `h1` (sr-only w Hero), sekcje z `h2`, `aria-labelledby` |

## 9. Dostępność (a11y)

### 9.1. Błąd: wiszący `aria-labelledby` w FAQ

`Faq.tsx:130` — panel odpowiedzi ma `aria-labelledby={"faq-question-" + i}`, ale **żaden
element nie ma takiego id** (przycisk pytania jest bez `id`). Czytniki ekranu dostają
region bez etykiety. Naprawa: dodać `id={"faq-question-" + i}` do przycisku.

### 9.2. Pozostałe uwagi

- **Karuzele**: zmiana slajdu nie jest komunikowana czytnikom ekranu (brak `aria-live`
  na kontenerze lub `aria-roledescription="carousel"`); klony slajdów są percepcyjnie
  identyczne z oryginałami — nawigacja klawiaturą trafia w duplikaty. Swipe działa tylko
  dotykiem, strzałki tylko myszą/klawiszem Enter — brak obsługi strzałek ⟵⟶ na kontenerze.
- **Seek w `CinematicVideoPlayer`**: pasek postępu to `<button>` reagujący na `clientX`
  kliknięcia — nieobsługiwalny klawiaturą (Enter przewija do pozycji 0). Wariant dostępny:
  `<input type="range">` jak przy głośności.
- **Filmy bez napisów**: `jsx-a11y/media-has-caption` wyciszone per linia — przy materiałach
  czysto wizualnych (b-roll) akceptowalne, ale film „Przedstawiam się" zawiera mowę i
  powinien mieć `<track>` z napisami.
- Przycisk nawigacji w `Testimonials.tsx` bez `type="button"` (poza formularzem — bez
  skutków, niekonsekwencja).

### 9.3. Co działa dobrze

`prefers-reduced-motion` respektowane w 21 plikach (animacje wejścia, Lenis, preloader,
timer HUD); `focus-visible` konsekwentnie ostylowane; poprawne wzorce hamburgera i
akordeonu; `aria-current` w nawigacjach; `aria-hidden` na dekoracjach; sr-only `h1`;
`role="status"` + `aria-label` na preloaderze.

## 10. Bezpieczeństwo

### 10.1. Dane placeholderowe jako fallback (ryzyko biznesowe)

Bez kompletu zmiennych env produkcja wyświetli: `tel:+48123456789` (Hero, CTA, WhatsApp),
`kontakt@example.com` (CTA, kontakt), `https://example.com` (metadataBase → OG/JSON-LD).
Kliknięcie „Zadzwoń" wybierze cudzy/nieistniejący numer. **Rekomendacja**: walidacja
wymaganych env w `next.config.mjs` (fail-fast przy buildzie) lub prawdziwe wartości
jako fallback.

### 10.2. Nagłówki i CSP

Skonfigurowane: CSP, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`,
`Referrer-Policy`, `Permissions-Policy`, `poweredByHeader: false` — solidny zestaw.
Do zacieśnienia:

- `script-src 'unsafe-inline'` — neutralizuje ochronę XSS z CSP; docelowo nonce
  (middleware Next.js) lub hashe dwóch inline skryptów.
- `img-src/font-src/media-src/connect-src https:` — dowolna domena HTTPS; można zawęzić
  do faktycznie używanych (`img.youtube.com`).
- `frame-src` poprawnie ograniczone do `youtube-nocookie.com`.

### 10.3. Drobne

- `error.tsx` renderuje `error.message` — w produkcji może ujawnić szczegóły wewnętrzne
  (ścieżki, nazwy modułów). Lepiej: komunikat ogólny + `digest` do korelacji z logami.
- Linki zewnętrzne mają `rel="noopener noreferrer"` ✅. JSON-LD escapowany ✅.
  Brak endpointów API / danych wejściowych użytkownika — powierzchnia ataku minimalna.

## 11. Testy i automatyzacja

Stan: 5 plików testów (node:test, 9 asercji) pokrywających **dane i konfigurację**
(kompletność `site-content`, layouty usług/highlightów, platformy social, tokeny Tailwind).
To dobre testy kontraktowe — wychwycą usunięcie pola treści — ale:

- **Zero testów zachowania**: karuzele (najbardziej złożona logika w projekcie — wrap-around,
  klony, blokady), akordeon FAQ, preloader gate, scroll-spy — nietestowane.
- **Brak E2E/smoke**: projekt ma skonfigurowanego Playwrighta w środowisku; jeden test
  „strona się ładuje, preloader znika, nawigacja przewija" dawałby realną siatkę
  bezpieczeństwa dla animowanej strony.
- **Brak CI** — w repo nie ma `.github/workflows`; `npm run check` uruchamiany jest tylko
  ręcznie. Minimalny workflow (install → check → build) na PR zamknąłby lukę.
- Ostrzeżenie Node o braku `"type": "module"` w `package.json` przy testach.

## 12. Zasoby statyczne i repozytorium

| Zasób | Waga | Uwagi |
| --- | --- | --- |
| `public/videos/` | ~27 MB | 6 plików; największe: `contact.mp4` 8,7 MB, `bieg.webm` 6,7 MB |
| `public/videos/services/bieg.mp4` | 5,1 MB | **martwy plik** — kod referencuje tylko `bieg.webm` |
| `public/images/Hero_v4.png` | 1,4 MB | używany jako favicon/OG (§8) i preload (§7.2) |
| pozostałe obrazy | ~1 MB | WebP/PNG, rozsądne wagi |
| `.git` | 91 MB | historia binarnych wideo (commit `c896a85` wymieniał formaty) |

Rekomendacje: usunąć `bieg.mp4`; rozważyć Git LFS dla `public/videos/` albo przeniesienie
wideo poza repo (CDN) — obecnie każdy klon repo pobiera ~91 MB historii.

## 13. Dokumentacja

`docs/` jest ponadprzeciętne: tech-spec, design system, branding, standardy kodowania,
ADR-y (szablon + decyzja o stacku), historia 6 audytów z datami, plan redesignu sekcji.
Do poprawy:

- **README nieaktualne**: wymienia sekcje „Portfolio / Galeria" i „Instagram Feed",
  których nie ma w `app/page.tsx`; kolejność sekcji w README różni się od rzeczywistej.
- `docs/open-questions.md` warto zrewidować po wdrożeniu odpowiedzi.
- Brak dokumentacji wymaganych zmiennych env poza `.env.example` (który jest dobry,
  ale nie mówi, które zmienne są *krytyczne* dla produkcji).

## 14. Zbiorcza lista znalezisk

| ID | Priorytet | Kategoria | Znalezisko | Lokalizacja |
| --- | --- | --- | --- | --- |
| F-01 | 🔴 | Bug | `type="video/mp4"` przy plikach `.webm` | 4 pliki (§6.1) |
| F-02 | 🔴 | Biznes/Sec | Placeholderowy telefon/e-mail/URL jako fallback | `lib/site-content.ts`, `app/layout.tsx` |
| F-03 | 🔴 | SEO/Perf | Favicon i OG image = 1,4 MB PNG | `app/layout.tsx:60-63` |
| F-04 | 🔴 | Perf | Preloader pobiera niezoptymalizowany PNG hero | `components/ui/usePreloaderGate.ts:7` |
| F-05 | 🟠 | Poprawność | Formatowanie About sprzężone z brzmieniem treści env | `components/sections/About.tsx:136-192` |
| F-06 | 🟠 | Perf | Re-render About co 80 ms (timer HUD, także poza ekranem) | `components/sections/About.tsx:33-42` |
| F-07 | 🟠 | Utrzymanie | Potrójna implementacja karuzeli (~350 linii) | Promo/Services/Testimonials |
| F-08 | 🟠 | A11y | `aria-labelledby` → nieistniejące id w FAQ | `components/sections/Faq.tsx:130` |
| F-09 | 🟠 | SEO | Brak `sitemap.ts` i `robots.ts` | `app/` |
| F-10 | 🟠 | Repo | Martwy `bieg.mp4` (5,1 MB); `.git` 91 MB przez binaria | `public/videos/services/` |
| F-11 | 🟠 | Sec | CSP z `unsafe-inline` dla skryptów; szerokie `https:` | `next.config.mjs:10-15` |
| F-12 | 🟡 | Utrzymanie | Boilerplate 14 hooków animacji (~3,6 tys. linii) | `components/**/use*Animations.ts` |
| F-13 | 🟡 | Perf | Podwójny render kart Services (8 instancji z wideo) | `components/sections/Services.tsx` |
| F-14 | 🟡 | A11y | Karuzele bez komunikacji zmian; seek bez klawiatury; brak napisów przy filmie z mową | Promo/Services/Testimonials, `CinematicVideoPlayer` |
| F-15 | 🟡 | Utrzymanie | Zduplikowany scroll-spy (Navbar + SectionRail); martwe `NAV_ITEMS` | `components/layout/` |
| F-16 | 🟡 | Jakość | Brak CI; testy tylko danych; brak `"type": "module"` | repo |
| F-17 | 🟡 | UX/Copy | Brak polskich znaków na stronach błędów; `error.message` widoczny | `app/error.tsx`, `app/not-found.tsx` |
| F-18 | 🟡 | Utrzymanie | 3 kopie listy social linków w `site-content.ts` | `lib/site-content.ts` |
| F-19 | 🟢 | Dokumentacja | README niezgodne ze stanem strony | `README.md` |
| F-20 | 🟢 | Perf | `imageUnoptimized` na hero `/contact`; rok w Footer zamrożony w buildzie | `app/contact/page.tsx`, `Footer.tsx` |

## 15. Plan naprawczy

**Etap 1 — szybkie poprawki (≈ pół dnia):**
1. F-01: poprawny typ MIME źródeł wideo (4 pliki).
2. F-08: `id` na przyciskach pytań FAQ.
3. F-10: usunięcie `bieg.mp4`.
4. F-17: polskie znaki + ogólny komunikat błędu.
5. F-16 (część): `"type": "module"` w `package.json`.

**Etap 2 — produkcyjna gotowość (≈ 1 dzień):**
6. F-02: walidacja env / prawdziwe dane kontaktowe.
7. F-03: dedykowany favicon (`app/icon.png`), `apple-icon.png`, OG image 1200×630.
8. F-09: `app/sitemap.ts` + `app/robots.ts`.
9. F-04: preload zoptymalizowanego URL-a hero (`getImageProps`).

**Etap 3 — wydajność i a11y (≈ 1–2 dni):**
10. F-06: timer HUD przez ref + widoczność.
11. F-05: łamania linii w treści zamiast `split()` po fragmentach.
12. F-14: `aria-live` w karuzelach, seek klawiaturą, napisy dla filmu z mową.
13. Kompresja/wyniesienie wideo (F-10/§7.2 pkt 4).

**Etap 4 — refaktoryzacja i jakość (backlog):**
14. F-07: wspólny hook `useLoopingCarousel`.
15. F-12: helper `useGsapSection`.
16. F-15: wspólny `useActiveSection` dla Navbar + SectionRail.
17. F-16: workflow CI (check + build) i smoke test Playwright.
18. Komponent `SectionHeader`; konsolidacja social linków (F-18); aktualizacja README (F-19).

---

*Raport wygenerowany na podstawie pełnego przeglądu kodu, weryfikacji automatycznej
(typecheck, lint, testy, build produkcyjny) i analizy zasobów repozytorium.
Poprzedni audyt: `aud_007_analiza-kodu_2026-07-19.md` (wersja skrócona).*
