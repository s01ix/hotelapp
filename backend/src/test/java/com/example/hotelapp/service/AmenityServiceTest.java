package com.example.hotelapp.service;

import com.example.hotelapp.dto.AmenityDTO;
import com.example.hotelapp.model.Amenity;
import com.example.hotelapp.repository.AmenityRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("AmenityService - Testy jednostkowe")
class AmenityServiceTest {

    @Mock
    private AmenityRepository amenityRepository;

    @InjectMocks
    private AmenityService amenityService;

    private Amenity amenity1;
    private Amenity amenity2;
    private AmenityDTO amenityDTO1;

    @BeforeEach
    void setUp() {
        amenity1 = new Amenity();
        amenity1.setId(1L);
        amenity1.setName("Wi-Fi");
        amenity1.setCategory("Internet");
        amenity1.setDescription("Darmowe Wi-Fi");

        amenity2 = new Amenity();
        amenity2.setId(2L);
        amenity2.setName("Basen");
        amenity2.setCategory("Rekreacja");
        amenity2.setDescription("Odkryty basen");

        amenityDTO1 = new AmenityDTO();
        amenityDTO1.setId(1L);
        amenityDTO1.setName("Wi-Fi");
        amenityDTO1.setCategory("Internet");
        amenityDTO1.setDescription("Darmowe Wi-Fi");
    }

