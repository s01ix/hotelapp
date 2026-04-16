package com.example.hotelapp.controller;

import com.example.hotelapp.model.Hotel;
import com.example.hotelapp.repository.HotelRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController // dzięki temu swagger zobaczy tą klasę
@RequestMapping("api/hotels")
@RequiredArgsConstructor

public class HotelController {
    private final HotelRepository hotelRepository;

    @GetMapping // operacja READ
    public List<Hotel> getAll(){
        return hotelRepository.findAll();
    }

    @PostMapping // operacja CREATE
    public Hotel create(@Valid @RequestBody Hotel hotel){   //@Valid sprawdza czy dane są poprawne
        hotel.setId(null);  // dajemy null żeby id było puste żeby nikt nie nadpisał istniejącego rekordu
        return hotelRepository.save(hotel);
    }

    @PutMapping("/{id}") // operacja UPDATE
    public Hotel update(@PathVariable Long id, @RequestBody Hotel hotel){
        return hotelRepository.findById(id)
                .map(existingHotel -> {
                    if(hotel.getName() != null){
                        existingHotel.setName(hotel.getName());
                    }
                    if(hotel.getDescription() != null){
                        existingHotel.setDescription(hotel.getDescription());
                    }
                    if(hotel.getStars() != null){
                        existingHotel.setStars(hotel.getStars());
                    }
                    if(hotel.getPhone() != null){
                        existingHotel.setPhone(hotel.getPhone());
                    }
                    if(hotel.getEmail() != null){
                        existingHotel.setEmail(hotel.getEmail());
                    }
                    if(hotel.getLocation() != null){
                        existingHotel.setLocation(hotel.getLocation());
                    }

                    return hotelRepository.save(existingHotel);
                }).orElseThrow(() -> new RuntimeException("Nie znaleziono hotelu o podanym ID"));
    }

    @DeleteMapping("/{id}") // operacja DELETE
    public void delete(@PathVariable Long id){
        if(hotelRepository.existsById(id)){
            hotelRepository.deleteById(id);
        }else {
            throw new RuntimeException("Nie można usunąć: brak hotelu o podanym ID");
        }
    }

}
