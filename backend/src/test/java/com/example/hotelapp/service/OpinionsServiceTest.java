package com.example.hotelapp.service;

import com.example.hotelapp.dto.OpinionsDTO;
import com.example.hotelapp.model.*;
import com.example.hotelapp.repository.BookingRepository;
import com.example.hotelapp.repository.OpinionsRepository;
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

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("OpinionsService - Testy jednostkowe")
class OpinionsServiceTest {

    @Mock
    private OpinionsRepository opinionsRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoomRepository roomRepository;

    @Mock
    private BookingRepository bookingRepository;

    @InjectMocks
    private OpinionsService opinionsService;

    private User testUser;
    private Room testRoom;
    private Booking testBooking;
    private Opinions testOpinion;
    private OpinionsDTO testOpinionDTO;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setEmail("user@example.com");

        testRoom = new Room();
        testRoom.setId(1L);
        testRoom.setName("Pokój 101");

        testBooking = new Booking();
        testBooking.setId(1L);
        testBooking.setUser(testUser);
        testBooking.setRoom(testRoom);
        testBooking.setCheckInDate(LocalDate.now().minusDays(5));
        testBooking.setCheckOutDate(LocalDate.now().minusDays(2));

        testOpinion = new Opinions();
        testOpinion.setId(1L);
        testOpinion.setRate(5);
        testOpinion.setComment("Wspaniały pobyt!");
        testOpinion.setUser(testUser);
        testOpinion.setRoom(testRoom);
        testOpinion.setBooking(testBooking);

