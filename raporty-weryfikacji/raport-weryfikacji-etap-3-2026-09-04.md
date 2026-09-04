# Raport weryfikacji przedwdrożeniowej — etap 3

**Projekt:** Strona_002

**Etap:** Multimedia, interakcje i formularze

**Data wykonania:** 2026-09-04

**Gałąź i commit bazowy:** `main`, `562c3b15a549ae2d38065657144e256a7de039b8`

**Wynik:** **PASS WARUNKOWY — multimedia i interakcje mogą przejść do etapu 4; przed wdrożeniem pozostają testy na fizycznym iOS/Android oraz ręczne potwierdzenie linku Messenger**

## Podsumowanie

Wykonano inwentaryzację, ponowne kodowanie i test dekodowania wszystkich plików w `public/videos/`. Krytyczny `contact.mp4` zmniejszono z 13,46 MB do 5,35 MB, czyli poniżej limitu 8 MB. Hero zmniejszono z 3,52 MB do 0,63 MB, a jego bitrate z 5,79 do 1,03 Mb/s. Materiały WebM zmniejszono z 4K do rozdzielczości odpowiadającej layoutowi oraz dodano fallbacki MP4/H.264 dla showreela i wszystkich usług.

Rozszerzono `CinematicVideoPlayer` o obsługę klawiatury, przeciąganie scrubbera wskaźnikiem/dotykiem, fallback MP4, fallback fullscreen dla WebKit i komunikat błędu. Naprawiono powiązanie ARIA akordeonu FAQ. Kontakt otrzymał gotowy temat e-maila oraz tekst startowy WhatsApp. Next Image ma teraz jawnie skonfigurowane używane poziomy jakości.

Sterowalna przeglądarka nie była dostępna w sesji. Dlatego testy gestów, orientacji, natywnego dialera/klienta poczty i fullscreen na rzeczywistych urządzeniach są oznaczone jako `NOT TESTED`, a nie jako zaliczone na podstawie samej inspekcji kodu.

## 1. Multimedia wideo — przed i po

Wartości rozmiaru są dziesiętne (MB), a bitrate kontenera podano w Mb/s. Dane zebrano przez `ffprobe` bezpośrednio przed i po optymalizacji.

| Plik | Kodek | Rozdzielczość przed → po | Rozmiar przed → po | Bitrate przed → po | Zmiana |
|---|---|---:|---:|---:|---:|
| `contact/contact.mp4` | H.264 + AAC | 1080×1920 → 720×1280 | 13,46 → 5,35 MB | 1,96 → 0,78 | −60,3% |
| `hero/hero-video.mp4` | H.264 | 1520×1900 → 960×1200 | 3,52 → 0,63 MB | 5,79 → 1,03 | −82,2% |
| `promo-reel.webm` | VP9 | 3840×2160 → 1920×1080 | 4,26 → 2,57 MB | 2,12 → 1,28 | −39,6% |
| `services/bieg.webm` | VP9 | 3840×2160 → 1280×720 | 7,01 → 4,77 MB | 2,23 → 1,52 | −31,9% |
| `services/bieg.mp4` | H.264 | 1280×720 → 1280×720 | 5,28 → 4,10 MB | 1,68 → 1,31 | −22,3% |
| `services/montage.webm` | VP9 | 3840×2160 → 1280×720 | 3,95 → 1,63 MB | 2,03 → 0,84 | −58,8% |
| `services/weeding.webm` | VP9 | 3840×2160 → 1280×720 | 3,95 → 0,85 MB | 2,08 → 0,45 | −78,5% |

Suma siedmiu zastanych plików spadła z **41,43 MB do 19,89 MB (−52,0%)**. Po doliczeniu trzech nowych fallbacków MP4 cały katalog `public/videos/` ma **27,05 MB**, nadal o 34,7% mniej niż katalog wejściowy mimo rozszerzenia kompatybilności.

Nowe fallbacki:

| Plik | Kodek / profil | Rozdzielczość | Rozmiar | Bitrate |
|---|---|---:|---:|---:|
| `promo-reel.mp4` | H.264 High, `yuv420p` | 1920×1080 | 3,05 MB | 1,51 Mb/s |
| `services/montage.mp4` | H.264 High, `yuv420p` | 1280×720 | 2,52 MB | 1,29 Mb/s |
| `services/weeding.mp4` | H.264 High, `yuv420p` | 1280×720 | 1,59 MB | 0,84 Mb/s |

Wszystkie 10 plików przeszły pełny test dekodowania `ffmpeg -f null` bez błędów. MP4 mają piksele `yuv420p` i metadane `faststart`, co zapewnia szeroką zgodność oraz możliwość rozpoczęcia odtwarzania przed pobraniem całego pliku.

## 2. Kompatybilność i sposób ładowania wideo

| Obszar | Wynik | Ustalenie |
|---|---|---|
| Apple / Safari | PASS statyczny | Każdy materiał WebM używany w UI ma teraz drugie źródło MP4/H.264; materiały Hero i `/o-mnie` są natywnie H.264. |
| Poster | PASS | Każde renderowane wideo posiada `poster`; mobilny Hero otrzymał jawny poster WebP. |
| Autoplay dekoracyjny | PASS statyczny | Automatyczne filmy mają `autoPlay`, `loop`, `muted`, `playsInline`; zastosowano `preload="none"`. |
| Lazy source | PASS statyczny / runtime częściowy | `useLazyVideoSource` korzysta z `IntersectionObserver` i `rootMargin=400px`. HTML SSR strony głównej nie zawierał żadnego URL `/videos/`, więc źródła poniżej fold nie są wysyłane przed hydratacją. Moment requestu po scrollu wymaga testu przeglądarkowego. |
| Graceful degradation | PASS statyczny | Postery mają stabilne kontenery z proporcjami; `CinematicVideoPlayer` pokazuje komunikat `role="alert"` po błędzie. |
| HTTP Range | PASS | Serwer produkcyjny zwrócił `206`, `Accept-Ranges: bytes`, prawidłowy `Content-Range` i `video/mp4`. |
| Cache | PASS | Multimedia otrzymują `Cache-Control: public, max-age=2592000, stale-while-revalidate=86400`. |

`WhyIDoThisVideo`, faktycznie osadzony na `/o-mnie`, korzysta z lekkiego `contact.mp4`, postera WebP, lazy source i ręcznego play/pause. Starszy komponent `AboutMeVideo.tsx` nie jest obecnie montowany na żadnej trasie, ale również ma poster, lazy source i `preload="none"`.

## 3. Obrazy i CLS

- Wszystkie 10 obrazów renderowanych w TSX używa `next/image`.
- Wszystkie obrazy z `fill` mają `sizes`; logotypy mają jawne `width` i `height`.
- Obrazy Hero/LCP na `/`, `/contact` i `/o-mnie` mają `priority`.
- Obrazy poniżej fold nie ustawiają `priority`, więc zachowują domyślne lazy-loading Next Image; fasady YouTube mają dodatkowo jawne `loading="lazy"`.
- Kontenery kluczowych zdjęć i filmów mają stałe proporcje (`aspect-ratio`) albo wymiary, co rezerwuje miejsce i ogranicza CLS.
- `next.config.mjs` generuje AVIF/WebP i zawiera teraz `qualities: [68, 75, 85, 88]`, dzięki czemu Next.js 16 akceptuje wszystkie wartości używane w komponentach.
- Wyjątek świadomy: obraz Hero `/o-mnie` jest `unoptimized`, ale źródłem jest już WebP o rozmiarze 41 kB.

## 4. CinematicVideoPlayer i YouTubeFacade

### CinematicVideoPlayer

Wdrożono i potwierdzono statycznie:

