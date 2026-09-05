# Raport weryfikacji przedwdrożeniowej — etap 5

**Projekt:** Strona_002

**Etap:** Odbiór z klientem i wdrożenie produkcyjne (go-live)

**Data rozpoczęcia:** 2026-09-05, 09:40 CEST

**Gałąź i commit:** `main`, `f4ae578`

**Publiczny staging:** `https://strona-002.vercel.app/`

**Wynik:** **BLOCKED / NO-GO — etap 5 rozpoczęty, wdrożenie produkcyjne wstrzymane**

## Podsumowanie wykonawcze

Etap 5 został rozpoczęty od bramki gotowości, kontroli publicznego stagingu, DNS, kanałów kontaktu, konfiguracji wdrożeniowej i stanu repozytorium. Nie wykonano przełączenia DNS, promocji deploymentu, zmian w poczcie, zgłoszenia sitemapy ani utworzenia tagu wydania, ponieważ kryteria wejścia do go-live nie są spełnione.

Najważniejsze blokery:

1. Etap 4 ma status **FAIL / brak zgody na rozpoczęcie etapu 5**. Mobilny Lighthouse Performance wynosił 78, mobilny LCP 5,50 s, a polityka prywatności nadal nie ma adresu, NIP ani REGON administratora.
2. Nie ma formalnej akceptacji klienta dla treści, zakresu v1, materiałów, praw do wizerunku, modelu kontaktu bez formularza, Q-4 ani pocztowej części Q-3. Q-1 i Q-2 zostały rozstrzygnięte.
3. Docelową domenę ustalono jako `maleszykmedia.pl`, ale nie jest ona jeszcze gotowa. Publiczny staging generuje dla niej poprawne canonicale, natomiast lokalne `.env.local` nadal wskazuje `maleszyk.media`. `maleszykmedia.pl` ma serwery nazw home.pl, ale brak odpowiedzi A, CNAME dla apexu, A/CNAME dla `www`, MX i TXT.
4. Nie wykonano backupu istniejącej strefy pocztowej. W aktualnie widocznej publicznej strefie `maleszykmedia.pl` nie ma rekordów MX/TXT, ale przed zmianami nadal trzeba uzyskać eksport strefy od klienta lub rejestratora i potwierdzić, czy poczta działa pod inną domeną.
5. `next.config.mjs` nie zawiera `redirects()`. Historia poprzedniej witryny i mapa starych adresów nie zostały potwierdzone w Google Search Console. Publiczne wyszukiwanie `site:` nie zwróciło wyników, ale nie zastępuje danych GSC ani informacji klienta.
6. Brak połączenia repozytorium z lokalnym projektem Vercel (`.vercel/project.json`), brak CLI Vercel i brak dostępu do panelu uniemożliwiają potwierdzenie typu/commitu deploymentu, Runtime Logs, Speed Insights, domen, właścicieli i konkretnego deploymentu rollback.
7. Nie ma tagu `v1.0.0`; repozytorium lokalne jest o 3 commity dokumentacyjne przed `origin/main`.

**Decyzja:** nie ma zgody na zmianę DNS ani produkcyjny deploy. Najpierw trzeba zamknąć blokery i uzyskać jednoznaczne zatwierdzenie klienta.

## 1. Zakres i metoda

Wykonano:

- przegląd instrukcji etapu 5, `docs/open-questions.md`, raportów etapów 3–4, konfiguracji Next.js, zmiennych lokalnych i treści strony;
- `npm run check` (TypeScript, ESLint, testy Node);
- kontrolę stanu Git, tagów, relacji z `origin/main` i konfiguracji Vercel w repozytorium;
- test HTTP publicznego stagingu, pięciu tras, kontrolnej trasy 404, przekierowania HTTP → HTTPS, krytycznych zasobów, robots i sitemapy;
- kontrolę składni linków `tel:`, `mailto:` i WhatsApp w HTML `/contact`;
- publiczne zapytania DNS przez Google Public DNS dla obu domen występujących w projekcie;
- publiczne wyszukiwanie `site:maleszyk.media` i `site:maleszykmedia.pl`.

Nie wykonano:

