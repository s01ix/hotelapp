# Hotel App – system rezerwacji hotelowych

Aplikacja webowa do rezerwacji pokoi hotelowych z płatnościami online, panelem recepcji i panelem administratora. Projekt zespołowy (3 osoby) realizowany na Politechnice Świętokrzyskiej.

**Stack:** Java 21 · Spring Boot 4 · Spring Security (sesja + Google OAuth2) · Spring Data JPA / Hibernate · Oracle XE · PayPal REST SDK (sandbox) · React 18 + TypeScript · Tailwind CSS · i18next · JUnit 5 + Mockito · Vitest

## Funkcje

- **Gość:** wyszukiwanie dostępnych pokoi, rezerwacja, płatność PayPal, historia rezerwacji, opinie o pokojach po zakończonym pobycie.
- **Recepcja:** podgląd i obsługa rezerwacji (zmiana statusów).
- **Administrator:** zarządzanie hotelami, lokalizacjami, pokojami (CRUD), cenami i użytkownikami.
- Interfejs w dwóch językach (PL / EN), dokumentacja API w Swagger UI (54 endpointy REST).

## Model danych

Główne encje: `Hotel` → `Location`, `Room` (z `RoomPrice`, `RoomPhoto`, `Amenity`), `User` (role: `USER`, `RECEPTIONIST`, `ADMIN`), `Booking` (statusy rezerwacji) → `Payment` (statusy: oczekująca, opłacona, nieudana, zwrócona) oraz `Opinions` powiązane z rezerwacją.

Reguły biznesowe w modelu: opinię można wystawić tylko do własnej, zakończonej rezerwacji i tylko raz; płatność jest powiązana 1:1 z rezerwacją, a kwoty przechowywane jako `NUMBER(10,2)` / `BigDecimal`.

## Uruchomienie

**Wymagania:** JDK 21, Node.js 20+, Oracle XE (domyślnie `localhost:1521/XEPDB1`, użytkownik `system` / hasło `oracle` – tylko lokalnie).

```bash
# backend (http://localhost:8080, Swagger: /swagger-ui.html)
cd backend
export PAYPAL_CLIENT_ID=...        # klucze z PayPal Developer (sandbox)
export PAYPAL_CLIENT_SECRET=...
export GOOGLE_CLIENT_ID=...        # opcjonalnie, do logowania przez Google
export GOOGLE_CLIENT_SECRET=...
./mvnw spring-boot:run

# frontend (http://localhost:5173)
cd frontend
npm install
npm run dev
```

## Testy

```bash
cd backend && ./mvnw test     # 188 testów: jednostkowe serwisów (Mockito) i integracyjne na H2
cd frontend && npm test       # testy komponentów (Vitest)
```

## Mój wkład (Michał Lesiak)

- Postawienie projektu Spring Boot, początkowy schemat bazy Oracle z encjami JPA i repozytoriami; nadzór nad modelem danych w trakcie projektu.
- Integracja płatności PayPal w całym przepływie: utworzenie płatności, akceptacja, wykonanie, weryfikacja i zmiana statusu.
- Moduł opinii end-to-end (API + formularz i prezentacja w React).
- Panele administratora: pokoje, lokalizacje, formularz dodawania hoteli.
- Internacjonalizacja PL/EN.
- 188 testów backendu (13 serwisów + testy integracyjne).

Pozostali członkowie zespołu: Jakub Żyła, Kamil Korzeniowski. Szablon interfejsu powstał w Figma Make (komponenty shadcn/ui – zob. `frontend/ATTRIBUTIONS.md`).

## Znane ograniczenia i co bym poprawił

To projekt uczelniany uruchamiany lokalnie. Świadomie wypisuję rzeczy, które przed wdrożeniem produkcyjnym trzeba by zmienić:

1. **Autoryzacja po stronie serwera.** Role są obecnie sprawdzane tylko we frontendzie. Backend wymaga jedynie zalogowania, a ścieżki `/api/hotels/**` i `/api/rooms/**` są otwarte dla wszystkich metod HTTP. Poprawka: `@EnableMethodSecurity` + `@PreAuthorize("hasRole('ADMIN')")` na operacjach zapisu oraz ograniczenie `permitAll` do żądań `GET`.
2. **Tożsamość użytkownika z sesji.** Część endpointów (np. opinie) przyjmuje `userId` z żądania. Powinien być brany z zalogowanego użytkownika (`@AuthenticationPrincipal`), żeby nie dało się działać w imieniu innej osoby.
3. **Walidacja wejścia.** Rejestracja i logowanie przyjmują `Map<String, String>`; lepsze byłyby DTO z adnotacjami Bean Validation i globalny `@ControllerAdvice` do obsługi błędów.
4. **Adresy w kodzie.** Adresy frontendu i zwrotne PayPal (`localhost`) powinny trafić do konfiguracji.
5. **Kwoty.** `PaypalService` przyjmuje kwotę jako `Double`; spójniej byłoby przekazywać `BigDecimal` w całym przepływie.

Już poprawione: po powrocie z PayPal backend sprawdza, że transakcja dotyczy właśnie tej płatności (identyfikator zapisany przy jej tworzeniu), a opłacona kwota i waluta zgadzają się z rezerwacją; nie da się też drugi raz opłacić tej samej płatności. Klucze PayPal i Google są czytane ze zmiennych środowiskowych.
