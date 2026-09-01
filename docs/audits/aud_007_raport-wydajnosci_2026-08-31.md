# Raport optymalizacji szybkości strony — Strona_002

**Data:** 2026-08-31  
**Zakres:** `/`, `/contact`, `/o-mnie`, `/oferta`; czas pierwszego wyświetlenia, JavaScript, media, fonty, animacje i cache  
**Metoda:** produkcyjny `next build`, analiza artefaktów buildu i kodu, rozmiary oraz parametry mediów (`ffprobe`), kontrola konfiguracji HTTP  
**Wersja:** Next.js 14.2.35, React 18.3.1

---

## 1. Wniosek wykonawczy

Strona ma solidne fundamenty: wszystkie trasy są statycznie prerenderowane, obrazy są małe i w większości obsługiwane przez `next/image`, filmy poniżej pierwszego ekranu są ładowane z użyciem `IntersectionObserver`, YouTube korzysta z fasady, a statyczne zasoby mają długi cache.

Największe rezerwy wydajności są jednak istotne:

1. **Preloader celowo opóźnia pokazanie treści o co najmniej ok. 1,7 s na pierwszej wizycie.** To bezpośrednio pogarsza odczuwaną szybkość, nawet przy szybkim łączu.
2. **Wideo waży 85,32 MiB**, czyli ok. 98% katalogu `public`; sam plik `contact.mp4` ma 58,47 MiB i bitrate ok. 8,9 Mb/s.
3. **Duża część strony jest hydratowana po stronie klienta.** First Load JS wynosi 122–159 kB zależnie od trasy, a komponenty globalne od razu dostarczają GSAP i Lenis.
4. **Pięć fontów jest preloadowanych globalnie** (łącznie ok. 115,7 KiB WOFF2), choć nie każda odmiana jest potrzebna nad linią załamania.
5. **Stałe `will-change` występuje w 25 regułach CSS**, co może zwiększać zużycie pamięci GPU na długiej stronie.

### Ocena bieżąca

- Architektura dostarczania treści: **dobra**
- Waga JS: **umiarkowana, do redukcji**
- Strategia obrazów: **dobra**
- Strategia wideo: **częściowo dobra, ale pliki są zbyt ciężkie**
- Odczuwana szybkość pierwszej wizyty: **osłabiona przez preloader**
- Gotowość do monitorowania produkcji: **częściowa** — reporter Web Vitals istnieje, lecz wymaga konfiguracji endpointu i flagi

---

## 2. Wyniki pomiarów

### 2.1 Produkcyjny build tras

`npm run perf:report` zakończyło się powodzeniem. Wszystkie trasy zostały wygenerowane jako statyczne (`○ Static`).

| Trasa | JS trasy | First Load JS | Ocena |
|---|---:|---:|---|
| `/` | 21,8 kB | 137 kB | umiarkowanie |
| `/contact` | 2,87 kB | 143 kB | umiarkowanie |
| `/o-mnie` | 10,2 kB | 122 kB | najlepszy wynik |
| `/oferta` | 4,5 kB | 159 kB | najwyższy koszt |
| wspólne dla wszystkich tras | — | 87,8 kB | główny budżet bazowy |

Największy chunk należący do strony głównej ma **100,8 kB raw / 21,5 kB gzip**. Suma wszystkich wygenerowanych chunków to **1 078,2 kB raw / 334,8 kB gzip**, ale nie są one pobierane jednocześnie przez jedną trasę, więc nie należy interpretować tej sumy jako kosztu pierwszego wejścia.

### 2.2 Media

| Zasób | Rozmiar | Czas | Bitrate | Ryzyko |
|---|---:|---:|---:|---|
| `videos/contact/contact.mp4` | 58,47 MiB | 54,9 s | 8,93 Mb/s | krytyczne na mobile |
| `videos/services/bieg.webm` | 6,68 MiB | 25,1 s | 2,23 Mb/s | wysokie |
| `videos/services/bieg.mp4` | 5,03 MiB | 25,1 s | 1,68 Mb/s | wysokie |
| `videos/promo-reel.webm` | 4,24 MiB | 16,1 s | 2,21 Mb/s | średnie |
| `videos/services/montage.webm` | 3,77 MiB | 15,6 s | 2,03 Mb/s | średnie |
| `videos/services/weeding.webm` | 3,77 MiB | 15,2 s | 2,08 Mb/s | średnie |
| `videos/hero/hero-video.mp4` | 3,36 MiB | 4,87 s | 5,79 Mb/s | wysokie dla hero mobile |