- deployu preview ani produkcyjnego, promocji deploymentu i zmian DNS;
- testów w panelu Vercel, GSC lub na kontach klienta — brak uwierzytelnionego dostępu;
- interakcyjnych testów w przeglądarce i na fizycznym telefonie — w sesji nie było dostępnej sterowalnej przeglądarki;
- rzeczywistego połączenia telefonicznego, otwarcia klienta poczty, wysłania wiadomości ani kontroli skrzynki odbiorczej;
- 24-godzinnego monitoringu po wdrożeniu, ponieważ produkcja nie została uruchomiona;
- żadnej zmiany o potencjalnym wpływie na domenę, pocztę, użytkowników lub stan produkcyjny.

Pozycje niemożliwe do potwierdzenia oznaczono jako `NOT TESTED` lub `PENDING`, a nie jako `PASS`.

## 2. Bramka wejściowa z etapów 1–4

| Obszar | Stan wejściowy | Ocena dla etapu 5 |
|---|---|---|
| Etap 3 | PASS warunkowy; otwarte testy iOS/Android, Messenger i akceptacja modelu bez formularza | PENDING |
| Etap 4 | FAIL; m.in. Performance Mobile 78, LCP 5,50 s, niepełne dane administratora | **BLOCKER** |
| Kontrola bieżąca `npm run check` | TypeScript PASS, ESLint PASS, testy 7/7 PASS | PASS |
| Drzewo robocze przed utworzeniem raportu | czyste | PASS |
| Synchronizacja Git | lokalny `main` o 3 commity dokumentacyjne przed `origin/main` | PENDING push/review |

Zgodnie z `docs/etapy-weryfikacji/README.md` nie należy przechodzić do kolejnego etapu przed pozytywnym zakończeniem poprzedniego etapu albo udokumentowanym kompromisem. Takiego kompromisu nie znaleziono.

## 3. Staging i zakres wydania

### 3.1 Publiczny staging

| Test | Wynik |
|---|---|
| `https://strona-002.vercel.app/` | 200 |
| `/contact` | 200 |
| `/o-mnie` | 200 |
| `/oferta` | 200 |
| `/polityka-prywatnosci` | 200 |
| `/nieistnieje-etap-5` | 404 |
| `http://strona-002.vercel.app/` | 308 do HTTPS |
| HSTS | obecny: `max-age=63072000; includeSubDomains; preload` |
| Wideo Hero | 200, `video/mp4`, 626 189 B |
| Obraz Hero | 200, `image/webp`, 137 608 B |
| Speed Insights script | 200, JavaScript |
| Obraz Open Graph | 200, `image/jpeg`, 33 470 B |

Staging istnieje i odpowiada poprawnie na poziomie HTTP. Nie udało się jednak potwierdzić w panelu, czy jest formalnym Preview Deployment, z którego commitu powstał ani czy jego logi są czyste.

### 3.2 Zakres v1

`app/page.tsx` montuje osiem sekcji: Hero, About, Promo, Services, Process, Testimonials, FAQ i CTA. Komentarz w pliku odkłada Benefits, Portfolio i Instagram na kolejne iteracje. Jest to zgodne z proponowanym zakresem v1, ale wymaga pisemnej akceptacji klienta.

Podstrona `/oferta` opisuje trzy typy usług i ich zakres, lecz nie publikuje kwot ani nazwanych pakietów cenowych. Punkt „potwierdzenie cennika i pakietów” jest więc **PENDING BUSINESS DECISION**: klient musi potwierdzić, że v1 ma celowo zawierać wycenę indywidualną, albo dostarczyć cennik.

## 4. Akceptacja klienta i otwarte pytania

| Pozycja | Stan | Wymagane potwierdzenie |
|---|---|---|
| Treści i proofreading | PENDING | pisemna akceptacja klienta |
| Telefon `+48 791 705 230` | potwierdzona spójność kodu/stagingu; PENDING biznesowo | klient potwierdza właściciela numeru |
| E-mail `kontakt@maleszyk.media` | potwierdzona spójność kodu/stagingu; domena NXDOMAIN | klient potwierdza właściwy adres i domenę |
| Adres fizyczny | brak w `.env.local` i polityce prywatności | klient dostarcza pełny adres |
| NIP / REGON | brak | klient dostarcza dane albo formalnie wskazuje brak zastosowania |
| Zakres v1 bez portfolio i live Instagram | PENDING | pisemna akceptacja |
| Ceny/pakiety lub wycena indywidualna | PENDING | decyzja klienta |
| Zgody na wizerunek i prawa do materiałów | PENDING | pisemne oświadczenie klienta |
| Model kontaktu bez formularza | PENDING | pisemna akceptacja |

Stan `docs/open-questions.md` po decyzjach klienta:

