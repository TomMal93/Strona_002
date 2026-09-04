# Polecenie Wykonawcze: Etap 5 — Odbiór z Klientem i Wdrożenie Produkcyjne (Go-Live)

> **Instrukcja dla AI / Inżyniera QA / Managera Projektu:**  
> Wykonaj poniższe polecenie w całości. Przeprowadź procedurę odbioru wersji przedwdrożeniowej (staging) z klientem, zamknij otwarte kwestie biznesowe, skonfiguruj domenę produkcyjną i wykonaj kontrolowany deploy.

---

## 1. Kontekst i Cel Etapu

Strona przeszła pomyślnie testy techniczne, wizualne, wydajnościowe oraz audyt SEO (Etapy 1–4). Ostatnim krokiem jest formalny odbiór dzieła przez klienta, bezpieczne przepięcie domeny produkcyjnej (bez zakłócania działania poczty firmowej) oraz finalne przekazanie praw i dostępów.

W dokumencie `docs/open-questions.md` zidentyfikowano otwarte tematy wymagające ostatecznej decyzji klienta:
- **Q-1:** Hosting wideo (Cloudinary vs Vercel Blob vs lokalne pliki).
- **Q-2:** Token dostępu do Instagram Graph API (lub statyczny widget).
- **Q-3:** Docelowa domena i hosting e-mail.
- **Q-4:** Ostateczne akceptacje materiałów wideo i zdjęć.

---

## 2. Zadania Weryfikacyjne i Procedura Wdrożenia

### Krok 1: Prezentacja Stagingu i weryfikacja merytoryczna z klientem
1. **Wdrożenie wersji podglądowej:**
   - Wygeneruj wersję podglądową na platformie Vercel (Preview Deployment).
   - Zapewnij klientowi link testowy oraz krótką instrukcję, na co zwrócić szczególną uwagę.
2. **Potwierdzenie zakresu wydania (Scope v1 vs v2):**
   - Zgodnie z `tech-spec.md` i komentarzem w `app/page.tsx`, strona główna zawiera obecnie 8 dopracowanych sekcji (Hero, About, Promo, Services, Process, Testimonials, FAQ, CTA).
   - Potwierdź z klientem, czy startujemy z wersją v1 (zgodnie z planem iteracyjnym), a sekcje dodatkowe (zaawansowane portfolio z filtrami kategorii, live feed Instagrama) zostaną opublikowane w v2 po dostarczeniu materiałów.
3. **Akceptacja treści (Proofreading):**
   - **Dane teleadresowe:** Trzykrotne sprawdzenie numeru telefonu, adresu e-mail i adresu fizycznego w stopce oraz sekcji kontaktowej.
   - **Cennik i pakiety:** Potwierdzenie przez klienta kwot, zakresów usług i warunków współpracy na podstronie `/oferta`.
   - **Prawa autorskie:** Pisemne potwierdzenie od klienta, że posiada zgody na publikację wizerunku wszystkich osób widocznych w portfolio (szczególnie realizacje weselne i eventy militarne).
4. **Zamknięcie otwartych pytań:**
   - Uzyskaj decyzję odnośnie feedu Instagrama (czy używamy dynamicznego API z tokenem, czy zoptymalizowanego statycznego podglądu z linkiem do profilu).

### Krok 2: Konfiguracja DNS, SSL, przekierowania 301 i poczta
1. **Audyt poprzedniej witryny i plan przekierowań 301 (Legacy URL Redirects):**
   - **KRYTYCZNE DLA SEO:** Ustal, czy pod docelową domeną klienta działała wcześniej inna strona www.
   - Jeśli domena posiada zaindeksowane w Google stare adresy (sprawdź w Google Search Console lub wpisując `site:twojadomena.pl` w wyszukiwarkę):
     - Sporządź listę starych adresów URL (np. `/kontakt.html`, `/cennik.php`, `/o-nas.html`, `/galeria`).
     - Skonfiguruj trwałe przekierowania 301 w `next.config.mjs` w sekcji `async redirects()` na odpowiadające im nowe trasy (`/contact`, `/oferta`, `/o-mnie`, `/`).
     - Brak przekierowań 301 spowoduje natychmiastową falę błędów 404 i drastyczny spadek widoczności w Google.
