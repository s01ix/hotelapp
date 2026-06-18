package com.example.hotelapp.service;

import com.example.hotelapp.dto.HotelDTO;
import com.example.hotelapp.model.Hotel;
import com.example.hotelapp.model.Location;
import com.example.hotelapp.repository.HotelRepository;
import com.example.hotelapp.repository.LocationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("HotelService - Testy jednostkowe")
class HotelServiceTest {

    @Mock
    private HotelRepository hotelRepository;

    @Mock
    private LocationRepository locationRepository;

    @InjectMocks
    private HotelService hotelService;

    private Hotel testHotel;
    private HotelDTO testHotelDTO;
    private Location testLocation;

    @BeforeEach
    void setUp() {
        testLocation = new Location();
        testLocation.setId(1L);
        testLocation.setCountry("Polska");
        testLocation.setCity("Warszawa");
        testLocation.setStreet("Marszałkowska");
        testLocation.setBuildingNumber("10");
        testLocation.setPostalCode("00-001");

        testHotel = new Hotel();
        testHotel.setId(1L);
        testHotel.setName("Hotel Marriott");
        testHotel.setDescription("Luksusowy hotel");
        testHotel.setStars(5);
        testHotel.setPhone("123456789");
        testHotel.setEmail("marriott@example.com");
        testHotel.setLocation(testLocation);

        testHotelDTO = new HotelDTO();
        testHotelDTO.setId(1L);
        testHotelDTO.setName("Hotel Marriott");
        testHotelDTO.setDescription("Luksusowy hotel");
        testHotelDTO.setStars(5);
        testHotelDTO.setPhone("123456789");
        testHotelDTO.setEmail("marriott@example.com");
        testHotelDTO.setLocationId(1L);
    }

