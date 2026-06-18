package com.example.hotelapp.service;

import com.example.hotelapp.dto.RoomPriceDTO;
import com.example.hotelapp.model.Room;
import com.example.hotelapp.model.RoomPrice;
import com.example.hotelapp.repository.RoomPriceRepository;
import com.example.hotelapp.repository.RoomRepository;
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
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("RoomPriceService - Testy jednostkowe")
class RoomPriceServiceTest {

    @Mock
    private RoomPriceRepository roomPriceRepository;

    @Mock
    private RoomRepository roomRepository;

    @InjectMocks
    private RoomPriceService roomPriceService;

    private Room testRoom;
    private RoomPrice testRoomPrice;
    private RoomPriceDTO testRoomPriceDTO;

    @BeforeEach
    void setUp() {
        testRoom = new Room();
        testRoom.setId(1L);
        testRoom.setName("Pokój 101");

        testRoomPrice = new RoomPrice();
        testRoomPrice.setId(1L);
        testRoomPrice.setStartDate(LocalDate.of(2024, 6, 1));
        testRoomPrice.setEndDate(LocalDate.of(2024, 8, 31));
        testRoomPrice.setPrice(new BigDecimal("300.00"));
        testRoomPrice.setSeasonName("Lato");
        testRoomPrice.setRoom(testRoom);

        testRoomPriceDTO = new RoomPriceDTO();
        testRoomPriceDTO.setId(1L);
        testRoomPriceDTO.setStartDate(LocalDate.of(2024, 6, 1));
        testRoomPriceDTO.setEndDate(LocalDate.of(2024, 8, 31));
        testRoomPriceDTO.setPrice(new BigDecimal("300.00"));
        testRoomPriceDTO.setSeasonName("Lato");
        testRoomPriceDTO.setRoomId(1L);
    }

