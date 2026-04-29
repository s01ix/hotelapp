package com.example.hotelapp.controller;

import com.example.hotelapp.dto.AmenityDTO;
import com.example.hotelapp.model.Amenity;
import com.example.hotelapp.service.AmenityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/amenities")
@RequiredArgsConstructor
public class AmenityController {

    private final AmenityService amenityService;

    @GetMapping
    public List<AmenityDTO> getAll(){
        return amenityService.getAll();
    }

    @PostMapping
    public AmenityDTO create(@Valid @RequestBody AmenityDTO amenityDTO){
        return amenityService.create(amenityDTO);
    }

    @PutMapping("/{id}")
    public AmenityDTO update(@RequestBody AmenityDTO amenityDTO, @PathVariable Long id){
        return amenityService.update(id, amenityDTO);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id){
        amenityService.delete(id);
    }
}
