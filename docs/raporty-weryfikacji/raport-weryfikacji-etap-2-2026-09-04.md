# Raport weryfikacji przedwdrożeniowej — etap 2

**Projekt:** Strona_002

**Etap:** Warstwa wizualna, RWD i animacje

**Data wykonania:** 2026-09-04

**Gałąź i commit bazowy:** `main`, `fa8a981426a9ed665f0f8f776c928e819d33e72a`

**Wynik:** **PARTIAL — wymagane testy wizualne i cross-browser przed przejściem do etapu 3**

## Podsumowanie

Wykonano audyt kodu odpowiedzialnego za RWD, animacje, Lenis, dostępność, preloader, SectionRail i strony błędów. Naprawiono wykryte problemy możliwe do jednoznacznego potwierdzenia statycznie: dodano skip-link, pułapkę fokusu w menu mobilnym, globalny widoczny focus, deklarację `color-scheme: dark`, obsługę kotwic Lenis z offsetem nagłówka, odświeżanie ScrollTrigger po zmianie rozmiaru i orientacji, style wydruku oraz pola dotykowe 44×44 px dla kluczowych kontrolek.

Pełny odbiór wizualny nie był możliwy, ponieważ sesja audytowa nie udostępniała sterowalnej przeglądarki. Nie wykonano zatem wiarygodnych pomiarów DOM dla poszczególnych viewportów, testów klawiaturowych w działającym UI, zoomu 200%, Force Dark Mode ani testów na fizycznym iOS/Android. Te pozycje pozostają otwarte i blokują bezwarunkowe zatwierdzenie etapu.

## 1. Zakres wykonanych testów

### Testy automatyczne i uruchomieniowe

| Test | Wynik |
|---|---|
| `npm run typecheck` | PASS |
| `npm run lint` | PASS |
| `npm run test` | PASS — 6/6 |
| `npm run build` | PASS — Next.js 16.3.4 |
| `git diff --check` | PASS |
| Test HTTP świeżego buildu | PASS |

Odpowiedzi HTTP świeżo zbudowanej aplikacji:

| Trasa | HTTP |
|---|---:|
| `/` | 200 |
| `/contact` | 200 |
| `/o-mnie` | 200 |
| `/oferta` | 200 |
| `/polityka-prywatnosci` | 200 |
| `/nieistniejaca-strona` | 404 |

### Viewporty i urządzenia

Poniższa macierz wynika z instrukcji etapu, ale nie została wykonana wizualnie z powodu braku dostępnej instancji przeglądarki:

| Viewport / urządzenie | Status |
|---|---|
| 360×800 — Galaxy S23/S24 | NOT TESTED |
| 375×667 — iPhone SE | NOT TESTED |
| 393×852 — iPhone Pro | NOT TESTED |
| 412×915 — Samsung Galaxy | NOT TESTED |
| 768×1024 — tablet portrait | NOT TESTED |
| 1024×768 — tablet landscape | NOT TESTED |
| 667×375 — mobile landscape | NOT TESTED |
| 844×390 — mobile landscape | NOT TESTED |
| 1440×900 — desktop | NOT TESTED |
| 1920×1080 — desktop | NOT TESTED |
| 2560×1440 — szeroki desktop | NOT TESTED |

Nie wykonano testów na fizycznych urządzeniach. Statyczna inspekcja potwierdza zastosowanie breakpointów mobilnych, tabletowych i desktopowych, ograniczenie kontenerów do `max-w-content` / 1280 px oraz globalne `overflow-x: hidden`, ale nie zastępuje to pomiaru `scrollWidth` w DOM.

## 2. RWD, iOS/Android i przewijanie

### Potwierdzone w kodzie

- Hero strony głównej używa `100svh` na mobile i `100dvh` od breakpointu `md`.
- Contact i pozostałe pełnoekranowe kompozycje korzystają z `svh`/`dvh`; menu mobilne ma fallback `100vh`, a następnie `100dvh`.
- Menu mobilne posiada wewnętrzne `overflow-y: auto` i `overscroll-behavior: contain`, więc jego zawartość może przewijać się przy małej wysokości ekranu.
- Otwarcie menu blokuje scroll tła przez `document.body.style.overflow = 'hidden'`.
- Kliknięcie pozycji menu ustawia stan zamknięty.
- Lenis nie jest uruchamiany przy `prefers-reduced-motion: reduce`.
- Włączono `anchors` Lenis z offsetem `-72 px`, a `html` otrzymał `scroll-padding-top: 72px` jako fallback dla nawigacji kotwicowej.
- Konfiguracja Lenis nie włącza wygładzania dotyku, więc gesty dotykowe pozostają natywne.

### Otwarte testy

- pomiar elementów z `scrollWidth > innerWidth` na każdej trasie i szerokości;
- zachowanie paska adresu iOS Safari podczas zmiany wysokości viewportu;
- gesty swipe, pinch-to-zoom i systemowe cofanie w Chrome Android / Samsung Internet;
- rzeczywiste przewijanie menu w orientacji poziomej.

