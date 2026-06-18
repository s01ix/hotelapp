package com.example.hotelapp.service;

import com.example.hotelapp.dto.RoomDTO;
import com.example.hotelapp.model.*;
import com.example.hotelapp.repository.*;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
@DisplayName("RoomService - Testy integracyjne")
class RoomServiceIntegrationTest {

    @Autowired
    private RoomService roomService;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private HotelRepository hotelRepository;

    @Autowired
    private AmenityRepository amenityRepository;

    @Autowired
    private RoomPhotoRepository roomPhotoRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LocationRepository locationRepository;

    private Hotel testHotel;
    private Amenity wifi;
    private Amenity parking;

    @BeforeEach
    void setUp() {
        bookingRepository.deleteAll();
        roomPhotoRepository.deleteAll();
        roomRepository.deleteAll();
        amenityRepository.deleteAll();
        hotelRepository.deleteAll();

        Location location = new Location();
        location.setCountry("Polska");
        location.setCity("Warszawa");
        location.setStreet("Marszałkowska");
        location.setBuildingNumber("1");
        location.setPostalCode("00-001");
        location = locationRepository.save(location);
        testHotel = new Hotel();
        testHotel.setName("Test Hotel");
        testHotel.setDescription("Test hotel description");
        testHotel.setStars(5);
        testHotel.setPhone("123456789");
        testHotel.setEmail("hotel@test.com");
        testHotel.setLocation(location);
        testHotel = hotelRepository.save(testHotel);

        wifi = new Amenity();
        wifi.setName("Wi-Fi");
        wifi.setCategory("Internet");
        wifi.setDescription("Darmowy Wi-Fi");
        wifi = amenityRepository.save(wifi);

        parking = new Amenity();
        parking.setName("Parking");
        parking.setCategory("Usługi");
        parking.setDescription("Bezpłatny parking");
        parking = amenityRepository.save(parking);
    }

    @AfterEach
    void cleanUp() {
        bookingRepository.deleteAll();
        roomPhotoRepository.deleteAll();
        roomRepository.deleteAll();
        amenityRepository.deleteAll();
        hotelRepository.deleteAll();
        userRepository.deleteAll();
    }


    @Test
    @DisplayName("Powinien utworzyć pokój z relacjami do hotelu i udogodnień")
    void shouldCreateRoomWithHotelAndAmenities() {
        RoomDTO dto = new RoomDTO();
        dto.setRoomNumber("101");
        dto.setName("Deluxe Room");
        dto.setDescription("Luksusowy pokój");
        dto.setBedCount(2);
        dto.setMaxGuests(4);
        dto.setBasePrice(new BigDecimal("200.00"));
        dto.setCurrency("PLN");
        dto.setStatus(RoomStatus.DOSTEPNY);
        dto.setHotelId(testHotel.getId());
        dto.setAmenityIds(Arrays.asList(wifi.getId(), parking.getId()));

        
        RoomDTO created = roomService.create(dto);

        
        assertThat(created.getId()).isNotNull();

        Room savedRoom = roomRepository.findById(created.getId()).orElseThrow();
        assertThat(savedRoom.getRoomNumber()).isEqualTo("101");
        assertThat(savedRoom.getHotel().getId()).isEqualTo(testHotel.getId());
        assertThat(savedRoom.getAmenities()).hasSize(2);
        assertThat(savedRoom.getAmenities()).extracting(Amenity::getName)
                .containsExactlyInAnyOrder("Wi-Fi", "Parking");
    }

    @Test
    @DisplayName("Powinien utworzyć pokój z domyślną walutą PLN")
    void shouldCreateRoomWithDefaultCurrency() {
        RoomDTO dto = new RoomDTO();
        dto.setRoomNumber("102");
        dto.setName("Standard Room");
        dto.setBedCount(1);
        dto.setMaxGuests(2);
        dto.setBasePrice(new BigDecimal("150.00"));
        dto.setCurrency(null);
        dto.setStatus(RoomStatus.DOSTEPNY);
        dto.setHotelId(testHotel.getId());

        
        RoomDTO created = roomService.create(dto);

        
        Room savedRoom = roomRepository.findById(created.getId()).orElseThrow();
        assertThat(savedRoom.getCurrency()).isEqualTo("PLN");
    }

    @Test
    @DisplayName("Powinien rzucić wyjątek gdy hotel nie istnieje")
    void shouldThrowExceptionWhenHotelNotExists() {
        RoomDTO dto = new RoomDTO();
        dto.setRoomNumber("103");
        dto.setName("Test Room");
        dto.setHotelId(999L);

        assertThatThrownBy(() -> roomService.create(dto))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Nie znaleziono hotelu o ID");
    }


