# Raport P2 — regresja Playwright

**Data:** 2026-09-05

**Zakres:** viewporty, overflow, klawiatura, WCAG, reduced motion, wydruk i wybrane zachowania runtime

**Wynik automatyczny:** **PASS — 75 PASS, 3 SKIP**

**Status całego P2:** **PARTIAL — pozostają testy urządzeń fizycznych i wybrane testy ręczne**

## Wykonane kontrole

- Chromium: 39/39 PASS.
- Firefox: 36 PASS, 3 SKIP dla testów zależnych od CDP Chromium.
- Wszystkie pięć tras sprawdzono przy 11 viewportach od 360×800 do 2560×1440.
- `documentElement.scrollWidth` i `body.scrollWidth` nie przekraczają szerokości viewportu.
- Menu mobilne działa w orientacji poziomej, zatrzymuje tło, przewija się, obsługuje focus trap i Escape oraz zwraca fokus na hamburger.
- Skalowanie tekstu do 200% nie powoduje poziomego overflow.
- axe 4.13.0 nie wykrył naruszeń reguł WCAG 2.1 A/AA na trasach zakresowych.
- `prefers-reduced-motion: reduce` wyłącza Lenis i zachowuje dostępność treści.
- Preloader działa przy pierwszej wizycie, nie wraca w tej samej sesji i pojawia się w świeżym kontekście przeglądarki.
- SectionRail poprawnie obsługuje aktywną sekcję, kliknięcie, hash oraz breakpoint 1405 px.
- 404, warianty wydruku `/oferta` i `/contact`, YouTubeFacade oraz mobilna karuzela przeszły testy runtime.
- Fast 3G, Slow 3G, pierwsza i kolejna wizyta przy ograniczonej sieci oraz Save-Data przeszły testy w Chromium.

Uwaga: pierwszy widok przy emulowanym Slow 3G na serwerze deweloperskim potrzebował około 32 s do zamknięcia preloadera. Test zakończył się powodzeniem, ale wynik wzmacnia potrzebę osobnego domknięcia optymalizacji wydajności z P1 i ponownego pomiaru na buildzie produkcyjnym.

## Naprawione błędy

1. Menu mobilne w trybie reduced motion otwierało warstwę z niewidocznymi elementami. Dodano bezanimacyjne ustawienie widoczności i fokusu.
2. Mobilny nagłówek miał 63,75 px przy bazowym foncie 17 px, a wysokość menu zakładała 60 px. Nagłówek ma teraz stałe 60 px na mobile, więc menu landscape nie wychodzi poza viewport.

## Niewykonane / wymagające środowiska zewnętrznego

- WebKit został pobrany, lecz nie uruchamia się bez systemowych `libicu74` i `libjpeg-turbo8`; instalacja wymaga hasła `sudo`.
- Edge desktop, fizyczny iPhone/iOS Safari, fizyczny Android/Chrome i Samsung Internet.
- Pasek adresu i dynamiczna wysokość viewportu w rzeczywistym iOS Safari.
- Pinch-to-zoom, systemowe cofanie, pełna obsługa multimediów i płynność animacji na słabszym telefonie.
- Pełny ręczny przebieg całej strony klawiaturą i podstawowa regresja czytnikiem ekranu.
- Force Dark Mode i kontrolowane wywołanie boundary 500.

## Uruchamianie

```bash
npm run test:p2
```

Opcjonalny przebieg WebKit po zainstalowaniu bibliotek systemowych:

```bash
npm run test:p2:webkit
```