## 3. GSAP, ScrollTrigger, Lenis i `will-change`

- Wszystkie 21 plików TypeScript/TSX korzystających z GSAP lub ScrollTrigger zawierają kontrolę `prefers-reduced-motion` — PASS statyczny.
- `SmoothScroll` odświeża teraz ScrollTrigger po zdarzeniach `resize` i `orientationchange`, z grupowaniem wywołań przez `requestAnimationFrame`.
- Lenis korzysta z osobnej pętli `requestAnimationFrame`, przekazuje scroll do `ScrollTrigger.update` i poprawnie usuwa listenery/pętlę przy unmount.
- Liczba stałych deklaracji CSS `will-change` wynosi 4, wobec 25 wskazanych w historycznym audycie 007. Pozostały wyłącznie na aktywnie transformowanych torach karuzel i obrazie parallax Hero.
- Nie zmieniano pozostałych czterech deklaracji: są ograniczone do elementów rzeczywiście animowanych transformacją, a ich liczba nie wskazuje już na masowe utrzymywanie warstw GPU.

Płynność, moment wyzwalania animacji, przewijanie w górę/dół i brak klatkowania na słabszym telefonie pozostają **NOT TESTED** bez runtime przeglądarkowego i urządzenia fizycznego.

## 4. Dostępność i WCAG 2.1 AA

### Wprowadzone poprawki

1. Dodano widoczny po fokusie link „Przejdź do treści” oraz wspólny cel `#main-content` na wszystkich stronach, 404 i 500.
2. Menu mobilne otrzymało pułapkę fokusu dla Tab/Shift+Tab, zamykanie Escape z powrotem fokusu na hamburger oraz semantykę dialogu modalnego.
3. Dodano globalny kontrastowy styl `:focus-visible`; istniejące lokalne focus ringi pozostają zachowane.
4. Zwiększono do minimum 44×44 px:
   - hamburger i linki nawigacyjne,
   - CTA i ikony społecznościowe Hero,
   - linki społecznościowe w Footer, CTA, `/oferta`, `/o-mnie` i `/contact`,
   - strzałki oraz punkty karuzel Services, Promo i Testimonials,
   - przyciski oraz obszar osi czasu odtwarzacza wideo.
5. Punkty karuzel zachowują wizualny rozmiar 8 px, ale ich rzeczywisty obszar kliknięcia ma 44×44 px.
6. Wszystkie 10 użyć `next/image` posiada opisowy `alt` albo celowo pusty `alt=""` dla obrazów dekoracyjnych / zdublowanych przez nazwę kontrolki.
7. Akordeon FAQ ma `aria-expanded`, `aria-controls` i powiązane identyfikatory odpowiedzi.

### Kontrast

Inspekcja źródeł wykazała liczne teksty pomocnicze o niskiej przezroczystości (np. jasny tekst 35–45% lub złoty token na ciemnym tle). Część pełni funkcję dekoracyjną, część jest dużym tekstem, lecz bez obliczenia wynikowego tła i fontu w DOM nie można potwierdzić WCAG AA dla całej strony. Kontrast pozostaje **REVIEW REQUIRED** w axe/WAVE lub Lighthouse. Nie wykonano globalnego podnoszenia jasności, ponieważ bez wizualnej walidacji zmieniłoby to system marki i nadal nie gwarantowałoby kontrastu tekstu nakładanego na zdjęcia.

### Testy niewykonane

- pełna kolejność Tab/Shift+Tab/Enter/Escape w działającym UI;
- test focus trapu w przeglądarce;
- pomiar kontrastu przez axe/WAVE;
- skalowanie tekstu do 200%;
- test z czytnikiem ekranu.

## 5. Reduced Motion, Force Dark Mode i druk

- Globalna reguła `prefers-reduced-motion` skraca animacje i przejścia; poszczególne hooki GSAP pomijają animacje, Lenis nie jest inicjalizowany, a mobilne wideo Hero nie jest ładowane — PASS statyczny.
- Dodano `color-scheme: dark`, co informuje przeglądarkę o natywnej ciemnej kolorystyce i ogranicza ryzyko niepożądanej automatycznej inwersji.
- Dodano `@media print`: usuwane są nawigacja, stopka, preloader, przyciski i multimedia; tło jest białe, tekst czarny, a sekcje nie zachowują wysokości viewportu.
- Emulacja Force Dark Mode oraz wizualny podgląd wydruku `/oferta` i `/contact` pozostają **NOT TESTED**.

## 6. Cross-browser

| Przeglądarka | Wynik |
|---|---|
| Chromium / Chrome desktop | NOT TESTED — brak instancji przeglądarki |
| Firefox desktop / Android | NOT TESTED |
| Edge desktop | NOT TESTED |
| iOS Safari | NOT TESTED |
| Samsung Internet | NOT TESTED |
| Chrome Android | NOT TESTED |