    @Test
    @DisplayName("Powinien znaleźć dostępne pokoje w podanym terminie")
    void shouldFindAvailableRoomsInDateRange() {
        Room room1 = createRoom("201", "Room 1", 4);
        Room room2 = createRoom("202", "Room 2", 2);
        Room room3 = createRoom("203", "Room 3", 4);

        LocalDate checkIn = LocalDate.now().plusDays(10);
        LocalDate checkOut = LocalDate.now().plusDays(12);

        createBooking(room2, checkIn, checkOut, 2);

        
        List<RoomDTO> available = roomService.searchAvailableRooms(checkIn, checkOut, 4);

        
        assertThat(available).hasSize(2);
        assertThat(available).extracting(RoomDTO::getRoomNumber)
                .containsExactlyInAnyOrder("201", "203");
    }

    @Test
    @DisplayName("Powinien wykluczyć pokoje z nakładającymi się rezerwacjami")
    void shouldExcludeRoomsWithOverlappingBookings() {
        Room room = createRoom("301", "Test Room", 2);

        LocalDate existingCheckIn = LocalDate.now().plusDays(5);
        LocalDate existingCheckOut = LocalDate.now().plusDays(8);
        createBooking(room, existingCheckIn, existingCheckOut, 2);

        LocalDate searchCheckIn = LocalDate.now().plusDays(6);
        LocalDate searchCheckOut = LocalDate.now().plusDays(9);

        
        List<RoomDTO> available = roomService.searchAvailableRooms(searchCheckIn, searchCheckOut, 2);

        
        assertThat(available).isEmpty();
    }

    @Test
    @DisplayName("Powinien znaleźć pokoje dla określonej liczby gości")
    void shouldFindRoomsForSpecificGuestCount() {
        Room smallRoom = createRoom("401", "Small Room", 2);
        Room largeRoom = createRoom("402", "Large Room", 6);

        LocalDate checkIn = LocalDate.now().plusDays(1);
        LocalDate checkOut = LocalDate.now().plusDays(3);

        List<RoomDTO> available = roomService.searchAvailableRooms(checkIn, checkOut, 5);

        assertThat(available).hasSize(1);
        assertThat(available.get(0).getRoomNumber()).isEqualTo("402");
        assertThat(available.get(0).getMaxGuests()).isGreaterThanOrEqualTo(5);
    }

    @Test
    @DisplayName("Powinien uwzględnić tylko aktywne rezerwacje przy sprawdzaniu dostępności")
    void shouldConsiderOnlyActiveBookingsForAvailability() {
        Room room = createRoom("501", "Test Room", 2);

        LocalDate checkIn = LocalDate.now().plusDays(5);
        LocalDate checkOut = LocalDate.now().plusDays(8);

        Booking cancelledBooking = createBooking(room, checkIn, checkOut, 2);
        cancelledBooking.setStatus(BookingStatus.ANULOWANA);
        bookingRepository.save(cancelledBooking);

        
        List<RoomDTO> available = roomService.searchAvailableRooms(checkIn, checkOut, 2);

        assertThat(available).hasSize(1);
        assertThat(available.get(0).getRoomNumber()).isEqualTo("501");
    }


    @Test
    @DisplayName("Powinien załadować pokoje ze wszystkimi relacjami")
    void shouldLoadRoomsWithAllRelations() {
        Room room = createRoom("601", "Full Room", 2);
        room.setAmenities(new ArrayList<>(Arrays.asList(wifi, parking)));
        roomRepository.save(room);

        RoomPhoto photo1 = new RoomPhoto();
        photo1.setRoom(room);
        photo1.setUrl("https://example.com/photo1.jpg");
        photo1.setIsPrimary(true);
        roomPhotoRepository.save(photo1);

        RoomPhoto photo2 = new RoomPhoto();
        photo2.setRoom(room);
        photo2.setUrl("https://example.com/photo2.jpg");
        photo2.setIsPrimary(false);
        roomPhotoRepository.save(photo2);

        
        List<RoomDTO> rooms = roomService.getAll();

        
        assertThat(rooms).hasSize(1);
        RoomDTO dto = rooms.get(0);

        assertThat(dto.getAmenities()).hasSize(2);
        assertThat(dto.getAmenities()).containsExactlyInAnyOrder("Wi-Fi", "Parking");

        assertThat(dto.getPhotos()).hasSize(2);
        assertThat(dto.getPhotos()).extracting("url")
                .containsExactlyInAnyOrder("https://example.com/photo1.jpg", "https://example.com/photo2.jpg");
    }


