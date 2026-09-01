# Raport SEO — Strona_002 / Maleszyk.Media

**Data audytu:** 2026-08-31  
**Zakres:** `/`, `/oferta`, `/o-mnie`, `/contact`; indeksowalność, metadane, treść, nagłówki, linkowanie, obrazy, dane strukturalne i czynniki techniczne  
**Wersja projektu:** Next.js 14.2.35, React 18.3.1  
**Rodzaj audytu:** analiza kodu, produkcyjnego buildu, prerenderowanego HTML i lokalnych odpowiedzi HTTP

---

## 1. Wniosek wykonawczy

Strona ma dobre podstawy SEO: wszystkie cztery trasy są statycznie prerenderowane, każda ma jeden nagłówek `h1`, unikalny tytuł i opis, dokument ma `lang="pl"`, treść jest dostępna w HTML bez wykonywania JavaScriptu, a obrazy mają atrybuty `alt`. Produkcyjny build kończy się powodzeniem.

W obecnym stanie projektu **nie należy jednak wdrażać strony do indeksowania bez domknięcia konfiguracji SEO**. Najważniejsze problemy to:

1. build używa `https://example.com` i nazwy `Autor` w metadanych, Open Graph i JSON-LD;
2. brakuje `/robots.txt` i `/sitemap.xml` — oba adresy zwracają lokalnie `404`;
3. żadna strona nie deklaruje własnego adresu canonical;
4. podstrony dziedziczą homepage'owe Open Graph i Twitter Cards, w tym błędny `og:url`;
5. w wyrenderowanej treści pozostają placeholdery: `Przemek Malxxxxx`, `kontakt@example.com`, `+48 123 456 789` i powiązane linki WhatsApp;
6. dane strukturalne są zbyt ogólne i identyczne na każdej trasie;
7. oferta nie jest jeszcze ukierunkowana na konkretne lokalizacje ani osobne intencje usługowe.

### Ocena gotowości

| Obszar | Stan | Komentarz |
|---|---|---|
| Indeksowalność techniczna | wymaga poprawy | `index, follow` jest obecne, ale brak sitemap, robots i canonicali |
| Metadane podstawowe | częściowo dobre | tytuły i opisy są unikalne, lecz zawierają zastępczą nazwę autora |
| Social sharing | słabe | wszystkie podstrony dziedziczą dane strony głównej |
| Struktura treści | dobra | jeden `h1`, logiczne `h2`/`h3`, treść w prerenderowanym HTML |
| Dane strukturalne | podstawowe | poprawny kierunek, ale błędne wartości i za mało danych biznesowych |
| SEO lokalne | niewystarczające | brak miejscowości/bazy, profilu firmy i lokalnych stron docelowych |
| Wydajność wspierająca SEO | wymaga poprawy | ciężkie wideo, blokujący preloader i umiarkowany koszt JS |
| Pomiar efektów | niegotowe | brak danych Search Console, GA4/RUM i produkcyjnego URL w zakresie audytu |

---

## 2. Metoda i ograniczenia

Wykonano:

- `npm run build` — build zakończony powodzeniem;
- analizę plików `app`, `components`, `lib`, `public` i konfiguracji Next.js;
- analizę czterech plików HTML wygenerowanych przez build;
- kontrolę tytułów, opisów, robots meta, Open Graph, Twitter Cards, nagłówków, obrazów, linków i JSON-LD;
- kontrolę lokalnych adresów `/robots.txt` i `/sitemap.xml`;
- porównanie z raportem wydajności `aud_007`;
- odniesienie do aktualnej dokumentacji Google Search Central.

Nie wykonano:

- audytu domeny produkcyjnej, ponieważ jej adres nie został podany i nie wynika z konfiguracji;
- analizy Google Search Console, profilu firmy Google, linków przychodzących ani pozycji;
- badania wolumenów i konkurencji fraz;
- liczbowego Lighthouse i Core Web Vitals — wbudowana przeglądarka pomiarowa nie była dostępna.

Lokalny aktywny serwer zwrócił `500` dla `/contact`, mimo że świeży build poprawnie wygenerował `contact.html`. Najbardziej prawdopodobna jest niespójność działającego procesu deweloperskiego ze świeżym buildem. Trzeba to ponownie sprawdzić na czystym serwerze produkcyjnym przed publikacją; nie traktuję tego wyniku jako potwierdzonego błędu wdrożenia.

---

## 3. Wyniki dla poszczególnych tras

