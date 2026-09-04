# Etapowa Weryfikacja Przedwdrożeniowa — Strona_002

Ten folder zawiera zestaw **5 kompleksowych, gotowych do wykonania poleceń (promptów weryfikacyjnych)** dla każdego etapu audytu strony przed jej produkcyjnym wdrożeniem i oddaniem do klienta.

Każdy plik został sformatowany jako kompletna instrukcja wykonawcza, którą można:
1. Uruchomić samodzielnie jako checklistę inżynierską.
2. Wkleić jako polecenie dla asystenta AI (np. w nowej sesji), aby autonomicznie przeprowadził audyt danego etapu, naprawił znalezione błędy i wygenerował raport.

---

## Przegląd etapów i plików

| Plik | Zakres weryfikacji | Kluczowe narzędzia i pliki |
|---|---|---|
| [`etap-1-fundamenty-techniczne-i-build.md`](./etap-1-fundamenty-techniczne-i-build.md) | Kompilacja, typowanie, linting, testy jednostkowe, audyt bezpieczeństwa pakietów (`npm audit`), czystość repozytorium Git, konfiguracja środowiska | `npm run check`, `npm run build`, `npm audit`, `package.json`, `.env.example` |
| [`etap-2-warstwa-wizualna-rwd-i-animacje.md`](./etap-2-warstwa-wizualna-rwd-i-animacje.md) | Responsywność (360px–4K, mobile landscape), brak overflow-x, iOS Safari, płynność GSAP i Lenis, `prefers-reduced-motion`, Force Dark Mode, zoom tekstu 200%, cross-browser (Firefox/Edge/Samsung Internet), dostępność WCAG AA | DevTools, urządzenia fizyczne, `components/layout/Navbar.tsx`, `globals.css`, axe DevTools / WAVE |
| [`etap-3-multimedia-interakcje-i-formularze.md`](./etap-3-multimedia-interakcje-i-formularze.md) | Kompresja wideo (w tym `contact.mp4` i `/o-mnie`), optymalizacja obrazów, bezpośrednie kanały kontaktu (`tel:`, `mailto:`, WhatsApp) oraz ewentualny formularz, fallbacki wideo, linki CTA | `public/videos/`, `public/images/`, `app/contact/`, testy dostarczalności |
| [`etap-4-wydajnosc-seo-analityka-i-prawne.md`](./etap-4-wydajnosc-seo-analityka-i-prawne.md) | Core Web Vitals, Lighthouse >= 90, meta tagi, Open Graph debuggery, favicony i `theme-color`, nagłówek HSTS i security headers, `robots.ts`, `sitemap.ts`, polityka prywatności | `npm run perf:report`, Lighthouse, Rich Results Test, SecurityHeaders.com, GA4/Vercel Analytics |
| [`etap-5-odbior-z-klientem-i-wdrozenie.md`](./etap-5-odbior-z-klientem-i-wdrozenie.md) | Akceptacja treści przez klienta, mapa przekierowań 301 ze starej strony, limity transferu Vercel, konfiguracja DNS/SSL, wdrożenie Vercel, real-time analityka, handover i gwarancja | Staging Vercel, Google Search Console, protokół zdawczo-odbiorczy |


---

## Jak korzystać z instrukcji

1. **Kolejność:** Nie przechodź do kolejnego etapu, dopóki poprzedni nie zakończy się wynikiem pozytywnym (lub uzgodnionym kompromisem).
2. **Użycie z AI:** Wklej treść wybranego pliku jako prompt do asystenta. Polecenia zawierają sekcje z dokładnym kontekstem technicznym projektu, krokami do wykonania i oczekiwanym formatem raportu.
3. **Dokumentowanie wyników:** Raporty z wykonania etapów zapisuj w folderze `docs/audits/` z prefiksem daty (np. `aud_009_etap-1_YYYY-MM-DD.md`).
