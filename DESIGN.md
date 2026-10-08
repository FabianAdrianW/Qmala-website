# Qmala — DESIGN.md (źródło prawdy UI), wersja 5

Jedyny obowiązujący opis stylu strony qmala.pl. Kod (`src/assets/style.css`, blok `:root`) musi się z nim zgadzać.
Kolejność ważności: słowa właściciela → ten plik → gust wykonawcy. Zmiana tokenu = zmiana tu i w `:root` jednocześnie.

Zmiany w wersji 5: strona generowana z szablonów (Eleventy), panel edycji `/admin`, nowa podstrona „O firmie”, ukrywana zakładka „Zatrudniamy”, „Firma” w menu prowadzi do podstrony.

## 1. Podmiot i cel
- Podmiot: Zakład Elektro-Instalacyjny Wojciech Kumala (Qmala), Wrocław, od 1978.
- Odbiorca: inwestor prywatny, kierownik budowy, zarządca obiektu. Śpieszy się, często na telefonie.
- Jedno zadanie strony: telefon pod 501 739 926 albo zapytanie o wycenę.
- Drugi odbiorca: właściciel firmy w panelu `/admin`. Nietechniczny, ma widzieć tylko to, co faktycznie zmienia.
- Koncept: jasna strona zbudowana z kafli. Hero i navbar używają tego samego języka co reszta (tło `--bg`, kafle, pigułki). Ciemne są tylko kafle wyróżnione oraz zamknięcie strony (kontakt, stopka). Przewód trójżyłowy zostaje wyłącznie jako znak w logo.

## 2. Kolor
| Token | Jasny | Ciemny | Rola |
|---|---|---|---|
| `--bg` | #F3F5F7 | #0D141D | tło sekcji dziennych |
| `--surface` | #FFFFFF | #141D29 | kafle, panele, sekcja Firma |
| `--ink` | #0C1320 | #F2F5F8 | tekst główny |
| `--ink-2` | #566170 | #9DA9B8 | tekst pomocniczy |
| `--line` | #DCE1E7 | #263347 | obramowania, linie |
| `--link` | #1F4FE0 | #8FB0FF | linki w tekście, focus |
| `--action` | #FFD21F | #FFD21F | WYŁĄCZNIE CTA (hover #FFE169, tekst #0C1320) |
| `--night` | #0A1019 | #070B12 | kontakt, stopka |
| `--night-2` | #131C29 | #131C29 | kafle nocne, formularz, panel z cytatem |
| `--night-line` | #263347 | #263347 | linie na nocy |
| `--night-ink` / `--night-ink-2` | #F2F5F8 / #9DA9B8 | bez zmian | tekst na nocy |
| `--lamp` | #37D067 | #37D067 | status, potwierdzenie |
Żyły przewodu (tylko znak): L #B0703F, N #3B7BFF, PE #FFD21F + #3DAA4A.

Zasady:
- Żółty = „kliknij i działaj”. Dekoracyjnie żółte są tylko: kropki osi czasu, rok na kaflu realizacji, kreska przy cytacie.
- Gradient tylko jako światło za kursorem na kaflu. Zero gradientów na tekście, tle i przyciskach.
- Kontrast tekstu min. 4,5:1.

## 3. Typografia
- Nagłówki: Bricolage Grotesque 700 (h3: 600), tracking −0,025em. Tekst: Geist 400/500/600. Fallback: Segoe UI, system-ui.
- Skala: 14 / 17 / 20 / 24 / 32–52 / 42–84 px (`--fs-0` … `--fs-5`). Nagłówek bloku na podstronie: 28–40 px. Innych rozmiarów nie dodajemy.
- Tekst ciągły max 36–44em, interlinia 1,55. Nagłówki 0,98–1,15, `text-wrap: balance`.
- Zwykła wielkość liter, cyfry tabelaryczne. Bez wersalików i bez wyróżniania jednego słowa w nagłówku.

## 4. Układ i odstępy
- Siatka 8 px: 8 / 16 / 24 / 32 / 48 / 72. Sekcja 64–128 px.
- Kontener 1200 px, margines boczny 16–40 px. Tekst do lewej.
- Promienie wg roli: kafel i panel 24, pole 14, przycisk i chip 999 (pigułka).
- Kolejność sekcji strony głównej: Hero → Oferta → Realizacje → Firma (zajawka z linkiem do „O firmie”) → Kontakt z wyceną (noc) → Stopka (noc).

## 5. Komponenty
- **Navbar**: jasna belka na całą szerokość, `position: fixed`, STAŁA wysokość 68 px, tło `--bg` z rozmyciem. Przy przewijaniu pojawia się tylko dolna linia. Nigdy `sticky` ze zmianą rozmiaru. Logo z podpisem po lewej, linki w białej pigułce, żółty „Zadzwoń 501 739 926”.
  - Pozycje: Oferta, Realizacje, Referencje, Firma, [Zatrudniamy], Kontakt. „Zatrudniamy” istnieje tylko przy włączonym przełączniku; zawsze przedostatnie, Kontakt zostaje ostatni.
  - Progi: ≤ 1180 px znika podpis logo i numer w przycisku, ≤ 1020 px linki zwijają się pod „Menu” (ta sama wartość w `site.js`).
  - Odrzucone: ciemna pływająca pigułka.
