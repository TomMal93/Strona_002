# TODO — domknięcie weryfikacji i uruchomienie produkcyjne

**Stan na:** 2026-09-05

**Źródła:** raporty w `docs/raporty-weryfikacji/`

**Status projektu:** **NO-GO — produkcyjne uruchomienie jest wstrzymane**

Etap 1 jest zamknięty. Etap 2 ma status `PARTIAL`, etap 3 `PASS WARUNKOWY`, etap 4 `FAIL`, a etap 5 `BLOCKED / NO-GO`. Przed wdrożeniem trzeba formalnie domknąć zaległe testy etapów 2–3, ponownie zaliczyć etap 4 i dopiero potem przeprowadzić etap 5.

## P0 — dane i decyzje wymagane od klienta

### Dane firmy i polityka prywatności

- [ ] Potwierdzić pełną nazwę podmiotu / administratora danych.
- [ ] Uzyskać pełny adres administratora lub siedziby.
- [ ] Uzyskać NIP.
- [ ] Uzyskać REGON.
- [ ] Jeśli NIP lub REGON nie mają zastosowania, uzyskać formalne potwierdzenie i odpowiednio dostosować politykę.
- [ ] Potwierdzić właściwy adres e-mail do spraw ochrony danych.
- [ ] Uzyskać akceptację danych i treści polityki od klienta oraz osoby odpowiedzialnej za zgodność prawną.
- [ ] Uzupełnić zatwierdzone wartości w konfiguracji produkcyjnej i sprawdzić ich prezentację na `/polityka-prywatnosci`.

Kod obsługuje już zmienne `PRIVACY_ADMIN_NAME`, `PRIVACY_ADMIN_ADDRESS`, `PRIVACY_ADMIN_NIP`, `PRIVACY_ADMIN_REGON`, `PRIVACY_CONTACT_EMAIL` i `PRIVACY_POLICY_UPDATED_AT`.

### Akceptacja zakresu i materiałów

- [ ] Uzyskać pisemną akceptację wszystkich treści oraz proofreadingu stagingu.
- [ ] Uzyskać pisemną akceptację zakresu v1 bez portfolio i dynamicznego feedu Instagram.
- [ ] Ustalić, czy v1 ma publikować ceny/pakiety, czy pozostać przy wycenie indywidualnej.
- [ ] Uzyskać pisemną akceptację modelu kontaktu bez klasycznego formularza.
- [ ] Uzyskać oświadczenie o prawach do zdjęć, filmów i pozostałych materiałów.
- [ ] Uzyskać potwierdzenie zgód na wykorzystanie wizerunku.
- [ ] Domknąć Q-4 dotyczące materiałów i praw.
- [ ] Potwierdzić właściciela numeru `+48 791 705 230`.

### Domena i poczta

- [ ] Potwierdzić docelowy adres e-mail publikowany na stronie.
- [ ] Potwierdzić operatora poczty i domenę obsługującą skrzynkę.
- [ ] Wyjaśnić rozbieżność: strona ma działać pod `maleszykmedia.pl`, a obecny adres kontaktowy używa `@maleszyk.media`, której DNS podczas audytu zwracał `NXDOMAIN`.
- [ ] Domknąć pocztową część Q-3.

### Odbiór i utrzymanie

- [ ] Ustalić okres gwarancji: 14 albo 30 dni.
- [ ] Ustalić właściciela decyzji o rollbacku podczas wdrożenia.
- [ ] Uzgodnić zakres instrukcji obsługi i statystyk przekazywanej klientowi.
- [ ] Przygotować i zatwierdzić protokół zdawczo-odbiorczy.

## P1 — blokery techniczne etapu 4

### Mobilna wydajność i LCP

Stan bazowy: Lighthouse Mobile Performance `78`, LCP `5,50 s`; cele: Performance `>= 90`, LCP `<= 2,5 s`.

- [ ] Poprawić mobilny element LCP w Hero.
- [ ] Zapewnić wczesne odkrywanie właściwego zasobu lub postera Hero.
- [ ] Ustawić właściwy priorytet pobierania zasobu LCP.
- [ ] Zweryfikować zasadność `preload="none"` dla wideo above the fold.
- [ ] Rozważyć responsywne warianty postera i dalsze ograniczenie krytycznego łańcucha żądań.
- [ ] Po optymalizacji wykonać 3–5 pomiarów Lighthouse Mobile i Desktop.
- [ ] Potwierdzić medianę Mobile Performance `>= 90` oraz LCP `<= 2,5 s`.
- [ ] Potwierdzić brak regresji CLS, TBT, Accessibility, Best Practices i SEO.