- play/pause przez przycisk, kliknięcie obrazu oraz Space/Enter na ramce;
- przewijanie o 5 sekund strzałkami;
- Home/End i strzałki na scrubberze;
- przeciąganie scrubbera przez Pointer Events z capture, obejmujące mysz, rysik i dotyk;
- suwak głośności;
- wejście/wyjście fullscreen oraz fallback `webkitEnterFullscreen`;
- Escape opuszczający fullscreen;
- synchronizację stanu przez zdarzenia `play`, `pause`, `timeupdate`, `volumechange`, `fullscreenchange`;
- zatrzymanie innego filmu po rozpoczęciu odtwarzania;
- komunikat błędu `role="alert"` i zachowany poster;
- źródło MP4 po WebM dla showreela i usług.

Testy faktycznego gestu swipe, zmiany orientacji i fullscreen na iOS Safari/Chrome Android: **NOT TESTED — brak sterowalnej przeglądarki i urządzeń fizycznych**.

### YouTubeFacade

- iframe nie występuje przed kliknięciem (`loaded=false`) i po kliknięciu jest tworzony z `youtube-nocookie.com` — PASS statyczny;
- CSP zezwala wyłącznie na `frame-src https://www.youtube-nocookie.com`, a `img-src https:` obejmuje miniatury — PASS;
- test URL iframe `youtube-nocookie.com` zwrócił HTTP 200;
- wszystkie trzy miniatury `maxresdefault.jpg` zwróciły HTTP 200 i `image/jpeg`;
- iframe ma `title`, `allowFullScreen`, a miniaturki używają `next/image`, `sizes` i lazy-loading;
- zamiana fasady po realnym tapnięciu: **NOT TESTED** bez przeglądarki.

## 5. Kontakt i konwersja

Projekt pozostaje przy modelu bez formularza: telefon, e-mail i WhatsApp. Nie ma endpointu formularza ani danych formularzowych do walidacji. Decyzję o ewentualnym dodaniu klasycznego formularza nadal należy potwierdzić z klientem; obecny model jest technicznie kompletny.

| Kanał | Wartość / składnia | Wynik |
|---|---|---|
| Telefon | `tel:+48791705230` | PASS składni; zachowuje `+48`. Otwarcie natywnego dialera NOT TESTED. |
| E-mail | `mailto:kontakt@maleszyk.media?subject=Zapytanie%20ofertowe` | PASS składni; dodano temat. Otwarcie klienta i dostarczalność NOT TESTED. |
| WhatsApp | `https://wa.me/48791705230?text=...` | PASS; numer oczyszczony do cyfr, dodano tekst powitalny. Endpoint odpowiada 200 po przekierowaniu. |
| Kroki współpracy | `01 Opowiedz → 02 Ustalamy kierunek → 03 Realizujemy` | PASS statyczny; lista uporządkowana i ma opis dostępności. |

## 6. Linki i pozostałe interakcje

### Linki społecznościowe

| Platforma | Wynik HTTP | Uwagi |
|---|---:|---|
| Facebook | 200 | Przekierowanie do profilu Maleszyk Media. |
| Instagram | 200 | Profil `maleszyk.media`. |
| YouTube | 200 | Kanał `@Maleszyk.V-log`. |
| WhatsApp | 200 | Przekierowanie do `api.whatsapp.com` z poprawnym numerem. |
| Messenger | 200 po przekierowaniu | Skrót `m.me/maleszyk.media` zakończył niezalogowany test na ogólnej stronie Messenger; wymagane ręczne potwierdzenie w zalogowanej aplikacji. |

W produkcyjnej konfiguracji nie znaleziono pustych wartości ani placeholderów. Linki społecznościowe w stopce i sekcjach mają `target="_blank"`, `rel="noopener noreferrer"` oraz nazwę dostępną przez `aria-label` albo widoczny tekst.

### FAQ i nawigacja