- **Q-1 — hosting wideo: ROZSTRZYGNIĘTE.** W v1 filmy pozostają lokalnie w projekcie i są serwowane przez Vercel. Migracja do CDN/Blob może zostać rozważona później na podstawie transferu.
- **Q-2 — Instagram: ROZSTRZYGNIĘTE.** W v1 pozostaje wyłącznie link do profilu, bez dynamicznego feedu i bez tokenu API.
- **Q-3 — domena i hosting e-mail: CZĘŚCIOWO ROZSTRZYGNIĘTE.** Docelowa domena strony to `maleszykmedia.pl`. Nadal trzeba potwierdzić docelowy adres e-mail, operatora poczty i rekordy pocztowe. Konfigurację lokalną `SITE_URL=https://maleszyk.media` trzeba ujednolicić przed następnym wdrożeniem.
- **Q-4 — materiały: OTWARTE.** Brak formalnej akceptacji klienta.

## 5. DNS, domena, SSL i poczta

### 5.1 Ustalony stan publiczny na 2026-09-05, 09:40 CEST

| Nazwa | Wynik |
|---|---|
| `maleszyk.media` A/MX/TXT | `NXDOMAIN` — domena nie rozwiązuje się w DNS |
| `maleszykmedia.pl` NS | `dns.home.pl`, `dns2.home.pl`, `dns3.home.pl` |
| `maleszykmedia.pl` A/CNAME | brak odpowiedzi |
| `www.maleszykmedia.pl` A/CNAME | `NXDOMAIN` dla hosta |
| `maleszykmedia.pl` MX/TXT/CAA | brak odpowiedzi |

Wybrana docelowa domena strony to **`maleszykmedia.pl`**. Publiczny staging już używa jej w metadanych:

- canonical: `https://maleszykmedia.pl/`;
- `og:url`: `https://maleszykmedia.pl`;
- `og:image`: `https://maleszykmedia.pl/og-image.jpg`;
- robots Host i Sitemap: `https://maleszykmedia.pl`;
- wszystkie adresy w sitemapie: `https://maleszykmedia.pl/...`.

Lokalne `.env.local` używa natomiast `SITE_URL=https://maleszyk.media`, a dane kontaktowe również kończą się na `@maleszyk.media`. Wybór domeny strony usuwa niepewność biznesową, ale konfigurację lokalną trzeba zmienić na `https://maleszykmedia.pl` przed następnym wdrożeniem. Adresu e-mail nie wolno zmieniać automatycznie, dopóki klient nie potwierdzi skrzynki i operatora poczty. `.env.local` jest tylko dowodem konfiguracji lokalnej, nie konfiguracji Vercel.

### 5.2 Status przełączenia

- Data i godzina przełączenia DNS: **nie dotyczy — nie wykonano**.
- Status propagacji: **nie rozpoczęto**.
- SSL domeny własnej: **NOT TESTED / niemożliwy bez działającego DNS**.
- Przekierowanie `www` → apex albo apex → `www`: **nie skonfigurowano / NOT TESTED**.
- Ciągłość poczty: **niepotwierdzona**; brak podstaw do zmiany strefy.

Przed zmianą należy wyeksportować pełną strefę z home.pl, zwłaszcza MX, SPF, DKIM i DMARC, oraz zapisać aktualne TTL. Nie wolno zastępować całej delegacji DNS bez odtworzenia rekordów pocztowych.

## 6. Historia URL i przekierowania 301

`next.config.mjs` nie ma funkcji `async redirects()` ani mapy przekierowań legacy. Wyszukiwania `site:maleszyk.media` i `site:maleszykmedia.pl` nie zwróciły wyników, ale ten wynik nie dowodzi, że stara witryna nie istniała i nie obejmuje danych z Google Search Console.

| Stary URL | Nowy URL | Stan |
|---|---|---|
| brak potwierdzonej listy | — | PENDING: klient + GSC + ewentualny backup starej witryny |

Jeśli potwierdzone zostaną stare adresy, należy przygotować mapę 1:1 i testować kod 301 oraz końcowy URL bez łańcuchów przekierowań. Nie należy wdrażać przykładowych tras z instrukcji bez dowodu, że istniały.

## 7. Kanały kontaktu i analityka

Na publicznym `/contact` potwierdzono obecność:

- `tel:+48791705230`;
- `mailto:kontakt@maleszyk.media?subject=Zapytanie%20ofertowe`;
- `https://wa.me/48791705230?text=...`.

