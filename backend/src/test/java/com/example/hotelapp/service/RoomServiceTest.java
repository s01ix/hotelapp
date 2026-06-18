package com.example.hotelapp.service;

import com.example.hotelapp.dto.RoomDTO;
import com.example.hotelapp.model.*;
import com.example.hotelapp.repository.AmenityRepository;
import com.example.hotelapp.repository.HotelRepository;
import com.example.hotelapp.repository.RoomPhotoRepository;
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
@DisplayName("RoomService - Testy jednostkowe")
class RoomServiceTest {

    @Mock
    private RoomRepository roomRepository;

    @Mock
    private HotelRepository hotelRepository;

    @Mock
    private AmenityRepository amenityRepository;

    @Mock
    private RoomPhotoRepository roomPhotoRepository;

    @InjectMocks
    private RoomService roomService;

    private Hotel testHotel;
    private Room testRoom;
    private RoomDTO testRoomDTO;
    private Amenity testAmenity;
    private RoomPhoto testPhoto;

    @BeforeEach
    void setUp() {
        testHotel = new Hotel();
        testHotel.setId(1L);
        testHotel.setName("Hotel Marriott");

        testAmenity = new Amenity();
        testAmenity.setId(1L);
        testAmenity.setName("Wi-Fi");

        testPhoto = new RoomPhoto();
        testPhoto.setId(1L);
        testPhoto.setUrl("https://example.com/photo.jpg");
        testPhoto.setIsPrimary(true);

        testRoom = new Room();
        testRoom.setId(1L);
        testRoom.setRoomNumber("101");
        testRoom.setName("Deluxe Room");
        testRoom.setDescription("Luksusowy pokój");
        testRoom.setBedCount(2);
        testRoom.setMaxGuests(4);
        testRoom.setBasePrice(new BigDecimal("200.00"));
        testRoom.setCurrency("PLN");
        testRoom.setStatus(RoomStatus.DOSTEPNY);
        testRoom.setHotel(testHotel);
        testRoom.setAmenities(Arrays.asList(testAmenity));

        testRoomDTO = new RoomDTO();
        testRoomDTO.setId(1L);
        testRoomDTO.setRoomNumber("101");
        testRoomDTO.setName("Deluxe Room");
        testRoomDTO.setDescription("Luksusowy pokój");
        testRoomDTO.setBedCount(2);
        testRoomDTO.setMaxGuests(4);
        testRoomDTO.setBasePrice(new BigDecimal("200.00"));
        testRoomDTO.setCurrency("PLN");
        testRoomDTO.setStatus(RoomStatus.DOSTEPNY);
        testRoomDTO.setHotelId(1L);
        testRoomDTO.setAmenityIds(Arrays.asList(1L));
    }