- **Przycisk główny**: żółty, pigułka, 54 px, z czasownikiem. **Ghost**: obrys, akcja druga. **Dark**: tylko na żółtym kaflu.
- **Hero**: jasne tło. Po lewej h1, lead, 2 CTA i linia z numerem do wycen. Po prawej stos trzech kafli w 3D: nocny „Zaufali nam”, biały „1978”, biały „Wrocław i cała Polska”. Na telefonie płaska siatka. Odrzucone: ciemny hero, przewód WebGL, rozdzielnica.
- **Kafel**: tło surface, obrys, r 24, ikona 52 px. Na hover pochylenie 3D do 9° i żółte światło za kursorem. Warianty: nocny, CTA (żółty).
- **Bento oferty**: siatka 12 kolumn: 7+5, 4+4+4, 8+4. Ostatni kafel to zawsze CTA. Usługi jako chipy.
- **Realizacje na stronie głównej**: 3 kafle nocne = trzy najnowsze realizacje z włączonym „Duży kafel” + lista dwukolumnowa pozostałych + pasek CTA. Generowane z danych.
- **Formularz wyceny**: 4 pola, jedno wymagane (telefon). Wysyła gotowy e-mail (mailto), bez serwera.
- **Dock (telefon)**: po przewinięciu 520 px pasek u dołu: „Zadzwoń” i „Wycena”.

## 5a. Podstrony
| Adres | Zawartość |
|---|---|
| `index.html` | hero, skrót oferty, wybrane realizacje, zajawka firmy, kontakt z formularzem |
| `oferta.html` | 6 paneli z listami usług + panel „Jak wyceniamy” |
| `realizacje.html` | wszystkie realizacje z galeriami, skok do roku, podgląd zdjęć |
| `referencje.html` | 7 listów referencyjnych (skan, firma, rok, zakres) |
| `o-firmie.html` | Kim jesteśmy, Dla kogo pracujemy, Czym się zajmujemy, Jak działamy, cytat z referencji, Dane firmy |
| `praca.html` | ogłoszenia + „Wyślij CV”. Powstaje tylko, gdy `praca.widoczna = true` |
| `admin/` | panel edycji (Sveltia CMS) |

Komponenty podstron:
- **Nagłówek podstrony**: h1 (38–64 px) + jedno zdanie, opcjonalnie rząd pigułek-kotwic. Bez hero i bez 3D.
- **Panel**: wygląd kafla (surface, obrys, r 24), bez pochylenia. Nagłówek: pigułka (rok, miejsce, „Krok n”) + h2/h3.
- **Nagłówek bloku** (`.about-head`): h2 28–40 px + jedno zdanie, odstęp 72 px od góry.
- **Trójka** (`.trio`): 3 panele obok siebie, na telefonie jeden pod drugim.
- **Kroki** (`.steps`): 4 panele z pigułką „Krok n”. Numeracja dozwolona tylko tu, bo to prawdziwa kolejność.
- **Cytat** (`.quote`): jedyny nocny panel na podstronie. Prawdziwy cytat z listu referencyjnego, źródło i rok, przycisk ghost do referencji.
- **Dane firmy** (`.data`): siatka etykieta/wartość, przy NIP przycisk „Kopiuj”.
- **Ogłoszenie** (`.job`): pigułka z miejscem, stanowisko, opis, dwie listy z haczykami, przycisk ghost „Aplikuj na to stanowisko”. Żółty jest tylko „Wyślij CV” w pasku na końcu.
- **Miniatura zdjęcia**: przycisk 4:3 (referencje 4:5), r 16, `object-fit: cover`, powiększenie 6% na hover.
- **Podgląd zdjęcia**: ciemna nakładka, podpis, „Poprzednie / Następne / Zamknij”, strzałki i Esc. `.lb[hidden] { display: none }` jest obowiązkowe.
- Każda podstrona kończy się paskiem CTA.

## 5b. Technika i panel
- Generator: Eleventy 3. Źródła w `src/`, wynik w `_site/`. Wspólny nagłówek, menu, stopka i dock: `src/_includes/base.njk`.
- Dane edytowane w panelu: `src/realizacje/*.md` (jedna realizacja = jeden plik), `src/_data/praca.json`, `src/_data/site.json`. Pola panelu: `src/admin/config.yml`.
- Panel ma trzy pozycje (prawo Hicka): Realizacje, Zatrudniamy, Dane firmy. Każde pole ma podpowiedź pisaną zwykłym językiem. Nie dodawać do panelu pól, których właściciel nie zmienia.
- Zdjęcia z panelu trafiają do `src/uploads/`; przy budowaniu powstaje miniatura 640 px i wersja 1600 px.
- Stare zdjęcia mają adresy `https://qmala.pl/images/...`. Pliki muszą leżeć w `src/images/` (kopiowane do `/images`). Bez nich galerie i referencje są puste.
- Telefony, e-maile, adresy i linki społecznościowe pochodzą z `site.json`. Pusty link do Facebooka lub Instagrama = element się nie renderuje.
- Wdrożenie i instrukcja dla właściciela: `WDROZENIE.md`.

