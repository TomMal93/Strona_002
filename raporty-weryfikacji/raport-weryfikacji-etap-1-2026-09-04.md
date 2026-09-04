# Raport weryfikacji przedwdrożeniowej — etap 1

**Projekt:** Strona_002

**Etap:** Fundamenty techniczne i build

**Data wykonania:** 2026-09-04

**Gałąź i commit bazowy:** `main`, `823051b0ee92ff8b6d24deac5dae3efa4feed8a4`

**Wynik:** **WARUNKOWY PASS — oczekiwanie na zdalny przebieg CI**

## Podsumowanie

Kod przechodzi lokalnie pełną weryfikację statyczną i buduje wszystkie wymagane trasy jako statyczne. Naprawiono konfigurację CI, usunięto wyświetlanie surowego komunikatu wyjątku na stronie 500, obniżono First Load JS `/oferta` poniżej budżetu oraz wykonano kontrolowaną migrację do Next.js 16.3.4 i React 19.2.8. Audyt produkcyjny nie wykazuje już podatności. Do pełnego zamknięcia etapu pozostało potwierdzenie zielonego przebiegu CI po pushu.

## 1. Weryfikacja statyczna

Polecenie: `npm run check`

Status końcowy: **PASS**, kod wyjścia `0`.

```text
> npm run typecheck
> tsc --noEmit

> npm run lint
> eslint .

> npm run test
1..6
# tests 6
# pass 6
# fail 0
```

- TypeScript: brak błędów.
- ESLint: brak błędów i ostrzeżeń.
- Testy: 6/6 zaliczonych.
- Ostrzeżenie `MODULE_TYPELESS_PACKAGE_JSON` nie wystąpiło na Node.js 22. Dodanie `"type": "module"` nie jest obecnie zasadne, ponieważ `font-mocks.js` używa CommonJS (`module.exports`).
- Dokumentacja etapu mówi o 11 testach, ale bieżące repozytorium zawiera 6 plików `tests/**/*.test.ts`. Jest to rozbieżność dokumentacji, nie niezaliczony test.

## 2. Audyt bezpieczeństwa zależności

Polecenie: `npm audit --omit=dev`

Status końcowy: **PASS**, kod wyjścia `0`.

Stan początkowy:

```text
3 vulnerabilities (1 moderate, 2 high)
```

Wykonano bezpieczne `npm audit fix --omit=dev`, bez flagi `--force`. Zaktualizowano lockfile między innymi do:

- Next.js `15.5.24` → `15.5.25`,
- `nanoid` `3.3.11` → `3.3.18`,
- bezpośredni `postcss` `8.5.6` → `8.5.28`.

Stan końcowy:

```text
postcss <=8.5.22
Severity: high
node_modules/next/node_modules/postcss

2 vulnerabilities (1 moderate, 1 high)
fix available via npm audit fix --force
Will install next@16.3.4, which is a breaking change
```

Wykonano kontrolowaną migrację do Next.js `16.3.4` i React/React DOM `19.2.8`, wraz z wymaganym przejściem na ESLint 9 i flat config. Wynik końcowego audytu:

```text
found 0 vulnerabilities
```

## 3. Build produkcyjny

Polecenie: `npm run build`

Status końcowy: **PASS**, kod wyjścia `0`, Next.js `16.3.4` (Turbopack).

```text
✓ Compiled successfully in 2.3s
✓ Generating static pages using 10 workers (9/9)
○ (Static) prerendered as static content
```

Wszystkie wymagane strony wygenerowano statycznie:

- `/`
- `/contact`
- `/o-mnie`
- `/oferta`
- `/polityka-prywatnosci`
- `/_not-found`

Dodatkowo statycznie wygenerowano `/robots.txt` i `/sitemap.xml`. Nie wystąpiły błędy prerenderowania ani ostrzeżenia o niedozwolonych bibliotekach serwerowych.

Test uruchomieniowy `next start` po migracji potwierdził HTTP 200 dla wszystkich stron, `/robots.txt` i `/sitemap.xml` oraz HTTP 404 dla nieistniejącego adresu.

## 4. First Load JS i analiza chunków

Pomiar porównawczy sprzed migracji do Next.js 16: tabela wynikowa `npm run build`

Status końcowy: **PASS**.

