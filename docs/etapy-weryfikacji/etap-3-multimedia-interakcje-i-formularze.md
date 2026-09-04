# Polecenie Wykonawcze: Etap 3 — Multimedia, Interakcje i Formularze

> **Instrukcja dla AI / Inżyniera QA:**  
> Wykonaj poniższe polecenie w całości. Zoptymalizuj i przetestuj najcięższe multimedia (pliki wideo, obrazy) oraz zweryfikuj integralność kluczowych punktów styku z klientem (formularz kontaktowy, linki CTA, interaktywne moduły).

---

## 1. Kontekst i Cel Etapu

Jako portfolio operatora wideo i fotografa, strona prezentuje bogate materiały audiowizualne. Zgodnie z raportem audytu 007 katalog `public/videos/` waży aż **85,32 MiB**, a sam plik `contact.mp4` to **58,47 MiB** (bitrate ~8.9 Mb/s), co grozi wyczerpaniem limitów transferu i drastycznym spowolnieniem na łączach komórkowych.

Celem **Etapu 3** jest radykalna optymalizacja multimediów bez utraty jakości percepcyjnej oraz pełna weryfikacja ścieżki konwersji (wysyłka zapytań ofertowych i bezpośredni kontakt).

---

## 2. Zadania Weryfikacyjne i Zakres Badania

### Krok 1: Weryfikacja i optymalizacja plików wideo
Przeanalizuj i zoptymalizuj wszystkie pliki wideo w `public/videos/`:
1. **Analiza parametrów wideo:**
   - Sprawdź parametry plików (np. za pomocą `ffprobe` lub skryptu node):
     - `public/videos/contact/contact.mp4` (Priorytet krytyczny: zredukować wagę do < 5-8 MB lub podpiąć zewnętrzny streaming).
     - `public/videos/hero/hero-video.mp4` (Bitrate max 1.5–2.0 Mb/s dla wideo w tle).
     - Wideo w sekcji usług: `bieg.webm`, `montage.webm`, `weeding.webm`.
     - Wideo na podstronie `/o-mnie` (`AboutMeVideo.tsx` oraz `WhyIDoThisVideo.tsx`).
2. **Kryteria techniczne odtwarzaczy HTML5 wideo:**
   - Każdy tag `<video>` działający jako tło/dekoracja musi posiadać atrybuty:
     ```html
     <video autoplay loop muted playsinline poster="/images/...-poster.webp" preload="none">
     ```
   - **Brak dźwięku na starcie:** Bezwzględny wymóg `muted` (bez tego iOS i Chrome blokują autoodtwarzanie).
   - **Poster:** Każde wideo musi mieć przypisany lekki plik graficzny `poster` (WebP), aby zapobiec migotaniu i skokom układu (CLS) przed załadowaniem strumienia.
   - **Kompatybilność formatów (WebM vs MP4):** Pliki `.webm` (VP9/VP8) oferują świetną kompresję, ale starsze wersje iOS Safari i macOS mogą ich nie odtwarzać. Upewnij się, że kluczowe odtwarzacze posiadają fallback `<source src="...mp4" type="video/mp4">` lub że docelowa baza urządzeń klienta wspiera użyty kodek.
   - **Odporność na błędy sieciowe (Graceful Degradation):** Sprawdź, czy przy braku połączenia lub błędzie pobierania pliku wideo poster pozostaje widoczny, a układ strony nie ulega rozpadnięciu.
3. **Lazy-loading odtwarzaczy poniżej linii zgięcia:**
   - Weryfikacja czy wideo poza sekcją Hero są inicjalizowane dopiero w pobliżu viewportu (użycie `IntersectionObserver`).

### Krok 2: Weryfikacja i kompresja obrazów (`next/image`)
Przejrzyj wykorzystanie grafik w katalogach `public/images/` oraz komponentach:
1. **Formaty i atrybuty komponentu `next/image`:**
   - Sprawdź, czy obrazy są serwowane w formatach WebP/AVIF.
   - Zdjęcia w sekcji Hero (LCP) powinny mieć atrybut `priority`.
   - Zdjęcia w dolnych sekcjach powinny mieć domyślny `loading="lazy"`.
   - Zdefiniowane atrybuty `sizes` odpowiadające rzeczywistym szerokościom w layoutach siatki (grid).
2. **Brak skoków układu (CLS = 0):**
   - Wszystkie grafiki muszą mieć zdefiniowane proporcje (`width`/`height` lub CSS `aspect-ratio`).