Łącznie:

- obrazy: **1,48 MiB**,
- wideo: **85,32 MiB**,
- udział wideo w `public`: ok. **98%**.

Lazy loading ogranicza faktyczny transfer, lecz domyślny `rootMargin: 400px` rozpoczyna pobieranie jeszcze przed wejściem sekcji do viewportu. Na stronie `/o-mnie` zbliżenie się do sekcji „Dlaczego to robię” może uruchomić pobieranie 58,47 MiB.

### 2.3 Fonty i CSS

Layout definiuje trzy rodziny (`Bebas Neue`, `Inter`, `IBM Plex Mono`) i kilka wag. Odpowiedź HTML deklaruje preload pięciu plików WOFF2 o łącznej wadze ok. **115,7 KiB**. To koszt ponoszony na każdej trasie.

Build emituje sześć plików CSS o łącznej wadze ok. **213,4 KiB raw** dla całej aplikacji; konkretna trasa pobiera tylko przypisane jej chunki. W CSS znaleziono **25 deklaracji `will-change`**, często ustawionych stale zamiast wyłącznie na czas animacji.

### 2.4 Metryki Core Web Vitals

Nie podaję liczbowych LCP, INP, CLS ani wyniku Lighthouse, ponieważ w tej sesji nie była dostępna przeglądarka pomiarowa, a aktywny serwer deweloperski kolidował z osobnym serwerem produkcyjnym. Wyniki z trybu development nie byłyby wiarygodną podstawą raportu.

Projekt ma `WebVitalsReporter`, który obsługuje CLS, FCP, INP, LCP i TTFB. Jest renderowany tylko przy:

```text
NEXT_PUBLIC_ENABLE_WEB_VITALS=true
```

Wysyłka danych wymaga dodatkowo `NEXT_PUBLIC_WEB_VITALS_ENDPOINT`. To dobra baza, ale bez skonfigurowanego odbiornika nie ma danych rzeczywistych użytkowników.

---

## 3. Rekomendacje według priorytetu

## P0 — największy wpływ

### 3.1 Skrócić lub usunąć preloader z krytycznej ścieżki

**Problem:** `usePreloaderGate` wymusza minimum 1100 ms, czeka na fonty, zasób hero i `window.load`, a następnie `Preloader` wykonuje animację wyjścia trwającą do ok. 600 ms. W najlepszym przypadku użytkownik czeka więc ok. 1,7 s na odsłonięcie strony. Limit awaryjny wynosi 6 s.

**Rekomendacja:**

- nie blokować treści oczekiwaniem na `window.load` ani komplet fontów,
- ustawić maksimum 300–500 ms lub przenieść intro nad już widoczny hero bez blokowania interakcji,
- dla `prefers-reduced-motion` pominąć preloader od pierwszego renderu,
- mierzyć osobno „intro duration”, aby nie ukrywać regresji pod estetyczną animacją.

**Spodziewany efekt:** największa poprawa odczuwanej szybkości i szybszy dostęp do CTA; potencjalnie niższy LCP zależnie od sposobu raportowania elementu hero.

### 3.2 Przekodować `contact.mp4` i przygotować warianty responsywne

**Problem:** 58,47 MiB i 8,93 Mb/s to koszt nieproporcjonalny do materiału osadzonego w sekcji strony.

**Rekomendacja:**

- przygotować AV1/WebM oraz H.264 jako fallback,
- ograniczyć bitrate do ok. 1,2–2,5 Mb/s dla 1080p lub zastosować 720p na mobile,
- przyciąć materiał do realnie wykorzystywanego fragmentu,
- użyć osobnych źródeł mobile/desktop,
- rozważyć ładowanie dopiero po kliknięciu, jeśli film nie jest kluczowy dla narracji sekcji.