## 6. CTA — każda sekcja kończy się akcją
| Miejsce | Akcja główna | Akcja druga |
|---|---|---|
| Navbar | Zadzwoń | — |
| Hero | Zadzwoń: 501 739 926 | Poproś o wycenę |
| Oferta | kafel „Nie widzisz swojego tematu? Zadzwoń” | — |
| Realizacje | Poproś o wycenę | Zobacz zdjęcia z realizacji |
| Firma (zajawka) | — | Poznaj firmę i sposób pracy |
| Kontakt | numer + Wyślij zapytanie | Kopiuj, Facebook, Instagram |
| Podstrony | Zadzwoń (pasek na końcu) | Poproś o wycenę |
| Zatrudniamy | Wyślij CV | Kopiuj adres, Aplikuj na to stanowisko |
| Telefon (dock) | Zadzwoń | Wycena |
Jedna żółta akcja w polu widzenia na raz (wyjątek: navbar).

## 7. Ruch i 3D
- 3D tylko w CSS: stos kafli w hero (głębia 0 / 90 / 160 px, podąża za kursorem) oraz pochylenie kafli na stronie głównej. Panele podstron się nie pochylają. Żadnych bibliotek 3D.
- Sekcje NIE wjeżdżają przy przewijaniu. Treść kompletna bez JS.
- `prefers-reduced-motion`: stos stoi w pozycji spoczynkowej, kafle się nie pochylają.

## 8. Psychologia poznawcza
| Zasada | Zastosowanie |
|---|---|
| Prawo Hicka | 5 pozycji menu (6 tylko w czasie naboru), 6 grup oferty, 1 żółta akcja na widok, 3 pozycje w panelu |
| Chunking | 20 usług w 6 grupach; „O firmie” w 5 blokach po 3–4 elementy |
| Prawo Fittsa | cele ≥ 44 px, dock pod kciukiem, telefon w navbarze |
| Rozpoznawanie zamiast przypominania | cała oferta widoczna; kotwice na górze „O firmie”; podpowiedzi przy polach panelu |
| Efekt von Restorffa | żółty tylko dla CTA; jeden nocny panel z cytatem |
| Pozycja w szeregu | menu: Oferta pierwsza, Kontakt ostatni |
| Prawo Jakoba | logo po lewej, menu u góry, kontakt na końcu, dane firmy w stopce i na „O firmie” |
| Dowód społeczny | znane instytucje w hero, nazwy klientów w „Dla kogo pracujemy”, cytat z referencji |
| Minimalny wysiłek | formularz: 4 pola, 1 wymagane; przełącznik zamiast usuwania ogłoszeń; zdjęcia prosto z telefonu |
| Próg Doherty'ego | reakcja interfejsu < 400 ms |
| Zapobieganie błędom | wyłączona zakładka nie zostawia martwej strony; pusty link się nie pokazuje |

## 9. Język
- „My” i „ty”, krótkie zdania, konkrety. Profesjonalnie, ale po ludzku: bez „firmy godnej zaufania”, „najwyższej jakości” i „kompleksowych rozwiązań”.
- Każde zdanie o firmie ma pokrycie w fakcie: rok, nazwa obiektu, nazwisko, list referencyjny.
- Przycisk nazywa skutek: „Zadzwoń”, „Poproś o wycenę”, „Wyślij zapytanie”, „Wyślij CV”, „Kopiuj”.

## 10. Zakazane
Navbar zmieniający wysokość; ciemny hero lub navbar przy jasnej reszcie; WebGL w hero; gradient fiolet→niebieski; tekst gradientowy; emoji jako ikony; etykiety wersalikami; numeracja 01/02/03 poza prawdziwą sekwencją; strzałka w przycisku; wjeżdżające sekcje; liczniki „500+”; zdjęcia stockowe; wymyślone opinie i ogłoszenia; więcej niż jedna żółta akcja w widoku; trzeci motyw 3D; treść przepisana ze stron innych firm.

## 11. Do uzupełnienia lub potwierdzenia przez firmę
- Adresy Facebook i Instagram (panel → Dane firmy). Do tego czasu linki są ukryte.
- Logo, jeśli istnieje (teraz znak-propozycja: przekrój przewodu).
- Realizacje po 2015 roku ze zdjęciami (panel → Realizacje).
- „O firmie”, do potwierdzenia: Wojciech Kumala prowadzi dziś firmę; wyceny nadal przygotowuje Mirosław Kumala; po robotach firma przekazuje dokumentację z pomiarów.
- „O firmie”, do dopisania, jeśli firma poda dane: rodzaj uprawnień (SEP, budowlane), liczba pracowników, ubezpieczenie OC, gwarancja.
- Formularz: docelowo wysyłka przez serwer zamiast mailto.