### Krok 2.5: Weryfikacja niestandardowych odtwarzaczy wideo
Projekt zawiera dwa autorskie komponenty odtwarzania wideo wymagające dedykowanych testów:
1. **CinematicVideoPlayer (`components/ui/CinematicVideoPlayer.tsx`):**
   - Sprawdź poprawność działania kontrolek: pasek postępu (scrubber), regulacja głośności, przycisk fullscreen.
   - Przetestuj obsługę dotykową kontrolek na iOS Safari i Chrome Android (gesty swipe na scrubberze, tap na play/pause).
   - Zweryfikuj zachowanie przy wejściu/wyjściu z trybu pełnoekranowego oraz przy zmianie orientacji urządzenia.
   - Sprawdź, jak odtwarzacz reaguje na błąd ładowania źródła wideo (np. brak pliku, timeout sieci) — czy wyświetla komunikat, czy zawiesza się.
   - Upewnij się, że odtwarzacz jest dostępny klawiaturowo: spacja = play/pause, strzałki = przewijanie, Escape = wyjście z fullscreen.
2. **YouTubeFacade (`components/sections/promo/YouTubeFacade.tsx`):**
   - Sprawdź, czy fasada (miniaturka + przycisk play) poprawnie zamienia się w iframe YouTube po kliknięciu.
   - Zweryfikuj, że iframe ładuje się z domeny `youtube-nocookie.com` (prywatność użytkownika) — sprawdź w DevTools Network.
   - Upewnij się, że miniaturka wideo z `img.youtube.com` ładuje się poprawnie i jest dozwolona w CSP (`img-src`).
   - Sprawdź zachowanie na urządzeniach mobilnych: czy kliknięcie w fasadę poprawnie uruchamia odtwarzanie.
3. **Hook `useLazyVideoSource` (`components/ui/useLazyVideoSource.ts`):**
   - Otwórz DevTools → Network → filtr `type:media`. Odśwież stronę i sprawdź, czy wideo poniżej linii zgięcia (fold) **nie generuje żadnych requestów sieciowych** przy starcie strony.
   - Przewiń stronę w dół i zweryfikuj, czy wideo zaczyna się ładować dopiero w pobliżu viewportu (`IntersectionObserver` z odpowiednim `rootMargin`).
   - Sprawdź, czy wideo zdąży się załadować (lub przynajmniej zbuforować poster) zanim użytkownik dotrze do sekcji.
4. **Showreel (`public/videos/promo-reel.webm`, 4.26 MB):**
   - Zweryfikuj parametry pliku (bitrate, rozdzielczość, kodek VP9/VP8) i upewnij się, że waga jest adekwatna.
   - Sprawdź, czy w sekcji Promo na stronie głównej showreel odtwarza się płynnie.

### Krok 3: Weryfikacja kanałów kontaktu i konwersji (`/contact` oraz sekcja CTA)
Sekcja kontaktu (`components/pages/contact/ContactHero.tsx`) oraz sekcja CTA opierają się na szybkich, bezpośrednich kanałach komunikacji:
1. **Bezpośrednie kanały kontaktu (Aktualna architektura UI):**
   - **E-mail (`mailto:`):** Sprawdź poprawność adresu docelowego w `siteContent.aboutMe.contact.email`. Sprawdź, czy link otwiera domyślnego klienta poczty oraz czy warto dodać predefiniowany temat (np. `mailto:kontakt@maleszyk.media?subject=Zapytanie%20ofertowe`).
   - **Telefon (`tel:`):** Sprawdź, czy numer telefonu (`tel:${contact.phone.replace(/\s/g, '')}`) poprawnie otwiera dialer na iOS Safari i Androidzie z zachowaniem numeru kierunkowego (`+48`).
   - **WhatsApp (`https://wa.me/...`):** Sprawdź, czy link WhatsApp (`https://wa.me/${contact.phone.replace(/\D/g, '')}`) poprawnie uruchamia aplikację WhatsApp z oczyszczonym numerem międzynarodowym (brak spacji, myślników i znaku plus) oraz opcjonalnym tekstem powitalnym (`?text=Dzie%C5%84%20dobry,%20chcia%C5%82bym%20zapyta%C4%87%20o...`).
   - **Kroki współpracy (Steps Panel):** Czytelność sekcji `01 Opowiedz -> 02 Ustalamy kierunek -> 03 Realizujemy`.
2. **Kwestia dedykowanego formularza kontaktowego (Decyzja biznesowa):**
   - Ustal z klientem, czy preferuje obecny model bezpośrednich kliknięć (Telefon / E-mail / WhatsApp – bardzo skuteczny w branży wideo/foto), czy oczekuje klasycznego formularza z polami tekstowymi.
   - **W przypadku wdrożenia formularza:** Sprawdź walidację pól (e-mail, telefon, wiadomość), ochronę antyspamową (honeypot / Turnstile), blokadę double-submit (`disabled` + loader), obsługę stanów sukcesu/błędu oraz konfigurację usługi wysyłkowej (np. Resend / SendGrid).

