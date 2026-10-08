# Qmala: wdrożenie i obsługa strony

## Jak to działa
- Treść strony leży w plikach w repozytorium GitHub. Panel `qmala.pl/admin` zapisuje zmiany do tych plików.
- Po każdym zapisie hosting (Netlify) sam buduje stronę na nowo. Zmiana jest widoczna po około minucie.
- Koszt: 0 zł miesięcznie. Nie ma bazy danych, wtyczek ani aktualizacji.

## Wdrożenie (jednorazowo, robi Fabian)
1. **GitHub**: załóż prywatne repozytorium, np. `qmala-website`, i wgraj do niego zawartość tej paczki.
2. **Stare zdjęcia (krytyczne)**: skopiuj przez FTP katalog `/images` ze starego serwera do `src/images/` w repozytorium. Strona ładuje 89 zdjęć realizacji i 7 skanów referencji z `https://qmala.pl/images/`. Bez tego kroku znikną w chwili przepięcia domeny.
3. **Netlify**: „Add new site → Import from Git”, wskaż repozytorium. Ustawienia budowania są w `netlify.toml`, niczego nie trzeba wpisywać.
4. **Panel**: w `src/admin/config.yml` jest już wpisane repozytorium `FabianAdrianW/Qmala-website`. Po zmianie nazwy repozytorium trzeba ją tam poprawić.
5. **Logowanie do panelu**:
   - GitHub → Settings → Developer settings → OAuth Apps → New. Callback URL: `https://api.netlify.com/auth/done`.
   - Netlify → ustawienia strony → Access & security → OAuth → Install provider → GitHub, wklej Client ID i Secret.
   - Właściciel zakłada darmowe konto GitHub, a Ty dodajesz go do repozytorium jako współpracownika (Settings → Collaborators).
6. **Test na adresie tymczasowym** (`nazwa.netlify.app`): zaloguj się w `/admin`, dodaj realizację testową ze zdjęciem z telefonu, włącz i wyłącz „Zatrudniamy”, usuń test.
7. **Domena**: w Netlify dodaj `qmala.pl`, a u rejestratora domeny ustaw rekordy A/CNAME, które pokaże Netlify. Rekordów MX nie ruszaj, wtedy poczta `@qmala.pl` działa bez zmian. Certyfikat HTTPS Netlify wystawia sam.

### Czego nie udało się sprawdzić przed wdrożeniem
Panel można przetestować dopiero na działającym hostingu, więc punkt 6 jest obowiązkowy. Do potwierdzenia w teście:
- logowanie przez GitHub w podanej wyżej konfiguracji,
- czy panel ma polskie przyciski (nazwy sekcji i pól są po polsku na pewno, bo pochodzą z `config.yml`),
- dodawanie wielu zdjęć naraz w polu „Zdjęcia”.

Plan B, gdyby logowanie przez GitHub było dla właściciela za trudne: w `src/admin/index.html` podmienić skrypt na Decap CMS i włączyć Netlify Identity (logowanie e-mailem i hasłem). Plik `config.yml` jest z nim zgodny, zmienia się tylko sekcja `backend`.

## Instrukcja dla właściciela
Wejdź na `qmala.pl/admin` i zaloguj się. Po lewej są trzy pozycje.

**Realizacje: dodanie nowej**
1. Kliknij „Realizacje”, potem przycisk dodawania nowej.
2. Wpisz nazwę obiektu, rok i jedno zdanie opisu.
3. W polu „Zdjęcia” dodaj zdjęcia, mogą być prosto z telefonu. Strona sama je zmniejszy.
4. Zapisz i opublikuj. Po minucie realizacja jest na górze podstrony „Realizacje” i na liście na stronie głównej.

**Zatrudniamy: włączenie zakładki**
1. Kliknij „Zatrudniamy”.
2. Dodaj ogłoszenie (stanowisko, miejsce, opis, punkty) albo zostaw listę pustą. Wtedy pokaże się ogólne zaproszenie do wysłania CV.
3. Włącz przełącznik „Pokaż zakładkę” i zapisz. Zakładka pojawia się w menu i w stopce.
4. Nabór zakończony? Wyłącz przełącznik. Ogłoszenia zostają zapisane na następny raz.

**Dane firmy**
Telefony, e-maile, adresy, NIP oraz linki do Facebooka i Instagrama. Zmiana numeru w jednym polu zmienia go na wszystkich przyciskach.

## Dla dewelopera
- `npm install`, `npm start` (podgląd lokalny), `npm run build` (wynik w `_site/`).
- Szablony: `src/*.njk`, wspólny nagłówek i stopka: `src/_includes/base.njk`, style: `src/assets/style.css` (źródło prawdy: `DESIGN.md`).
- Dane: `src/_data/site.json`, `src/_data/praca.json`, realizacje: `src/realizacje/*.md`.
- Oferta, referencje i teksty „O firmie” są w szablonach, celowo poza panelem. Da się je dodać do `config.yml`, jeśli właściciel będzie chciał je zmieniać.
