# Polecenie Wykonawcze: Etap 4 — Wydajność, SEO, Analityka i Prawne

> **Instrukcja dla AI / Inżyniera QA:**  
> Wykonaj poniższe polecenie w całości. Przeprowadź audyt Core Web Vitals, zweryfikuj metatagi SEO i dane strukturalne, sprawdź konfigurację narzędzi analitycznych oraz upewnij się, że strona spełnia wymogi prawne (RODO, polityka prywatności, baner cookies).

---

## 1. Kontekst i Cel Etapu

Wymagania niefunkcjonalne projektu (`docs/non-functional-requirements.md`) narzucają rygorystyczne wskaźniki jakości:
- **Lighthouse Performance:** $\ge 90$
- **Lighthouse Accessibility:** $\ge 85$
- **Lighthouse SEO:** $\ge 90$
- **Automatyczna konwersja WebP & lazy loading**
- **Pełna zgodność z protokołem HTTPS i standardami semantyki webowej**

Celem **Etapu 4** jest audyt przedwdrożeniowy parametrów SEO, analitycznych i prawnych, aby strona po zaindeksowaniu przez Google osiągała wysokie pozycje i była w pełni bezpieczna prawnie.

---

## 2. Zadania Weryfikacyjne i Zakres Badania

### Krok 1: Audyt Lighthouse i optymalizacja Core Web Vitals
1. **Uruchomienie audytu produkcyjnego:**
   - Zbuduj projekt i uruchom serwer produkcyjny:
     ```powershell
     cmd /c "npm run build && npm run start"
     ```
   - Przeprowadź audyt Lighthouse w trybie incognito (szczególnie profil **Mobile**):
     - **LCP (Largest Contentful Paint):** cel $\le 2.5$ s.
     - **INP (Interaction to Next Paint):** cel $\le 200$ ms.
     - **CLS (Cumulative Layout Shift):** cel $\le 0.1$.
2. **Weryfikacja preloadera i First Paint:**
   - Zbadaj działanie preloadera strony głównej.
   - Upewnij się, że nie opóźnia on sztucznie renderowania treści dla użytkowników z szybkim łączem oraz botów wyszukiwarek (zgodnie z wnioskami audytu 007).
3. **Symulacja słabej sieci (Network Throttling):**
   - W DevTools (zakładka Network) ustaw profil ograniczania prędkości na **Fast 3G** lub **Slow 3G**.
   - Odśwież stronę główną i zweryfikuj doświadczenie użytkownika. Upewnij się, że preloader odpowiednio informuje o ładowaniu zasobów, czcionki mają fallback (`font-display: swap`), a ciężkie wideo nie blokuje renderowania pierwszej widocznej treści (First Paint).
4. **Analiza pakietów (`perf:bundle`):**
   - Uruchom `cmd /c "npm run perf:bundle"` i upewnij się, że wspólny budżet bazowy JavaScript nie przekracza limitów.

### Krok 2: Weryfikacja SEO On-Page, Indeksacji i Podglądów Społecznościowych
1. **Pliki indeksujące botów:**
   - Sprawdź `app/robots.ts` — upewnij się, że w trybie produkcyjnym plik zezwala na indeksowanie (`allow: '/'`), nie blokuje zasobów CSS/JS/obrazów dla robotów wyszukiwarek i wskazuje poprawny URL do `sitemap.xml`.
   - Sprawdź `app/sitemap.ts` — czy zawiera wszystkie docelowe adresy (`/`, `/contact`, `/o-mnie`, `/oferta`, `/polityka-prywatnosci`) z właściwym protokołem `https://` i datą ostatniej modyfikacji.
2. **Metatagi, Favicony i Theme Color:**
   - Sprawdź metadane na każdej trasie: unikalny `<title>` (format: `Tytuł | Maleszyk Media`), `meta description` (140–160 znaków), `canonical URL`.
   - Zweryfikuj favikony (`favicon.ico`, `apple-touch-icon.png`) w zakładkach przeglądarki i wynikach wyszukiwania.
   - Upewnij się, że zadeklarowano `themeColor: '#0a0a0a'` w metadanych (`app/layout.tsx`), aby pasek adresu w przeglądarkach mobilnych (iOS Safari, Chrome Android) harmonizował z ciemną stylistyką strony.