        testOpinionDTO = new OpinionsDTO();
        testOpinionDTO.setId(1L);
        testOpinionDTO.setRate(5);
        testOpinionDTO.setComment("Wspaniały pobyt!");
        testOpinionDTO.setUserId(1L);
        testOpinionDTO.setRoomId(1L);
        testOpinionDTO.setBookingId(1L);
    }


    @Test
    @DisplayName("getAll() - powinien zwrócić wszystkie opinie")
    void getAll_ShouldReturnAllOpinions() {
        
        List<Opinions> opinions = Arrays.asList(testOpinion);
        when(opinionsRepository.findAll()).thenReturn(opinions);

        
        List<OpinionsDTO> result = opinionsService.getAll();

        
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getRate()).isEqualTo(5);
        assertThat(result.get(0).getComment()).isEqualTo("Wspaniały pobyt!");
        verify(opinionsRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("getAll() - powinien zwrócić pustą listę gdy brak opinii")
    void getAll_ShouldReturnEmptyList_WhenNoOpinions() {
        
        when(opinionsRepository.findAll()).thenReturn(List.of());

        
        List<OpinionsDTO> result = opinionsService.getAll();

        
        assertThat(result).isEmpty();
        verify(opinionsRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("getUserOpinions() - powinien zwrócić opinie użytkownika")
    void getUserOpinions_ShouldReturnUserOpinions() {
        
        when(opinionsRepository.findByUserId(1L)).thenReturn(Arrays.asList(testOpinion));

        
        List<OpinionsDTO> result = opinionsService.getUserOpinions(1L);

        
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getUserId()).isEqualTo(1L);
        verify(opinionsRepository, times(1)).findByUserId(1L);
    }

    @Test
    @DisplayName("getUserOpinions() - powinien zwrócić pustą listę gdy użytkownik nie ma opinii")
    void getUserOpinions_ShouldReturnEmptyList_WhenUserHasNoOpinions() {
        
        when(opinionsRepository.findByUserId(1L)).thenReturn(List.of());

        
        List<OpinionsDTO> result = opinionsService.getUserOpinions(1L);

        
        assertThat(result).isEmpty();
        verify(opinionsRepository, times(1)).findByUserId(1L);
    }

    @Test
    @DisplayName("getRoomOpinions() - powinien zwrócić opinie dla pokoju")
    void getRoomOpinions_ShouldReturnRoomOpinions() {
        
        when(opinionsRepository.findByRoomId(1L)).thenReturn(Arrays.asList(testOpinion));

        
        List<OpinionsDTO> result = opinionsService.getRoomOpinions(1L);

        
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getRoomId()).isEqualTo(1L);
        verify(opinionsRepository, times(1)).findByRoomId(1L);
    }

    @Test
    @DisplayName("canReviewBooking() - powinien zwrócić true gdy można wystawić opinię")
    void canReviewBooking_ShouldReturnTrue_WhenCanReview() {
        
        when(bookingRepository.findById(1L)).thenReturn(Optional.of(testBooking));
        when(opinionsRepository.existsByBookingId(1L)).thenReturn(false);

        
        boolean result = opinionsService.canReviewBooking(1L, 1L);

        
        assertThat(result).isTrue();
    }

    @Test
    @DisplayName("canReviewBooking() - powinien zwrócić false gdy rezerwacja nie należy do użytkownika")
    void canReviewBooking_ShouldReturnFalse_WhenBookingNotBelongsToUser() {
        
        when(bookingRepository.findById(1L)).thenReturn(Optional.of(testBooking));

        
        boolean result = opinionsService.canReviewBooking(1L, 999L);

        
        assertThat(result).isFalse();
    }

    @Test
    @DisplayName("canReviewBooking() - powinien zwrócić false gdy pobyt jeszcze trwa")
    void canReviewBooking_ShouldReturnFalse_WhenStayNotFinished() {
        
        testBooking.setCheckOutDate(LocalDate.now().plusDays(1));
        when(bookingRepository.findById(1L)).thenReturn(Optional.of(testBooking));

        
        boolean result = opinionsService.canReviewBooking(1L, 1L);

        
        assertThat(result).isFalse();
    }

    @Test
    @DisplayName("canReviewBooking() - powinien zwrócić false gdy opinia już istnieje")
    void canReviewBooking_ShouldReturnFalse_WhenReviewAlreadyExists() {
        
        when(bookingRepository.findById(1L)).thenReturn(Optional.of(testBooking));
        when(opinionsRepository.existsByBookingId(1L)).thenReturn(true);

        
        boolean result = opinionsService.canReviewBooking(1L, 1L);

        
        assertThat(result).isFalse();
    }

    @Test
    @DisplayName("canReviewBooking() - powinien rzucić wyjątek gdy rezerwacja nie istnieje")
    void canReviewBooking_ShouldThrowException_WhenBookingNotFound() {
        
        when(bookingRepository.findById(1L)).thenReturn(Optional.empty());

        
        assertThatThrownBy(() -> opinionsService.canReviewBooking(1L, 1L))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Nie znaleziono rezerwacji");
    }

    

    @Test
    @DisplayName("create() - powinien utworzyć opinię")
    void create_ShouldCreateOpinion() {
        
        when(bookingRepository.findById(1L)).thenReturn(Optional.of(testBooking));
        when(opinionsRepository.existsByBookingId(1L)).thenReturn(false);
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(roomRepository.findById(1L)).thenReturn(Optional.of(testRoom));
        when(opinionsRepository.save(any(Opinions.class))).thenReturn(testOpinion);

        
        OpinionsDTO result = opinionsService.create(testOpinionDTO);

        
        assertThat(result).isNotNull();
        assertThat(result.getRate()).isEqualTo(5);
        verify(opinionsRepository, times(1)).save(any(Opinions.class));
    }

    @Test
    @DisplayName("create() - powinien rzucić wyjątek gdy nie można wystawić opinii")
    void create_ShouldThrowException_WhenCannotReview() {
        
        testBooking.setCheckOutDate(LocalDate.now().plusDays(1));
        when(bookingRepository.findById(1L)).thenReturn(Optional.of(testBooking));

        
        assertThatThrownBy(() -> opinionsService.create(testOpinionDTO))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Nie możesz wystawić opinii dla tej rezerwacji");

        verify(opinionsRepository, never()).save(any(Opinions.class));
    }

    @Test
    @DisplayName("create() - powinien rzucić wyjątek gdy użytkownik nie istnieje")
    void create_ShouldThrowException_WhenUserNotFound() {
        
        when(bookingRepository.findById(1L)).thenReturn(Optional.of(testBooking));
        when(opinionsRepository.existsByBookingId(1L)).thenReturn(false);
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        
        assertThatThrownBy(() -> opinionsService.create(testOpinionDTO))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Nie znaleziono użytkownika o ID");

        verify(opinionsRepository, never()).save(any(Opinions.class));
    }

    @Test
    @DisplayName("create() - powinien rzucić wyjątek gdy pokój nie istnieje")
    void create_ShouldThrowException_WhenRoomNotFound() {
        
        when(bookingRepository.findById(1L)).thenReturn(Optional.of(testBooking));
        when(opinionsRepository.existsByBookingId(1L)).thenReturn(false);
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(roomRepository.findById(1L)).thenReturn(Optional.empty());

        
        assertThatThrownBy(() -> opinionsService.create(testOpinionDTO))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Nie znaleziono pokoju o ID");

        verify(opinionsRepository, never()).save(any(Opinions.class));
    }

    @Test
    @DisplayName("create() - powinien przypisać wszystkie relacje")
    void create_ShouldAssignAllRelations() {
        
        when(bookingRepository.findById(1L)).thenReturn(Optional.of(testBooking));
        when(opinionsRepository.existsByBookingId(1L)).thenReturn(false);
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(roomRepository.findById(1L)).thenReturn(Optional.of(testRoom));
        when(opinionsRepository.save(any(Opinions.class))).thenAnswer(inv -> inv.getArgument(0));

        
        opinionsService.create(testOpinionDTO);

        
        ArgumentCaptor<Opinions> captor = ArgumentCaptor.forClass(Opinions.class);
        verify(opinionsRepository).save(captor.capture());
        Opinions saved = captor.getValue();

        assertThat(saved.getUser()).isEqualTo(testUser);
        assertThat(saved.getRoom()).isEqualTo(testRoom);
        assertThat(saved.getBooking()).isEqualTo(testBooking);
    }


    @Test
    @DisplayName("update() - powinien zaktualizować opinię")
    void update_ShouldUpdateOpinion() {
        
        when(opinionsRepository.findById(1L)).thenReturn(Optional.of(testOpinion));
        when(opinionsRepository.save(any(Opinions.class))).thenReturn(testOpinion);

        OpinionsDTO updateDTO = new OpinionsDTO();
        updateDTO.setUserId(1L);
        updateDTO.setRate(4);
        updateDTO.setComment("Dobry pobyt");

        
        OpinionsDTO result = opinionsService.update(1L, updateDTO);

        
        assertThat(result).isNotNull();
        verify(opinionsRepository, times(1)).save(any(Opinions.class));
    }

    @Test
    @DisplayName("update() - powinien rzucić wyjątek gdy opinia nie istnieje")
    void update_ShouldThrowException_WhenOpinionNotFound() {
        
        when(opinionsRepository.findById(1L)).thenReturn(Optional.empty());

        
        assertThatThrownBy(() -> opinionsService.update(1L, testOpinionDTO))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Nie znaleziono opinii o ID");

        verify(opinionsRepository, never()).save(any(Opinions.class));
    }

    @Test
    @DisplayName("update() - powinien rzucić wyjątek gdy użytkownik próbuje edytować cudzą opinię")
    void update_ShouldThrowException_WhenUserTriesToEditOthersOpinion() {
        
        when(opinionsRepository.findById(1L)).thenReturn(Optional.of(testOpinion));
        testOpinionDTO.setUserId(999L);

        
        assertThatThrownBy(() -> opinionsService.update(1L, testOpinionDTO))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Nie możesz edytować cudzej opinii");

        verify(opinionsRepository, never()).save(any(Opinions.class));
    }

    @Test
    @DisplayName("update() - powinien zaktualizować tylko ocenę i komentarz")
    void update_ShouldUpdateOnlyRateAndComment() {
        
        when(opinionsRepository.findById(1L)).thenReturn(Optional.of(testOpinion));
        when(opinionsRepository.save(any(Opinions.class))).thenAnswer(inv -> inv.getArgument(0));

        OpinionsDTO updateDTO = new OpinionsDTO();
        updateDTO.setUserId(1L);
        updateDTO.setRate(3);
        updateDTO.setComment("Zmieniony komentarz");

        
        opinionsService.update(1L, updateDTO);

        
        assertThat(testOpinion.getRate()).isEqualTo(3);
        assertThat(testOpinion.getComment()).isEqualTo("Zmieniony komentarz");
        assertThat(testOpinion.getUser()).isEqualTo(testUser);
        assertThat(testOpinion.getRoom()).isEqualTo(testRoom);
        assertThat(testOpinion.getBooking()).isEqualTo(testBooking);
    }


    @Test
    @DisplayName("delete() - powinien usunąć opinię gdy istnieje")
    void delete_ShouldDeleteOpinion_WhenExists() {
        
        when(opinionsRepository.existsById(1L)).thenReturn(true);
        doNothing().when(opinionsRepository).deleteById(1L);

        
        opinionsService.delete(1L);

        
        verify(opinionsRepository, times(1)).existsById(1L);
        verify(opinionsRepository, times(1)).deleteById(1L);
    }

    @Test
    @DisplayName("delete() - powinien rzucić wyjątek gdy opinia nie istnieje")
    void delete_ShouldThrowException_WhenOpinionNotFound() {
        
        when(opinionsRepository.existsById(1L)).thenReturn(false);

        
        assertThatThrownBy(() -> opinionsService.delete(1L))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Brak opinii o ID");

        verify(opinionsRepository, never()).deleteById(anyLong());
    }
}