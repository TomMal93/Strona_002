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
│   ├── sections/           # Sekcje strony (Hero, Services, About…)
│   ├── ui/                 # Komponenty wielokrotnego użytku
│   └── layout/             # Header, Footer, Navigation
├── lib/                    # Helpery, konfiguracja
├── public/                 # Zasoby statyczne
└── docs/                   # Dokumentacja projektu
```

---

## 5. Wymagania funkcjonalne — sekcje strony

Strona składa się z 7 sekcji w następującej kolejności:

### 5.1 Hero
- **FR-01:** Full-screen wideo (autoplay, mute, loop) lub pokaz slajdów jako tło
- **FR-02:** Overlay z grain texture (efekt filmowy)
- **FR-03:** Animowane hasło i podtytuł (GSAP text reveal)
- **FR-04:** Przycisk CTA prowadzący do sekcji Kontakt

### 5.2 Usługi
- **FR-05:** Karty usług z ikoną, tytułem i krótkim opisem
- **FR-06:** Kategorie: Eventy militarne/survival, Wesela, Sesje rodzinne, Drony, Off-road/Jeepe
- **FR-07:** Animacja kart przy wejściu w widok (scroll-triggered)

### 5.3 O mnie
- **FR-08:** Zdjęcie fotografa (w terenie / militarny klimat)
- **FR-09:** Krótka historia i filozofia pracy
- **FR-10:** Wyróżniki (liczby, doświadczenie)

### 5.4 Portfolio / Galeria
- **FR-11:** Siatka zdjęć (masonry lub równy grid)
- **FR-12:** Filtrowanie po kategorii (Eventy / Wesela / Sesje / Drony)
- **FR-13:** Lightbox po kliknięciu w zdjęcie
- **FR-14:** Animacja filtrowania (płynne przetasowanie)

### 5.5 Instagram Feed
- **FR-15:** Wyświetlanie ostatnich postów z Instagrama (live feed)
- **FR-16:** Kliknięcie otwiera post na Instagramie
- **FR-17:** Siatka 3×2 lub 4×2 miniatur

### 5.6 Pokaz wideo
- **FR-18:** Full-width embed z YouTube lub Vimeo
- **FR-19:** Lazy-load odtwarzacza (performance)
- **FR-20:** Możliwość dodania wielu filmów (demo reel, highlight)

### 5.7 Kontakt
- **FR-21:** Linki do social media (Instagram, Facebook, YouTube)
- **FR-22:** Numer telefonu i e-mail bezpośredni

---

## 6. Wymagania niefunkcjonalne

| Kategoria      | Wymaganie                                              |
|----------------|--------------------------------------------------------|
| Wydajność      | Lighthouse Performance Score ≥ 90                      |
| Dostępność     | Lighthouse Accessibility Score ≥ 85                    |
| SEO            | Lighthouse SEO Score ≥ 90                              |
| Obrazy         | Automatyczna konwersja do WebP, lazy-loading           |
| Responsywność  | Pełna responsywność: mobile, tablet, desktop           |
| Animacje       | Redukcja animacji przy `prefers-reduced-motion`        |
| Bezpieczeństwo | HTTPS                                                  |

---

## 7. Interfejsy zewnętrzne

| Serwis / API         | Cel użycia                        |
|----------------------|-----------------------------------|
| Instagram Basic API  | Live feed z ostatnich postów      |
| YouTube / Vimeo      | Embed filmów w sekcji Pokaz wideo |
| Cloudinary / Vercel  | Hosting i CDN dla mediów          |

---

## 8. Środowiska

| Środowisko  | URL                    | Gałąź git                               |
|-------------|------------------------|-----------------------------------------|
| Development | localhost:3000         | `claude/event-photography-portfolio-*`  |
| Production  | TBD (Vercel)           | `main`                                  |

---

## 9. Otwarte kwestie

| ID  | Kwestia                                        | Priorytet |
|-----|------------------------------------------------|-----------|
| Q-1 | Wybór między Cloudinary a Vercel Blob          | Średni    |
| Q-2 | Instagram API — token dostępu (wymaga konta)   | Wysoki    |
| Q-3 | Docelowa domena i hosting e-mail               | Średni    |
| Q-4 | Treści (zdjęcia, opisy, filmy) dostarczone przez klienta | Wysoki |
