package com.example.hotelapp.service;

import com.example.hotelapp.dto.AmenityDTO;
import com.example.hotelapp.model.Amenity;
import com.example.hotelapp.repository.AmenityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AmenityService {

    private final AmenityRepository amenityRepository;

    public List<AmenityDTO> getAll() {
        List<Amenity> amenitiesFromDb = amenityRepository.findAll();
        List<AmenityDTO> dtoList = new ArrayList<>();

        for (Amenity amenity : amenitiesFromDb) {
            dtoList.add(mapToDto(amenity));
        }
        return dtoList;
    }

    public AmenityDTO create(AmenityDTO amenityDTO) {
        Amenity amenityToSave = mapToEntity(amenityDTO);

        Amenity savedAmenity = amenityRepository.save(amenityToSave);

        return mapToDto(savedAmenity);
    }

    public AmenityDTO update(Long id, AmenityDTO amenityDTO) {

        Amenity existingAmenity = amenityRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Nie znaleziono udogodnienia o ID: " + id));

        existingAmenity.setName(amenityDTO.getName());
        existingAmenity.setCategory(amenityDTO.getCategory());
        existingAmenity.setDescription(amenityDTO.getDescription());

        Amenity savedAmenity = amenityRepository.save(existingAmenity);
        return mapToDto(savedAmenity);
    }

    public void delete(Long id) {
        if (amenityRepository.existsById(id)) {
            amenityRepository.deleteById(id);
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Nie można usunąć: brak udogodnienia o ID: " + id);
        }
    }

    private AmenityDTO mapToDto(Amenity amenity) {
        AmenityDTO dto = new AmenityDTO();
        dto.setId(amenity.getId());
        dto.setName(amenity.getName());
        dto.setCategory(amenity.getCategory());
        dto.setDescription(amenity.getDescription());
        return dto;
    }

    private Amenity mapToEntity(AmenityDTO dto) {
        Amenity amenity = new Amenity();
        amenity.setName(dto.getName());
        amenity.setCategory(dto.getCategory());
        amenity.setDescription(dto.getDescription());
        return amenity;
    }
}