Składnia linków jest poprawna. Nie wykonano rzeczywistego połączenia, uruchomienia klienta e-mail, wysłania wiadomości WhatsApp ani testu dostarczalności. Adres e-mail wykorzystuje domenę, która w chwili testu zwracała `NXDOMAIN`, dlatego kanału e-mail nie można uznać za działający.

Projekt nie ma formularza kontaktowego. `<SpeedInsights />` i jego publiczny skrypt są obecne, lecz rejestrowanie sesji i metryk w panelu Vercel ma status `NOT TESTED` z powodu braku dostępu. Projekt pozostaje bez GA4/GTM zgodnie z wcześniejszą decyzją. GSC i zgłoszenie sitemapy: `NOT TESTED / NOT SUBMITTED`.

## 8. Dostępy, backup, wydanie i protokół

| Element | Stan |
|---|---|
| Klient Owner/Admin w Vercel | NOT VERIFIED |
| Dostęp klienta do repozytorium | NOT VERIFIED |
| Speed Insights / ewentualna analityka | NOT VERIFIED |
| Google Search Console | NOT VERIFIED |
| Backup kodu i zasobów | lokalne repozytorium istnieje; brak potwierdzonego archiwum wydaniowego |
| Tag `v1.0.0` | **brak** |
| Protokół zdawczo-odbiorczy | PENDING |
| Okres gwarancji 14/30 dni | PENDING BUSINESS DECISION |
| Instrukcja obsługi/statystyk | PENDING |

Tagu nie utworzono, ponieważ projekt nie został wdrożony ani odebrany. Tag wydaniowy powinien wskazywać dokładnie commit zaakceptowany przez klienta i wdrożony na produkcję, a nie bieżący stan dokumentacyjny.

## 9. Plan rollback i monitoring

### 9.1 Punkt przywrócenia

- Bieżący publiczny staging: `https://strona-002.vercel.app/`.
- Ostatni kodowy punkt odniesienia zsynchronizowany z `origin/main`: `f67dc1a` (`fix(security): zaostrz politykę CSP`).
- Konkretny poprzedni Production Deployment Vercel: **NOT IDENTIFIED — BLOCKER przed go-live**.

Commit Git nie jest automatycznie równoważny deploymentowi kwalifikującemu się do Instant Rollback. Przed uruchomieniem trzeba w Vercel zapisać URL/ID obecnego i poprzedniego wdrożenia produkcyjnego oraz potwierdzić, jakie domeny zostaną przełączone.

### 9.2 Procedura awaryjna

1. Przed wdrożeniem zapisać eksport DNS, ID/URL stabilnego deploymentu, commit, listę domen i właściciela decyzji rollback.
2. Po deployu natychmiast sprawdzić HTTP/HTTPS, pięć tras, 404, canonicale, robots, sitemapę, obrazy OG, kanały kontaktu, pocztę i Speed Insights.
3. Przy krytycznym błędzie użyć Vercel Instant Rollback do bezpośrednio poprzedniego deploymentu produkcyjnego; następnie zweryfikować domeny i wyłączyć dalszą automatyczną promocję do czasu naprawy.
4. Przy awarii poczty przywrócić dokładnie zapisane rekordy MX/TXT i zweryfikować dostarczanie w obie strony.
5. Przy problemie SSL sprawdzić rekordy A/CNAME/CAA i status domeny w Vercel; nie omijać HTTPS.
6. Przy braku propagacji po 48 h eskalować do home.pl i Vercel, porównując odpowiedzi serwerów autorytatywnych oraz publicznych resolverów.

Dokumentacja Vercel potwierdza, że Instant Rollback przywraca poprzednie wdrożenie, a na planie Hobby jest ograniczony do bezpośrednio poprzedniego deploymentu produkcyjnego: <https://vercel.com/docs/instant-rollback>. Aktualna procedura promocji preview i kontroli logów: <https://vercel.com/docs/deployments/promote-preview-to-production>.

### 9.3 Plan monitoringu 24 h

Monitoring nie został rozpoczęty. Po faktycznym przełączeniu:

- `T+0`, `T+15 min`, `T+1 h`, `T+4 h`, `T+12 h`, `T+24 h`: DNS apex/`www`, HTTPS/SSL, trasy i kanały kontaktu;
- ciągle przez pierwszą godzinę, później przy każdym punkcie kontrolnym: Runtime Logs i błędy klienta;
- `T+1 h`, `T+4 h`, `T+24 h`: Speed Insights, dostępność wideo i wykorzystanie transferu;
- `T+24 h`: decyzja o zamknięciu monitoringu albo przedłużeniu obserwacji.