Build nie wykazał błędów składni ani bundlowania kodu GSAP/Lenis. Atrybuty wymagane dla mobilnego autoplay (`autoPlay`, `muted`, `playsInline`) są obecne w filmach uruchamianych automatycznie. Faktyczne autoplay na iOS Safari i Samsung Internet wymaga testu urządzeniowego.

## 7. Preloader, SectionRail i strony błędów

### Preloader

- Klucz `sessionStorage`: `intro:played:v1`.
- Skrypt w `<head>` ukrywa overlay przed pierwszym paintem dla powracającej wizyty w tej samej sesji.
- Preloader zapisuje klucz po zakończeniu, blokuje body i zatrzymuje Lenis na czas intro.
- Przy reduced motion kończy działanie bez animowanego wyjścia.
- Mechanizm jest poprawny w inspekcji kodu; sekwencja pierwsza/druga wizyta oraz incognito pozostają **NOT TESTED**.

### SectionRail

- Renderuje się wyłącznie na stronie głównej.
- Jest ukryty poniżej 1405 px (`min-[1405px]:block`).
- Aktualizuje aktywną sekcję podczas scrollu, hashchange i resize.
- Używa kotwic obsługiwanych przez Lenis z offsetem nagłówka.
- Podświetlenie podczas scrollu i kliknięcie wskaźnika pozostają **NOT TESTED** wizualnie.

### Strony błędów

- Nieistniejąca trasa zwraca HTTP 404.
- 404 zawiera komunikat i powrót na stronę główną.
- 500 zawiera przycisk wywołujący `reset()` oraz powrót na stronę główną.
- Obie strony mają globalny Navbar, Footer i cel skip-linku.
- Rzeczywiste wywołanie boundary 500 i wizualna responsywność pozostają **NOT TESTED**.

## 8. Zmodyfikowane obszary

- `app/layout.tsx`, wszystkie pliki stron i `app/globals.css` — skip-link, cel głównej treści, dark mode, focus i druk.
- `components/layout/Navbar.tsx` — pułapka fokusu, ARIA i pola dotykowe.
- `components/layout/SmoothScroll.tsx` — kotwice z offsetem i refresh po resize/orientation.
- moduły CSS Services, Promo, Testimonials i odtwarzacza — pola dotykowe 44×44 px.
- Hero, Footer, CTA i podstrony kontaktowe — pola dotykowe 44×44 px.

## 9. Checklista akceptacyjna

- [ ] Brak horizontal overflow na wszystkich trasach 360–2560 px — wymaga pomiaru DOM.
- [ ] Mobile landscape w pełni użyteczny — wymaga testu wizualnego.
- [x] Hero korzysta ze stabilnych jednostek `svh` / `dvh`.
- [x] Menu blokuje tło, zamyka się po kliknięciu i obsługuje Escape.
- [x] Dodano focus trap menu — wymagany jeszcze test runtime.
- [x] ScrollTrigger odświeża po resize i zmianie orientacji.
- [x] Naprawiono wykryte pola dotykowe mniejsze niż 44×44 px.
- [x] Reduced motion jest obsługiwany w Lenis, GSAP, CSS i mobilnym Hero.
- [ ] Brak klatkowania animacji — wymaga testu urządzeniowego.
- [x] Zadeklarowano `color-scheme: dark`.
- [ ] Force Dark Mode nie zmienia niepożądanie kolorów — wymaga emulacji.
- [ ] Firefox, Edge, Samsung Internet i iOS Safari — niewykonane.
- [ ] Autoplay w przeglądarkach mobilnych — atrybuty poprawne, runtime niewykonany.
- [ ] Pełna nawigacja klawiaturą — zabezpieczenia wdrożone, runtime niewykonany.
- [x] Dodano globalny widoczny focus i zachowano lokalne focus ringi.
- [ ] Kontrast WCAG AA całej strony — wymaga pomiaru w DOM.
- [ ] Zoom tekstu 200% — niewykonany.
- [x] Wszystkie obrazy mają opisowe lub prawidłowo puste `alt`.
- [ ] Preloader raz na sesję — poprawny kod, runtime niewykonany.
- [ ] SectionRail — poprawna logika i breakpoint, runtime niewykonany.
- [ ] 404/500 wizualnie — HTTP 404 i struktura kodu potwierdzone, runtime 500 niewykonany.
- [x] Dodano bezpieczny wariant wydruku dla treści.

## Decyzja

**Wymagane dokończenie testów wizualnych, dostępności i cross-browser przed przejściem do etapu 3.**

Kod po poprawkach przechodzi wszystkie kontrole statyczne, build i smoke test tras, ale kryteria etapu 2 wprost wymagają badań w wielu viewportach, przeglądarkach i na urządzeniach mobilnych. Po udostępnieniu sterowalnej przeglądarki należy wykonać macierz viewportów, axe/WAVE, zoom 200%, Force Dark Mode, wydruk oraz regresję animacji; iOS Safari i Samsung Internet powinny zostać dodatkowo sprawdzone na urządzeniach fizycznych lub wiarygodnym emulatorze.
