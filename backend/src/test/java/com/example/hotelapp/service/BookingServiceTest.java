package com.example.hotelapp.service;

import com.example.hotelapp.dto.BookingDTO;
import com.example.hotelapp.model.*;
import com.example.hotelapp.repository.BookingRepository;
import com.example.hotelapp.repository.RoomPriceRepository;
import com.example.hotelapp.repository.RoomRepository;
import com.example.hotelapp.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("BookingService - Testy jednostkowe")
class BookingServiceTest {

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoomRepository roomRepository;

    @Mock
    private RoomPriceRepository roomPriceRepository;

    @InjectMocks
    private BookingService bookingService;

    private User testUser;
    private Room testRoom;
    private Booking testBooking;
    private BookingDTO testBookingDTO;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setEmail("user@example.com");
        testUser.setName("Jan");
        testUser.setLastName("Kowalski");

        testRoom = new Room();
        testRoom.setId(1L);
        testRoom.setName("Pokój 101");
        testRoom.setBasePrice(new BigDecimal("200.00"));

        testBooking = new Booking();
        testBooking.setId(1L);
        testBooking.setCheckInDate(LocalDate.now().plusDays(1));
        testBooking.setCheckOutDate(LocalDate.now().plusDays(3));
        testBooking.setAdults(2);
        testBooking.setChildren(0);
        testBooking.setStatus(BookingStatus.OCZEKUJACA);
        testBooking.setTotalAmount(new BigDecimal("400.00"));
        testBooking.setUser(testUser);
        testBooking.setRoom(testRoom);