2. **Zabezpieczenie rekordów poczty elektronicznej (MX):**
   - **KRYTYCZNE DLA BIZNESU:** Przed jakąkolwiek zmianą rekordów DNS zapisz obecne wpisy (rekordy MX, TXT ze strefą SPF/DKIM/DMARC).
   - Upewnij się, że delegacja domeny na Vercel nie odetnie klienta od odbierania firmowej poczty e-mail.
3. **Konfiguracja rekordów w Vercel:**
   - Dodaj domenę główną oraz subdomenę `www` w panelu Vercel (np. `twojadomena.pl` oraz `www.twojadomena.pl`).
   - Ustaw jednoznaczne przekierowanie 301: zalecane przekierowanie z subdomeny `www` na domenę główną (lub odwrotnie).
   - Skonfiguruj rekordy DNS u rejestratora:
     - Typ `A` dla domeny głównej -> `76.76.21.21` (lub CNAME zgodnie z instrukcją Vercel).
     - Typ `CNAME` dla subdomeny `www` -> `cname.vercel-dns.com`.
4. **Certyfikat SSL / HTTPS:**
   - Poczekaj na propagację DNS i upewnij się, że certyfikat Let's Encrypt / Vercel został wygenerowany pomyślnie.
   - Sprawdź, czy wejście przez `http://` automatycznie przekierowuje na bezpieczne `https://`.

### Krok 2.5: Plan Rollback i Procedura Awaryjna
Przed wykonaniem wdrożenia produkcyjnego przygotuj plan wycofania zmian na wypadek krytycznych problemów:
1. **Instant Rollback na Vercel:**
   - Upewnij się, że znasz procedurę natychmiastowego przywrócenia poprzedniej wersji w panelu Vercel (Deployments → trzy kropki → Promote to Production).
   - Zidentyfikuj ostatni stabilny deployment, który posłuży jako punkt przywrócenia.
2. **Okno monitoringu po wdrożeniu:**
   - Zaplanuj **24-godzinny okres wzmożonej obserwacji** po przełączeniu DNS, podczas którego zespół monitoruje:
     - Logi błędów w panelu Vercel (Runtime Logs).
     - Metryki Web Vitals w Speed Insights (nagły spadek wyników).
     - Poprawność dostarczania wiadomości z formularza kontaktowego lub klikalność direct links.
     - Status certyfikatu SSL i propagacji DNS.
3. **Scenariusze awaryjne:**
   - **DNS nie propaguje się po 48h:** Skontaktuj się z rejestratorem domeny; rozważ tymczasowe obniżenie TTL rekordów przed migracją.
   - **SSL nie generuje się:** Sprawdź, czy rekordy DNS wskazują poprawnie na Vercel; wymuś ponowne wygenerowanie certyfikatu w panelu.
   - **Krytyczny błąd po deploy'u:** Wykonaj Instant Rollback na Vercel, zdiagnozuj problem na deploymencie preview, popraw i wdróż ponownie.
   - **Poczta e-mail przestaje działać:** Natychmiast przywróć oryginalne rekordy MX z backupu wykonanego w Kroku 2.
4. **Monitoring błędów (opcjonalnie):**
   - Rozważ integrację z narzędziem do monitorowania błędów klienckich (np. Sentry, LogRocket) w celu automatycznego wykrywania wyjątków JavaScript na produkcji.

### Krok 3: Weryfikacja dymna po wdrożeniu (Smoke Tests na Produkcji)
Po rozpropagowaniu DNS wykonaj natychmiastowe testy na żywej domenie:
1. **Test kanałów kontaktu na żywej domenie:**
   - Przetestuj kliknięcie w numer telefonu (`tel:`), link `mailto:` oraz odnośnik WhatsApp (`https://wa.me/`) z poziomu smartfona na domenie produkcyjnej.
   - W przypadku wdrożenia formularza: wyślij rzeczywiste zapytanie testowe i upewnij się, że trafia natychmiast do skrzynki odbiorczej.
2. **Sprawdzenie działania wideo:**
   - Sprawdź, czy wideo w sekcji Hero i w tle ładuje się bez opóźnień i nie zużywa nadmiernego transferu.
3. **Weryfikacja analityki w czasie rzeczywistym:**
   - Wejdź na stronę z urządzeń testowych (mobile + desktop) i sprawdź w panelu Vercel Speed Insights (lub Google Analytics Real-time), czy sesje i metryki są poprawnie rejestrowane na domenie produkcyjnej.
