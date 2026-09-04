# Raport weryfikacji przedwdrożeniowej — etap 1

**Projekt:** Strona_002

**Etap:** Fundamenty techniczne i build

**Data wykonania:** 2026-09-04

**Gałąź i commit bazowy:** `main`, `823051b0ee92ff8b6d24deac5dae3efa4feed8a4`

**Wynik:** **FAIL — etap 2 wstrzymany**

## Podsumowanie

Kod przechodzi lokalnie pełną weryfikację statyczną i buduje wszystkie wymagane trasy jako statyczne. Naprawiono konfigurację CI, usunięto wyświetlanie surowego komunikatu wyjątku na stronie 500, częściowo zaktualizowano zależności produkcyjne i obniżono First Load JS `/oferta` poniżej budżetu. Etapu nie można jednak zamknąć wynikiem pozytywnym z powodu jednej podatności produkcyjnej o poziomie `high` oraz braku zielonego przebiegu CI po poprawce.

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

Status końcowy: **FAIL**, kod wyjścia `1`.

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

Pozostała podatność dotyczy `postcss@8.4.31` zagnieżdżonego w Next.js 15. Automatyczna naprawa wymaga migracji do Next.js 16.3.4, dlatego świadomie nie wykonano ryzykownego `npm audit fix --force`. Wymagana jest kontrolowana migracja do Next.js 16 i pełna regresja.

## 3. Build produkcyjny

Polecenie: `npm run build`

Status końcowy: **PASS**, kod wyjścia `0`, Next.js `15.5.25`.

```text
✓ Compiled successfully in 4.8s
✓ Generating static pages (10/10)
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

## 4. First Load JS i analiza chunków

Pomiar: tabela wynikowa `npm run build`

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

Kontrola regresji objęła TypeScript, ESLint, testy jednostkowe i produkcyjny build. Automatyczny test wizualny nie był możliwy, ponieważ w sesji audytowej nie była dostępna sterowalna przeglądarka. Użytkownik wykonał następnie ręczny test `/oferta` i potwierdził poprawne działanie animacji po optymalizacji.

## 5. Higiena kodu i obsługa błędów

Przeszukano `app/`, `components/` i `lib/` pod kątem `console.log`, `console.warn`, `debugger`, `TODO:`, `FIXME:`, `temp` i mocków.

- Nie znaleziono artefaktów debugowania ani znaczników tymczasowych w kodzie produkcyjnym.
- `app/not-found.tsx` pokazuje spójny interfejs 404 i nie ujawnia danych technicznych.
- `app/error.tsx` ujawniał użytkownikowi `error.message`. Usunięto ten fragment; strona 500 pokazuje teraz wyłącznie bezpieczny, ogólny komunikat i akcje odzyskiwania.

## 6. Środowisko i repozytorium

- Lokalny Node.js: `v22.23.1` — zgodny z Next.js 15 i skryptem testowym.
- npm: `10.9.8`.
- CI po poprawce: Node.js `22`, zgodny z lokalną główną wersją runtime.
- Wersji Node.js ustawionej w panelu Vercel nie można potwierdzić na podstawie repozytorium — wymaga kontroli w panelu projektu.
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

Konfiguracja nadal wykonuje pełną sekwencję `npm ci` → `npm run check` → `npm run build`. `concurrency.cancel-in-progress` ma wartość `true`. Cache npm jest włączony przez `actions/setup-node` z `cache: npm`; API przebiegu potwierdza powodzenie kroku instalacji, lecz nie udostępnia jednoznacznej informacji, czy w tym konkretnym przebiegu wystąpił cache hit. Poprawkę sprawdzono lokalnie na Node.js 22, ale zielony status zdalny będzie możliwy dopiero po commit/push i ponownym uruchomieniu workflow.

## 8. Naprawione usterki

1. Dopasowano runtime CI do skryptu testowego i usunięto przyczynę kodu wyjścia 9.
2. Podniesiono wersje akcji GitHub do wariantów opartych na Node.js 24, usuwając ostrzeżenie o wycofanym runtime akcji.
3. Usunięto ujawnianie surowego `error.message` na stronie 500.
4. Usunięto podatne `nanoid@3.3.11` i podniesiono Next.js w obrębie wersji 15 do `15.5.25`.
5. Odroczono ładowanie `ScrollTrigger` bez zmiany parametrów animacji; First Load JS `/oferta` spadł o 17 kB.

## 9. Checklista akceptacyjna

- [x] `tsc --noEmit` kończy się kodem `0`.
- [x] `eslint .` kończy się kodem `0`.
- [x] Wszystkie istniejące testy przechodzą: 6/6.
- [ ] `npm audit --omit=dev` bez podatności `high`/`critical` — pozostała 1 `high` w zagnieżdżonym PostCSS.
- [x] `next build` kończy się kodem `0`.
- [x] Wszystkie 5 głównych tras oraz 404 są statyczne.
- [x] Brak wycieków sekretów w `NEXT_PUBLIC_`.
- [x] Brak niepożądanych wywołań `console.log` w kodzie produkcyjnym.
- [ ] Czyste drzewo Git — zmiany istniały przed audytem i doszły poprawki audytowe.
- [ ] Zielony pipeline na `main` — poprawka jest lokalna i nie została jeszcze uruchomiona zdalnie.
- [x] Wszystkie trasy poniżej 160 kB First Load JS — `/oferta` ma po optymalizacji 157 kB.
- [x] Ręczna regresja wizualna animacji `/oferta` po optymalizacji.

## Rekomendacja

**Nie zezwalać jeszcze na przejście do etapu 2.**

Blokery do zamknięcia:

1. Zaplanować i wykonać kontrolowaną migrację Next.js 15 → 16, następnie potwierdzić `npm audit --omit=dev` bez podatności `high`/`critical`.
2. Przejrzeć zmiany, wykonać commit/push i potwierdzić zielony przebieg CI na `main`.
3. Potwierdzić zgodną wersję Node.js w ustawieniach Vercel.
4. Uzgodnić, czy dokumentacja ma wymagać 6 obecnych testów, czy repozytorium powinno zostać uzupełnione do deklarowanych 11 testów.
