package com.example.hotelapp.controller;

import com.example.hotelapp.dto.LocationDTO;
import com.example.hotelapp.model.Location;
import com.example.hotelapp.service.LocationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/locations")
@RequiredArgsConstructor

public class LocationController {

    private final LocationService locationService;

    @GetMapping // operacja READ
    public List<LocationDTO> getAll(){
        return locationService.getAll();
    }

    @PostMapping // operacja CREATE
    public LocationDTO create(@Valid @RequestBody LocationDTO locationDTO){  //@Valid sprawdza czy dane są poprawne
        return locationService.create(locationDTO);
    }

    @PutMapping("/{id}") // operacja UPDATE
    public LocationDTO update(@PathVariable Long id, @RequestBody LocationDTO locationDTO){
        return locationService.update(id, locationDTO);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id){
        locationService.delete(id);
    }
}
