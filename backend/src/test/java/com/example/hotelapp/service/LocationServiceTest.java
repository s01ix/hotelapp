package com.example.hotelapp.service;

import com.example.hotelapp.dto.LocationDTO;
import com.example.hotelapp.model.Location;
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
@DisplayName("LocationService - Testy jednostkowe")
class LocationServiceTest {

    @Mock
    private LocationRepository locationRepository;

    @InjectMocks
    private LocationService locationService;

    private Location testLocation;
    private LocationDTO testLocationDTO;

    @BeforeEach
    void setUp() {
        testLocation = new Location();
        testLocation.setId(1L);
        testLocation.setCountry("Polska");
        testLocation.setCity("Warszawa");
        testLocation.setStreet("Marszałkowska");
        testLocation.setBuildingNumber("10");
        testLocation.setPostalCode("00-001");

        testLocationDTO = new LocationDTO();
        testLocationDTO.setId(1L);
        testLocationDTO.setCountry("Polska");
        testLocationDTO.setCity("Warszawa");
        testLocationDTO.setStreet("Marszałkowska");
        testLocationDTO.setBuildingNumber("10");
        testLocationDTO.setPostalCode("00-001");
    }

    @Test
    @DisplayName("getAll() - powinien zwrócić wszystkie lokalizacje")
    void getAll_ShouldReturnAllLocations() {
        
        List<Location> locations = Arrays.asList(testLocation);
        when(locationRepository.findAll()).thenReturn(locations);

        
        List<LocationDTO> result = locationService.getAll();

        
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getCity()).isEqualTo("Warszawa");
        assertThat(result.get(0).getCountry()).isEqualTo("Polska");
        verify(locationRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("getAll() - powinien zwrócić pustą listę gdy brak lokalizacji")
    void getAll_ShouldReturnEmptyList_WhenNoLocations() {
        
        when(locationRepository.findAll()).thenReturn(List.of());

        
        List<LocationDTO> result = locationService.getAll();

        
        assertThat(result).isEmpty();
        verify(locationRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("getAll() - powinien zmapować wszystkie pola")
    void getAll_ShouldMapAllFields() {
        
        when(locationRepository.findAll()).thenReturn(Arrays.asList(testLocation));

        
        List<LocationDTO> result = locationService.getAll();

        
        LocationDTO dto = result.get(0);
        assertThat(dto.getId()).isEqualTo(1L);
        assertThat(dto.getCountry()).isEqualTo("Polska");
        assertThat(dto.getCity()).isEqualTo("Warszawa");
        assertThat(dto.getStreet()).isEqualTo("Marszałkowska");
        assertThat(dto.getBuildingNumber()).isEqualTo("10");
        assertThat(dto.getPostalCode()).isEqualTo("00-001");
    }

    

    @Test
    @DisplayName("create() - powinien utworzyć lokalizację")
    void create_ShouldCreateLocation() {
        
        when(locationRepository.save(any(Location.class))).thenReturn(testLocation);

        
        LocationDTO result = locationService.create(testLocationDTO);

        
        assertThat(result).isNotNull();
        assertThat(result.getCity()).isEqualTo("Warszawa");
        verify(locationRepository, times(1)).save(any(Location.class));
    }

    @Test
    @DisplayName("create() - powinien zmapować wszystkie pola z DTO na encję")
    void create_ShouldMapAllFieldsFromDTOToEntity() {
        
        when(locationRepository.save(any(Location.class))).thenAnswer(inv -> inv.getArgument(0));

        
        locationService.create(testLocationDTO);

        
        ArgumentCaptor<Location> captor = ArgumentCaptor.forClass(Location.class);
        verify(locationRepository).save(captor.capture());
        Location saved = captor.getValue();

        assertThat(saved.getCountry()).isEqualTo("Polska");
        assertThat(saved.getCity()).isEqualTo("Warszawa");
        assertThat(saved.getStreet()).isEqualTo("Marszałkowska");
        assertThat(saved.getBuildingNumber()).isEqualTo("10");
        assertThat(saved.getPostalCode()).isEqualTo("00-001");
    }

    @Test
    @DisplayName("create() - nie powinien ustawiać ID przy tworzeniu")
    void create_ShouldNotSetIdWhenCreating() {
        
        when(locationRepository.save(any(Location.class))).thenAnswer(inv -> inv.getArgument(0));

        
        locationService.create(testLocationDTO);

        
        ArgumentCaptor<Location> captor = ArgumentCaptor.forClass(Location.class);
        verify(locationRepository).save(captor.capture());
        assertThat(captor.getValue().getId()).isNull();
    }


    @Test
    @DisplayName("update() - powinien zaktualizować lokalizację")
    void update_ShouldUpdateLocation() {
        
        when(locationRepository.findById(1L)).thenReturn(Optional.of(testLocation));
        when(locationRepository.save(any(Location.class))).thenReturn(testLocation);

        LocationDTO updateDTO = new LocationDTO();
        updateDTO.setCountry("Niemcy");
        updateDTO.setCity("Berlin");
        updateDTO.setStreet("Unter den Linden");
        updateDTO.setBuildingNumber("1");
        updateDTO.setPostalCode("10117");

        
        LocationDTO result = locationService.update(1L, updateDTO);

        
        assertThat(result).isNotNull();
        verify(locationRepository, times(1)).findById(1L);
        verify(locationRepository, times(1)).save(any(Location.class));
    }

    @Test
    @DisplayName("update() - powinien rzucić wyjątek gdy lokalizacja nie istnieje")
    void update_ShouldThrowException_WhenLocationNotFound() {
        
        when(locationRepository.findById(1L)).thenReturn(Optional.empty());

        
        assertThatThrownBy(() -> locationService.update(1L, testLocationDTO))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Nie znaleziono lokalizacji o podanym ID");

        verify(locationRepository, never()).save(any(Location.class));
    }

    @Test
    @DisplayName("update() - powinien zaktualizować wszystkie pola")
    void update_ShouldUpdateAllFields() {
        
        when(locationRepository.findById(1L)).thenReturn(Optional.of(testLocation));
        when(locationRepository.save(any(Location.class))).thenAnswer(inv -> inv.getArgument(0));

        LocationDTO updateDTO = new LocationDTO();
        updateDTO.setCountry("Francja");
        updateDTO.setCity("Paryż");
        updateDTO.setStreet("Champs-Élysées");
        updateDTO.setBuildingNumber("100");
        updateDTO.setPostalCode("75008");

        
        locationService.update(1L, updateDTO);

        
        assertThat(testLocation.getCountry()).isEqualTo("Francja");
        assertThat(testLocation.getCity()).isEqualTo("Paryż");
        assertThat(testLocation.getStreet()).isEqualTo("Champs-Élysées");
        assertThat(testLocation.getBuildingNumber()).isEqualTo("100");
        assertThat(testLocation.getPostalCode()).isEqualTo("75008");
    }

    @Test
    @DisplayName("update() - powinien zachować ID podczas aktualizacji")
    void update_ShouldKeepIdWhenUpdating() {
        
        when(locationRepository.findById(1L)).thenReturn(Optional.of(testLocation));
        when(locationRepository.save(any(Location.class))).thenAnswer(inv -> inv.getArgument(0));

        
        LocationDTO result = locationService.update(1L, testLocationDTO);

        
        assertThat(result.getId()).isEqualTo(1L);
    }


    @Test
    @DisplayName("delete() - powinien usunąć lokalizację gdy istnieje")
    void delete_ShouldDeleteLocation_WhenExists() {
        
        when(locationRepository.existsById(1L)).thenReturn(true);
        doNothing().when(locationRepository).deleteById(1L);

        
        locationService.delete(1L);

        
        verify(locationRepository, times(1)).existsById(1L);
        verify(locationRepository, times(1)).deleteById(1L);
    }

    @Test
    @DisplayName("delete() - powinien rzucić wyjątek gdy lokalizacja nie istnieje")
    void delete_ShouldThrowException_WhenLocationNotFound() {
        
        when(locationRepository.existsById(1L)).thenReturn(false);

        
        assertThatThrownBy(() -> locationService.delete(1L))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Nie można usunąć: brak lokalizacji o ID");

        verify(locationRepository, never()).deleteById(anyLong());
    }

    @Test
    @DisplayName("delete() - nie powinien wywoływać deleteById gdy lokalizacja nie istnieje")
    void delete_ShouldNotCallDeleteById_WhenLocationDoesNotExist() {
        
        when(locationRepository.existsById(999L)).thenReturn(false);

        
        assertThatThrownBy(() -> locationService.delete(999L))
                .isInstanceOf(ResponseStatusException.class);

        verify(locationRepository, never()).deleteById(anyLong());
    }
}