- FAQ ma natywne przyciski, `aria-expanded`, `aria-controls` oraz odpowiadające regiony.
- Dodano brakujące identyfikatory `faq-question-*`, więc `aria-labelledby` regionów wskazuje istniejące elementy.
- Nie znaleziono literalnych pustych linków `href="#"` w komponentach. Fallback `#` istnieje wyłącznie w konfiguracji kodu, gdy brak zmiennych środowiskowych; produkcyjne zmienne są kompletne.
- Wszystkie trasy zakresowe odpowiadają poprawnie: `/`, `/contact`, `/o-mnie`, `/oferta`, `/polityka-prywatnosci` → 200; trasa nieistniejąca → 404.
- Projekt nie ma osobnej trasy portfolio ani filtra kategorii. Karuzele i przełączniki są komponentami klienckimi bez przeładowania strony; ich gesty wymagają testu runtime.

## 7. Testy techniczne

| Test | Wynik |
|---|---|
| `npm run typecheck` | PASS |
| `npm run lint` | PASS |
| `npm run test` | PASS — 6/6 |
| `git diff --check` | PASS |
| Pełne dekodowanie 10 plików przez FFmpeg | PASS — 10/10 |
| Produkcyjny build Next.js 16.3.4 | PASS przez Webpack |
| Smoke test świeżego buildu | PASS |
| Trasy zakresowe | PASS — 5×200, kontrolna 404 |
| Multimedia/poster przez HTTP Range | PASS — 206 i prawidłowe MIME |

Domyślny Turbopack nie mógł w zarządzanym sandboxie utworzyć procesu wiążącego lokalny port (`Operation not permitted`). Build wykonano poza sandboxem przez Webpack, czasowo przełączając wewnętrzny checker TypeScript z CLI na API; ustawienie testowe zostało wycofane z kodu po poprawnym buildzie. To ograniczenie środowiska audytowego, nie błąd aplikacji.

## 8. Checklista akceptacyjna

- [x] `contact.mp4` ma mniej niż 8 MB — 5,35 MB.
- [x] Automatyczne/dekoracyjne wideo ma `muted`, `playsInline`, `autoPlay`, `loop`, poster i `preload="none"`.
- [x] Wideo `/o-mnie` ma poster, lazy source i sterowanie play/pause; pełny test urządzeniowy pozostaje otwarty.
- [x] Każdy używany WebM ma fallback MP4/H.264.
- [x] Obrazy poniżej fold korzystają z lazy-loading, a kontenery rezerwują proporcje.
- [x] `tel:`, `mailto:` i WhatsApp mają poprawną składnię międzynarodową; dodano szablony wiadomości.
- [x] FAQ ma poprawne ARIA; dotykowy test runtime pozostaje otwarty.
- [x] Brak wewnętrznych błędów 404 na trasach zakresowych i brak literalnych `href="#"`.
- [x] CinematicVideoPlayer obsługuje scrubber, głośność, fullscreen, błędy i klawiaturę w kodzie.
- [x] YouTubeFacade tworzy iframe `youtube-nocookie.com`, a CSP i miniatury są poprawne.
- [x] `useLazyVideoSource` nie renderuje źródeł w SSR i inicjalizuje je przez IntersectionObserver blisko viewportu.
- [x] Showreel jest zoptymalizowany, dekoduje się i jest dostępny jako VP9 oraz H.264.
- [ ] iOS Safari / Chrome Android: tap, swipe, autoplay, fullscreen i orientacja — wymagane urządzenie lub emulator.
- [ ] Link Messenger — ręczne potwierdzenie w zalogowanej aplikacji.
- [ ] Klient powinien formalnie potwierdzić pozostawienie modelu kontaktu bez formularza.

## Decyzja

**Zatwierdzenie multimediów i interakcji do Etapu 4.**

Dalsza redukcja wagi wideo nie jest wymagana: wszystkie krytyczne progi zostały spełnione, a cały katalog jest lżejszy mimo dodania kompatybilnych fallbacków. Przed produkcyjnym odbiorem należy wykonać krótką regresję na fizycznym iPhonie oraz Androidzie, potwierdzić profil Messenger i uzyskać decyzję klienta w sprawie braku klasycznego formularza.