    @Test
    @DisplayName("getAll() - powinien zwrócić listę wszystkich udogodnień")
    void getAll_ShouldReturnListOfAmenityDTOs() {
        
        List<Amenity> amenities = Arrays.asList(amenity1, amenity2);
        when(amenityRepository.findAll()).thenReturn(amenities);

        
        List<AmenityDTO> result = amenityService.getAll();

        
        assertThat(result).hasSize(2);
        assertThat(result.get(0).getId()).isEqualTo(1L);
        assertThat(result.get(0).getName()).isEqualTo("Wi-Fi");
        assertThat(result.get(0).getCategory()).isEqualTo("Internet");
        assertThat(result.get(1).getName()).isEqualTo("Basen");
        verify(amenityRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("getAll() - powinien zwrócić pustą listę gdy brak udogodnień")
    void getAll_ShouldReturnEmptyList_WhenNoAmenities() {
        
        when(amenityRepository.findAll()).thenReturn(Collections.emptyList());

        
        List<AmenityDTO> result = amenityService.getAll();

        
        assertThat(result).isEmpty();
        verify(amenityRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("create() - powinien utworzyć i zwrócić nowe udogodnienie")
    void create_ShouldCreateAndReturnAmenityDTO() {
        
        AmenityDTO inputDTO = new AmenityDTO();
        inputDTO.setName("Parking");
        inputDTO.setCategory("Usługi");
        inputDTO.setDescription("Bezpłatny parking");

        Amenity savedAmenity = new Amenity();
        savedAmenity.setId(3L);
        savedAmenity.setName("Parking");
        savedAmenity.setCategory("Usługi");
        savedAmenity.setDescription("Bezpłatny parking");

        when(amenityRepository.save(any(Amenity.class))).thenReturn(savedAmenity);

        AmenityDTO result = amenityService.create(inputDTO);

        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(3L);
        assertThat(result.getName()).isEqualTo("Parking");
        assertThat(result.getCategory()).isEqualTo("Usługi");
        assertThat(result.getDescription()).isEqualTo("Bezpłatny parking");

        verify(amenityRepository, times(1)).save(any(Amenity.class));
    }

    @Test
    @DisplayName("create() - powinien poprawnie mapować DTO na encję")
    void create_ShouldMapDTOToEntityCorrectly() {
        AmenityDTO inputDTO = new AmenityDTO();
        inputDTO.setName("Spa");
        inputDTO.setCategory("Wellness");
        inputDTO.setDescription("Centrum SPA");

        Amenity savedAmenity = new Amenity();
        savedAmenity.setId(4L);
        savedAmenity.setName("Spa");
        savedAmenity.setCategory("Wellness");
        savedAmenity.setDescription("Centrum SPA");

        when(amenityRepository.save(any(Amenity.class))).thenReturn(savedAmenity);

        amenityService.create(inputDTO);

        verify(amenityRepository).save(argThat(amenity ->
                amenity.getName().equals("Spa") &&
                        amenity.getCategory().equals("Wellness") &&
                        amenity.getDescription().equals("Centrum SPA") &&
                        amenity.getId() == null
        ));
    }

    @Test
    @DisplayName("update() - powinien zaktualizować istniejące udogodnienie")
    void update_ShouldUpdateExistingAmenity() {
        Long amenityId = 1L;
        AmenityDTO updateDTO = new AmenityDTO();
        updateDTO.setName("Wi-Fi Premium");
        updateDTO.setCategory("Internet");
        updateDTO.setDescription("Szybkie Wi-Fi");

        Amenity existingAmenity = new Amenity();
        existingAmenity.setId(amenityId);
        existingAmenity.setName("Wi-Fi");
        existingAmenity.setCategory("Internet");
        existingAmenity.setDescription("Darmowe Wi-Fi");

        when(amenityRepository.findById(amenityId)).thenReturn(Optional.of(existingAmenity));
        when(amenityRepository.save(any(Amenity.class))).thenAnswer(invocation -> invocation.getArgument(0));

        AmenityDTO result = amenityService.update(amenityId, updateDTO);

        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(amenityId);
        assertThat(result.getName()).isEqualTo("Wi-Fi Premium");
        assertThat(result.getCategory()).isEqualTo("Internet");
        assertThat(result.getDescription()).isEqualTo("Szybkie Wi-Fi");

        verify(amenityRepository, times(1)).findById(amenityId);
        verify(amenityRepository, times(1)).save(existingAmenity);
    }

    @Test
    @DisplayName("update() - powinien rzucić wyjątek gdy udogodnienie nie istnieje")
    void update_ShouldThrowException_WhenAmenityNotFound() {
        Long nonExistentId = 999L;
        AmenityDTO updateDTO = new AmenityDTO();
        updateDTO.setName("Test");
        updateDTO.setCategory("Test");
        updateDTO.setDescription("Test");

        when(amenityRepository.findById(nonExistentId)).thenReturn(Optional.empty());

        
        assertThatThrownBy(() -> amenityService.update(nonExistentId, updateDTO))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Nie znaleziono udogodnienia o ID: " + nonExistentId);

        verify(amenityRepository, times(1)).findById(nonExistentId);
        verify(amenityRepository, never()).save(any(Amenity.class));
    }

    @Test
    @DisplayName("update() - powinien zachować ID podczas aktualizacji")
    void update_ShouldKeepIdWhenUpdating() {
        
        Long amenityId = 1L;
        AmenityDTO updateDTO = new AmenityDTO();
        updateDTO.setName("Updated");
        updateDTO.setCategory("Updated");
        updateDTO.setDescription("Updated");

        when(amenityRepository.findById(amenityId)).thenReturn(Optional.of(amenity1));
        when(amenityRepository.save(any(Amenity.class))).thenAnswer(inv -> inv.getArgument(0));

        
        AmenityDTO result = amenityService.update(amenityId, updateDTO);

        
        assertThat(result.getId()).isEqualTo(amenityId);
    }

    @Test
    @DisplayName("delete() - powinien usunąć udogodnienie gdy istnieje")
    void delete_ShouldDeleteAmenity_WhenExists() {
        
        Long amenityId = 1L;
        when(amenityRepository.existsById(amenityId)).thenReturn(true);
        doNothing().when(amenityRepository).deleteById(amenityId);

        
        amenityService.delete(amenityId);

        
        verify(amenityRepository, times(1)).existsById(amenityId);
        verify(amenityRepository, times(1)).deleteById(amenityId);
    }

    @Test
    @DisplayName("delete() - powinien rzucić wyjątek gdy udogodnienie nie istnieje")
    void delete_ShouldThrowException_WhenAmenityNotFound() {
        
        Long nonExistentId = 999L;
        when(amenityRepository.existsById(nonExistentId)).thenReturn(false);

        
        assertThatThrownBy(() -> amenityService.delete(nonExistentId))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Nie można usunąć: brak udogodnienia o ID: " + nonExistentId);

        verify(amenityRepository, times(1)).existsById(nonExistentId);
        verify(amenityRepository, never()).deleteById(anyLong());
    }

    @Test
    @DisplayName("delete() - nie powinien wywoływać deleteById gdy udogodnienie nie istnieje")
    void delete_ShouldNotCallDeleteById_WhenDoesNotExist() {
        
        Long amenityId = 999L;
        when(amenityRepository.existsById(amenityId)).thenReturn(false);

        
        assertThatThrownBy(() -> amenityService.delete(amenityId))
                .isInstanceOf(ResponseStatusException.class);

        verify(amenityRepository, never()).deleteById(anyLong());
    }

    @Test
    @DisplayName("mapToDto() - powinien poprawnie mapować wszystkie pola")
    void mapToDto_ShouldMapAllFields() {
        
        List<AmenityDTO> result = amenityService.getAll();
        when(amenityRepository.findAll()).thenReturn(List.of(amenity1));

        
        result = amenityService.getAll();
        assertThat(result.get(0).getId()).isEqualTo(amenity1.getId());
        assertThat(result.get(0).getName()).isEqualTo(amenity1.getName());
        assertThat(result.get(0).getCategory()).isEqualTo(amenity1.getCategory());
        assertThat(result.get(0).getDescription()).isEqualTo(amenity1.getDescription());
    }
}