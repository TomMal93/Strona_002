# Polecenie Wykonawcze: Etap 1 — Fundamenty Techniczne i Build

> **Instrukcja dla AI / Inżyniera QA:**  
> Wykonaj poniższe polecenie w całości. Zbadaj stan projektu, uruchom komendy testowe, zweryfikuj kod źródłowy, usuń ewentualne usterki i przedstaw sformalizowany raport z wykonania.

---

## 1. Kontekst i Cel Etapu

Projekt **Strona_002** to nowoczesne portfolio fotograficzno-wideo oparte o **Next.js 15 (App Router)**, **React 18**, **TypeScript** oraz **Tailwind CSS**.

Celem **Etapu 1** jest upewnienie się, że kod źródłowy jest w 100% spójny, bezpieczny, typowany bez błędów, przechodzi wszystkie testy regresji i buduje się do zoptymalizowanego stanu produkcyjnego bez ostrzeżeń krytycznych.

---

## 2. Zadania i Komendy do Uruchomienia

### Krok 1: Weryfikacja statyczna (Typecheck, Linter, Testy)
Uruchom pełny zestaw testów projektu:
```powershell
cmd /c "npm run check"
```
*Weryfikacja:*
- `npm run typecheck` (`tsc --noEmit`): Brak jakichkolwiek błędów typowania TypeScript.
- `npm run lint` (`eslint .`): Brak błędów i ostrzeżeń reguł ESLint (w tym `eslint-plugin-jsx-a11y` oraz `eslint-plugin-tailwindcss`).
- `npm run test` (`node --experimental-strip-types --test tests/**/*.test.ts`): Wszystkie 11 testów jednostkowych musi zakończyć się statusem `pass` (layouty, variants, site-content, social platforms, structured-data, design tokens).

*Uwaga techniczna:* Zwróć uwagę na ostrzeżenie `MODULE_TYPELESS_PACKAGE_JSON` w logach testów. Sprawdź, czy dodanie `"type": "module"` w `package.json` jest bezpieczne dla skryptów CommonJS/MJS i ewentualnie zaproponuj lub wdroż poprawkę.

### Krok 1b: Audyt bezpieczeństwa zależności (npm audit)
Sprawdź, czy produkcyjne pakiety nie zawierają znanych luk bezpieczeństwa (CVE):
```powershell
cmd /c "npm audit --omit=dev"
```
*Weryfikacja:*
- Brak podatności o poziomie `critical` lub `high` w zależnościach produkcyjnych.
- W razie wykrycia podatności: przeanalizuj możliwość wykonania `npm audit fix` lub zaktualizuj podatne pakiety w `package.json`.

### Krok 2: Produkcyjny build aplikacji
Uruchom kompilację produkcyjną Next.js:
```powershell
cmd /c "npm run build"
```
*Weryfikacja wyników buildu:*
- Wszystkie trasy aplikacji muszą wygenerować się poprawnie jako statyczne (`○ Static`) lub dynamiczne zgodnie z założeniami:
  - `/` (Strona główna)
  - `/contact` (Kontakt)
  - `/o-mnie` (O mnie)
  - `/oferta` (Oferta i pakiety)
  - `/polityka-prywatnosci` (Polityka prywatności)
  - `/_not-found` (Obsługa błędu 404)
- Brak ostrzeżeń dotyczących niedozwolonych bibliotek po stronie serwera lub błędów prerenderowania.

### Krok 3: Analiza wielkości chunków (Bundle Analysis)
Uruchom skrypt analityczny:
```powershell
cmd /c "npm run perf:bundle"
```
*Weryfikacja:*
- Sprawdź rozmiar `First Load JS` dla każdej trasy (budżet bazowy: < 160 kB).
- Zidentyfikuj największe chunki kodu klienckiego i upewnij się, że nie ma duplikacji bibliotek.

### Krok 4: Higiena kodu i wyszukiwanie artefaktów deweloperskich
Przeszukaj pliki w katalogach `app/`, `components/`, `lib/`:
- Wyszukaj pozostałości po debugowaniu: `console.log`, `console.warn`, `debugger`.
- Wyszukaj znaczniki tymczasowe: `TODO:`, `FIXME:`, `temp`, mocki danych.
- Sprawdź obsługę błędów w `app/error.tsx` oraz `app/not-found.tsx` — czy prezentują spójny wygląd i nie wyrzucają surowych stack trace'ów użytkownikowi.

