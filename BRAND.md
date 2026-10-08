# QMALA.PL — identyfikacja marki, wersja 2

Wyprowadzona z logo dostarczonego przez firmę (plik JPG 1376×768). Uzupełnia `DESIGN.md`: tam jest interfejs strony, tu marka.

## 1. Logo
- Pełne logo: znak Q + napis „MALA.PL” + podpis „ELEKTROINSTALACJE”. Q jest jednocześnie pierwszą literą nazwy.
- Znak (sygnet): samo Q na granatowym zaokrąglonym kwadracie. Używany tam, gdzie pełne logo się nie mieści: favicon, ikona na telefonie, navbar.
- Logo jest zaprojektowane na ciemne tło. Na jasne tło jest osobna wersja (`logo-light.png`), przygotowana z oryginału skryptem `tools/logo-light.py` (wycięcie po kształcie liter, bez poświaty): usunięte tło, podpis „Elektroinstalacje” w błękicie marki, „.PL” i srebrna krawędź Q przyciemnione, żeby nie znikały na bieli. Oryginału na jasnym tle nie kładziemy.

| Plik | Do czego |
|---|---|
| `src/assets/brand/logo-original.jpg` | oryginał od firmy, nie modyfikować |
| `src/assets/brand/logo-dark.png` | pełne logo, przezroczyste tło, tylko na granat (stopka, materiały ciemne) |
| `src/assets/brand/logo-light.png` | pełne logo na jasne tło (navbar, dokumenty, faktury) |
| `src/assets/brand/q-light.png`, `q-dark.png` | sam znak Q, przezroczyste tło (wąskie ekrany) |
| `src/assets/brand/icon-192.png`, `icon-512.png` | ikona strony na telefonie |
| `src/assets/favicon.ico`, `favicon-32.png`, `apple-touch-icon.png` | favicon |
| `src/assets/brand/og.jpg` | obraz przy linku wklejonym w Messengerze, na Facebooku itp. |

Zasady:
- Pole ochronne: wokół logo wolne miejsce o szerokości co najmniej połowy wysokości znaku Q.
- Minimalna szerokość pełnego logo: 180 px na ekranie. Poniżej używamy samego znaku.
- Nie rozciągać, nie obracać, nie zmieniać kolorów, nie dodawać cieni ani obrysów, nie kłaść na zdjęciach.
- W tekście nazwę piszemy „Qmala” (firma) albo „qmala.pl” (adres). Wersaliki „QMALA.PL” tylko w logo i w napisie obok znaku.

## 2. Kolory
| Nazwa | HEX | Skąd | Rola |
|---|---|---|---|
| Granat | #0B1626 | tło logo | ciemne powierzchnie, tekst na jasnym tle |
| Granat głęboki | #060F1D | krawędzie tła logo | kontakt, stopka |
| Błękit królewski | #2350C4 | litery „MALA” | kolor akcji na jasnym tle, linki |
| Cyjan | #2FE3F2 | „.PL”, segment znaku Q | kolor akcji na ciemnym tle, akcenty |
| Lodowy błękit | #93CFE2 | podpis „Elektroinstalacje” | rezerwa: drobne akcenty na granacie |
| Mgła | #F2F5F9 | dobrany do palety | tło strony |
| Biel | #FFFFFF | — | kafle, tekst na błękicie |
| Grafit | #55637A | dobrany do palety | tekst pomocniczy |

Proporcje na stronie: około 70% mgła i biel, 20% granat, 10% błękit i cyjan. Błękit i cyjan oznaczają akcję, więc nie używamy ich jako tła dużych powierzchni ani dekoracji.

Sprawdzone pary (kontrast tekstu co najmniej 4,5:1): granat na mgle, biel na błękicie, granat na cyjanie, biel i lodowy błękit na granacie. Zakazane: cyjan lub lodowy błękit jako tekst na jasnym tle.

## 3. Typografia
- Nagłówki: Bricolage Grotesque 700. Tekst: Geist 400/500/600.
- Napis w logo ma własny krój (geometryczny, szeroki grotesk). Nie odtwarzamy go w nagłówkach; logo zawsze wstawiamy jako obraz.

## 4. Kształt i styl
- Zaokrąglenia jak w znaku Q: kafle 24 px, przyciski w kształcie pigułki, znak w kwadracie o promieniu 11 px.
- Połysk, metaliczne krawędzie i gradient zostają wyłącznie w logo. Interfejs jest płaski, żeby logo było jedynym błyszczącym elementem.
- Ikony: liniowe, grubość 2 px, bez wypełnień.
- Zdjęcia: prawdziwe realizacje firmy, bez zdjęć stockowych.

## 5. Głos marki
- Rodzinny zakład z doświadczeniem od 1978 roku: mówimy konkretnie, po ludzku, w pierwszej osobie liczby mnogiej.
- Fakty zamiast przymiotników: rok, nazwa obiektu, nazwisko, list referencyjny.
- Unikamy: „najwyższa jakość”, „kompleksowe rozwiązania”, „firma godna zaufania”.

## 6. Do uzupełnienia
- Logo w wersji wektorowej (SVG, AI lub PDF) od autora. Obecne pliki są wycięte z JPG i przy dużych formatach (baner, samochód, odzież robocza) będą nieostre.
- Wersja logo na jasne tło od autora (obecna jest przeróbką z JPG) oraz wersja jednokolorowa (pieczątka, grawer, faktura), jeśli autor je przygotował.
- Dokładne wartości kolorów od autora logo. Podane wyżej są odczytane z pliku JPG i uśrednione, bo logo ma gradienty i połysk.