4. **Google Search Console:**
   - Zaloguj się na konto Google klienta i zweryfikuj własność domeny w GSC (metoda rekordu DNS TXT lub pliku weryfikacyjnego).
   - Prześlij adres sitemapy: `https://twojadomena.pl/sitemap.xml`.

### Krok 4: Przekazanie Dostępów, Edukacja o Limitach i Zamknięcie Projektu
1. **Przekazanie uprawnień:**
   - Zaproś klienta jako właściciela (Owner/Admin) do projektu w Vercel, repozytorium kodu, Google Analytics 4 i Search Console.
2. **Pouczenie o limitach transferu hostingu (Vercel Bandwidth):**
   - **Ważna uwaga kosztowa:** Poinformuj klienta o limitach bezpłatnego planu Vercel Hobby (100 GB transferu/mc). Ponieważ portfolio zawiera pliki wideo, duży ruch może wyczerpać transfer.
   - Zalecaj włączenie powiadomień o zużyciu w Vercel Billing lub planowaną migrację wideo na dedykowany CDN (Cloudinary / BunnyCDN / Vercel Blob) w wersji v2 serwisu.
3. **Instrukcja obsługi / Materiały instruktażowe:**
   - Przygotuj krótkie podsumowanie lub nagranie wideo (np. Loom), jak odczytywać statystyki odwiedzin i jak zarządzane są treści.
4. **Kopia zapasowa (Backup):**
   - Utwórz tag wydania w repozytorium Git (np. `git tag -a v1.0.0 -m "Wdrożenie produkcyjne - odbiór klienta"`).
   - Zabezpiecz stabilną kopię kodu źródłowego i bazy zasobów graficznych.
5. **Protokół odbioru i warunki gwarancji:**
   - Przedstawienie klientowi protokołu zdawczo-odbiorczego do podpisu.
   - Ujęcie w protokole ram czasowych bezpłatnego wsparcia gwarancyjnego (np. 14 lub 30 dni od odbioru na usuwanie ewentualnych usterek).

---

## 3. Checklista Akceptacyjna (Kryteria Pass/Fail)

- [ ] Klient pisemnie zaakceptował treści, teksty i cenniki na wersji stagingowej.
- [ ] Pytania z `docs/open-questions.md` zostały rozstrzygnięte.
- [ ] Sprawdzono historię domeny i wdrożono przekierowania 301 ze starych URL-i (jeśli strona istniała wcześniej).
- [ ] Rekordy MX i poczta e-mail klienta działają nieprzerwanie po zmianach DNS.
- [ ] Domena produkcyjna działa z ważnym certyfikatem SSL i wymuszonym HTTPS.
- [ ] Kanały kontaktu (tel, mailto, WhatsApp) oraz formularz przetestowane na domenie produkcyjnej.
- [ ] Analityka w czasie rzeczywistym (Speed Insights / GA4) potwierdza rejestrowanie wizyt z domeny produkcyjnej.
- [ ] Mapa strony `sitemap.xml` zgłoszona w Google Search Console.
- [ ] Klient poinstruowany o limitach transferu Vercel i zasadach monitorowania zużycia wideo.
- [ ] Wszystkie niezbędne dostępy przekazane klientowi.
- [ ] Utworzono tag wydania `v1.0.0` w systemie kontroli wersji.
- [ ] Plan rollback udokumentowany — zidentyfikowany ostatni stabilny deployment do przywrócenia.
- [ ] Protokół zdawczo-odbiorczy podpisany z określonym okresem gwarancji powdrożeniowej.
- [ ] 24-godzinny okres monitoringu po wdrożeniu zakończony bez krytycznych incydentów.

---

## 4. Oczekiwany Raport Końcowy

Zapisz protokół końcowy jako `docs/audits/aud_XXX_protokol-wdrozenia-i-odbioru.md`. Raport powinien zawierać:
1. Datę i godzinę przełączenia DNS oraz status propagacji.
2. Zestawienie skonfigurowanych przekierowań 301 ze starej domeny (lub adnotację o nowej domenie).
3. Potwierdzenie testu kanałów kontaktu i real-time analityki na produkcji.
4. Listę przekazanych kont i uprawnień.
5. Plan rollback i wynik 24-godzinnego monitoringu po wdrożeniu.
6. Potwierdzenie przekazania informacji o limitach transferu Vercel i okresie gwarancji.
7. Ostateczny status projektu: **Projekt pomyślnie wdrożony i odebrany przez klienta**.
