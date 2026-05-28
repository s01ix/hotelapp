SET DEFINE OFF;

DELETE FROM pokoje;
DELETE FROM hotele;
DELETE FROM lokalizacje;

-- LOKALIZACJE
INSERT INTO lokalizacje (id, kraj, miasto, kod_pocztowy, ulica, nr_budynku) VALUES (1, 'Polska', 'Zakopane', '34-500', 'Krupowki', '12');
INSERT INTO lokalizacje (id, kraj, miasto, kod_pocztowy, ulica, nr_budynku) VALUES (2, 'Polska', 'Sopot', '81-700', 'Morska', '5');
INSERT INTO lokalizacje (id, kraj, miasto, kod_pocztowy, ulica, nr_budynku) VALUES (3, 'Polska', 'Warszawa', '00-123', 'Zlota', '44');
INSERT INTO lokalizacje (id, kraj, miasto, kod_pocztowy, ulica, nr_budynku) VALUES (4, 'Polska', 'Bialowieza', '17-230', 'Parkowa', '1');
INSERT INTO lokalizacje (id, kraj, miasto, kod_pocztowy, ulica, nr_budynku) VALUES (5, 'Polska', 'Mikolajki', '11-730', 'Jeziorna', '8');

-- HOTELE
INSERT INTO hotele (id, lokalizacja_id, nazwa, opis, gwiazdki, email, telefon) VALUES (1, 1, 'Gorski Resort & Spa', 'Ekskluzywny hotel u podnoza Tatr.', 5, 'kontakt@gorski.pl', '123456789');
INSERT INTO hotele (id, lokalizacja_id, nazwa, opis, gwiazdki, email, telefon) VALUES (2, 2, 'Morska Bryza', 'Elegancki hotel blisko plazy w Sopocie.', 4, 'recepcja@bryza.pl', '987654321');
INSERT INTO hotele (id, lokalizacja_id, nazwa, opis, gwiazdki, email, telefon) VALUES (3, 3, 'City Center Premium', 'Nowoczesny hotel w sercu stolicy.', 5, 'info@citycenter.pl', '555444333');
INSERT INTO hotele (id, lokalizacja_id, nazwa, opis, gwiazdki, email, telefon) VALUES (4, 4, 'Lesna Ostoja', 'Klimatyczny osrodek otoczony puszcza.', 3, 'rezerwacje@ostoja.pl', '111222333');
INSERT INTO hotele (id, lokalizacja_id, nazwa, opis, gwiazdki, email, telefon) VALUES (5, 5, 'Mazurski Raj', 'Luksusowy kompleks nad jeziorem.', 4, 'witaj@mazurskiraj.pl', '999888777');