| Trasa | `<title>` | Znaki | Meta description | Znaki | `h1` | Canonical |
|---|---|---:|---|---:|---:|---|
| `/` | `Portfolio Fotograficzno-Wideo \| Autor` | 37 | Portfolio fotografa i operatora wideo… | 112 | 1 | brak |
| `/oferta` | `Oferta — Maleszyk Media \| Autor` | 31 | Film okolicznościowy, profesjonalny montaż… | 97 | 1 | brak |
| `/o-mnie` | `O mnie \| Autor` | 14 | Poznaj fotografa i operatora wideo… | 96 | 1 | brak |
| `/contact` | `Kontakt \| Autor` | 15 | Porozmawiajmy o filmie, fotografii… | 78 | 1 | brak |

Wnioski:

- tytuły i opisy są unikalne, ale zbyt ogólne i nie wykorzystują głównej lokalizacji ani najważniejszej specjalizacji;
- `Autor` osłabia wiarygodność i markę;
- `/o-mnie` i `/contact` mają bardzo krótkie tytuły, które można lepiej wykorzystać do opisania usługi i marki;
- długość nie powinna być traktowana mechanicznie — ważniejsza jest zgodność tytułu, `h1`, treści i intencji użytkownika. Google może tworzyć title link również z nagłówków, tekstu i `og:title` ([Google Search Central — title links](https://developers.google.com/search/docs/appearance/title-link)).

### Proponowane tytuły i opisy

Finalne wersje wymagają podania głównego miasta/regionu i decyzji, która usługa jest priorytetowa.

| Trasa | Rekomendowany kierunek tytułu | Rekomendowany kierunek opisu |
|---|---|---|
| `/` | `Filmowanie i fotografia [miasto/region] \| Maleszyk.Media` | główne usługi, obszar działania, wyróżnik i wezwanie do kontaktu |
| `/oferta` | `Film ślubny, eventowy i promocyjny \| Maleszyk.Media` | konkretne formaty realizacji, obszar działania i wartość dla klienta |
| `/o-mnie` | `Przemek [nazwisko] — filmowiec i fotograf \| Maleszyk.Media` | doświadczenie, styl pracy, specjalizacje i lokalizacja |
| `/contact` | `Kontakt i wolne terminy \| Maleszyk.Media` | czas odpowiedzi, obszar realizacji i bezpośredni sposób kontaktu |

---

## 4. Problemy i rekomendacje według priorytetu

## P0 — przed dopuszczeniem strony do indeksowania

### 4.1 Ustawić prawdziwy URL, nazwę autora i dane firmy

**Dowód:** wynik buildu zawiera:

- `og:url = https://example.com`;
- `og:image = https://example.com/images/Hero.webp`;
- JSON-LD: `name = Autor`, `url = https://example.com`;
- tytuły zakończone `| Autor`.

**Przyczyna:** `app/layout.tsx` ma fallbacki `https://example.com` i `Autor`, a `.env.local` nie dostarcza `SITE_URL` ani `AUTHOR_NAME`.

**Rekomendacja:**

1. ustawić na hostingu `SITE_URL=https://docelowa-domena.pl` oraz pełne `AUTHOR_NAME`;
2. zastąpić bezpieczne w developmencie fallbacki walidacją, która przerywa produkcyjny build przy placeholderze;
3. dodać jedną centralną konfigurację danych firmy: nazwa marki, pełne imię i nazwisko, telefon, e-mail, bazowa lokalizacja i profile społecznościowe;
4. po wdrożeniu sprawdzić źródło HTML każdej trasy.

### 4.2 Usunąć wszystkie placeholdery z treści i linków

W świeżym buildzie występują co najmniej:

- `Przemek Malxxxxx`;
- `tel:+48123456789` na stronie głównej;
- `https://wa.me/48123456789`;
- CTA `mailto:kontakt@example.com` na `/o-mnie`, mimo że obok widnieje `kontakt@maleszyk.media`.

To problem SEO, jakości i konwersji. Niespójne dane kontaktowe osłabiają zaufanie, a błędny CTA może bezpośrednio tracić zapytania.

**Rekomendacja:** usunąć wartości zastępcze z kodu albo dodać automatyczny test blokujący build po wykryciu `example.com`, `123456789`, `Malxxxxx` lub `Autor` w produkcyjnym HTML.

### 4.3 Dodać canonical dla każdej strony

Żadna z czterech tras nie zawiera `<link rel="canonical">`. Każda strona powinna wskazywać własny, absolutny URL:

- `/` → `https://domena.pl/`;
- `/oferta` → `https://domena.pl/oferta`;
- `/o-mnie` → `https://domena.pl/o-mnie`;
- `/contact` → `https://domena.pl/contact`.

W App Router można użyć `metadata.alternates.canonical`. Canonical jest silnym sygnałem wyboru preferowanego URL i pomaga konsolidować sygnały wariantów adresu ([Google Search Central — canonicalization](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)).

### 4.4 Dodać `sitemap.xml` i `robots.txt`

Oba adresy zwracają obecnie `404`. W Next.js należy dodać:

- `app/sitemap.ts` z czterema absolutnymi canonicalami;
- `app/robots.ts` z regułą dla robotów i odnośnikiem do sitemap.

Mapa powinna zawierać wyłącznie publiczne canonicale i używać absolutnych URL-i. Google rekomenduje umieszczenie mapy w katalogu głównym i pozwala zgłosić ją w Search Console ([Google Search Central — sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)).

## P1 — wysoki wpływ na prezentację i zrozumienie strony

### 4.5 Nadać każdej podstronie własne Open Graph i Twitter Cards

Aktualnie `/oferta`, `/o-mnie` i `/contact` dziedziczą ze strony głównej:

- `og:title = Portfolio Fotograficzno-Wideo | Autor`;
- homepage'owy opis;
- `og:url = https://example.com`;
- ten sam kwadratowy obraz `Hero.webp`;
- identyczne dane Twitter Cards.

**Skutek:** udostępnienie dowolnej podstrony może pokazać błędny tytuł, opis i adres.

**Rekomendacja:** na każdej trasie zdefiniować `openGraph` i `twitter`, w tym własny URL, tytuł, opis i odpowiedni obraz. Przygotować dedykowany obraz społecznościowy w proporcji poziomej, zamiast używać kwadratowego `Hero.webp` 1024×1024. Dodać jego rozmiar i typ MIME do metadanych.

### 4.6 Rozbudować i uporządkować dane strukturalne

JSON-LD używa `ProfessionalService`, ale jest identyczny na każdej stronie i zawiera placeholdery. Brakuje m.in. powiązań z profilami, telefonu/e-maila, logo/obrazu, konkretnego obszaru działania i identyfikatora `@id`.

**Rekomendacja:**

- na homepage dodać spójny graf `WebSite` + `Organization` lub właściwy typ biznesu/usługi;
- wskazać `name`, `url`, `@id`, `logo`/`image`, `telephone`, `email`, `sameAs` i prawdziwy `areaServed`;
- na stronach wewnętrznych dodać `WebPage` i opcjonalnie `BreadcrumbList`;
- dane mają odzwierciedlać treść widoczną dla użytkownika;
- nie dodawać ocen zbiorczych ani pól, których nie można potwierdzić;
- zweryfikować wynik w Rich Results Test po wdrożeniu.

Google zaleca JSON-LD i podkreśla, że kompletne, prawdziwe dane są ważniejsze niż duża liczba niepełnych pól ([ogólne zasady danych strukturalnych](https://developers.google.com/search/docs/appearance/structured-data/sd-policies), [wprowadzenie do danych strukturalnych](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data)). Dla biznesu działającego lokalnie należy rozważyć właściwy podtyp `LocalBusiness` tylko wtedy, gdy odpowiada rzeczywistemu modelowi firmy ([LocalBusiness](https://developers.google.com/search/docs/appearance/structured-data/local-business)).

### 4.7 Dodać sygnał nazwy witryny i prawdziwe ikony

Obecna konfiguracja używa fotografii `Hero.webp` jako `icon` i `apple` icon. To nie jest optymalny favicon. Brakuje również danych `WebSite`, które pomagają określić preferowaną nazwę witryny.

**Rekomendacja:**

- dodać `app/icon.png` lub `favicon.ico` w odpowiednich rozmiarach;
- dodać `app/apple-icon.png`;
- opcjonalnie dodać manifest PWA, jeśli będzie faktycznie utrzymywany;
- dodać homepage'owy `WebSite` z nazwą `Maleszyk.Media` i `alternateName`, jeśli marka używa wariantu zapisu.

Google wskazuje `WebSite` na stronie głównej jako sposób podania preferowanej nazwy serwisu ([Google Search Central — site name](https://developers.google.com/search/docs/appearance/site-names)).

### 4.8 Ustalić strategię fraz i lokalizacji

Treści opisują szeroki zestaw usług: śluby, eventy, koncerty, materiały promocyjne, montaż, drony, off-road i sesje rodzinne. Bez priorytetu tematycznego i lokalnego trudno zbudować silną trafność dla jednej intencji.

**Rekomendacja biznesowa:** wybrać:

1. usługę numer 1 pod względem marży i popytu;
2. główną miejscowość lub region bazowy;
3. 2–4 segmenty, które mają otrzymać osobne strony docelowe;
4. język marki: fotograf, filmowiec, operator wideo czy studio produkcyjne.

Przykładowa docelowa architektura, jeśli odpowiada ofercie:

- `/film-slubny-[miasto]`;
- `/film-promocyjny-dla-firm`;
- `/film-eventowy`;
- `/montaz-filmow`;
- `/realizacje/[nazwa-projektu]` — studia przypadków z opisem celu, procesu i efektu.

Nie należy tworzyć masowych stron miast z niemal identyczną treścią. Każda strona powinna odpowiadać realnej usłudze i zawierać unikalne dowody: realizacje, zakres, proces, FAQ i kontekst lokalny.

## P2 — rozwój widoczności i jakości

### 4.9 Wzmocnić linkowanie wewnętrzne

Linki technicznie prowadzą do istniejących sekcji i tras, co jest plusem. Strona główna linkuje do `/oferta` i `/o-mnie`, a oferta do kontaktu.

Do poprawy:

- dodać opisowe linki z usług na przyszłe podstrony usług;
- linkować z realizacji do odpowiadających im usług;
- dodać breadcrumb na podstronach;
- rozważyć linki tekstowe w stopce do oferty, o mnie i kontaktu, nie tylko logo i social media;
- usunąć powtórzoną pozycję „O MNIE” w pełnej tablicy nawigacji (`/#about` oraz `/o-mnie`) albo wyraźnie rozróżnić etykiety.

### 4.10 Rozbudować portfolio jako treść indeksowalną

Sekcja wideo jest atrakcyjna wizualnie, ale same miniatury i osadzenia nie budują tylu sygnałów tematycznych co opisane realizacje.

Dla najważniejszych projektów warto publikować osobne strony zawierające:

- typ zlecenia i branżę;
- cel klienta;
- lokalizację, jeśli można ją ujawnić;
- zakres: zdjęcia, film, dron, montaż;
- krótki opis procesu i wyzwań;
- finalny materiał, kadry i transkrypcję lub streszczenie wideo;
- opinię klienta za zgodą;
- link do odpowiedniej usługi i CTA.

### 4.11 Zachować poprawne użycie `alt`

W buildzie wszystkie obrazy mają atrybut `alt`. Puste wartości dotyczą głównie powtarzalnych miniaturek i dekoracyjnych obrazów CTA; nie należy ich automatycznie wypełniać słowami kluczowymi. Pusty `alt` jest właściwy dla dekoracji.

Do ręcznej weryfikacji:

- czy miniatury YouTube przekazują informację niewystępującą w dostępnej nazwie przycisku;
- czy `alt="Zdjęcie kontaktowe"` na `/o-mnie` można zastąpić opisem osoby i kontekstu;
- czy logo klientów mają odpowiednio nazwę organizacji i nie wymagają dodatkowego kontekstu.

### 4.12 Poprawić wydajność wpływającą na odbiór i CWV

Szczegółowe dane zawiera `aud_007_raport-wydajnosci_2026-08-31.md`. Najważniejsze punkty dla SEO i konwersji:

- preloader może opóźniać odsłonięcie treści o około 1,7 s;
- pliki wideo ważą łącznie około 85,3 MiB;
- `contact.mp4` ma około 58,5 MiB;
- First Load JS wynosi 122–159 kB zależnie od trasy;
- pięć fontów jest preloadowanych globalnie.

Nie ma wiarygodnego pomiaru produkcyjnego CWV. Po wdrożeniu należy mierzyć dane rzeczywistych użytkowników i dążyć do wartości „good” w 75. percentylu: LCP ≤ 2,5 s, INP ≤ 200 ms i CLS ≤ 0,1 ([web.dev — progi Core Web Vitals](https://web.dev/articles/defining-core-web-vitals-thresholds)).

---

## 5. Co działa dobrze

- wszystkie publiczne trasy są statycznie prerenderowane;
- tekst i linki znajdują się w pierwszym HTML;
- każda trasa ma dokładnie jeden `h1`;
- hierarchia `h2`/`h3` jest zasadniczo logiczna;
- każda trasa ma unikalny `<title>` i meta description;
- ustawiono `html lang="pl"`;
- ustawiono `meta robots: index, follow`;
- wewnętrzne odnośniki do sekcji wskazują istniejące identyfikatory;
- wszystkie obrazy mają jawny `alt`, w tym pusty dla dekoracji;
- `next/image` generuje responsywne warianty większości obrazów;
- treść strony głównej jest rozbudowana, a FAQ zawiera realne pytania klientów;
- działają nagłówki bezpieczeństwa i długie cache dla zasobów statycznych;
- nie znaleziono mechanizmu przypadkowo ustawiającego `noindex` na stronach publicznych.

---

## 6. Plan wdrożenia

### Etap 1 — blokery publikacji, 0,5–1 dnia

1. Ustawić prawdziwy `SITE_URL`, `AUTHOR_NAME` i komplet danych kontaktowych.
2. Usunąć wszystkie placeholdery i dodać test ich obecności.
3. Dodać canonicale.
4. Dodać `app/sitemap.ts` i `app/robots.ts`.
5. Nadać każdej trasie własne Open Graph/Twitter metadata.
6. Dodać prawdziwy favicon oraz social image.
7. Uruchomić czysty build i serwer produkcyjny; sprawdzić `200` dla wszystkich tras.

### Etap 2 — dane i treść, 1–3 dni

1. Zbudować centralny, spójny model danych firmy.
2. Poprawić JSON-LD i dodać `WebSite`.
3. Uzupełnić pełne nazwisko, lokalizację bazową i priorytet usług.
4. Przepisać tytuły, opisy i pierwszy ekran zgodnie z wybraną intencją.
5. Dodać linki tekstowe w stopce i lepsze linkowanie usług.

### Etap 3 — wzrost organiczny, praca ciągła

1. Przygotować osobne strony najważniejszych usług.
2. Publikować indeksowalne case studies realizacji.
3. Dodać transkrypcje/streszczenia najważniejszych materiałów wideo.
4. Zoptymalizować media i preloader według raportu wydajności.
5. Pozyskiwać prawdziwe wzmianki i linki od klientów, partnerów, sal, organizatorów i usługodawców.

---

## 7. Konfiguracja po wdrożeniu

Po opublikowaniu prawdziwej domeny:

1. zweryfikować domenę w Google Search Console;
2. zgłosić `/sitemap.xml`;
3. użyć URL Inspection dla wszystkich czterech tras;
4. sprawdzić canonical wybrany przez Google;
5. przetestować JSON-LD w Rich Results Test;
6. sprawdzić podgląd linków w serwisach społecznościowych;
7. skonfigurować GA4 lub inne narzędzie analityczne z pomiarem wysłania kontaktu, kliknięć telefonu, e-maila i CTA;
8. skonfigurować raportowanie Web Vitals istniejące w projekcie;
9. utworzyć lub uzupełnić Profil Firmy w Google, jeśli firma ma realną bazę lub obsługiwany obszar zgodny z zasadami platformy;
10. po 28 dniach ocenić zapytania, strony wejścia, CTR, indeksację i rzeczywiste CWV.

### Minimalne kryteria odbioru

| Kontrola | Oczekiwany wynik |
|---|---|
| `https://domena.pl/robots.txt` | `200`, odnośnik do sitemap |
| `https://domena.pl/sitemap.xml` | `200`, 4 poprawne canonicale |
| każda publiczna trasa | `200`, self-canonical, unikalny title/description/OG |
| źródło HTML | brak `example.com`, `Autor`, `Malxxxxx`, `123456789` |
| JSON-LD | poprawne wartości, zgodność z treścią, brak błędów walidatora |
| favicon/social image | prawidłowe ładowanie i podgląd |
| kontakt | działający telefon, e-mail, WhatsApp i wszystkie CTA |
| Search Console | sitemap odczytana, brak niezamierzonych wykluczeń |

---

## 8. Podsumowanie priorytetów

Największą wartość da teraz nie „dopisywanie słów kluczowych”, lecz poprawne uruchomienie fundamentów: prawdziwa domena i marka, spójne dane firmy, canonicale, mapa witryny, robots, indywidualne metadane społecznościowe oraz brak placeholderów. Po tym etapie należy wybrać usługę i region, wokół których powstaną dedykowane strony ofertowe oraz opisane realizacje. Dopiero na działającej domenie, z danymi Search Console i profilem zapytań, warto wykonywać pełny audyt widoczności i konkurencji.
