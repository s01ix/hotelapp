package com.example.hotelapp.controller;

import com.example.hotelapp.model.Location;
import com.example.hotelapp.repository.LocationRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/locations")
@RequiredArgsConstructor

public class LocationController {

    private final LocationRepository locationRepository;

    @GetMapping // operacja READ
    public List<Location> getAll(){
        return locationRepository.findAll();
    }

    @PostMapping // operacja CREATE
    public Location create(@Valid @RequestBody Location location){  //@Valid sprawdza czy dane są poprawne
        location.setId(null);   //null żeby nikt nie nadpisał istniejącego rekordu
        return locationRepository.save(location);
    }

    @PutMapping("/{id}") // operacja UPDATE
    public Location update(@PathVariable Long id, @RequestBody Location location){
        return locationRepository.findById(id)
                .map(existingLocation ->{
                    if(location.getCountry() != null){
                        existingLocation.setCountry(location.getCountry());
                    }
                    if(location.getCity() != null){
                        existingLocation.setCity(location.getCity());
                    }
                    if(location.getStreet() != null){
                        existingLocation.setStreet(location.getStreet());
                    }
                    if(location.getBuildingNumber() != null){
                        existingLocation.setBuildingNumber(location.getBuildingNumber());
                    }
                    if(location.getPostalCode() != null){
                        existingLocation.setPostalCode(location.getPostalCode());
                    }

                    return locationRepository.save(existingLocation);
                }).orElseThrow(()-> new RuntimeException("Nie znaleziono lokalizacji o podanym ID"));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id){
        if(locationRepository.existsById(id)) {
            locationRepository.deleteById(id);
        }else{
            throw new RuntimeException("Nie można usunąć: brak lokalizacji o podanym ID");
        }
    }
}