-- POKOJE
INSERT INTO pokoje (hotel_id, nazwa, numer_pokoju, opis, max_osob, liczba_lozek, cena_bazowa, waluta, status, utworzono) VALUES (1, 'Apartament VIP', '101', 'Luksus z widokiem. Udogodnienia: Jacuzzi, Kominek, Minibar, Wi-Fi.', 4, 2, 1200.00, 'PLN', 'DOSTEPNY', CURRENT_TIMESTAMP);
INSERT INTO pokoje (hotel_id, nazwa, numer_pokoju, opis, max_osob, liczba_lozek, cena_bazowa, waluta, status, utworzono) VALUES (1, 'Pokoj Rodzinny Premium', '102', 'Przestronny pokoj dla rodziny. Udogodnienia: Klimatyzacja, TV, Balkon.', 4, 3, 650.00, 'PLN', 'DOSTEPNY', CURRENT_TIMESTAMP);
INSERT INTO pokoje (hotel_id, nazwa, numer_pokoju, opis, max_osob, liczba_lozek, cena_bazowa, waluta, status, utworzono) VALUES (1, 'Pokoj Dwuosobowy Standard', '103', 'Przytulne wnetrze. Udogodnienia: Wi-Fi, Prysznic, Sejf.', 2, 1, 350.00, 'PLN', 'DOSTEPNY', CURRENT_TIMESTAMP);
INSERT INTO pokoje (hotel_id, nazwa, numer_pokoju, opis, max_osob, liczba_lozek, cena_bazowa, waluta, status, utworzono) VALUES (1, 'Pokoj Dwuosobowy Twin', '104', 'Dwa osobne lozka. Udogodnienia: Wi-Fi, Suszarka, TV.', 2, 2, 350.00, 'PLN', 'DOSTEPNY', CURRENT_TIMESTAMP);
INSERT INTO pokoje (hotel_id, nazwa, numer_pokoju, opis, max_osob, liczba_lozek, cena_bazowa, waluta, status, utworzono) VALUES (1, 'Pokoj Jednoosobowy', '105', 'Kompaktowy pokoj. Udogodnienia: Wi-Fi, Zestaw do herbaty.', 1, 1, 250.00, 'PLN', 'DOSTEPNY', CURRENT_TIMESTAMP);
INSERT INTO pokoje (hotel_id, nazwa, numer_pokoju, opis, max_osob, liczba_lozek, cena_bazowa, waluta, status, utworzono) VALUES (2, 'Apartament z Widokiem', '201', 'Najlepsza panorama. Udogodnienia: Taras, Ekspres, Wi-Fi.', 3, 2, 550.00, 'PLN', 'DOSTEPNY', CURRENT_TIMESTAMP);
INSERT INTO pokoje (hotel_id, nazwa, numer_pokoju, opis, max_osob, liczba_lozek, cena_bazowa, waluta, status, utworzono) VALUES (2, 'Pokoj Rodzinny', '202', 'Dwie sypialnie. Udogodnienia: Aneks kuchenny, TV, Lodowka.', 5, 4, 750.00, 'PLN', 'DOSTEPNY', CURRENT_TIMESTAMP);
INSERT INTO pokoje (hotel_id, nazwa, numer_pokoju, opis, max_osob, liczba_lozek, cena_bazowa, waluta, status, utworzono) VALUES (2, 'Pokoj Dwuosobowy Standard', '203', 'Lozko malzenskie. Udogodnienia: Wi-Fi, Minibar.', 2, 1, 380.00, 'PLN', 'DOSTEPNY', CURRENT_TIMESTAMP);
INSERT INTO pokoje (hotel_id, nazwa, numer_pokoju, opis, max_osob, liczba_lozek, cena_bazowa, waluta, status, utworzono) VALUES (2, 'Pokoj Dwuosobowy Premium', '204', 'Wiekszy metraz. Udogodnienia: Balkon, Wi-Fi, Sejf, Suszarka.', 2, 1, 420.00, 'PLN', 'DOSTEPNY', CURRENT_TIMESTAMP);
INSERT INTO pokoje (hotel_id, nazwa, numer_pokoju, opis, max_osob, liczba_lozek, cena_bazowa, waluta, status, utworzono) VALUES (2, 'Pokoj Jednoosobowy', '205', 'Na delegacje. Udogodnienia: Biurko, Internet, TV.', 1, 1, 280.00, 'PLN', 'DOSTEPNY', CURRENT_TIMESTAMP);
INSERT INTO pokoje (hotel_id, nazwa, numer_pokoju, opis, max_osob, liczba_lozek, cena_bazowa, waluta, status, utworzono) VALUES (3, 'Apartament Prezydencki', '301', 'Najwyzszy standard. Udogodnienia: Smart Home, Konsola, Sauna.', 4, 2, 2500.00, 'PLN', 'DOSTEPNY', CURRENT_TIMESTAMP);
INSERT INTO pokoje (hotel_id, nazwa, numer_pokoju, opis, max_osob, liczba_lozek, cena_bazowa, waluta, status, utworzono) VALUES (3, 'Apartament Biznesowy', '302', 'Praca i relaks. Udogodnienia: Biurko, Ekspres, Wi-Fi.', 2, 1, 800.00, 'PLN', 'DOSTEPNY', CURRENT_TIMESTAMP);
INSERT INTO pokoje (hotel_id, nazwa, numer_pokoju, opis, max_osob, liczba_lozek, cena_bazowa, waluta, status, utworzono) VALUES (3, 'Pokoj Dwuosobowy Standard', '303', 'Krotkie pobyty. Udogodnienia: Klimatyzacja, TV, Sejf.', 2, 1, 500.00, 'PLN', 'DOSTEPNY', CURRENT_TIMESTAMP);
INSERT INTO pokoje (hotel_id, nazwa, numer_pokoju, opis, max_osob, liczba_lozek, cena_bazowa, waluta, status, utworzono) VALUES (3, 'Pokoj Dwuosobowy Twin', '304', 'Dla wspolpracownikow. Udogodnienia: 2 osobne lozka, Wi-Fi.', 2, 2, 500.00, 'PLN', 'DOSTEPNY', CURRENT_TIMESTAMP);
INSERT INTO pokoje (hotel_id, nazwa, numer_pokoju, opis, max_osob, liczba_lozek, cena_bazowa, waluta, status, utworzono) VALUES (3, 'Pokoj Jednoosobowy Standard', '305', 'Male wnetrze. Udogodnienia: Klimatyzacja, Podstawowe Wi-Fi.', 1, 1, 350.00, 'PLN', 'DOSTEPNY', CURRENT_TIMESTAMP);
INSERT INTO pokoje (hotel_id, nazwa, numer_pokoju, opis, max_osob, liczba_lozek, cena_bazowa, waluta, status, utworzono) VALUES (4, 'Apartament Rodzinny', '401', 'Osobny modul. Udogodnienia: Kominek, Hamak, Brak Wi-Fi.', 4, 3, 400.00, 'PLN', 'DOSTEPNY', CURRENT_TIMESTAMP);
INSERT INTO pokoje (hotel_id, nazwa, numer_pokoju, opis, max_osob, liczba_lozek, cena_bazowa, waluta, status, utworzono) VALUES (4, 'Pokoj Dwuosobowy Premium', '402', 'Najwiekszy pokoj. Udogodnienia: Taras, Ekspres, TV.', 3, 2, 450.00, 'PLN', 'DOSTEPNY', CURRENT_TIMESTAMP);
INSERT INTO pokoje (hotel_id, nazwa, numer_pokoju, opis, max_osob, liczba_lozek, cena_bazowa, waluta, status, utworzono) VALUES (4, 'Pokoj Dwuosobowy Standard', '403', 'Spokojna okolica. Udogodnienia: Zestaw do herbaty, Czyste powietrze.', 2, 1, 250.00, 'PLN', 'DOSTEPNY', CURRENT_TIMESTAMP);
INSERT INTO pokoje (hotel_id, nazwa, numer_pokoju, opis, max_osob, liczba_lozek, cena_bazowa, waluta, status, utworzono) VALUES (4, 'Pokoj Dwuosobowy Standard', '404', 'Idealny dla par. Udogodnienia: Radio, Prysznic z hydromasazem.', 2, 1, 250.00, 'PLN', 'DOSTEPNY', CURRENT_TIMESTAMP);
INSERT INTO pokoje (hotel_id, nazwa, numer_pokoju, opis, max_osob, liczba_lozek, cena_bazowa, waluta, status, utworzono) VALUES (4, 'Pokoj Jednoosobowy', '405', 'Baza wypadowa. Udogodnienia: Suszarka na buty, Czajnik.', 1, 1, 150.00, 'PLN', 'DOSTEPNY', CURRENT_TIMESTAMP);
INSERT INTO pokoje (hotel_id, nazwa, numer_pokoju, opis, max_osob, liczba_lozek, cena_bazowa, waluta, status, utworzono) VALUES (5, 'Apartament VIP', '501', 'Wysoki standard. Udogodnienia: Taras nad woda, Klimatyzacja, Wanna.', 4, 2, 900.00, 'PLN', 'DOSTEPNY', CURRENT_TIMESTAMP);
INSERT INTO pokoje (hotel_id, nazwa, numer_pokoju, opis, max_osob, liczba_lozek, cena_bazowa, waluta, status, utworzono) VALUES (5, 'Pokoj Dwuosobowy Premium', '502', 'Klasyka premium. Udogodnienia: Balkon, Lodowka, TV, Wi-Fi.', 2, 1, 450.00, 'PLN', 'DOSTEPNY', CURRENT_TIMESTAMP);
INSERT INTO pokoje (hotel_id, nazwa, numer_pokoju, opis, max_osob, liczba_lozek, cena_bazowa, waluta, status, utworzono) VALUES (5, 'Pokoj Rodzinny', '503', 'Z dziecmi. Udogodnienia: Kacik zabaw, Aneks, Klimatyzacja.', 5, 4, 600.00, 'PLN', 'DOSTEPNY', CURRENT_TIMESTAMP);
INSERT INTO pokoje (hotel_id, nazwa, numer_pokoju, opis, max_osob, liczba_lozek, cena_bazowa, waluta, status, utworzono) VALUES (5, 'Pokoj Dwuosobowy Standard', '504', 'Klasyczny. Udogodnienia: Prysznic, Zestaw kosmetykow, Wi-Fi.', 2, 1, 350.00, 'PLN', 'DOSTEPNY', CURRENT_TIMESTAMP);
INSERT INTO pokoje (hotel_id, nazwa, numer_pokoju, opis, max_osob, liczba_lozek, cena_bazowa, waluta, status, utworzono) VALUES (5, 'Pokoj Jednoosobowy', '505', 'Kompaktowy. Udogodnienia: TV, Czajnik, Sejf.', 1, 1, 200.00, 'PLN', 'DOSTEPNY', CURRENT_TIMESTAMP);

COMMIT;