**Cel:** maks. **8–12 MiB desktop** i **3–6 MiB mobile**. Oznacza to potencjalną redukcję o 80–95%.

### 3.3 Odchudzić hero mobile

**Problem:** hero mobile automatycznie pobiera plik 3,36 MiB o bitrate 5,79 Mb/s. Preloader tworzy dodatkowo tymczasowy element `<video preload="auto">`, a właściwy hero ma bezwarunkowy `src` i `autoplay`.

**Rekomendacja:**

- przygotować wariant mobile 540p/720p o wadze docelowej 0,8–1,5 MiB,
- dodać WebM/AV1 i zachować MP4 fallback,
- nie tworzyć osobnego preloadującego elementu; zamiast tego wykorzystać właściwy element i zdarzenie pierwszej klatki,
- respektować `prefers-reduced-motion` i `Save-Data`, pokazując wtedy poster.

**Spodziewany efekt:** wyraźnie niższy transfer i szybszy start na 4G.

## P1 — wysoki wpływ

### 3.4 Zmniejszyć wspólny JavaScript i zakres hydratacji

**Problem:** globalne `Preloader`, `Navbar`, `SectionRail` i `SmoothScroll` są komponentami klienckimi. Większość sekcji strony głównej również ma `use client`, nawet jeśli duża część ich HTML jest statyczna. First Load JS wynosi 122–159 kB.

**Rekomendacja:**

- zostawić markup i treść jako Server Components,
- wydzielić małe wyspy klientowe tylko dla sterowania animacją i interakcją,
- ładować Lenis i ScrollTrigger po bezczynności (`requestIdleCallback`) lub po pierwszej interakcji,
- nie ładować smooth scroll przy `prefers-reduced-motion`, urządzeniach dotykowych lub `Save-Data`,
- przeanalizować `/oferta`, ponieważ ma najwyższe First Load JS: 159 kB.

**Cel budżetowy:**

- shared First Load JS: **< 75 kB**,
- każda trasa: **< 130 kB**, a docelowo **< 100 kB** dla prostych podstron.

### 3.5 Ładować animacje dopiero w pobliżu sekcji

**Problem:** część hooków dynamicznie importuje GSAP/ScrollTrigger, co jest dobre, ale import następuje po zamontowaniu całej długiej strony. Kod animacji sekcji znajdujących się daleko poniżej hero może zostać pobrany zbyt wcześnie.

**Rekomendacja:** połączyć dynamiczny import z `IntersectionObserver` i inicjalizować sekcję 100–200 px przed viewportem. Wyjątkiem powinien pozostać hero.

### 3.6 Ograniczyć globalny preload fontów

**Problem:** pięć fontów, ok. 115,7 KiB WOFF2, konkuruje z hero o pasmo.

**Rekomendacja:**

- preloadować tylko odmiany rzeczywiście użyte nad linią załamania,
- dla rodzin drugorzędnych ustawić `preload: false`,
- ograniczyć liczbę wag Inter/IBM Plex Mono albo użyć fontu zmiennego,
- sprawdzić wizualnie wpływ `display: swap` i dobrać metryki fallbacku.

**Cel:** maks. **40–70 KiB fontów w krytycznej ścieżce**.

## P2 — średni wpływ i stabilizacja

### 3.7 Zarządzać `will-change` tylko podczas animacji

**Problem:** 25 stałych deklaracji może utrzymywać wiele warstw kompozytora przez cały czas życia długiej strony.

**Rekomendacja:** ustawiać `will-change` tuż przed animacją i czyścić po jej zakończeniu (`clearProps: 'willChange'`), pozostawiając stałe użycie tylko dla elementów faktycznie animowanych ciągle.

### 3.8 Zmniejszyć agresywność lazy-load wideo

**Problem:** `rootMargin = 400px` jest wspólny także dla bardzo dużego filmu kontaktowego.

**Rekomendacja:**