    @Test
    @DisplayName("getAll() - powinien zwrócić wszystkie pokoje")
    void getAll_ShouldReturnAllRooms() {
        
        testPhoto.setRoom(testRoom);
        when(roomRepository.findAll()).thenReturn(Arrays.asList(testRoom));
        when(roomPhotoRepository.findByRoomId(1L)).thenReturn(Arrays.asList(testPhoto));

        
        List<RoomDTO> result = roomService.getAll();

        
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getRoomNumber()).isEqualTo("101");
        assertThat(result.get(0).getName()).isEqualTo("Deluxe Room");
        verify(roomRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("getAll() - powinien zwrócić pustą listę gdy brak pokoi")
    void getAll_ShouldReturnEmptyList_WhenNoRooms() {
        
        when(roomRepository.findAll()).thenReturn(List.of());

        
        List<RoomDTO> result = roomService.getAll();

        
        assertThat(result).isEmpty();
        verify(roomRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("getAll() - powinien zawierać zdjęcia pokoi")
    void getAll_ShouldIncludeRoomPhotos() {
        
        testPhoto.setRoom(testRoom);
        when(roomRepository.findAll()).thenReturn(Arrays.asList(testRoom));
        when(roomPhotoRepository.findByRoomId(1L)).thenReturn(Arrays.asList(testPhoto));

        
        List<RoomDTO> result = roomService.getAll();

        
        assertThat(result.get(0).getPhotos()).hasSize(1);
        assertThat(result.get(0).getPhotos().get(0).getUrl()).isEqualTo("https://example.com/photo.jpg");
        verify(roomPhotoRepository, times(1)).findByRoomId(1L);
    }

    @Test
    @DisplayName("getAll() - powinien zawierać listę udogodnień")
    void getAll_ShouldIncludeAmenities() {
        
        when(roomRepository.findAll()).thenReturn(Arrays.asList(testRoom));
        when(roomPhotoRepository.findByRoomId(1L)).thenReturn(List.of());

        
        List<RoomDTO> result = roomService.getAll();

        
        assertThat(result.get(0).getAmenityIds()).hasSize(1);
        assertThat(result.get(0).getAmenityIds()).contains(1L);
        assertThat(result.get(0).getAmenities()).contains("Wi-Fi");
    }


    @Test
    @DisplayName("searchAvailableRooms() - powinien znaleźć dostępne pokoje")
    void searchAvailableRooms_ShouldFindAvailableRooms() {
        
        LocalDate checkIn = LocalDate.now().plusDays(1);
        LocalDate checkOut = LocalDate.now().plusDays(3);
        Integer guests = 2;

        when(roomRepository.findAvailableRooms(checkIn, checkOut, guests))
                .thenReturn(Arrays.asList(testRoom));
        when(roomPhotoRepository.findByRoomId(1L)).thenReturn(List.of());

        
        List<RoomDTO> result = roomService.searchAvailableRooms(checkIn, checkOut, guests);

        
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getRoomNumber()).isEqualTo("101");
        verify(roomRepository, times(1)).findAvailableRooms(checkIn, checkOut, guests);
    }

    @Test
    @DisplayName("searchAvailableRooms() - powinien użyć domyślnej liczby gości gdy null")
    void searchAvailableRooms_ShouldUseDefaultGuests_WhenNull() {
        
        LocalDate checkIn = LocalDate.now().plusDays(1);
        LocalDate checkOut = LocalDate.now().plusDays(3);

        when(roomRepository.findAvailableRooms(eq(checkIn), eq(checkOut), isNull()))
                .thenReturn(List.of());

        
        roomService.searchAvailableRooms(checkIn, checkOut, null);

        
        verify(roomRepository, times(1)).findAvailableRooms(checkIn, checkOut, null);
    }

    @Test
    @DisplayName("searchAvailableRooms() - powinien zwrócić pustą listę gdy brak dostępnych pokoi")
    void searchAvailableRooms_ShouldReturnEmptyList_WhenNoAvailableRooms() {
        
        LocalDate checkIn = LocalDate.now().plusDays(1);
        LocalDate checkOut = LocalDate.now().plusDays(3);
        Integer guests = 2;

        when(roomRepository.findAvailableRooms(checkIn, checkOut, guests)).thenReturn(List.of());

        
        List<RoomDTO> result = roomService.searchAvailableRooms(checkIn, checkOut, guests);

        
        assertThat(result).isEmpty();
    }


    @Test
    @DisplayName("getRoomById() - powinien zwrócić pokój po ID")
    void getRoomById_ShouldReturnRoom() {
        
        when(roomRepository.findById(1L)).thenReturn(Optional.of(testRoom));
        when(roomPhotoRepository.findByRoomId(1L)).thenReturn(List.of());

        
        RoomDTO result = roomService.getRoomById(1L);

        
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getRoomNumber()).isEqualTo("101");
        verify(roomRepository, times(1)).findById(1L);
    }

    @Test
    @DisplayName("getRoomById() - powinien rzucić wyjątek gdy pokój nie istnieje")
    void getRoomById_ShouldThrowException_WhenRoomNotFound() {
        
        when(roomRepository.findById(1L)).thenReturn(Optional.empty());

        
        assertThatThrownBy(() -> roomService.getRoomById(1L))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Nie znaleziono pokoju o podanym ID");
    }

    

    @Test
    @DisplayName("create() - powinien utworzyć pokój")
    void create_ShouldCreateRoom() {
        
        when(hotelRepository.findById(1L)).thenReturn(Optional.of(testHotel));
        when(amenityRepository.findAllById(Arrays.asList(1L))).thenReturn(Arrays.asList(testAmenity));
        when(roomRepository.save(any(Room.class))).thenReturn(testRoom);
        when(roomPhotoRepository.findByRoomId(1L)).thenReturn(List.of());

        
        RoomDTO result = roomService.create(testRoomDTO);

        
        assertThat(result).isNotNull();
        assertThat(result.getRoomNumber()).isEqualTo("101");
        verify(hotelRepository, times(1)).findById(1L);
        verify(roomRepository, times(1)).save(any(Room.class));
    }

    @Test
    @DisplayName("create() - powinien rzucić wyjątek gdy hotel nie istnieje")
    void create_ShouldThrowException_WhenHotelNotFound() {
        
        when(hotelRepository.findById(1L)).thenReturn(Optional.empty());

        
        assertThatThrownBy(() -> roomService.create(testRoomDTO))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Nie znaleziono hotelu o ID");

        verify(roomRepository, never()).save(any(Room.class));
    }

    @Test
    @DisplayName("create() - powinien użyć domyślnej waluty PLN gdy nie podano")
    void create_ShouldUseDefaultCurrency_WhenNotProvided() {
        
        testRoomDTO.setCurrency(null);
        when(hotelRepository.findById(1L)).thenReturn(Optional.of(testHotel));
        when(amenityRepository.findAllById(anyList())).thenReturn(List.of());
        when(roomRepository.save(any(Room.class))).thenAnswer(inv -> inv.getArgument(0));

        
        roomService.create(testRoomDTO);

        
        ArgumentCaptor<Room> captor = ArgumentCaptor.forClass(Room.class);
        verify(roomRepository).save(captor.capture());
        assertThat(captor.getValue().getCurrency()).isEqualTo("PLN");
    }

    @Test
    @DisplayName("create() - powinien przypisać hotel do pokoju")
    void create_ShouldAssignHotelToRoom() {
        
        when(hotelRepository.findById(1L)).thenReturn(Optional.of(testHotel));
        when(amenityRepository.findAllById(anyList())).thenReturn(List.of());
        when(roomRepository.save(any(Room.class))).thenAnswer(inv -> inv.getArgument(0));

        
        roomService.create(testRoomDTO);

        
        ArgumentCaptor<Room> captor = ArgumentCaptor.forClass(Room.class);
        verify(roomRepository).save(captor.capture());
        assertThat(captor.getValue().getHotel()).isEqualTo(testHotel);
    }

    @Test
    @DisplayName("create() - powinien przypisać udogodnienia do pokoju")
    void create_ShouldAssignAmenitiesToRoom() {
        
        when(hotelRepository.findById(1L)).thenReturn(Optional.of(testHotel));
        when(amenityRepository.findAllById(Arrays.asList(1L))).thenReturn(Arrays.asList(testAmenity));
        when(roomRepository.save(any(Room.class))).thenAnswer(inv -> inv.getArgument(0));

        
        roomService.create(testRoomDTO);

        
        ArgumentCaptor<Room> captor = ArgumentCaptor.forClass(Room.class);
        verify(roomRepository).save(captor.capture());
        assertThat(captor.getValue().getAmenities()).hasSize(1);
        assertThat(captor.getValue().getAmenities()).contains(testAmenity);
    }

    @Test
    @DisplayName("create() - powinien obsłużyć pustą listę udogodnień")
    void create_ShouldHandleEmptyAmenities() {
        
        testRoomDTO.setAmenityIds(null);
        when(hotelRepository.findById(1L)).thenReturn(Optional.of(testHotel));
        when(roomRepository.save(any(Room.class))).thenAnswer(inv -> inv.getArgument(0));

        
        roomService.create(testRoomDTO);

        
        ArgumentCaptor<Room> captor = ArgumentCaptor.forClass(Room.class);
        verify(roomRepository).save(captor.capture());
        assertThat(captor.getValue().getAmenities()).isEmpty();
        verify(amenityRepository, never()).findAllById(anyList());
    }


    @Test
    @DisplayName("update() - powinien zaktualizować pokój")
    void update_ShouldUpdateRoom() {
        
        when(roomRepository.findById(1L)).thenReturn(Optional.of(testRoom));
        when(hotelRepository.findById(1L)).thenReturn(Optional.of(testHotel));
        when(amenityRepository.findAllById(Arrays.asList(1L))).thenReturn(Arrays.asList(testAmenity));
        when(roomRepository.save(any(Room.class))).thenReturn(testRoom);
        when(roomPhotoRepository.findByRoomId(1L)).thenReturn(List.of());

        RoomDTO updateDTO = new RoomDTO();
        updateDTO.setRoomNumber("102");
        updateDTO.setName("Updated Room");
        updateDTO.setDescription("Updated description");
        updateDTO.setBedCount(3);
        updateDTO.setMaxGuests(5);
        updateDTO.setBasePrice(new BigDecimal("300.00"));
        updateDTO.setCurrency("EUR");
        updateDTO.setStatus(RoomStatus.SERWIS);
        updateDTO.setHotelId(1L);
        updateDTO.setAmenityIds(Arrays.asList(1L));

        
        RoomDTO result = roomService.update(1L, updateDTO);

        
        assertThat(result).isNotNull();
        verify(roomRepository, times(1)).save(any(Room.class));
    }

    @Test
    @DisplayName("update() - powinien rzucić wyjątek gdy pokój nie istnieje")
    void update_ShouldThrowException_WhenRoomNotFound() {
        
        when(roomRepository.findById(1L)).thenReturn(Optional.empty());

        
        assertThatThrownBy(() -> roomService.update(1L, testRoomDTO))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Nie znaleziono pokoju o ID");

        verify(roomRepository, never()).save(any(Room.class));
    }

    @Test
    @DisplayName("update() - powinien rzucić wyjątek gdy nowy hotel nie istnieje")
    void update_ShouldThrowException_WhenNewHotelNotFound() {
        
        when(roomRepository.findById(1L)).thenReturn(Optional.of(testRoom));
        when(hotelRepository.findById(1L)).thenReturn(Optional.empty());

        
        assertThatThrownBy(() -> roomService.update(1L, testRoomDTO))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Nie znaleziono hotelu o ID");

        verify(roomRepository, never()).save(any(Room.class));
    }

    @Test
    @DisplayName("delete() - powinien usunąć pokój gdy istnieje")
    void delete_ShouldDeleteRoom_WhenExists() {
        
        when(roomRepository.existsById(1L)).thenReturn(true);
        doNothing().when(roomRepository).deleteById(1L);

        
        roomService.delete(1L);

        
        verify(roomRepository, times(1)).existsById(1L);
        verify(roomRepository, times(1)).deleteById(1L);
    }

    @Test
    @DisplayName("delete() - powinien rzucić wyjątek gdy pokój nie istnieje")
    void delete_ShouldThrowException_WhenRoomNotFound() {
        
        when(roomRepository.existsById(1L)).thenReturn(false);

        
        assertThatThrownBy(() -> roomService.delete(1L))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Nie można usunąć: brak pokoju o ID");

        verify(roomRepository, never()).deleteById(anyLong());
    }
}