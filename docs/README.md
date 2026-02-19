# Dokumentacja projektu

Ten folder przechowuje całą dokumentację techniczną i operacyjną projektu **Strona_002**.

## Struktura folderu

```
docs/
├── README.md              # Ten plik – przegląd dokumentacji
├── tech-spec.md           # Specyfikacja techniczna projektu (dokument główny)
├── sections-order.md      # Kolejność sekcji i wymagania funkcjonalne (FR)
├── non-functional-requirements.md # Wymagania niefunkcjonalne (NFR)
├── integrations.md        # Integracje zewnętrzne (API/serwisy)
├── open-questions.md      # Otwarte kwestie projektowe
├── design.md              # System designu (kolory, typografia, animacje)
├── decisions/             # Architecture Decision Records (ADR)
│   ├── 001-template-adr.md
│   └── 002-stack-technologiczny.md
```

## Kluczowe dokumenty

- [`tech-spec.md`](./tech-spec.md) — główna specyfikacja i kontekst projektu
- [`sections-order.md`](./sections-order.md) — docelowa kolejność sekcji i FR
- [`non-functional-requirements.md`](./non-functional-requirements.md) — cele jakościowe i ograniczenia
- [`integrations.md`](./integrations.md) — zewnętrzne API i media hosting
- [`open-questions.md`](./open-questions.md) — tematy do domknięcia przed wdrożeniem

## Jak używać

- Każdy nowy plik dokumentacji powinien być w formacie Markdown (`.md`)
- Nazwy plików pisz małymi literami z myślnikami zamiast spacji
- Decyzje architektoniczne zapisuj jako ADR w folderze `decisions/`
