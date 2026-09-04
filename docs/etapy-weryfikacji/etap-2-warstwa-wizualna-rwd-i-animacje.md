# Polecenie Wykonawcze: Etap 2 — Warstwa Wizualna, RWD i Animacje

> **Instrukcja dla AI / Inżyniera QA:**  
> Wykonaj poniższe polecenie w całości. Przetestuj responsywność, działanie bibliotek animacji (GSAP, Lenis), zachowanie na urządzeniach mobilnych oraz spójność z systemem designu projektu.

---

## 1. Kontekst i Cel Etapu

W projekcie **Strona_002** kluczową rolę w odbiorze wizerunku marki fotografa odgrywa dynamika wizualna: animacje wejścia sekcji, płynny scroll (**Lenis**) oraz efekty oparte o **GSAP ScrollTrigger**. 

Celem **Etapu 2** jest wyeliminowanie problemów z wyświetlaniem na urządzeniach mobilnych (w szczególności iOS Safari), likwidacja niekontrolowanego przewijania poziomego (horizontal overflow) oraz optymalizacja obciążenia GPU przez animacje i reguły CSS.

---

## 2. Zadania Weryfikacyjne i Zakres Badania

### Krok 1: Weryfikacja Responsywności (RWD) na kluczowych breakpointach
Przetestuj każdą z tras (`/`, `/contact`, `/o-mnie`, `/oferta`, `/polityka-prywatnosci`) w narzędziach deweloperskich (emulacja urządzeń) oraz na fizycznych smartfonach:
1. **Wąskie ekrany (360px – 430px):**
   - iPhone SE (375px), iPhone 14/15/16 Pro (393px), Samsung Galaxy S23/S24 (360px / 412px).
   - Sprawdź, czy żaden element nie wystaje poza szerokość okna (test: `document.querySelectorAll('*').forEach(el => el.scrollWidth > window.innerWidth && console.log(el))`).
   - Upewnij się, że nie pojawia się boczny pasek przewijania (`overflow-x`).
2. **Tablety (768px – 1024px):**
   - iPad / iPad Air pionowo i poziomo.
   - Prawidłowe załamywanie siatek kart w sekcjach `Services`, `About` oraz `Testimonials`.
3. **Duże ekrany (1440px – 2560px 4K):**
   - Weryfikacja maksymalnej szerokości kontenerów (`max-w-...`), czy strona nie rozciąga się nadmiernie i czy marginesy boczne zachowują proporcje.