- dla ciężkich filmów użyć `rootMargin` 0–100 px,
- na wolnym łączu lub przy `Save-Data` wymagać kliknięcia,
- rozdzielić „załaduj metadata” od „załaduj pełne źródło”.

### 3.9 Urealnić cache HTML i pomiary produkcyjne

Trasy są statyczne, co jest korzystne. Nagłówki dla `/_next/static` są `immutable`, a media mają 30 dni cache + SWR. Należy dodatkowo potwierdzić na docelowym hostingu:

- CDN cache dla statycznego HTML,
- obsługę Brotli,
- poprawne `Accept-Ranges` dla wideo,
- brak nadpisania nagłówków przez platformę hostingową.

---

## 4. Plan wdrożenia

### Etap 1 — 0,5–1 dnia

1. Skrócić preloader i usunąć oczekiwanie na `window.load`.
2. Dodać fallback poster dla `Save-Data` i `prefers-reduced-motion`.
3. Ustawić mniej agresywne lazy-load dla `contact.mp4`.
4. Skonfigurować endpoint Web Vitals.

### Etap 2 — 1–2 dni

1. Przekodować hero mobile i `contact.mp4` do wariantów responsywnych.
2. Dodać `<source>` w kolejności AV1/WebM → MP4.
3. Zweryfikować `Accept-Ranges`, cache i typy MIME na hostingu.

### Etap 3 — 2–4 dni

1. Rozdzielić statyczny markup od klientowych kontrolerów animacji.
2. Odroczyć Lenis/ScrollTrigger i animacje sekcji poza viewportem.
3. Ograniczyć preload fontów.
4. Usuwać `will-change` po animacji.

---

## 5. Kryteria odbioru po optymalizacji

Pomiary należy wykonać na produkcyjnym URL, co najmniej 5 razy na trasę, w trybie mobilnym Lighthouse oraz potwierdzić danymi RUM po 28 dniach.

| Metryka / budżet | Cel |
|---|---:|
| LCP mobile (75. percentyl RUM) | ≤ 2,5 s |
| INP (75. percentyl RUM) | ≤ 200 ms |
| CLS (75. percentyl RUM) | ≤ 0,1 |
| TTFB (75. percentyl RUM) | ≤ 800 ms |
| First Load JS dowolnej trasy | < 130 kB, docelowo < 100 kB |
| krytyczne fonty | ≤ 70 KiB |
| hero video mobile | ≤ 1,5 MiB |
| `contact` video mobile | ≤ 6 MiB |
| czas blokującego intro | ≤ 500 ms, docelowo 0 ms |

Scenariusze testowe:

1. pierwsza wizyta, pusty cache, mobile 4G;
2. kolejna wizyta w tej samej sesji;
3. `Save-Data: on`;
4. `prefers-reduced-motion: reduce`;
5. przejście na każdą trasę przez nawigację klientową;
6. przewinięcie do każdego filmu i kontrola transferu w Network.

---

## 6. Co już działa dobrze

- statyczne prerenderowanie wszystkich tras,
- `next/image` z `sizes`, `priority` dla obrazów hero i AVIF/WebP w konfiguracji,
- długi cache dla chunków, obrazów i wideo,
- lazy source dla większości filmów poniżej pierwszego ekranu,
- fasada YouTube zamiast natychmiastowego iframe,
- dynamiczny import GSAP/ScrollTrigger w wielu hookach,
- obsługa `prefers-reduced-motion` w animacjach,
- gotowy reporter Web Vitals,
- brak ciężkich zewnętrznych skryptów marketingowych w analizowanym kodzie.

---

## 7. Podsumowanie priorytetów

Największy zwrot dają trzy działania: **odblokowanie pierwszego ekranu**, **radykalne zmniejszenie wideo** i **redukcja klientowego JavaScriptu**. Obrazy i cache nie wymagają obecnie pilnej przebudowy. Po wdrożeniu P0 należy wykonać pełny Lighthouse na produkcji i rozpocząć zbieranie Web Vitals od realnych użytkowników; dopiero te dane pozwolą wiarygodnie ocenić LCP, INP i CLS.