        testBookingDTO = new BookingDTO();
        testBookingDTO.setId(1L);
        testBookingDTO.setCheckInDate(LocalDate.now().plusDays(1));
        testBookingDTO.setCheckOutDate(LocalDate.now().plusDays(3));
        testBookingDTO.setAdults(2);
        testBookingDTO.setChildren(0);
        testBookingDTO.setUserId(1L);
        testBookingDTO.setRoomId(1L);
        testBookingDTO.setStatus(BookingStatus.OCZEKUJACA);
    }


    @Test
    @DisplayName("getBookingsForUser() - powinien zwrócić rezerwacje dla użytkownika")
    void getBookingsForUser_ShouldReturnBookingsForUser() {
        
        String email = "user@example.com";
        List<Booking> bookings = Arrays.asList(testBooking);
        when(bookingRepository.findByUserEmail(email)).thenReturn(bookings);

        
        List<BookingDTO> result = bookingService.getBookingsForUser(email);

        
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getUserEmail()).isEqualTo(email);
        assertThat(result.get(0).getRoomName()).isEqualTo("Pokój 101");
        verify(bookingRepository, times(1)).findByUserEmail(email);
    }

    @Test
    @DisplayName("getBookingsForUser() - powinien zwrócić pustą listę gdy brak rezerwacji")
    void getBookingsForUser_ShouldReturnEmptyList_WhenNoBookings() {
        
        String email = "user@example.com";
        when(bookingRepository.findByUserEmail(email)).thenReturn(List.of());

        
        List<BookingDTO> result = bookingService.getBookingsForUser(email);

        
        assertThat(result).isEmpty();
        verify(bookingRepository, times(1)).findByUserEmail(email);
    }

    @Test
    @DisplayName("getAll() - powinien zwrócić wszystkie rezerwacje")
    void getAll_ShouldReturnAllBookings() {
        
        List<Booking> bookings = Arrays.asList(testBooking);
        when(bookingRepository.findAll()).thenReturn(bookings);

        
        List<BookingDTO> result = bookingService.getAll();

        
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getId()).isEqualTo(1L);
        verify(bookingRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("create() - powinien utworzyć rezerwację z poprawną ceną")
    void create_ShouldCreateBookingWithCorrectPrice() {
        
        when(bookingRepository.existsOverlappingBooking(
                anyLong(), any(LocalDate.class), any(LocalDate.class), any(BookingStatus.class)))
                .thenReturn(false);
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(roomRepository.findById(1L)).thenReturn(Optional.of(testRoom));
        when(roomPriceRepository.findByRoomIdAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
                anyLong(), any(LocalDate.class), any(LocalDate.class)))
                .thenReturn(Optional.empty());
        when(bookingRepository.save(any(Booking.class))).thenReturn(testBooking);

        
        BookingDTO result = bookingService.create(testBookingDTO);

        
        assertThat(result).isNotNull();
        verify(bookingRepository, times(1)).save(any(Booking.class));

        ArgumentCaptor<Booking> captor = ArgumentCaptor.forClass(Booking.class);
        verify(bookingRepository).save(captor.capture());
        Booking savedBooking = captor.getValue();
        assertThat(savedBooking.getTotalAmount()).isEqualByComparingTo(new BigDecimal("400.00"));
    }

    @Test
    @DisplayName("create() - powinien rzucić wyjątek gdy data wymeldowania nie jest późniejsza")
    void create_ShouldThrowException_WhenCheckOutNotAfterCheckIn() {
        
        testBookingDTO.setCheckInDate(LocalDate.now().plusDays(3));
        testBookingDTO.setCheckOutDate(LocalDate.now().plusDays(1));

        
        assertThatThrownBy(() -> bookingService.create(testBookingDTO))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Data wymeldowania musi być późniejsza niż data zameldowania");

        verify(bookingRepository, never()).save(any(Booking.class));
    }

    @Test
    @DisplayName("create() - powinien rzucić wyjątek gdy pokój jest zajęty")
    void create_ShouldThrowException_WhenRoomIsOccupied() {
        
        when(bookingRepository.existsOverlappingBooking(
                anyLong(), any(LocalDate.class), any(LocalDate.class), any(BookingStatus.class)))
                .thenReturn(true);

        
        assertThatThrownBy(() -> bookingService.create(testBookingDTO))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("ten pokój jest już zajęty w wybranym terminie");

        verify(bookingRepository, never()).save(any(Booking.class));
    }

    @Test
    @DisplayName("create() - powinien rzucić wyjątek gdy użytkownik nie istnieje")
    void create_ShouldThrowException_WhenUserNotFound() {
        
        when(bookingRepository.existsOverlappingBooking(
                anyLong(), any(LocalDate.class), any(LocalDate.class), any(BookingStatus.class)))
                .thenReturn(false);
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        
        assertThatThrownBy(() -> bookingService.create(testBookingDTO))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Nie znaleziono użytkownika o ID");

        verify(bookingRepository, never()).save(any(Booking.class));
    }

    @Test
    @DisplayName("create() - powinien rzucić wyjątek gdy pokój nie istnieje")
    void create_ShouldThrowException_WhenRoomNotFound() {
        
        when(bookingRepository.existsOverlappingBooking(
                anyLong(), any(LocalDate.class), any(LocalDate.class), any(BookingStatus.class)))
                .thenReturn(false);
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(roomRepository.findById(1L)).thenReturn(Optional.empty());

        
        assertThatThrownBy(() -> bookingService.create(testBookingDTO))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Nie znaleziono pokoju o ID");

        verify(bookingRepository, never()).save(any(Booking.class));
    }

    @Test
    @DisplayName("create() - powinien użyć ceny sezonowej gdy jest dostępna")
    void create_ShouldUseSeasonalPrice_WhenAvailable() {
        
        RoomPrice seasonalPrice = new RoomPrice();
        seasonalPrice.setPrice(new BigDecimal("300.00"));

        when(bookingRepository.existsOverlappingBooking(
                anyLong(), any(LocalDate.class), any(LocalDate.class), any(BookingStatus.class)))
                .thenReturn(false);
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(roomRepository.findById(1L)).thenReturn(Optional.of(testRoom));
        when(roomPriceRepository.findByRoomIdAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
                anyLong(), any(LocalDate.class), any(LocalDate.class)))
                .thenReturn(Optional.of(seasonalPrice));
        when(bookingRepository.save(any(Booking.class))).thenAnswer(inv -> inv.getArgument(0));

        
        bookingService.create(testBookingDTO);

        
        ArgumentCaptor<Booking> captor = ArgumentCaptor.forClass(Booking.class);
        verify(bookingRepository).save(captor.capture());
        assertThat(captor.getValue().getTotalAmount()).isEqualByComparingTo(new BigDecimal("600.00"));
    }

    @Test
    @DisplayName("create() - powinien ustawić status OCZEKUJACA gdy nie podano statusu")
    void create_ShouldSetDefaultStatus_WhenStatusNotProvided() {
        
        testBookingDTO.setStatus(null);
        when(bookingRepository.existsOverlappingBooking(
                anyLong(), any(LocalDate.class), any(LocalDate.class), any(BookingStatus.class)))
                .thenReturn(false);
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(roomRepository.findById(1L)).thenReturn(Optional.of(testRoom));
        when(roomPriceRepository.findByRoomIdAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
                anyLong(), any(LocalDate.class), any(LocalDate.class)))
                .thenReturn(Optional.empty());
        when(bookingRepository.save(any(Booking.class))).thenAnswer(inv -> inv.getArgument(0));

        
        bookingService.create(testBookingDTO);

        
        ArgumentCaptor<Booking> captor = ArgumentCaptor.forClass(Booking.class);
        verify(bookingRepository).save(captor.capture());
        assertThat(captor.getValue().getStatus()).isEqualTo(BookingStatus.OCZEKUJACA);
    }

    @Test
    @DisplayName("update() - powinien zaktualizować rezerwację")
    void update_ShouldUpdateBooking() {
        
        when(bookingRepository.existsOverlappingBookingForUpdate(
                anyLong(), any(LocalDate.class), any(LocalDate.class), anyLong(), any(BookingStatus.class)))
                .thenReturn(false);
        when(bookingRepository.findById(1L)).thenReturn(Optional.of(testBooking));
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(roomRepository.findById(1L)).thenReturn(Optional.of(testRoom));
        when(roomPriceRepository.findByRoomIdAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
                anyLong(), any(LocalDate.class), any(LocalDate.class)))
                .thenReturn(Optional.empty());
        when(bookingRepository.save(any(Booking.class))).thenReturn(testBooking);

        
        BookingDTO result = bookingService.update(1L, testBookingDTO);

        
        assertThat(result).isNotNull();
        verify(bookingRepository, times(1)).findById(1L);
        verify(bookingRepository, times(1)).save(any(Booking.class));
    }

    @Test
    @DisplayName("update() - powinien rzucić wyjątek gdy rezerwacja nie istnieje")
    void update_ShouldThrowException_WhenBookingNotFound() {
        
        when(bookingRepository.existsOverlappingBookingForUpdate(
                anyLong(), any(LocalDate.class), any(LocalDate.class), anyLong(), any(BookingStatus.class)))
                .thenReturn(false);
        when(bookingRepository.findById(1L)).thenReturn(Optional.empty());

        
        assertThatThrownBy(() -> bookingService.update(1L, testBookingDTO))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Nie znaleziono rezerwacji o ID");

        verify(bookingRepository, never()).save(any(Booking.class));
    }

    @Test
    @DisplayName("update() - powinien rzucić wyjątek gdy nowy termin koliduje")
    void update_ShouldThrowException_WhenNewDatesOverlap() {
        
        when(bookingRepository.existsOverlappingBookingForUpdate(
                anyLong(), any(LocalDate.class), any(LocalDate.class), anyLong(), any(BookingStatus.class)))
                .thenReturn(true);

        
        assertThatThrownBy(() -> bookingService.update(1L, testBookingDTO))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Nie można zmienić terminu! Pokój jest zajęty");

        verify(bookingRepository, never()).save(any(Booking.class));
    }

    @Test
    @DisplayName("update() - powinien przeliczyć cenę przy zmianie dat")
    void update_ShouldRecalculatePrice_WhenDatesChange() {
        
        testBookingDTO.setCheckOutDate(LocalDate.now().plusDays(4));

        when(bookingRepository.existsOverlappingBookingForUpdate(
                anyLong(), any(LocalDate.class), any(LocalDate.class), anyLong(), any(BookingStatus.class)))
                .thenReturn(false);
        when(bookingRepository.findById(1L)).thenReturn(Optional.of(testBooking));
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(roomRepository.findById(1L)).thenReturn(Optional.of(testRoom));
        when(roomPriceRepository.findByRoomIdAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
                anyLong(), any(LocalDate.class), any(LocalDate.class)))
                .thenReturn(Optional.empty());
        when(bookingRepository.save(any(Booking.class))).thenAnswer(inv -> inv.getArgument(0));

        
        bookingService.update(1L, testBookingDTO);

        
        ArgumentCaptor<Booking> captor = ArgumentCaptor.forClass(Booking.class);
        verify(bookingRepository).save(captor.capture());
        assertThat(captor.getValue().getTotalAmount()).isEqualByComparingTo(new BigDecimal("600.00"));
    }

    @Test
    @DisplayName("updateStatus() - powinien zaktualizować status rezerwacji")
    void updateStatus_ShouldUpdateBookingStatus() {
        
        when(bookingRepository.findById(1L)).thenReturn(Optional.of(testBooking));
        when(bookingRepository.save(any(Booking.class))).thenReturn(testBooking);

        
        bookingService.updateStatus(1L, "POTWIERDZONA");

        
        ArgumentCaptor<Booking> captor = ArgumentCaptor.forClass(Booking.class);
        verify(bookingRepository).save(captor.capture());
        assertThat(captor.getValue().getStatus()).isEqualTo(BookingStatus.POTWIERDZONA);
    }

    @Test
    @DisplayName("updateStatus() - powinien rzucić wyjątek gdy rezerwacja nie istnieje")
    void updateStatus_ShouldThrowException_WhenBookingNotFound() {
        
        when(bookingRepository.findById(1L)).thenReturn(Optional.empty());

        
        assertThatThrownBy(() -> bookingService.updateStatus(1L, "POTWIERDZONA"))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Nie znaleziono rezerwacji o ID");

        verify(bookingRepository, never()).save(any(Booking.class));
    }

    @Test
    @DisplayName("delete() - powinien usunąć rezerwację gdy istnieje")
    void delete_ShouldDeleteBooking_WhenExists() {
        
        when(bookingRepository.existsById(1L)).thenReturn(true);
        doNothing().when(bookingRepository).deleteById(1L);

        
        bookingService.delete(1L);

        
        verify(bookingRepository, times(1)).existsById(1L);
        verify(bookingRepository, times(1)).deleteById(1L);
    }

    @Test
    @DisplayName("delete() - powinien rzucić wyjątek gdy rezerwacja nie istnieje")
    void delete_ShouldThrowException_WhenBookingNotFound() {
        
        when(bookingRepository.existsById(1L)).thenReturn(false);

        
        assertThatThrownBy(() -> bookingService.delete(1L))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Nie można usunąć: brak rezerwacji o ID");

        verify(bookingRepository, never()).deleteById(anyLong());
    }
}