### Budżet JavaScript

Stan bazowy: wspólne skrypty obecne na każdej trasie mają około `217,8 kB gzip`; `perf:bundle` obecnie tylko drukuje wynik.

- [ ] Ustalić realny, mierzalny budżet JS dla całej aplikacji i poszczególnych tras.
- [ ] Dodać próg pass/fail do `npm run perf:bundle`.
- [ ] Egzekwować budżet w CI.
- [ ] Ograniczyć globalny JS, analizując szczególnie Lenis, GSAP, Navbar, preloader i Speed Insights ładowane z layoutu.
- [ ] Zapisać wynik bazowy i wynik po optymalizacji w ponownym raporcie etapu 4.

### Dostępność wskazana przez Lighthouse

- [ ] Poprawić `aria-label` na dwóch elementach `<div>` grup CTA: zastosować prawidłową semantykę albo usunąć niepoprawny atrybut.
- [ ] Ujednolicić widoczny tekst logo „MALESZYK.MEDIA” z jego nazwą dostępną.
- [ ] Powtórzyć Lighthouse i potwierdzić brak tych błędów.

### CSP i bezpieczeństwo runtime

- [ ] Otworzyć publiczne wdrożenie w dostępnej przeglądarce i sprawdzić konsolę na wszystkich trasach pod kątem naruszeń CSP.
- [ ] Sprawdzić działanie preloadera, JSON-LD, YouTube, animacji i Speed Insights z produkcyjną polityką nonce.
- [ ] Powtórzyć SecurityHeaders.com, jeśli serwis będzie dostępny.

Mozilla Observatory oraz statyczna kontrola nonce są już zaliczone: `A+`, 120 punktów, 12/12 testów PASS.

## P2 — zaległe testy wizualne, dostępności i cross-browser

### Macierz viewportów i RWD

- [ ] Przetestować wszystkie trasy przy `360x800`.
- [ ] Przetestować wszystkie trasy przy `375x667`.
- [ ] Przetestować wszystkie trasy przy `393x852`.
- [ ] Przetestować wszystkie trasy przy `412x915`.
- [ ] Przetestować wszystkie trasy przy `768x1024`.
- [ ] Przetestować wszystkie trasy przy `1024x768`.
- [ ] Przetestować mobile landscape przy `667x375` i `844x390`.
- [ ] Przetestować desktop przy `1440x900`, `1920x1080` i `2560x1440`.
- [ ] Zmierzyć `scrollWidth` i potwierdzić brak poziomego overflow na każdej trasie.
- [ ] Potwierdzić użyteczność i przewijanie menu mobilnego w orientacji poziomej.
- [ ] Sprawdzić zachowanie paska adresu i dynamicznej wysokości viewportu w iOS Safari.

### Przeglądarki i urządzenia

- [ ] Wykonać regresję w Chrome/Chromium desktop.
- [ ] Wykonać regresję w Firefox desktop.
- [ ] Wykonać regresję w Edge desktop.
- [ ] Wykonać regresję na fizycznym iPhonie w iOS Safari.
- [ ] Wykonać regresję na fizycznym Androidzie w Chrome Android.
- [ ] Wykonać regresję w Samsung Internet.
- [ ] Sprawdzić tap, swipe, pinch-to-zoom i systemowe cofanie.
- [ ] Sprawdzić autoplay, play/pause, scrubber, głośność, fullscreen i zmianę orientacji.
- [ ] Potwierdzić płynność GSAP, ScrollTrigger i Lenis podczas przewijania w dół i w górę, także na słabszym telefonie.
- [ ] Sprawdzić faktyczne uruchomienie YouTubeFacade po tapnięciu.

### Klawiatura i WCAG

- [ ] Przejść wszystkie trasy klawiaturą: Tab, Shift+Tab, Enter, Space i Escape.
- [ ] Potwierdzić focus trap menu, zamykanie Escape i powrót fokusu na hamburger.
- [ ] Sprawdzić widoczność fokusu oraz logiczną kolejność nawigacji.
- [ ] Zmierzyć kontrast WCAG 2.1 AA w axe, WAVE lub równoważnym narzędziu.
- [ ] Sprawdzić skalowanie tekstu do 200% bez utraty treści lub funkcji.
- [ ] Wykonać podstawową regresję z czytnikiem ekranu.
- [ ] Sprawdzić działanie przy `prefers-reduced-motion: reduce`.
- [ ] Sprawdzić Force Dark Mode.

### Pozostałe testy runtime