    @Test
    @DisplayName("getAll() - powinien zwrócić wszystkie ceny")
    void getAll_ShouldReturnAllPrices() {
        
        List<RoomPrice> prices = Arrays.asList(testRoomPrice);
        when(roomPriceRepository.findAll()).thenReturn(prices);

        
        List<RoomPriceDTO> result = roomPriceService.getAll();

        
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getPrice()).isEqualByComparingTo(new BigDecimal("300.00"));
        assertThat(result.get(0).getSeasonName()).isEqualTo("Lato");
        verify(roomPriceRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("getAll() - powinien zwrócić pustą listę gdy brak cen")
    void getAll_ShouldReturnEmptyList_WhenNoPrices() {
        
        when(roomPriceRepository.findAll()).thenReturn(List.of());

        
        List<RoomPriceDTO> result = roomPriceService.getAll();

        
        assertThat(result).isEmpty();
        verify(roomPriceRepository, times(1)).findAll();
    }

    

    @Test
    @DisplayName("create() - powinien utworzyć cenę sezonową")
    void create_ShouldCreateRoomPrice() {
        
        when(roomRepository.findById(1L)).thenReturn(Optional.of(testRoom));
        when(roomPriceRepository.save(any(RoomPrice.class))).thenReturn(testRoomPrice);

        
        RoomPriceDTO result = roomPriceService.create(testRoomPriceDTO);

        
        assertThat(result).isNotNull();
        assertThat(result.getPrice()).isEqualByComparingTo(new BigDecimal("300.00"));
        verify(roomRepository, times(1)).findById(1L);
        verify(roomPriceRepository, times(1)).save(any(RoomPrice.class));
    }

    @Test
    @DisplayName("create() - powinien rzucić wyjątek gdy pokój nie istnieje")
    void create_ShouldThrowException_WhenRoomNotFound() {
        
        when(roomRepository.findById(1L)).thenReturn(Optional.empty());

        
        assertThatThrownBy(() -> roomPriceService.create(testRoomPriceDTO))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Nie znaleziono pokoju o ID");

        verify(roomPriceRepository, never()).save(any(RoomPrice.class));
    }

    @Test
    @DisplayName("create() - powinien przypisać pokój do ceny")
    void create_ShouldAssignRoomToPrice() {
        
        when(roomRepository.findById(1L)).thenReturn(Optional.of(testRoom));
        when(roomPriceRepository.save(any(RoomPrice.class))).thenAnswer(inv -> inv.getArgument(0));

        
        roomPriceService.create(testRoomPriceDTO);

        
        ArgumentCaptor<RoomPrice> captor = ArgumentCaptor.forClass(RoomPrice.class);
        verify(roomPriceRepository).save(captor.capture());
        assertThat(captor.getValue().getRoom()).isEqualTo(testRoom);
    }

    @Test
    @DisplayName("create() - powinien zmapować wszystkie pola")
    void create_ShouldMapAllFields() {
        
        when(roomRepository.findById(1L)).thenReturn(Optional.of(testRoom));
        when(roomPriceRepository.save(any(RoomPrice.class))).thenAnswer(inv -> inv.getArgument(0));

        
        roomPriceService.create(testRoomPriceDTO);

        
        ArgumentCaptor<RoomPrice> captor = ArgumentCaptor.forClass(RoomPrice.class);
        verify(roomPriceRepository).save(captor.capture());
        RoomPrice saved = captor.getValue();

        assertThat(saved.getStartDate()).isEqualTo(LocalDate.of(2024, 6, 1));
        assertThat(saved.getEndDate()).isEqualTo(LocalDate.of(2024, 8, 31));
        assertThat(saved.getPrice()).isEqualByComparingTo(new BigDecimal("300.00"));
        assertThat(saved.getSeasonName()).isEqualTo("Lato");
    }


    @Test
    @DisplayName("update() - powinien zaktualizować cenę")
    void update_ShouldUpdateRoomPrice() {
        
        when(roomPriceRepository.findById(1L)).thenReturn(Optional.of(testRoomPrice));
        when(roomRepository.findById(1L)).thenReturn(Optional.of(testRoom));
        when(roomPriceRepository.save(any(RoomPrice.class))).thenReturn(testRoomPrice);

        RoomPriceDTO updateDTO = new RoomPriceDTO();
        updateDTO.setStartDate(LocalDate.of(2024, 12, 1));
        updateDTO.setEndDate(LocalDate.of(2025, 2, 28));
        updateDTO.setPrice(new BigDecimal("400.00"));
        updateDTO.setSeasonName("Zima");
        updateDTO.setRoomId(1L);

        
        RoomPriceDTO result = roomPriceService.update(1L, updateDTO);

        
        assertThat(result).isNotNull();
        verify(roomPriceRepository, times(1)).save(any(RoomPrice.class));
    }

    @Test
    @DisplayName("update() - powinien rzucić wyjątek gdy cena nie istnieje")
    void update_ShouldThrowException_WhenPriceNotFound() {
        
        when(roomPriceRepository.findById(1L)).thenReturn(Optional.empty());

        
        assertThatThrownBy(() -> roomPriceService.update(1L, testRoomPriceDTO))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Nie znaleziono ceny o ID");

        verify(roomPriceRepository, never()).save(any(RoomPrice.class));
    }

    @Test
    @DisplayName("update() - powinien rzucić wyjątek gdy nowy pokój nie istnieje")
    void update_ShouldThrowException_WhenNewRoomNotFound() {
        
        when(roomPriceRepository.findById(1L)).thenReturn(Optional.of(testRoomPrice));
        when(roomRepository.findById(1L)).thenReturn(Optional.empty());

        
        assertThatThrownBy(() -> roomPriceService.update(1L, testRoomPriceDTO))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Nie znaleziono pokoju o ID");

        verify(roomPriceRepository, never()).save(any(RoomPrice.class));
    }

    @Test
    @DisplayName("update() - powinien zaktualizować wszystkie pola")
    void update_ShouldUpdateAllFields() {
        
        when(roomPriceRepository.findById(1L)).thenReturn(Optional.of(testRoomPrice));
        when(roomRepository.findById(1L)).thenReturn(Optional.of(testRoom));
        when(roomPriceRepository.save(any(RoomPrice.class))).thenAnswer(inv -> inv.getArgument(0));

        RoomPriceDTO updateDTO = new RoomPriceDTO();
        updateDTO.setStartDate(LocalDate.of(2025, 1, 1));
        updateDTO.setEndDate(LocalDate.of(2025, 3, 31));
        updateDTO.setPrice(new BigDecimal("500.00"));
        updateDTO.setSeasonName("Wiosna");
        updateDTO.setRoomId(1L);

        
        roomPriceService.update(1L, updateDTO);

        
        assertThat(testRoomPrice.getStartDate()).isEqualTo(LocalDate.of(2025, 1, 1));
        assertThat(testRoomPrice.getEndDate()).isEqualTo(LocalDate.of(2025, 3, 31));
        assertThat(testRoomPrice.getPrice()).isEqualByComparingTo(new BigDecimal("500.00"));
        assertThat(testRoomPrice.getSeasonName()).isEqualTo("Wiosna");
    }


    @Test
    @DisplayName("delete() - powinien usunąć cenę gdy istnieje")
    void delete_ShouldDeletePrice_WhenExists() {
        
        when(roomPriceRepository.existsById(1L)).thenReturn(true);
        doNothing().when(roomPriceRepository).deleteById(1L);

        
        roomPriceService.delete(1L);

        
        verify(roomPriceRepository, times(1)).existsById(1L);
        verify(roomPriceRepository, times(1)).deleteById(1L);
    }

    @Test
    @DisplayName("delete() - powinien rzucić wyjątek gdy cena nie istnieje")
    void delete_ShouldThrowException_WhenPriceNotFound() {
        
        when(roomPriceRepository.existsById(1L)).thenReturn(false);

        
        assertThatThrownBy(() -> roomPriceService.delete(1L))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Brak ceny o ID");

        verify(roomPriceRepository, never()).deleteById(anyLong());
    }
}