| Trasa | First Load JS | Budżet < 160 kB | Status |
|---|---:|---:|---|
| `/` | 154 kB | 160 kB | PASS |
| `/contact` | 157 kB | 160 kB | PASS |
| `/o-mnie` | 137 kB | 160 kB | PASS |
| `/oferta` | 157 kB | 160 kB | **PASS (−3 kB)** |
| `/polityka-prywatnosci` | 107 kB | 160 kB | PASS |
| `/_not-found` | 103 kB | 160 kB | PASS |

Wspólny First Load JS: `103 kB`.

Największe chunki według gzip:

| Chunk | Raw | Gzip |
|---|---:|---:|
| `static/chunks/4bd1b696-….js` | 169.0 kB | 53.1 kB |
| `static/chunks/255-….js` | 169.6 kB | 45.4 kB |
| `static/chunks/framework-….js` | 136.6 kB | 43.8 kB |
| `static/chunks/polyfills-….js` | 110.0 kB | 38.7 kB |
| `static/chunks/main-….js` | 123.3 kB | 35.4 kB |

Łącznie przed optymalizacją: `1111.3 kB raw`, `346.8 kB gzip`. Zidentyfikowano synchroniczne ładowanie `ScrollTrigger` przez layout oraz dwa komponenty `/oferta`. Po zmianie plugin jest pobierany asynchronicznie po hydratacji, natomiast wszystkie parametry animacji pozostały bez zmian. First Load JS `/oferta` spadł z `174 kB` do `157 kB`, czyli o `17 kB`.

Next.js 16 usunął metrykę First Load JS z raportu `next build`, dlatego powyższa tabela pozostaje ostatnim bezpośrednio porównywalnym pomiarem z Next.js 15. Po migracji `npm run perf:bundle` raportuje łącznie `1080.6 kB raw` i `334.3 kB gzip` dla wszystkich chunków.

Kontrola regresji objęła TypeScript, ESLint, testy jednostkowe i produkcyjny build. Automatyczny test wizualny nie był możliwy, ponieważ w sesji audytowej nie była dostępna sterowalna przeglądarka. Użytkownik wykonał następnie ręczny test `/oferta` i potwierdził poprawne działanie animacji po optymalizacji.

## 5. Higiena kodu i obsługa błędów

Przeszukano `app/`, `components/` i `lib/` pod kątem `console.log`, `console.warn`, `debugger`, `TODO:`, `FIXME:`, `temp` i mocków.

- Nie znaleziono artefaktów debugowania ani znaczników tymczasowych w kodzie produkcyjnym.
- `app/not-found.tsx` pokazuje spójny interfejs 404 i nie ujawnia danych technicznych.
- `app/error.tsx` ujawniał użytkownikowi `error.message`. Usunięto ten fragment; strona 500 pokazuje teraz wyłącznie bezpieczny, ogólny komunikat i akcje odzyskiwania.

## 6. Środowisko i repozytorium

- Lokalny Node.js: `v22.23.1` — zgodny z wymaganiem Next.js 16 (`>=20.9`) i skryptem testowym.
- npm: `10.9.8`.
- CI po poprawce: Node.js `22`, zgodny z lokalną główną wersją runtime.
- Vercel: Node.js `24.x` — ustawienie potwierdzone przez użytkownika na podstawie panelu Production Deployment; wersja spełnia wymagania projektu.
- Śledzony jest wyłącznie `.env.example`.
- `.env`, `.env.local` i `.env.production` są ignorowane przez `.gitignore`.
- Nie znaleziono prywatnych tokenów lub kluczy API oznaczonych prefiksem `NEXT_PUBLIC_`. Zmienne publiczne zawierają wyłącznie treści, dane kontaktowe i adresy profili.

Drzewo robocze nie było czyste już przed audytem:

```text
M .gitignore
M components/pages/about-me/AboutMeBio.tsx
M package-lock.json
```

Zmiany te należały do użytkownika i zostały zachowane. Audyt dodał zmiany w `.github/workflows/ci.yml`, `app/error.tsx`, dalszą bezpieczną aktualizację `package-lock.json` oraz niniejszy raport. Przed wdrożeniem należy przejrzeć i zatwierdzić cały zamierzony diff. `git diff --check` kończy się kodem `0`.

## 7. Pipeline CI/CD