- [ ] Potwierdzić działanie preloadera przy pierwszej wizycie, kolejnej wizycie w tej samej sesji i w trybie incognito.
- [ ] Potwierdzić działanie SectionRail: aktywna sekcja, kliknięcia, hashe i breakpoint widoczności.
- [ ] Sprawdzić wizualnie stronę 404.
- [ ] Kontrolowanie wywołać boundary 500 i sprawdzić reset oraz responsywność.
- [ ] Sprawdzić podgląd wydruku `/oferta` i `/contact`.
- [ ] Wykonać test Fast 3G i Slow 3G.
- [ ] Przetestować pierwszą i kolejną wizytę przy ograniczonej sieci.
- [ ] Sprawdzić tryb Save-Data.

## P3 — kanały kontaktu, SEO i zewnętrzne walidatory

### Kontakt i konwersja

- [ ] Na fizycznym telefonie uruchomić link `tel:` i potwierdzić właściwy numer.
- [ ] Uruchomić link `mailto:` i potwierdzić adres oraz temat wiadomości.
- [ ] Wysłać kontrolną wiadomość e-mail i potwierdzić dostarczalność w obie strony.
- [ ] Uruchomić WhatsApp i potwierdzić numer oraz treść startową.
- [ ] Ręcznie sprawdzić `m.me/maleszyk.media` w zalogowanej aplikacji Messenger.
- [ ] Potwierdzić działanie pozostałych linków społecznościowych.

### SEO i metadane po uruchomieniu domeny

- [ ] Wykonać Google Rich Results Test dla publicznych tras.
- [ ] Sprawdzić podgląd w Facebook Sharing Debugger.
- [ ] Sprawdzić podgląd w LinkedIn Post Inspector.
- [ ] Sprawdzić podgląd w X Card Validator.
- [ ] Potwierdzić dostępność canonicali, `og:url`, `og:image`, robots, sitemap i URL-i JSON-LD pod docelową domeną.
- [ ] Potwierdzić prawidłowe działanie Open Graph po stronie botów społecznościowych.

### Speed Insights

- [ ] Potwierdzić w panelu Vercel, że Speed Insights rejestruje wizyty.
- [ ] Po zebraniu ruchu potwierdzić LCP, INP i CLS.
- [ ] Nie wdrażać GA4, GTM ani Consent Mode v2 bez nowej decyzji klienta.

## P4 — przygotowanie domeny i wdrożenia

### Konfiguracja aplikacji

- [ ] Ujednolicić `SITE_URL` na potwierdzone `https://maleszykmedia.pl` przed następnym wdrożeniem.
- [ ] Zweryfikować analogiczną konfigurację środowiska w Vercel.
- [ ] Nie zmieniać automatycznie adresu e-mail przed potwierdzeniem skrzynki i operatora poczty.
- [ ] Wykonać pełne `npm run check`, `npm run build` i `git diff --check` na kandydacie wydaniowym.
- [ ] Przejrzeć zamierzony diff i zsynchronizować zatwierdzone commity z `origin/main`.

### DNS i poczta

- [ ] Uzyskać eksport całej obecnej strefy DNS z home.pl lub od klienta.
- [ ] Zapisać istniejące rekordy A, AAAA, CNAME, MX, TXT, CAA i aktualne TTL.
- [ ] Zabezpieczyć konfigurację MX, SPF, DKIM i DMARC.
- [ ] Nie zastępować delegacji ani całej strefy bez planu zachowania poczty.
- [ ] Dodać `maleszykmedia.pl` do właściwego projektu Vercel.
- [ ] Ustalić wersję kanoniczną: apex albo `www`.
- [ ] Skonfigurować przekierowanie 301 drugiego wariantu do wersji kanonicznej.
- [ ] Wprowadzić dokładnie rekordy wskazane dla domeny przez panel Vercel.
- [ ] Po propagacji potwierdzić DNS na serwerach autorytatywnych i publicznych resolverach.
- [ ] Potwierdzić ważny certyfikat SSL, HTTPS, HSTS i przekierowanie HTTP do HTTPS.
- [ ] Po zmianach ponownie sprawdzić dostarczalność poczty.

### Historia URL i przekierowania 301

- [ ] Uzyskać od klienta informację, czy wcześniej istniała witryna pod którąkolwiek domeną.
- [ ] Sprawdzić Google Search Console, archiwum lub backup starej witryny i inne wiarygodne źródła starych adresów.
- [ ] Jeśli stare adresy istniały, przygotować mapę przekierowań 1:1.
- [ ] Wdrożyć wymagane przekierowania 301 bez łańcuchów i sprawdzić końcowe URL-e.

Nie tworzyć przykładowych przekierowań bez potwierdzenia, że stare trasy faktycznie istniały.