Wynik 24-godzinnego monitoringu: **NOT STARTED**.

## 10. Limity Vercel i ryzyko transferu

Instrukcja etapu podaje 100 GB transferu miesięcznie dla Hobby. Oficjalna dokumentacja planów Vercel dostępna podczas audytu nadal wskazuje 100 GB Fast Data Transfer w zestawieniu planów, ale limity i zasady mogą się zmieniać; przed przekazaniem klientowi trzeba potwierdzić bieżący plan i Usage/Billing projektu: <https://vercel.com/docs/plans>.

Klient nie został jeszcze formalnie poinstruowany. Ze względu na około 27 MB lokalnych materiałów wideo należy:

- włączyć alerty użycia w Vercel;
- monitorować transfer po starcie;
- monitorować przyjętą decyzję Q-1 (lokalne wideo na Vercel) i rozważyć dedykowany CDN/Blob dopiero wtedy, gdy uzasadni to zużycie transferu;
- zapisać ustalenie kosztowe w protokole odbioru.

## 11. Checklista akceptacyjna etapu 5

- [ ] Klient pisemnie zaakceptował treści, teksty i model cenowy na stagingu.
- [ ] Wszystkie pytania Q-1–Q-4 zostały rozstrzygnięte — Q-1 i Q-2 zamknięte, Q-3 częściowo zamknięte, Q-4 otwarte.
- [ ] Etap 4 został zamknięty albo klient podpisał świadomy wyjątek dla wskazanych ryzyk.
- [ ] Potwierdzono jedną docelową domenę i spójne adresy e-mail — domena `maleszykmedia.pl` potwierdzona, e-mail oczekuje.
- [ ] Sprawdzono historię domeny i wdrożono wymagane przekierowania 301.
- [ ] Zapisano pełny backup DNS, MX i TXT poczty.
- [ ] Domena produkcyjna działa z ważnym SSL i wymuszonym HTTPS.
- [ ] `www` i apex mają ustaloną wersję kanoniczną oraz 301.
- [ ] Kanały kontaktu przetestowano na fizycznym smartfonie i potwierdzono dostarczalność e-mail.
- [ ] Speed Insights potwierdza rejestrowanie wizyt produkcyjnych.
- [ ] Domena została zweryfikowana w GSC, a produkcyjna sitemap została zgłoszona.
- [ ] Klient został poinstruowany o limitach i alertach transferu.
- [ ] Wszystkie wymagane dostępy przekazano klientowi.
- [ ] Utworzono tag `v1.0.0` na dokładnym wdrożonym commicie.
- [ ] Zidentyfikowano poprzedni Production Deployment do rollback.
- [ ] Protokół odbioru podpisano i wskazano okres gwarancji.
- [ ] Monitoring 24 h zakończył się bez krytycznych incydentów.

## 12. Warunki wznowienia i kolejność go-live

1. Ujednolicić konfigurację strony na potwierdzoną domenę `maleszykmedia.pl`; klient potwierdza właściwy adres e-mail oraz operatora poczty.
2. Zespół zamyka blokery etapu 4 albo uzyskuje podpisane odstępstwo.
3. Klient zatwierdza scope v1, treści, wycenę indywidualną/cennik, materiały, prawa do wizerunku i brak formularza; domyka pocztową część Q-3 oraz Q-4. Q-1 i Q-2 są już zamknięte.
4. Administrator eksportuje strefę DNS i dane pocztowe; zespół tworzy mapę 301 na podstawie GSC/starej witryny.
5. W Vercel należy wskazać konkretny READY preview, sprawdzić commit i logi oraz zapisać poprzedni deployment produkcyjny do rollback.
6. Dopiero wtedy skonfigurować apex i `www` według wartości pokazanych dla domeny przez panel Vercel, zachowując rekordy pocztowe.
7. Po propagacji wykonać smoke test produkcyjny, GSC, analitykę, przekazanie dostępów, tag wydania i monitoring 24 h.
8. Po bezbłędnym monitoringu podpisać protokół i zmienić status na: **Projekt pomyślnie wdrożony i odebrany przez klienta**.

## Status końcowy

**Etap 5 uruchomiony jako kontrola gotowości. Produkcyjny go-live: WSTRZYMANY. Projekt nie został jeszcze wdrożony ani odebrany przez klienta.**
