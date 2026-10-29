BRICKSTORE — podłączenie do MySQL/MariaDB

WYMAGANIA
- XAMPP (Apache + PHP + MySQL/MariaDB)
- Zaimportowana baza skleplego.sql do bazy o nazwie skleplego

INSTALACJA
1. Skopiuj cały folder brickstore do katalogu htdocs, np. C:\xampp\htdocs\brickstore.
2. Uruchom w XAMPP moduły Apache oraz MySQL.
3. Otwórz phpMyAdmin, utwórz bazę skleplego (jeśli jej jeszcze nie ma) i zaimportuj swój plik skleplego.sql.
4. Otwórz api/db.php i ustaw $dbuser oraz $dbpass zgodnie z konfiguracją lokalnego MySQL. Domyślnie XAMPP często używa root i pustego hasła.
5. Zdjęcia są już dołączone w brickstore/images/. Nazwy odpowiadają kolumnie products.image. Baner to images/banergorny.png.
6. Wejdź na http://localhost/brickstore/ — nie otwieraj index.html bezpośrednio z dysku, ponieważ PHP API wymaga serwera.

CO JEST PODŁĄCZONE
- Lista produktów i kategorii pobierana z bazy.
- Wyszukiwarka i filtrowanie kategorii.
- Rejestracja i logowanie przez PHP sessions; hasła są zapisywane jako bezpieczne hashe.
- Ulubione zapisują się w tabeli favorites i są przypisane do zalogowanego użytkownika.
- Koszyk działa w localStorage przeglądarki (nie jest zapisywany do bazy).

UWAGA
Przycisk zamówienia został celowo pominięty w funkcjonalności: nie zapisuje zamówień. Aby uruchomić prawdziwe składanie zamówień, trzeba dodać formularz danych dostawy, walidację po stronie serwera, transakcję SQL i obsługę płatności. Nie zbieraj prawdziwych danych płatniczych przez zwykły formularz.

DIAGNOSTYKA: jeśli zdjęcie nie działa, sprawdź np. http://localhost/brickstore/images/hpdwa.png . Jeśli produkt nie pojawia się w ogóle, sprawdź http://localhost/brickstore/api/products.php oraz konfigurację api/db.php.