### Krok 5: Bezpieczeństwo, środowisko i czystość repozytorium Git
1. **Zmienne środowiskowe:**
   - Sprawdź plik `.env.example` oraz pliki `.env*`.
   - Upewnij się, że żadne prywatne tokeny/klucze API nie są poprzedzone prefiksem `NEXT_PUBLIC_` (co ujawniłoby je w przeglądarce).
   - Upewnij się, że pliki `.env.local` i `.env.production` znajdują się w `.gitignore`.
2. **Wersja środowiska Node.js:**
   - Sprawdź wersję lokalnego Node.js (`node -v`). Next.js 15 wymaga Node.js $\ge 18.18$ (rekomendowany LTS Node 20+).
   - Upewnij się, że w panelu Vercel (lub środowisku serwerowym) wybrana jest wersja zgodna z lokalną (Node 20.x).
3. **Czystość drzewa roboczego Git:**
   - Wykonaj `git status` — upewnij się, że nie ma nieśledzonych śmieci (untracked files), tymczasowych zrzutów ani niezatwierdzonych zmian, które mogłyby zafałszować build produkcyjny.

### Krok 6: Weryfikacja pipeline CI/CD (GitHub Actions)
Projekt posiada zautomatyzowany pipeline jakości w `.github/workflows/ci.yml`:
1. **Status pipeline na gałęzi `main`:**
   - Sprawdź, czy ostatni przebieg workflow `CI` zakończył się powodzeniem (zielony status).
   - Upewnij się, że pipeline wykonuje pełną sekwencję: `npm ci` → `npm run check` → `npm run build`.
2. **Mechanizm współbieżności:**
   - Sprawdź, czy konfiguracja `concurrency` poprawnie anuluje wiszące buildy przy nowym commicie w PR (`cancel-in-progress: true`).
3. **Cache zależności:**
   - Upewnij się, że cache npm (`actions/cache`) działa prawidłowo i skraca czas instalacji zależności.

---

## 3. Checklista Akceptacyjna (Kryteria Pass/Fail)

- [ ] `tsc --noEmit` kończy się kodem `0` (brak błędów typów).
- [ ] `eslint .` kończy się kodem `0` (brak naruszeń standardów kodowania).
- [ ] `npm run test` zalicza 100% testów w katalogu `tests/`.
- [ ] `npm audit --omit=dev` nie wykazuje krytycznych podatności bezpieczeństwa.
- [ ] `next build` kompiluje się do katalogu `.next` bez błędów.
- [ ] Wszystkie 5 głównych tras jest wyrenderowanych statycznie.
- [ ] Brak wycieków sekretów w zmiennych `NEXT_PUBLIC_`.
- [ ] Brak niepożądanych wywołań `console.log` w kodzie produkcyjnym.
- [ ] Wersja środowiska Node.js jest zgodna z wymaganiami Next.js 15 ($\ge$ 18.18, zalecana Node 20+), a drzewo Git jest czyste (`git status`).
- [ ] Pipeline CI/CD (GitHub Actions) przechodzi pomyślnie na gałęzi `main`.

---

## 4. Oczekiwany Raport Końcowy

Po wykonaniu weryfikacji przygotuj zwięzły raport w formacie Markdown i zapisz go jako `docs/audits/aud_XXX_weryfikacja-etap-1.md`. Raport powinien zawierać:
1. Status wykonania komend (z wycinkami logów potwierdzającymi powodzenie, w tym `npm audit`).
2. Wykrytą wersję Node.js i stan drzewa roboczego Git.
3. Wykaz naprawionych usterek (jeśli jakiekolwiek znaleziono).
4. Podsumowanie rozmiaru First Load JS dla poszczególnych podstron.
5. Status pipeline CI/CD (ostatni przebieg, czas wykonania).
6. Rekomendację: **Zezwolenie na przejście do Etapu 2** LUB **Lista blokerów do natychmiastowej poprawy**.