### Krok 4: Weryfikacja pozostałych punktów interakcji
1. **Linki bezpośrednie:**
   - Kliknięcie w numer telefonu (`tel:+48...`) uruchamia dialer na smartfonie.
   - Kliknięcie w adres e-mail (`mailto:...`) otwiera domyślnego klienta poczty.
   - Sprawdzenie formatu międzynarodowego (np. `+48 123 456 789`).
2. **Linki społecznościowe w stopce (`components/layout/Footer.tsx`):**
   - Zweryfikuj poprawność linków do wszystkich 5 platform zdefiniowanych w konfiguracji: Facebook, Instagram, YouTube, Messenger, WhatsApp.
   - Sprawdź, czy każdy link otwiera się w nowej karcie (`target="_blank"`) z atrybutem `rel="noopener noreferrer"`.
   - Upewnij się, że URL-e nie zawierają placeholderów z `.env.example` (np. pustych wartości lub domyślnych adresów).
   - Sprawdź, czy ikony platform renderują się poprawnie i mają odpowiedni atrybut `aria-label`.
3. **Elementy rozwijane i nawigacyjne:**
   - Sprawdzenie działania akordeonów w sekcji FAQ (`components/sections/Faq.tsx`) — czytelne otwieranie/zamykanie, odpowiednie atrybuty `aria-expanded`.
   - Filtry i przełączniki kategorii w ofercie i portfolio — płynna zmiana bez przeładowania całej strony.
4. **Weryfikacja martwych linków (Broken Links):**
   - Przetestuj wszystkie odnośniki na stronie (w tym linki społecznościowe w stopce). Upewnij się, że nie występują puste linki (np. `href="#"`) bez obsługi zdarzeń, oraz że żaden zewnętrzny link nie zwraca błędu 404.

---

## 3. Checklista Akceptacyjna (Kryteria Pass/Fail)

- [ ] Waga pliku `contact.mp4` zredukowana lub plik przeniesiony na zewnętrzny CDN (docelowy rozmiar < 8 MB).
- [ ] Każdy dekoracyjny tag `<video>` posiada atrybuty `muted`, `playsinline`, `autoplay`, `loop` oraz `poster`.
- [ ] Odtwarzacze wideo na podstronie `/o-mnie` (`AboutMeVideo`, `WhyIDoThisVideo`) działają stabilnie z poprawnym plakatem i sterowaniem.
- [ ] Formaty wideo zapewniają kompatybilność z iOS Safari i macOS (MP4/H.264 lub sprawdzony WebM).
- [ ] Wszystkie grafiki poniżej linii zgięcia ładują się w trybie `lazy`.
- [ ] Bezpośrednie kanały kontaktu (`tel:`, `mailto:`, WhatsApp) działają poprawnie, posiadają właściwą składnię międzynarodową i opcjonalne szablony wiadomości; **LUB** (w przypadku wdrożenia dedykowanego formularza) formularz pomyślnie wysyła i dostarcza wiadomości z zabezpieczeniem antyspamowym i blokadą double-submit.
- [ ] Akordeony FAQ i filtry portfolio działają poprawnie na urządzeniach dotykowych i desktopie.
- [ ] Wszystkie linki zewnętrzne i wewnętrzne działają (brak martwych linków i błędów 404).
- [ ] CinematicVideoPlayer działa poprawnie (kontrolki, fullscreen, obsługa błędów, dostępność klawiszowa).
- [ ] YouTubeFacade poprawnie zamienia fasadę w iframe z domeny `youtube-nocookie.com`.
- [ ] Hook `useLazyVideoSource` wstrzymuje ładowanie wideo poniżej fold do momentu zbliżenia się użytkownika.
- [ ] Showreel `promo-reel.webm` odtwarza się płynnie w sekcji Promo.
- [ ] Linki społecznościowe w stopce prowadzą do poprawnych profili i otwierają się w nowej karcie.

---

## 4. Oczekiwany Raport Końcowy

Zapisz wyniki w pliku `docs/audits/aud_XXX_weryfikacja-etap-3.md`. Raport powinien zawierać:

*Uwaga:* Weryfikacja multimediów obejmuje wszystkie trasy: `/`, `/contact`, `/o-mnie`, `/oferta` i `/polityka-prywatnosci`.

1. Tabelę porównawczą rozmiarów i bitrate'ów wideo (Przed vs Po optymalizacji, w tym materiały z `/o-mnie`).
2. Status weryfikacji kompatybilności kodeków wideo (WebM vs MP4 na ekosystemie Apple).
3. Wynik testu bezpośrednich kanałów kontaktu (oraz ewentualnego formularza, jeśli został wdrożony).
4. Wykaz sprawdzonych linków kontaktowych, szablonów wiadomości i interakcji.
5. Rekomendację: **Zatwierdzenie multimediów i interakcji do Etapu 4** LUB **Konieczność dalszej redukcji wagi wideo**.
