package com.example.hotelapp.service;

import com.example.hotelapp.dto.LocationDTO;
import com.example.hotelapp.model.Location;
import com.example.hotelapp.repository.LocationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class LocationService {

    private final LocationRepository locationRepository;

    public List<LocationDTO> getAll(){
        List<Location> locationsFromDatabase = locationRepository.findAll();

        List<LocationDTO> dtoList = new ArrayList<>();

        for (Location location : locationsFromDatabase) {
            LocationDTO dto = mapToDto(location);
            dtoList.add(dto);
        }
        return dtoList;
    }

    public LocationDTO create(LocationDTO locationDTO){
        Location locationToSave = mapToEntity(locationDTO);

        Location saveLocation = locationRepository.save(locationToSave);

        return mapToDto(saveLocation);
    }

    public LocationDTO update(Long id, LocationDTO locationDTO){
    Location existingLocation = locationRepository.findById(id).
            orElseThrow(()-> new ResponseStatusException(HttpStatus.NOT_FOUND, "Nie znaleziono lokalizacji o podanym ID"));

    existingLocation.setCountry(locationDTO.getCountry());
    existingLocation.setCity(locationDTO.getCity());
    existingLocation.setStreet(locationDTO.getStreet());
    existingLocation.setBuildingNumber(locationDTO.getBuildingNumber());
    existingLocation.setPostalCode(locationDTO.getPostalCode());

    Location saveLocation = locationRepository.save(existingLocation);

    return mapToDto(saveLocation);
    }

    public void delete(Long id){
        if(locationRepository.existsById(id)){
            locationRepository.deleteById(id);
        }else{
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Nie można usunąć: brak lokalizacji o ID: " + id);
        }
    }

    //metody pomocnicze do mapowania
    private LocationDTO mapToDto(Location location) {
        LocationDTO dto = new LocationDTO();
        dto.setId(location.getId());
        dto.setCountry(location.getCountry());
        dto.setCity(location.getCity());
        dto.setStreet(location.getStreet());
        dto.setBuildingNumber(location.getBuildingNumber());
        dto.setPostalCode(location.getPostalCode());
        return dto;
    }

    private Location mapToEntity(LocationDTO dto) {
        Location location = new Location();
        location.setCountry(dto.getCountry());
        location.setCity(dto.getCity());
        location.setStreet(dto.getStreet());
        location.setBuildingNumber(dto.getBuildingNumber());
        location.setPostalCode(dto.getPostalCode());
        return location;
    }
}
