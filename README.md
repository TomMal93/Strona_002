# Strona_002 — Portfolio Fotograficzno-Wideo

Strona portfolio dla fotografa i operatora wideo specjalizującego się w eventach militarnych, survivalowych, nagraniach z drona, off-roadzie, weselach i sesjach rodzinnych.

## Stack technologiczny

- **Framework:** Next.js 14+ (App Router, TypeScript)
- **Styling:** Tailwind CSS
- **Animacje:** GSAP + ScrollTrigger, Lenis
- **Deploy:** Vercel

## Sekcje strony

1. Hero
2. Kim jestem
3. Korzyści
4. Oferta
5. Portfolio / Galeria
6. Instagram Feed
7. Proces
8. Opinie
9. FAQ + mocne CTA

## Dokumentacja

Pełna dokumentacja projektu znajduje się w folderze [`docs/`](./docs/README.md):

- [`docs/tech-spec.md`](./docs/tech-spec.md) — specyfikacja techniczna
- [`docs/sections-order.md`](./docs/sections-order.md) — kolejność sekcji i wymagania funkcjonalne (FR)
- [`docs/non-functional-requirements.md`](./docs/non-functional-requirements.md) — wymagania niefunkcjonalne (NFR)
- [`docs/integrations.md`](./docs/integrations.md) — integracje zewnętrzne
- [`docs/open-questions.md`](./docs/open-questions.md) — otwarte kwestie
- [`docs/design.md`](./docs/design.md) — system designu
- [`docs/decisions/`](./docs/decisions/) — decyzje architektoniczne (ADR)

## Performance (pkt 6)

- `npm run perf:report` — build + raport największych chunków JS (gzip i raw)
- Web Vitals logują się w przeglądarce jako `[WebVitals]` (CLS, FCP, INP, LCP, TTFB)
- Reporter Web Vitals jest domyślnie wyłączony; włącz przez `NEXT_PUBLIC_ENABLE_WEB_VITALS=true`
- Opcjonalnie wyślij Web Vitals do endpointu przez `NEXT_PUBLIC_WEB_VITALS_ENDPOINT`
- Lighthouse: uruchom lokalnie po `npm run build && npm run start` i audytuj `http://localhost:3000`
