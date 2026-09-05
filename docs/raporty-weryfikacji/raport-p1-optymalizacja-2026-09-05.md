# Raport P1 — wydajność i dostępność

**Projekt:** Strona_002
**Data:** 2026-09-05
**Zakres:** techniczne blokery P1 etapu 4
**Wynik:** **PASS implementacji / wymagane potwierdzenie Mobile na publicznym wdrożeniu**

## Wdrożone zmiany

- Mobilny poster Hero jest elementem `<img>` obecnym w początkowym HTML, ma jawny preload, `fetchpriority="high"` i nie jest animowany przed pierwszym paintem.
- Wideo Hero nie używa już `preload="none"`. Ładuje metadane po pierwszej interakcji albo po 6 sekundach, dzięki czemu nie zastępuje postera jako wczesnego kandydata LCP.
- Mobilny preloader został usunięty ze ścieżki krytycznej. Na desktopie korzysta z animacji CSS zamiast GSAP.
- Lenis i kosztowne animacje GSAP/ScrollTrigger nie uruchamiają się na małym viewporcie; animacje poniżej fold są inicjalizowane dopiero blisko widocznego obszaru.
- Navbar korzysta z Web Animations API i nie importuje GSAP.
- Speed Insights jest uruchamiany wyłącznie w środowisku Vercel, więc lokalny build produkcyjny nie generuje błędów 404 ani błędów MIME w konsoli.
- Poprawiono semantykę grup CTA i ujednolicono dostępną nazwę logo z tekstem `MALESZYK.MEDIA`.

## JavaScript

Wartości bazowe pochodzą z raportu etapu 4. Wyniki końcowe policzono z zasobów wskazanych przez HTML pięciu tras produkcyjnego buildu.

| Zakres | Bazowo | Po optymalizacji | Zmiana |
|---|---:|---:|---:|
| Wspólny początkowy JS | 217,8 kB gzip | 185,5 kB gzip | -32,3 kB (-14,8%) |
| `/` | 258,8 kB | 227,0 kB | -31,8 kB |
| `/contact` | 236,1 kB | 204,1 kB | -32,0 kB |
| `/o-mnie` | 243,4 kB | 211,3 kB | -32,1 kB |
| `/oferta` | 235,2 kB | 203,1 kB | -32,1 kB |
| `/polityka-prywatnosci` | 218,2 kB | 186,0 kB | -32,2 kB |

`npm run perf:bundle` ma teraz progi pass/fail dla całego wyjścia, największego chunka, wspólnego zakresu oraz każdej trasy. Kontrola jest uruchamiana po buildzie w CI. Końcowy build zaliczył wszystkie budżety; konserwatywne górne oszacowania tras wynoszą 227,0–237,9 kB gzip przy limitach 240–245 kB.

## Lighthouse

Lighthouse 13.0.1 uruchomiono na lokalnym produkcyjnym buildzie w Chromium 153. Poster był w każdym przebiegu właściwym mobilnym elementem LCP, odkrywanym w początkowym dokumencie i pobieranym z wysokim priorytetem.

Końcowy pomiar Mobile z throttlingiem DevTools:

| Performance | LCP | FCP | TBT | CLS | Accessibility | Best Practices | SEO |
|---:|---:|---:|---:|---:|---:|---:|---:|
| 96 | 2,07 s | 2,07 s | 94 ms | 0 | 100 | 100 | 100 |

Seria Desktop osiągnęła medianę Performance 98 i LCP 1,15 s; Accessibility, Best Practices i SEO wyniosły 100, TBT 0 ms, a CLS 0,007.

Standardowa symulacja Lantern na lokalnym HTTP/1.1 nadal zawyża koszt pobrania postera: ostatni przebieg osiągnął Performance 80 i LCP 4,81 s, mimo zaobserwowanego paintu 0,15 s oraz spełnienia wszystkich trzech kontroli odkrywania zasobu. Z tego powodu checkbox mediany Mobile pozostaje otwarty do wykonania 3–5 przebiegów na publicznym wdrożeniu HTTP/2.

## Kontrole regresji

- `npm run check`: PASS — typecheck, ESLint i 13 testów Node.
- Produkcyjny build Webpack: PASS.
- `npm run perf:bundle`: PASS.
- `git diff --check`: PASS.
- Regresja Chromium menu, klawiatury i preloadera: 14/14 PASS.
- Konsola pięciu tras produkcyjnego buildu: brak błędów i naruszeń CSP.

## Pozostałe zależności P1

Po wdrożeniu kandydata należy:

1. wykonać 3–5 pomiarów Lighthouse Mobile na publicznym HTTPS i potwierdzić medianę Performance co najmniej 90 oraz LCP najwyżej 2,5 s;
2. sprawdzić konsolę wszystkich tras z produkcyjnym Speed Insights i polityką nonce;
3. powtórzyć SecurityHeaders.com, jeśli serwis będzie dostępny.