### Vercel, dostępy i rollback

- [ ] Połączyć lokalne repozytorium z właściwym projektem Vercel albo zapewnić dostęp do panelu.
- [ ] Zweryfikować właściciela projektu i dostęp klienta Owner/Admin.
- [ ] Zweryfikować dostęp klienta do repozytorium.
- [ ] Zweryfikować dostęp do Speed Insights i Google Search Console.
- [ ] Wskazać konkretny deployment `READY` przeznaczony do promocji.
- [ ] Potwierdzić jego commit, typ deploymentu i czyste Runtime Logs.
- [ ] Zapisać URL/ID bezpośrednio poprzedniego Production Deployment do Instant Rollback.
- [ ] Potwierdzić domeny przypisane do deploymentu i procedurę awaryjną.
- [ ] Przygotować archiwum lub inny potwierdzony backup kodu i zasobów wydania.

## P5 — go-live i odbiór

Tę sekcję wykonywać dopiero po formalnym zamknięciu P0–P4 i ponownym zaliczeniu etapu 4.

- [ ] Uzyskać ostateczną pisemną akceptację stagingu i zgodę na przełączenie.
- [ ] Promować zatwierdzony deployment lub wykonać zatwierdzony deploy produkcyjny.
- [ ] Przełączyć DNS z zachowaniem rekordów pocztowych.
- [ ] Wykonać smoke test wszystkich pięciu tras, 404, zasobów, canonicali, robots i sitemapy.
- [ ] Sprawdzić kanały kontaktu, pocztę, Open Graph i Speed Insights.
- [ ] Zweryfikować domenę w Google Search Console.
- [ ] Zgłosić produkcyjną sitemapę w Google Search Console.
- [ ] Włączyć alerty wykorzystania i transferu w Vercel.
- [ ] Poinstruować klienta o limitach planu i ryzyku transferu lokalnych materiałów wideo.
- [ ] Przekazać klientowi uzgodnione dostępy i instrukcję obsługi/statystyk.
- [ ] Utworzyć tag `v1.0.0` na dokładnym zaakceptowanym i wdrożonym commicie.
- [ ] Podpisać protokół zdawczo-odbiorczy z okresem gwarancji.

### Monitoring 24 h

- [ ] `T+0`: DNS apex/`www`, HTTPS, trasy, zasoby, kontakt i poczta.
- [ ] `T+15 min`: DNS, HTTPS, trasy, Runtime Logs i błędy klienta.
- [ ] `T+1 h`: DNS, trasy, kontakt, poczta, Runtime Logs, Speed Insights i wideo.
- [ ] `T+4 h`: ponowna pełna kontrola oraz transfer.
- [ ] `T+12 h`: ponowna kontrola krytycznych funkcji.
- [ ] `T+24 h`: końcowa kontrola i decyzja o zamknięciu albo przedłużeniu monitoringu.
- [ ] W razie krytycznego błędu wykonać uzgodniony rollback i ponownie zweryfikować domeny oraz pocztę.
- [ ] Po bezbłędnym monitoringu ustawić status: „Projekt pomyślnie wdrożony i odebrany przez klienta”.

## Ustalenia już zamknięte

- [x] Etap 1: fundamenty techniczne, build, CI i audyt zależności.
- [x] Q-1: w v1 filmy pozostają lokalnie w projekcie i są serwowane przez Vercel; CDN/Blob można rozważyć później na podstawie transferu.
- [x] Q-2: w v1 pozostaje link do profilu Instagram, bez dynamicznego feedu i tokenu API.
- [x] Analityka: tylko Vercel Speed Insights, bez GA4/GTM.
- [x] Docelowa domena strony: `maleszykmedia.pl`.
- [x] CSP z nonce: wdrożone; Mozilla Observatory `A+`, 120 punktów, 12/12 PASS.
- [x] Podstawowe SEO, JSON-LD, sitemap `lastmod`, 404, cache zasobów i nagłówki bezpieczeństwa mają zaliczoną kontrolę implementacji.

## Kolejność zamykania projektu

1. Uzyskać dane i decyzje klienta z P0.
2. Wykonać poprawki techniczne z P1.
3. Przeprowadzić testy urządzeniowe, dostępności i cross-browser z P2.
4. Zweryfikować kanały oraz zewnętrzne narzędzia z P3 w możliwym zakresie.
5. Powtórzyć etap 4 i uzyskać wynik PASS albo udokumentowany, świadomy wyjątek klienta.
6. Przygotować DNS, pocztę, Vercel, przekierowania i rollback według P4.
7. Uzyskać finalną zgodę i wykonać P5 wraz z monitoringiem 24 h.