4. **Smartfony w orientacji poziomej (Mobile Landscape, np. 667×375 px, 844×390 px):**
   - Sprawdź zachowanie przy małej wysokości viewportu (< 400 px).
   - Upewnij się, że otwarte menu mobilne umożliwia przewijanie (scroll wewnątrz overlay'a) i użytkownik ma dostęp do wszystkich linków oraz przycisku zamknięcia.

### Krok 2: Zachowanie w przeglądarce mobilnej iOS Safari & Android
1. **Wysokość ekranu (100vh vs 100dvh):**
   - Zbadaj sekcję Hero w `components/sections/Hero.tsx` oraz `ContactHero.tsx`.
   - Sprawdź, czy przy chowaniu/pokazywaniu paska nawigacji Safari dół sekcji nie skacze gwałtownie (użycie jednostek `dvh` / `svh` zamiast sztywnego `100vh`).
2. **Menu mobilne (Hamburger):**
   - Sprawdź animację otwierania i zamykania menu w `components/layout/Navbar.tsx`.
   - Czy kliknięcie w pozycję menu zamyka overlay i płynnie przewija do wybranej sekcji?
   - Czy po otwarciu menu scroll strony w tle jest zablokowany (`overflow: hidden` na `body`)?
3. **Pola dotykowe (Touch Targets):**
   - Upewnij się, że przyciski nawigacji, hamburger, strzałki sliderów i linki mają pole dotykowe co najmniej 44×44 px.

### Krok 3: Płynność animacji GSAP i Lenis Smooth Scroll
1. **Lenis Scroll:**
   - Weryfikacja działania płynnego przewijania. Czy nie występuje "gumowy" efekt lub konflikt z gestami dotykowymi na telefonach?
   - Sprawdź, czy nawigacja kotwicowa (`href="#oferta"`, `#hero`, itp.) przewija do właściwego miejsca z uwzględnieniem wysokości przyklejonego nagłówka (header offset).
2. **GSAP ScrollTrigger:**
   - Sprawdź, czy animacje wyzwalają się w odpowiednim momencie podczas przewijania w dół i w górę.
   - Przetestuj obrót urządzenia (zmiana orientacji pionowa $\leftrightarrow$ pozioma) lub zmianę rozmiaru okna — czy wywoływane jest odświeżenie pozycji `ScrollTrigger.refresh()`?
3. **Zużycie zasobów i CSS `will-change`:**
   - Zbadaj reguły CSS w modułach sekcji (w audycie 007 zidentyfikowano aż 25 stałych deklaracji `will-change`).
   - Upewnij się, że `will-change` nie jest nakładane stale na dziesiątki niewidocznych elementów (ryzyko przepełnienia pamięci GPU na słabszych smartfonach).

### Krok 4: Dostępność, `prefers-reduced-motion` i zachowanie trybu ciemnego
1. Włącz w przeglądarce emulację trybu ograniczonego ruchu (`Rendering` -> `Emulate CSS media feature prefers-reduced-motion: reduce`).
2. Zweryfikuj, czy:
   - Duże animacje przesunięć i zoomów zostają wyciszone lub zamienione na natychmiastowe/delikatne pojawienie (`opacity`).
   - Płynne przewijanie Lenis nie wymusza sztucznego opóźnienia u użytkowników wymagających ograniczenia ruchu.
3. **Wymuszony tryb ciemny w przeglądarce (Browser Force Dark Mode):**
   - Przetestuj stronę w przeglądarce mobilnej z włączonym automatycznym trybem ciemnym (np. Chrome Android: *Auto Dark Mode for Web Contents*).
   - Upewnij się, że ciemna kolorystyka witryny nie jest niepożądanie odwracana (invert) i zadeklarowano `color-scheme: dark` w stylach globalnych.

### Krok 5: Testy cross-browser (Firefox, Edge, Samsung Internet)
Oprócz Chrome i iOS Safari zweryfikuj wygląd i działanie strony w pozostałych popularnych przeglądarkach:
1. **Firefox (desktop + Android):**
   - Firefox korzysta z silnika Gecko — sprawdź, czy animacje GSAP i Lenis renderują się płynnie (brak różnic w `transform`, `will-change` i `backdrop-filter`).
   - Upewnij się, że czcionki (`font-display: swap`) ładują się bez widocznych przeskoków i że fallbacki typograficzne nie psują układu.
2. **Microsoft Edge (desktop):**
   - Edge opiera się na Chromium, ale posiada własne domyślne ustawienia (np. tryb wydajności, blokowanie reklam). Sprawdź, czy żaden wbudowany mechanizm nie blokuje skryptów GSAP lub Lenis.
   - Zweryfikuj poprawność otwierania linków `tel:` i `mailto:` (na desktopie Edge może proponować Skype lub Outlook).
3. **Samsung Internet (Android):**
   - Domyślna przeglądarka na smartfonach Samsung. Przetestuj stronę główną i podstrony na fizycznym urządzeniu Samsung lub emulatorze.
   - Sprawdź, czy wideo w tle (`autoplay muted playsinline`) odtwarza się bez interakcji użytkownika.
4. **Chrome Android:**
   - Zweryfikuj gesty dotykowe (swipe, pinch-to-zoom) w kontekście Lenis smooth scroll — czy nie blokują natywnych gestów systemowych (cofanie, przełączanie kart).

### Krok 6: Audyt dostępności WCAG 2.1 (poziom AA) i skalowanie
Przejdź stronę pod kątem kluczowych kryteriów dostępności:
1. **Nawigacja klawiaturowa (Tab, Enter, Escape):**
   - Przejdź **całą stronę używając wyłącznie klawiatury** (Tab do przodu, Shift+Tab do tyłu, Enter aktywacja, Escape zamknięcie).
   - Upewnij się, że każdy interaktywny element (linki, przyciski CTA, hamburger menu, akordeony FAQ, filtry portfolio) jest osiągalny i aktywowany z klawiatury.
   - Sprawdź, czy menu hamburger otwiera się i zamyka klawiszem Enter/Escape, a focus nie ucieka poza otwarty overlay (focus trap).
2. **Widoczny wskaźnik focusu (focus ring):**
   - Przy nawigacji Tabem musi być wyraźnie widoczny obrys (outline) na aktywnym elemencie.
   - Szczególna uwaga na ciemnych sekcjach — domyślny outline przeglądarki (`outline: auto`) może być niewidoczny na czarnym tle. W razie potrzeby dodać niestandardowy styl `:focus-visible`.
3. **Kontrast kolorów tekstu (WCAG AA):**
   - Sprawdź kontrast tekstu na tle we wszystkich sekcjach za pomocą narzędzia (np. axe DevTools, WAVE lub Lighthouse).
   - Wymagane proporcje: **4.5:1** dla zwykłego tekstu, **3:1** dla tekstu dużego ($\ge$ 18 px lub $\ge$ 14 px bold).
   - Zwróć szczególną uwagę na: szare napisy na ciemnym tle, tekst na zdjęciach/wideo bez wystarczającego kontrastu, placeholdery w polach formularza.
4. **Atrybuty `alt` na obrazach:**
   - Wszystkie znaczące zdjęcia muszą mieć opisowy atrybut `alt` (np. `alt="Sesja ślubna w plenerze – para młoda na tle zachodu słońca"`).
   - Obrazy czysto dekoracyjne powinny mieć pusty `alt=""`, aby czytniki ekranu je pomijały.
5. **Semantyka HTML i ARIA:**
   - Sprawdź, czy strona posiada poprawną strukturę semantyczną: `<header>`, `<nav>`, `<main>`, `<footer>`, `<section>`.
   - Sprawdź obecność linku „Przejdź do treści" (skip-to-content) na początku strony.
   - Upewnij się, że dynamiczne elementy (akordeony, menu) mają odpowiednie atrybuty ARIA: `aria-expanded`, `aria-controls`, `aria-label`, `role`.
6. **Skalowanie tekstu (WCAG 1.4.4 Text Zoom 200%):**
   - Zwiększ rozmiar czcionki w ustawieniach przeglądarki do 200%. Upewnij się, że napisy w nagłówkach Bebas Neue nie ulegają ucięciu, a treść kart nie nakłada się na sąsiadujące bloki.
7. **Podgląd wydruku (`@media print`):**
   - Wywołaj podgląd wydruku (`Ctrl+P`) dla podstron `/oferta` i `/contact`. Sprawdź, czy kluczowe treści są czytelne na wydruku i czy nie drukuje się całe czarne tło zużywające toner.

### Krok 7: Weryfikacja Preloadera, SectionRail i stron błędów
1. **Preloader (`components/ui/Preloader.tsx`):**
   - Sprawdź, czy animacja wejścia (kinowy wordmark splash) jest płynna i nie opóźnia First Contentful Paint.
   - Zweryfikuj mechanizm `sessionStorage` (`intro:played:v1`): po pierwszej wizycie preloader NIE powinien wyświetlać się ponownie w tej samej sesji przeglądarki.
   - Przetestuj zachowanie po wyczyszczeniu danych przeglądarki oraz w trybie incognito — preloader powinien się wyświetlić ponownie.
   - Upewnij się, że preloader nie blokuje botów wyszukiwarek i nie opóźnia sztucznie renderowania treści (hook `usePreloaderGate.ts`).
2. **SectionRail (`components/layout/SectionRail.tsx`):**
   - Sprawdź, czy boczny pasek nawigacji z wskaźnikami sekcji jest widoczny wyłącznie na dużych ekranach (>1405px) i znika na mniejszych.
   - Zweryfikuj, czy aktywna sekcja podświetla się poprawnie podczas przewijania w dół i w górę.
   - Sprawdź, czy kliknięcie w wskaźnik sekcji przewija stronę do właściwego miejsca (integracja z Lenis smooth scroll).
3. **Strony błędów — testy UX:**
   - Wejdź na nieistniejący adres (np. `/nieistniejaca-strona`) i zweryfikuj, że strona 404 (`app/not-found.tsx`) wyświetla się poprawnie, jest responsywna i spójna wizualnie z resztą serwisu.
   - Sprawdź, czy `app/error.tsx` posiada działający przycisk „Spróbuj ponownie" (reset) i umożliwia powrót na stronę główną.
   - Upewnij się, że na stronach błędów nawigacja (Navbar, Footer) jest dostępna, a animacje GSAP nie „wiszą" w niedokończonym stanie.

---

## 3. Checklista Akceptacyjna (Kryteria Pass/Fail)

- [ ] Brak poziomego paska przewijania (`overflow-x: hidden`) na wszystkich stronach w przedziale 360px–2560px.
- [ ] Strona i menu nawigacyjne są w pełni użyteczne w orientacji poziomej na smartfonach (Mobile Landscape).
- [ ] Sekcje Hero zachowują stabilną wysokość w iOS Safari bez ucinania treści przez pasek adresu.
- [ ] Hamburger menu w `Navbar.tsx` działa bez zacięć, blokuje przewijanie tła i zamyka się po kliknięciu linku.
- [ ] GSAP ScrollTrigger poprawnie przelicza pozycje po zmianie rozmiaru/orientacji okna.
- [ ] Wszystkie interaktywne elementy spełniają wymóg minimalnego pola dotyku ($\ge$ 44×44 px).
- [ ] Reguły `prefers-reduced-motion` są respektowane w kluczowych sekcjach.
- [ ] Brak widocznego klatkowania animacji podczas szybkiego scrollowania na mobile.
- [ ] Wymuszony tryb ciemny w przeglądarce mobilnej nie odwraca nieprawidłowo kolorystyki serwisu.
- [ ] Strona renderuje się poprawnie i bez błędów w Firefox, Edge i Samsung Internet (brak artefaktów wizualnych, animacje działają).
- [ ] Wideo `autoplay muted` odtwarza się bez interakcji we wszystkich przeglądarkach docelowych.
- [ ] Cała strona jest w pełni nawigowalna klawiaturą (Tab/Enter/Escape) — każdy link, przycisk i element interaktywny jest osiągalny.
- [ ] Wskaźnik focusu (outline) jest wyraźnie widoczny na wszystkich interaktywnych elementach, w tym na ciemnych sekcjach.
- [ ] Kontrast tekstu spełnia WCAG AA ($\ge$ 4.5:1 dla tekstu zwykłego, $\ge$ 3:1 dla dużego).
- [ ] Skalowanie tekstu do 200% (WCAG 1.4.4) zachowuje czytelność nagłówków i siatek kart.
- [ ] Wszystkie znaczące obrazy posiadają opisowy atrybut `alt`.
- [ ] Preloader wyświetla się tylko raz na sesję (mechanizm `sessionStorage` działa poprawnie).
- [ ] SectionRail poprawnie podświetla aktywną sekcję i znika na ekranach <1405px.
- [ ] Strony błędów (404, 500) są responsywne, spójne wizualnie i posiadają nawigację powrotną.

---

## 4. Oczekiwany Raport Końcowy

Zapisz wyniki w pliku `docs/audits/aud_XXX_weryfikacja-etap-2.md`. Raport powinien zawierać:
1. Listę przetestowanych rozdzielczości i urządzeń (w tym tryb Mobile Landscape).
2. Zestawienie wykrytych kolizji layoutu lub problemów ze scrollem wraz z wprowadzonymi poprawkami.
3. Ocenę płynności animacji GSAP i Lenis (wraz ze statusem redukcji `will-change`).
4. Wyniki testów cross-browser (Firefox, Edge, Samsung Internet) oraz zachowanie w Force Dark Mode.
5. Status weryfikacji Preloadera, SectionRail i stron błędów (404/500).
6. Wyniki audytu dostępności WCAG: nawigacja klawiaturą, kontrast, brakujące `alt`, problemy ARIA oraz test zoomu tekstu 200%.
7. Decyzję: **Zatwierdzenie warstwy wizualnej do Etapu 3** LUB **Wymagane poprawki stylów/animacji/dostępności**.
