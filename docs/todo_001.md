# TODO — do zrobienia

---

## 1. Wyciągnąć treści do zmiennych środowiskowych

Podobnie jak `SITE_URL` i `AUTHOR_NAME`, następujące teksty na razie są hardcodowane w kodzie i powinny trafić do `process.env`:

- `description` strony (SEO, OG, Twitter) — `app/layout.tsx:37-38`
- Treść przycisku CTA ("Skontaktuj się") — `components/sections/Hero.tsx`
- Podtytuł Hero ("Fotografia i film — …") — `components/sections/Hero.tsx`
- Hasło Hero ("Zamrażam Chwile") — `components/sections/Hero.tsx`
- Locale OG (`pl_PL`) jeśli planowane wersje językowe

Wzorzec: dodać zmienną do `.env.example`, odczytać przez `process.env.ZMIENNA ?? 'placeholder'`.

---

## 2. Stworzyć wymagane pliki statyczne

Metadata API odwołuje się do plików, które muszą fizycznie istnieć w `/public`:

| Plik | Rozmiar | Uwagi |
|------|---------|-------|
| `/public/og-image.jpg` | 1200×630 px | Obraz do podglądu linku (OG/Twitter) |
| `/public/favicon.ico` | 32×32 px | Ikona zakładki przeglądarki |
| `/public/apple-touch-icon.png` | 180×180 px | Ikona dla iOS (dodaj do ekranu głównego) |
| `/public/video/hero-poster.jpg` | dowolny | Placeholder wideo w Hero (już użyty w kodzie) |
| `/public/video/hero.mp4` | < 10 MB, H.264 | Docelowe tło wideo Hero (odkomentować `<source>`) |

---

## 3. Audyt jakości kodu

Przeprowadzić przegląd całego kodu pod kątem:

- Spójności nazewnictwa (komponenty, zmienne, klasy CSS)
- Martwego kodu i nieużywanych importów (np. font Oswald — audit #8)
- Brakujących typów TypeScript (`any`, nieoznaczone propsy)
- Dostępności (ARIA, kontrast kolorów, focus management)
- Pokrycia błędów w boundary (brak `error.tsx`, `not-found.tsx`)

Po audycie:

- Zaktualizować `docs/tech-spec.md` o nowe decyzje techniczne
- Zaktualizować `docs/design.md` jeśli zmieniły się założenia UI
- Dodać nowy plik `docs/audits/aud_002_RRRR-MM-DD.md` z wnioskami

---

## 4. Testy — migracja na Vitest (gdy wróci dostęp do npm)

Aktualnie działają bramki jakości bez dodatkowych paczek:
- `npm run typecheck`
- `npm run lint`
- `npm run test` (Node `node:test` + `--experimental-strip-types`)
- `npm run check` (typecheck + lint + test)

Powód: podczas próby instalacji Vitest środowisko zwracało `EAI_AGAIN` dla `registry.npmjs.org`.

Po przywróceniu dostępu do internetu:
- Zainstalować `vitest`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`
- Przenieść testy smoke z `node:test` do Vitest + Testing Library
- Dodać konfigurację `vitest.config.ts` oraz `test/setup.ts`

---

## 5. Uzupełnić i zatwierdzić dane prawne

Przed finalnym wdrożeniem uzupełnić w Polityce Prywatności i zatwierdzić z klientem:

- pełną nazwę podmiotu / administratora danych;
- adres siedziby lub adres administratora;
- NIP;
- REGON;
- dedykowany adres e-mail do spraw ochrony danych;
- datę obowiązywania lub ostatniej aktualizacji dokumentu.

Kod i pliki środowiskowe obsługują już `PRIVACY_ADMIN_NAME`, `PRIVACY_ADMIN_ADDRESS`, `PRIVACY_ADMIN_NIP`, `PRIVACY_ADMIN_REGON`, `PRIVACY_CONTACT_EMAIL` oraz `PRIVACY_POLICY_UPDATED_AT`. Do uzupełnienia pozostają prawdziwe wartości adresu, NIP-u i REGON-u.

## 6. Decyzja analityczna — bez GA4/GTM

Projekt pozostaje wyłącznie przy **Vercel Speed Insights**. Nie wdrażać GA4 ani GTM, a więc również Google Consent Mode v2, dopóki klient nie zmieni tej decyzji. Przed odbiorem potwierdzić w panelu Vercel, że metryki LCP, INP i CLS są zbierane.

## 7. Zadania odroczone do końca testów

- Po zakończeniu testów podłączyć docelową domenę `maleszykmedia.pl` i dopiero wtedy zweryfikować DNS, TLS, canonicale, robots, sitemap, JSON-LD oraz Open Graph.
- Po wdrożeniu CSP z nonce powtórzyć Mozilla Observatory i potwierdzić wynik A/A+ oraz brak naruszeń CSP w przeglądarce. Implementacja usuwa `'unsafe-inline'` z `script-src` i ogranicza `connect-src` do strony oraz Vercel Speed Insights.
