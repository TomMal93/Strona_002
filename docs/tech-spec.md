# Specyfikacja techniczna – Portfolio Fotograficzno-Wideo

## 1. Przegląd projektu

**Nazwa projektu:** Strona_002
**Wersja:** 0.1.0
**Status:** W trakcie planowania
**Język:** Polski (PL)

Strona portfolio dla fotografa i operatora wideo specjalizującego się w eventach militarnych, survivalowych, nagraniach z drona, off-roadzie (jeepe), weselach oraz sesjach rodzinnych. Strona ma być dynamiczna, nowoczesna i pełna animacji — budująca wizerunek profesjonalisty z unikalną niszą.

---

## 2. Cele i zakres

### Cele
- [ ] Prezentacja portfolio w formie wizualnej galerii z filtrowaniem
- [ ] Pokazanie zakresu usług i specjalizacji fotografa
- [ ] Budowanie zaufania przez oprawę wizualną i spójny branding
- [ ] Udostępnienie danych kontaktowych i linków do social media
- [ ] Integracja z mediami społecznościowymi (Instagram)

### Poza zakresem
- Panel administracyjny / CMS (nie planowany w v1)
- Wielojęzyczność (strona wyłącznie w języku polskim)
- Sklep / e-commerce
- Rezerwacja terminu online
- System komentarzy / blog

---

## 3. Stack technologiczny

| Warstwa        | Technologia            | Uzasadnienie                                              |
|----------------|------------------------|-----------------------------------------------------------|
| Framework      | Next.js 14+ (App Router) | SSG/SSR, optymalizacja obrazów, SEO, TypeScript natywnie |
| Język          | TypeScript             | Bezpieczeństwo typów, lepsza maintainability              |
| Styling        | Tailwind CSS           | Szybkie budowanie UI, pełna kontrola nad wyglądem         |
| Animacje       | GSAP + ScrollTrigger   | Industry standard, animacje scroll-based i timelines      |
| Smooth scroll  | Lenis                  | Premium efekt przewijania (jak Apple.com)                 |
| Media hosting  | Cloudinary / Vercel Blob | CDN, automatyczna optymalizacja zdjęć i wideo            |
| Deploy         | Vercel                 | Natywna integracja z Next.js, darmowy plan na start       |

---

## 4. Architektura systemu

```
Strona_002/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout (font, meta, Lenis)
│   ├── page.tsx            # Strona główna (wszystkie sekcje)
│   └── api/
│       └── contact/        # Sekcja kontaktowa (dane, social media)
├── components/
│   ├── sections/           # Sekcje strony (Hero, About, Benefits, Services…)
│   ├── ui/                 # Komponenty wielokrotnego użytku
│   └── layout/             # Header, Footer, Navigation
├── lib/                    # Helpery, konfiguracja
├── public/                 # Zasoby statyczne
└── docs/                   # Dokumentacja projektu
```

---

## 5. Wymagania funkcjonalne — sekcje strony

Szczegółowa kolejność sekcji oraz lista FR-01 ... FR-27:

- [`docs/sections-order.md`](./sections-order.md)

---

## 6. Wymagania niefunkcjonalne

Szczegółowa lista NFR:

- [`docs/non-functional-requirements.md`](./non-functional-requirements.md)

---

## 7. Interfejsy zewnętrzne

Szczegóły integracji:

- [`docs/integrations.md`](./integrations.md)

---

## 8. Środowiska

| Środowisko  | URL                    | Gałąź git                               |
|-------------|------------------------|-----------------------------------------|
| Development | localhost:3000         | `claude/event-photography-portfolio-*`  |
| Production  | TBD (Vercel)           | `main`                                  |

---

## 9. Otwarte kwestie

Lista pytań do domknięcia:

- [`docs/open-questions.md`](./open-questions.md)