3. **Walidacja Open Graph i Twitter Card w debuggerach:**
   - Weryfikacja tagów społecznościowych: `og:title`, `og:description`, `og:image` (format 1200×630 px, plik `/og-image.jpg` o wadze < 300 kB).
   - Przetestuj linki w oficjalnych debuggerach:
     - [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
     - [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)
     - [Twitter / X Card Validator](https://cards-dev.twitter.com/validator)
   - Upewnij się, że miniatura ładuje się błyskawicznie i `metadataBase` poprawnie rozwiązuje adresy bezwzględne.
4. **Weryfikacja błędu 404 (Brak Soft 404):**
   - Wywołaj zapytanie pod nieistniejący adres (np. `curl -I https://domena.pl/nieistnieje`).
   - Upewnij się, że serwer zwraca rzeczywisty nagłówek HTTP status **`404 Not Found`**, a nie `200 OK` z widokiem błędu (Soft 404 jest surowo karane przez Google).
5. **Struktura semantyczna i dane uporządkowane (JSON-LD):**
   - Sprawdź hierarchię nagłówków na każdej podstronie (dokładnie jeden `<h1>`, brak przeskoków np. z `<h1>` bezpośrednio do `<h3>`).
   - Weryfikacja poprawności danych strukturalnych generowanych przez `lib/structured-data.ts` i `components/seo/StructuredData.tsx` (`WebSite`, `Organization`, `Person`, `BreadcrumbList`) w oficjalnym testerze [Google Rich Results Test](https://search.google.com/test/rich-results).
   - Upewnij się, że wszystkie zdjęcia w kodzie mają uzupełniony, opisowy atrybut `alt`.

### Krok 3: Narzędzia Analityczne i Weryfikacja Nagłówków Cache
1. **Konfiguracja Vercel Speed Insights:**
   - Sprawdź, czy komponent `<SpeedInsights />` z pakietu `@vercel/speed-insights/next` jest poprawnie osadzony w `app/layout.tsx`.
   - Upewnij się, że po wdrożeniu na Vercel metryki Web Vitals (LCP, INP, CLS) są widoczne w panelu Speed Insights projektu.
   - Zweryfikuj, że Speed Insights nie zapisuje cookies ani identyfikatorów użytkownika (zgodność z polityką prywatności strony).
2. **Ewentualna integracja GA4 / GTM (decyzja biznesowa):**
   - Ustal z klientem, czy wymagana jest integracja z Google Analytics 4 lub Google Tag Manager.
   - **Aktualny stan:** Projekt nie posiada żadnej integracji z GA4/GTM — brak zależności w `package.json`, brak skryptów śledzących w kodzie, brak domen Google Analytics w CSP.
   - **W przypadku wdrożenia GA4:** Należy dodać domeny `https://www.googletagmanager.com` i `https://*.google-analytics.com` do `script-src` i `connect-src` w CSP (`next.config.mjs`), zaimplementować Consent Mode v2 z banerem cookies oraz zaktualizować politykę prywatności.
3. **Weryfikacja nagłówków Cache-Control na produkcji:**
   - Po wdrożeniu na Vercel (lub na serwerze produkcyjnym) sprawdź nagłówki HTTP zwracane dla kluczowych zasobów:
     ```powershell
     # Statyczne assety JS/CSS (oczekiwane: max-age=31536000, immutable)
     curl -I https://domena.pl/_next/static/chunks/main-HASH.js

     # Obrazy (oczekiwane: max-age=2592000, stale-while-revalidate=86400)
     curl -I https://domena.pl/images/Hero.webp

     # Wideo (oczekiwane: max-age=2592000, stale-while-revalidate=86400)
     curl -I https://domena.pl/videos/promo-reel.webm
     ```
   - Alternatywnie: w DevTools → Network → kliknij zasób → zakładka Headers → sprawdź `Cache-Control`.
   - Upewnij się, że reguły zdefiniowane w `next.config.mjs` są faktycznie zwracane w odpowiedziach HTTP.

### Krok 4: Wymogi Prawne, RODO i Polityka Prywatności
1. **Uzupełnienie danych w Polityce Prywatności (`app/polityka-prywatnosci/page.tsx`):**
   - Sprawdź, czy usunięto wszystkie placeholdery.
   - Wprowadź oficjalne dane podmiotu gospodarczego klienta: pełna nazwa firmy, adres siedziby, NIP, REGON, dedykowany e-mail do kontaktu w sprawach ochrony danych osobowych.
2. **Zgody i pliki cookies:**
   - **Aktualny stan:** Strona nie zapisuje własnych cookies analitycznych ani marketingowych. Jedynym narzędziem analitycznym jest `@vercel/speed-insights`, który nie używa cookies ani identyfikatorów. Baner cookies nie jest wymagany w obecnej wersji.
   - **Na przyszłość:** W przypadku dodania GA4, GTM lub innych narzędzi zapisujących cookies, należy wdrożyć Consent Mode v2 z banerem akceptacji/odrzucenia przed zbieraniem danych.
3. **Klauzula informacyjna:**
   - Upewnij się, że w sekcjach kontaktu i stopce znajduje się jasny odnośnik do Polityki Prywatności.

### Krok 5: Nagłówki bezpieczeństwa, HSTS i Content Security Policy
Projekt posiada rygorystyczny zestaw nagłówków HTTP i Content Security Policy w `next.config.mjs`:
1. **Zgodność CSP z zewnętrznymi serwisami:**
   - **Vercel Speed Insights:** Upewnij się, że `connect-src` zezwala na endpoint analityki (`https://vitals.vercel-insights.com`).
   - **YouTube (embed):** Upewnij się, że `frame-src` zawiera `https://www.youtube-nocookie.com` (wymagane przez `YouTubeFacade` i embedy na podstronie `/o-mnie`).
   - **Wideo / Obrazy zewnętrzne:** Jeśli media hostowane są na Cloudinary / Vercel Blob, sprawdź czy domena jest odblokowana w `remotePatterns` oraz w CSP (`img-src`, `media-src`).
   - **Na przyszłość (GA4/GTM):** W razie dodania Google Analytics 4 lub GTM, należy odblokować w CSP domeny `https://www.googletagmanager.com` i `https://*.google-analytics.com` w `script-src` i `connect-src`.
2. **Nagłówek HSTS (Strict-Transport-Security):**
   - Upewnij się, że w odpowiedziach produkcyjnych HTTPS obecny jest nagłówek `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`.
   - Przetestuj nagłówki produkcyjne w narzędziu [SecurityHeaders.com](https://securityheaders.com) lub [Mozilla Observatory](https://observatory.mozilla.org/) (oczekiwana ocena: **A** lub **A+**).
3. **Zmienne środowiskowe witryny w `app/layout.tsx`:**
   - Sprawdź czy zmienna `SITE_URL` (domyślnie `https://maleszyk.media`) i `AUTHOR_NAME` są poprawnie ustawione w środowisku produkcyjnym Vercel (służą do `metadataBase` i znaczników Open Graph).

---

## 3. Checklista Akceptacyjna (Kryteria Pass/Fail)

- [ ] Wynik Lighthouse w kategoriach: Performance $\ge 90$, Accessibility $\ge 85$, SEO $\ge 90$.
- [ ] Pliki `robots.txt` i `sitemap.xml` generują się poprawnie z prawidłowymi adresami `https://` (brak blokad zasobów dla botów).
- [ ] Każda podstrona posiada unikalny `title`, `description` oraz działający obraz `og:image`.
- [ ] Podglądy Open Graph pomyślnie zweryfikowane w debuggerach społecznościowych (Facebook / LinkedIn / Twitter).
- [ ] Favicona i meta tag `theme-color` wyświetlają się poprawnie i współgrają z ciemnym motywem.
- [ ] Zapytania do nieistniejących podstron zwracają właściwy kod błędu HTTP `404 Not Found` (brak Soft 404).
- [ ] Brak błędów składni w danych strukturalnych Schema.org (JSON-LD).
- [ ] Dokładnie jeden nagłówek `<h1>` na każdej podstronie.
- [ ] Vercel Speed Insights (`<SpeedInsights />`) poprawnie osadzony i raportujący metryki w panelu Vercel.
- [ ] Nagłówki `Cache-Control` na produkcji zgodne z konfiguracją w `next.config.mjs`.
- [ ] Nagłówki bezpieczeństwa (CSP, HSTS) uzyskują ocenę A/A+ na SecurityHeaders.com.
- [ ] Decyzja ws. GA4/GTM podjęta i udokumentowana (jeśli wymagane — wdrożone z Consent Mode v2).
- [ ] Polityka prywatności zawiera kompletne i zatwierdzone dane firmy (NIP, REGON, adres).
- [ ] Strona ładuje się bez zawieszania na symulowanym słabym łączu (Fast 3G), z odpowiednim obsłużeniem opóźnień multimediów.

---

## 4. Oczekiwany Raport Końcowy

Zapisz wyniki w pliku `docs/audits/aud_XXX_weryfikacja-etap-4.md`. Raport powinien zawierać:
1. Zrzut / tabelę wyników audytu Lighthouse na profilu mobilnym i desktopowym.
2. Zestawienie tytułów, opisów, nagłówków `H1` oraz status testu podglądów Open Graph.
3. Potwierdzenie poprawności schematu JSON-LD oraz testu kodu odpowiedzi HTTP 404.
4. Wyniki audytu nagłówków bezpieczeństwa (ocena SecurityHeaders / HSTS).
5. Status weryfikacji dokumentów prawnych i analityki.
6. Rekomendację: **Zgoda na rozpoczęcie procedury wdrożeniowej (Etap 5)** LUB **Lista braków formalno-optymalizacyjnych**.