Ostatni zdalny przebieg workflow `CI` na `main`:

- run: [#2 — GitHub Actions](https://github.com/TomMal93/Strona_002/actions/runs/33885661479),
- commit: `823051b0ee92ff8b6d24deac5dae3efa4feed8a4`,
- start: `2026-09-04 14:46:26 UTC`,
- koniec: `2026-09-04 14:46:56 UTC`,
- czas zadania: około 30 s,
- wynik: **failure**,
- nieudany krok: `Run quality checks`, kod wyjścia `9`,
- krok `Build production application`: pominięty.

Przyczyna: workflow uruchamiał Node.js 20, a `npm run test` korzysta z `node --experimental-strip-types`; ta opcja nie jest obsługiwana przez ustawiony runtime i proces kończył się kodem 9.

Wprowadzona poprawka:

- `actions/checkout@v4` → `actions/checkout@v5`,
- `actions/setup-node@v4` → `actions/setup-node@v5`,
- Node.js `20` → `22`.

Konfiguracja nadal wykonuje pełną sekwencję `npm ci` → `npm run check` → `npm run build`. `concurrency.cancel-in-progress` ma wartość `true`. Cache npm jest włączony przez `actions/setup-node` z `cache: npm`; API przebiegu potwierdza powodzenie kroku instalacji, lecz nie udostępnia jednoznacznej informacji, czy w tym konkretnym przebiegu wystąpił cache hit. Pełną sekwencję CI odtworzono w czystym katalogu tymczasowym po migracji do Next.js 16: instalacja, typy, lint, 6/6 testów i build zakończyły się powodzeniem. Zielony status zdalny będzie możliwy dopiero po commit/push i ponownym uruchomieniu workflow.

## 8. Naprawione usterki

1. Dopasowano runtime CI do skryptu testowego i usunięto przyczynę kodu wyjścia 9.
2. Podniesiono wersje akcji GitHub do wariantów opartych na Node.js 24, usuwając ostrzeżenie o wycofanym runtime akcji.
3. Usunięto ujawnianie surowego `error.message` na stronie 500.
4. Usunięto podatne `nanoid@3.3.11`, a następnie wykonano migrację do Next.js `16.3.4` i React `19.2.8`; końcowy audyt produkcyjny wykazuje 0 podatności.
5. Odroczono ładowanie `ScrollTrigger` bez zmiany parametrów animacji; First Load JS `/oferta` spadł o 17 kB.
6. Przeniesiono linting ze starego `.eslintrc` do flat config wymaganego przez Next.js 16 i ESLint 9.
7. Usunięto niestandardowe nagłówki `Cache-Control` dla `/_next/*`, które w Next.js 16 powodowały ostrzeżenia i mogły kolidować z cache frameworka.

## 9. Checklista akceptacyjna

- [x] `tsc --noEmit` kończy się kodem `0`.
- [x] `eslint .` kończy się kodem `0`.
- [x] Wszystkie istniejące testy przechodzą: 6/6.
- [x] `npm audit --omit=dev` kończy się kodem `0`: 0 podatności.
- [x] `next build` kończy się kodem `0`.
- [x] Wszystkie 5 głównych tras oraz 404 są statyczne.
- [x] Brak wycieków sekretów w `NEXT_PUBLIC_`.
- [x] Brak niepożądanych wywołań `console.log` w kodzie produkcyjnym.
- [ ] Czyste drzewo Git — zmiany istniały przed audytem i doszły poprawki audytowe.
- [ ] Zielony pipeline na `main` — poprawka jest lokalna i nie została jeszcze uruchomiona zdalnie.
- [x] Wszystkie trasy poniżej 160 kB First Load JS — `/oferta` ma po optymalizacji 157 kB.
- [x] Ręczna regresja wizualna animacji `/oferta` po optymalizacji.
- [x] Runtime Vercel zweryfikowany: Node.js `24.x`.
- [x] Rozbieżność dokumentacji (11 testów) i repozytorium (6 testów) zaakceptowana decyzją użytkownika jako niewstrzymująca etap.

## Rekomendacja

**Zezwolić na przejście do etapu 2 po potwierdzeniu zielonego CI.**

Pozostały warunek:

1. Przejrzeć zmiany, wykonać commit/push i potwierdzić zielony przebieg CI na `main`.