    @Test
    @DisplayName("getAll() - powinien zwrócić wszystkie hotele")
    void getAll_ShouldReturnAllHotels() {
        
        List<Hotel> hotels = Arrays.asList(testHotel);
        when(hotelRepository.findAll()).thenReturn(hotels);

        
        List<HotelDTO> result = hotelService.getAll();

        
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getName()).isEqualTo("Hotel Marriott");
        assertThat(result.get(0).getLocationId()).isEqualTo(1L);
        verify(hotelRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("getAll() - powinien zwrócić pustą listę gdy brak hoteli")
    void getAll_ShouldReturnEmptyList_WhenNoHotels() {
        
        when(hotelRepository.findAll()).thenReturn(List.of());

        
        List<HotelDTO> result = hotelService.getAll();

        
        assertThat(result).isEmpty();
        verify(hotelRepository, times(1)).findAll();
    }

    

    @Test
    @DisplayName("create() - powinien utworzyć hotel")
    void create_ShouldCreateHotel() {
        
        when(locationRepository.findById(1L)).thenReturn(Optional.of(testLocation));
        when(hotelRepository.save(any(Hotel.class))).thenReturn(testHotel);

        
        HotelDTO result = hotelService.create(testHotelDTO);

        
        assertThat(result).isNotNull();
        assertThat(result.getName()).isEqualTo("Hotel Marriott");
        assertThat(result.getLocationId()).isEqualTo(1L);
        verify(locationRepository, times(1)).findById(1L);
        verify(hotelRepository, times(1)).save(any(Hotel.class));
    }

    @Test
    @DisplayName("create() - powinien rzucić wyjątek gdy lokalizacja nie istnieje")
    void create_ShouldThrowException_WhenLocationNotFound() {
        
        when(locationRepository.findById(1L)).thenReturn(Optional.empty());

        
        assertThatThrownBy(() -> hotelService.create(testHotelDTO))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Nie znaleziono lokalizacji o podanym ID");

        verify(hotelRepository, never()).save(any(Hotel.class));
    }

    @Test
    @DisplayName("create() - powinien przypisać lokalizację do hotelu")
    void create_ShouldAssignLocationToHotel() {
        
        when(locationRepository.findById(1L)).thenReturn(Optional.of(testLocation));
        when(hotelRepository.save(any(Hotel.class))).thenAnswer(inv -> inv.getArgument(0));

        
        hotelService.create(testHotelDTO);

        
        ArgumentCaptor<Hotel> captor = ArgumentCaptor.forClass(Hotel.class);
        verify(hotelRepository).save(captor.capture());
        assertThat(captor.getValue().getLocation()).isEqualTo(testLocation);
    }

    @Test
    @DisplayName("create() - powinien zmapować wszystkie pola z DTO")
    void create_ShouldMapAllFieldsFromDTO() {
        
        when(locationRepository.findById(1L)).thenReturn(Optional.of(testLocation));
        when(hotelRepository.save(any(Hotel.class))).thenAnswer(inv -> inv.getArgument(0));

        
        hotelService.create(testHotelDTO);

        
        ArgumentCaptor<Hotel> captor = ArgumentCaptor.forClass(Hotel.class);
        verify(hotelRepository).save(captor.capture());
        Hotel saved = captor.getValue();

        assertThat(saved.getName()).isEqualTo("Hotel Marriott");
        assertThat(saved.getDescription()).isEqualTo("Luksusowy hotel");
        assertThat(saved.getStars()).isEqualTo(5);
        assertThat(saved.getPhone()).isEqualTo("123456789");
        assertThat(saved.getEmail()).isEqualTo("marriott@example.com");
    }


    @Test
    @DisplayName("update() - powinien zaktualizować hotel")
    void update_ShouldUpdateHotel() {
        
        when(hotelRepository.findById(1L)).thenReturn(Optional.of(testHotel));
        when(locationRepository.findById(1L)).thenReturn(Optional.of(testLocation));
        when(hotelRepository.save(any(Hotel.class))).thenReturn(testHotel);

        HotelDTO updateDTO = new HotelDTO();
        updateDTO.setName("Hotel Updated");
        updateDTO.setDescription("Updated description");
        updateDTO.setStars(4);
        updateDTO.setPhone("987654321");
        updateDTO.setEmail("updated@example.com");
        updateDTO.setLocationId(1L);

        
        HotelDTO result = hotelService.update(1L, updateDTO);

        
        assertThat(result).isNotNull();
        verify(hotelRepository, times(1)).findById(1L);
        verify(hotelRepository, times(1)).save(any(Hotel.class));
    }

    @Test
    @DisplayName("update() - powinien rzucić wyjątek gdy hotel nie istnieje")
    void update_ShouldThrowException_WhenHotelNotFound() {
        
        when(hotelRepository.findById(1L)).thenReturn(Optional.empty());

        
        assertThatThrownBy(() -> hotelService.update(1L, testHotelDTO))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Nie znaleziono hotelu o podanym ID");

        verify(hotelRepository, never()).save(any(Hotel.class));
    }

    @Test
    @DisplayName("update() - powinien rzucić wyjątek gdy nowa lokalizacja nie istnieje")
    void update_ShouldThrowException_WhenNewLocationNotFound() {
        
        when(hotelRepository.findById(1L)).thenReturn(Optional.of(testHotel));
        when(locationRepository.findById(1L)).thenReturn(Optional.empty());

        
        assertThatThrownBy(() -> hotelService.update(1L, testHotelDTO))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Nie istnieje lokalizacja o ID");

        verify(hotelRepository, never()).save(any(Hotel.class));
    }

    @Test
    @DisplayName("update() - powinien zaktualizować wszystkie pola")
    void update_ShouldUpdateAllFields() {
        
        when(hotelRepository.findById(1L)).thenReturn(Optional.of(testHotel));
        when(locationRepository.findById(1L)).thenReturn(Optional.of(testLocation));
        when(hotelRepository.save(any(Hotel.class))).thenAnswer(inv -> inv.getArgument(0));

        HotelDTO updateDTO = new HotelDTO();
        updateDTO.setName("New Name");
        updateDTO.setDescription("New Description");
        updateDTO.setStars(3);
        updateDTO.setPhone("111222333");
        updateDTO.setEmail("new@example.com");
        updateDTO.setLocationId(1L);

        
        hotelService.update(1L, updateDTO);

        
        assertThat(testHotel.getName()).isEqualTo("New Name");
        assertThat(testHotel.getDescription()).isEqualTo("New Description");
        assertThat(testHotel.getStars()).isEqualTo(3);
        assertThat(testHotel.getPhone()).isEqualTo("111222333");
        assertThat(testHotel.getEmail()).isEqualTo("new@example.com");
    }


    @Test
    @DisplayName("delete() - powinien usunąć hotel gdy istnieje")
    void delete_ShouldDeleteHotel_WhenExists() {
        
        when(hotelRepository.existsById(1L)).thenReturn(true);
        doNothing().when(hotelRepository).deleteById(1L);

        
        hotelService.delete(1L);

        
        verify(hotelRepository, times(1)).existsById(1L);
        verify(hotelRepository, times(1)).deleteById(1L);
    }

    @Test
    @DisplayName("delete() - powinien rzucić wyjątek gdy hotel nie istnieje")
    void delete_ShouldThrowException_WhenHotelNotFound() {
        
        when(hotelRepository.existsById(1L)).thenReturn(false);

        
        assertThatThrownBy(() -> hotelService.delete(1L))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Nie można usunąć: brak hotelu o ID");

        verify(hotelRepository, never()).deleteById(anyLong());
    }
}