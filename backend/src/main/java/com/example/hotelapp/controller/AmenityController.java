package com.example.hotelapp.controller;

import com.example.hotelapp.model.Amenity;
import com.example.hotelapp.repository.AmenityRepository;
import jakarta.persistence.Table;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/amenities")
@RequiredArgsConstructor
public class AmenityController {

    private final AmenityRepository amenityRepository;

    @GetMapping
    public List<Amenity> getAll(){
        return amenityRepository.findAll();
    }

    @PostMapping
    public Amenity create(@Valid @RequestBody Amenity amenity){
        amenity.setId(null);
        return amenityRepository.save(amenity);
    }

    @PutMapping("/{id}")
    public Amenity update(@RequestBody Amenity amenity, @PathVariable Long id){
        return amenityRepository.findById(id)
                .map(existingAmenity ->{
                    if(amenity.getName() != null){
                        existingAmenity.setName(amenity.getName());
                    }
                    if(amenity.getCategory() != null){
                        existingAmenity.setCategory(amenity.getCategory());
                    }
                    if(amenity.getDescription() != null){
                        existingAmenity.setDescription(amenity.getDescription());
                    }
                    return amenityRepository.save(existingAmenity);
                }).orElseThrow(()-> new RuntimeException("Nie znaleziono udogodnienia o podanym ID"));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id){
        if(amenityRepository.existsById(id)){
            amenityRepository.deleteById(id);
        }else{
            throw new RuntimeException("Nie można usunąć: Brak udogodnienia o podanym ID");
        }
    }
}
