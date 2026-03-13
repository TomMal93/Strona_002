# Sekcja „O mnie” — plan wyglądu

> Dokument roboczy sekcji „O mnie” (Kim jestem), przygotowany na bazie `docs/branding.md` i `docs/design.md`.

## 1. Cel sekcji

- Pokazać twarz marki i szybko zbudować zaufanie po Hero.
- Połączyć dwa filary marki: dynamikę akcji (Odkrywca) oraz uważność na ludzi (Opiekun).
- Odpowiedzieć na pytanie klienta: „Czy ta osoba zrozumie klimat mojego wydarzenia i dowiezie rezultat?”.

## 2. Miejsce w strukturze strony

- Sekcja nr 2: bezpośrednio po Hero (`docs/sections-order.md`, FR-05, FR-06, FR-07).
- Funkcja: przejście z obietnicy marki do konkretu przed sekcją korzyści/oferty.

## 3. Założenia narracyjne i copy

- Ton: konkretny, prosty, obrazowy, bez patosu.
- Każde zdanie ma odpowiadać na „co z tego ma klient?”.
- Maksymalnie 2–3 krótkie zdania leadu + 3 wyróżniki.
- Przykładowa oś komunikatu:
  - „Pracuję w ruchu i pod presją czasu.”
  - „Łapię emocje bez ustawiania ludzi.”
  - „Dostarczam materiał, który oddaje atmosferę wydarzenia.”

## 4. Layout i kompozycja

### Desktop (md+)

- Siatka 12 kolumn, podział `5/7`.
- Lewa kolumna (5): zdjęcie autora + subtelne halo.
- Prawa kolumna (7): eyebrow, nagłówek, lead, lista wyróżników, mini CTA.
- Odstępy sekcji: `py-20 md:py-28`.
- Kontener: `max-w-content`.

### Mobile (< md)

- Jedna kolumna, kolejność:
  1. eyebrow,
  2. nagłówek,
  3. zdjęcie,
  4. lead,
  5. lista 3 wyróżników,
  6. CTA.
- Rytm odstępów: `gap-6` lub `gap-8`.

## 5. Kolor i tło

- Tło sekcji: `.section-dark-bg` (ciągłość po Hero).
- Akcent: tylko `khaki` (`--c-gold`), pomocniczo `military-green`.
- Separator pod nagłówkiem: delikatny gradient `from-khaki/70 to-transparent`.
- Bez nowych kolorów akcentowych.

## 6. Typografia

- Eyebrow: Inter `.ui-overline`, np. `POZNAJMY SIĘ`.
- Nagłówek: Bebas Neue uppercase, 1 jasna obietnica.
- Lead i opis: Inter (`text-warm-gray` / `text-warm-white`).
- Wyróżniki: krótkie, konkretne, najlepiej mierzalne.

## 7. Elementy sekcji

- **Blok bio:** kim jestem + jak pracuję.
- **3 wyróżniki:** doświadczenie, niezawodność, styl reportażu / efekt końcowy.
- **Mini CTA:**
  - primary: `Zobacz ofertę`,
  - opcjonalnie ghost: `Zobacz realizacje`.

## 8. Obraz (foto autora)

- Jedno zdjęcie portretowe lub „w akcji” (autentyczne, bez studyjnej sztuczności).
- Kadr: półpostać albo kontekst pracy reportażowej.
- Obróbka: spójna z estetyką serwisu (kontrast, lekka faktura filmowa, bez ciężkich filtrów).

## 9. Ruch i interakcje

- Wejście sekcji: `autoAlpha 0→1`, `y 20→0`, `0.7s`, easing `power3.out`.
- Wyróżniki: `stagger: 0.12`.
- CTA hover: systemowe underline `scaleX`.
- `prefers-reduced-motion`: animacje wejścia wyłączone.

## 10. Dostępność

- Semantyka: `<section id="about" aria-label="O mnie">`.
- Hierarchia: `h2` + lista wyróżników jako `ul/li`.
- Alt zdjęcia: opis kontekstowy (co się dzieje, gdzie, kto).
- Kontrast tekstu: minimum WCAG AA.

## 11. Kryteria akceptacji

- W 5 sekund użytkownik rozumie: kim jesteś, jak pracujesz, co dostaje.
- Sekcja domyka narrację po Hero i prowadzi do oferty.
- CTA jest wyraźnie widoczne na desktop i mobile.
- Sekcja pozostaje spójna z kierunkiem `Tactical Elegance`.

## 12. Mapa danych `siteContent.about` -> UI

Źródło danych: `lib/site-content.ts` (`siteContent.about`).

- `siteContent.about.title` -> nagłówek sekcji (`h2`).
- `siteContent.about.lead` -> lead (pierwszy blok copy pod nagłówkiem).
- `siteContent.about.description` -> opis uzupełniający pod leadem.
- `siteContent.about.highlights[0..2].title` -> tytuły wyróżników (lista `ul/li`).
- `siteContent.about.highlights[0..2].description` -> opisy wyróżników.
- `siteContent.about.ctaLabel` -> etykieta mini CTA.
- `siteContent.about.imageAlt` -> `alt` dla zdjęcia autora.

Uwagi implementacyjne:
- Utrzymać dokładnie 3 wyróżniki w UI (zgodnie z założeniem sekcji).
- Przy braku któregoś pola z ENV używać fallbacków z `lib/site-content.ts`.