    @Test
    @DisplayName("Powinien zaktualizować pokój wraz z relacjami")
    void shouldUpdateRoomWithRelations() {
        Room room = createRoom("701", "Old Room", 2);
        room.setAmenities(new ArrayList<>(Arrays.asList(wifi)));
        room = roomRepository.save(room);

        RoomDTO updateDTO = new RoomDTO();
        updateDTO.setRoomNumber("701-UPDATED");
        updateDTO.setName("New Room Name");
        updateDTO.setDescription("Updated description");
        updateDTO.setBedCount(3);
        updateDTO.setMaxGuests(5);
        updateDTO.setBasePrice(new BigDecimal("350.00"));
        updateDTO.setCurrency("EUR");
        updateDTO.setStatus(RoomStatus.SERWIS);
        updateDTO.setHotelId(testHotel.getId());
        updateDTO.setAmenityIds(Arrays.asList(wifi.getId(), parking.getId()));

        
        RoomDTO updated = roomService.update(room.getId(), updateDTO);

        
        Room updatedRoom = roomRepository.findById(room.getId()).orElseThrow();
        assertThat(updatedRoom.getRoomNumber()).isEqualTo("701-UPDATED");
        assertThat(updatedRoom.getName()).isEqualTo("New Room Name");
        assertThat(updatedRoom.getBedCount()).isEqualTo(3);
        assertThat(updatedRoom.getMaxGuests()).isEqualTo(5);
        assertThat(updatedRoom.getBasePrice()).isEqualByComparingTo(new BigDecimal("350.00"));
        assertThat(updatedRoom.getCurrency()).isEqualTo("EUR");
        assertThat(updatedRoom.getStatus()).isEqualTo(RoomStatus.SERWIS);
        assertThat(updatedRoom.getAmenities()).hasSize(2);
    }


    @Test
    @DisplayName("Powinien usunąć pokój z bazy danych")
    void shouldDeleteRoomFromDatabase() {
        Room room = createRoom("801", "To Delete", 2);

        
        roomService.delete(room.getId());

        
        assertThat(roomRepository.findById(room.getId())).isEmpty();
    }

    @Test
    @DisplayName("Powinien rzucić wyjątek przy próbie usunięcia nieistniejącego pokoju")
    void shouldThrowExceptionWhenDeletingNonExistentRoom() {
        assertThatThrownBy(() -> roomService.delete(999L))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Nie można usunąć: brak pokoju o ID");
    }


    @Test
    @DisplayName("Powinien pobrać pokój po ID wraz ze zdjęciami")
    void shouldGetRoomByIdWithPhotos() {
        Room room = createRoom("901", "Room with photos", 2);

        RoomPhoto photo = new RoomPhoto();
        photo.setRoom(room);
        photo.setUrl("https://example.com/photo.jpg");
        photo.setIsPrimary(true);
        roomPhotoRepository.save(photo);
        RoomDTO result = roomService.getRoomById(room.getId());
        assertThat(result.getId()).isEqualTo(room.getId());
        assertThat(result.getRoomNumber()).isEqualTo("901");
        assertThat(result.getPhotos()).hasSize(1);
        assertThat(result.getPhotos().get(0).getUrl()).isEqualTo("https://example.com/photo.jpg");
    }

    private Room createRoom(String roomNumber, String name, int maxGuests) {
        Room room = new Room();
        room.setRoomNumber(roomNumber);
        room.setName(name);
        room.setDescription("Test room");
        room.setBedCount(maxGuests / 2);
        room.setMaxGuests(maxGuests);
        room.setBasePrice(new BigDecimal("200.00"));
        room.setCurrency("PLN");
        room.setStatus(RoomStatus.DOSTEPNY);
        room.setHotel(testHotel);
        return roomRepository.save(room);
    }

    private Booking createBooking(Room room, LocalDate checkIn, LocalDate checkOut, int adults) {
        User user = new User();
        user.setEmail("test" + System.currentTimeMillis() + "@example.com");
        user.setName("Test");
        user.setLastName("User");
        user.setPhone("123456789");
        user.setPasswordHash("hash");
        user.setRole(UserRole.USER);
        user = userRepository.save(user);

        Booking booking = new Booking();
        booking.setRoom(room);
        booking.setUser(user);
        booking.setCheckInDate(checkIn);
        booking.setCheckOutDate(checkOut);
        booking.setAdults(adults);
        booking.setChildren(0);
        booking.setStatus(BookingStatus.POTWIERDZONA);
        booking.setTotalAmount(new BigDecimal("400.00"));
        return bookingRepository.save(booking);
    }
}