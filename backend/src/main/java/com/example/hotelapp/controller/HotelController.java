package com.example.hotelapp.controller;

import com.example.hotelapp.dto.HotelDTO;
import com.example.hotelapp.model.Hotel;
import com.example.hotelapp.repository.HotelRepository;
import com.example.hotelapp.service.HotelService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController // dzięki temu swagger zobaczy tą klasę
@RequestMapping("api/hotels")
@RequiredArgsConstructor

public class HotelController {
    private final HotelService hotelService;

    @GetMapping // operacja READ
    public List<HotelDTO> getAll(){
        return hotelService.getAll();
    }

    @PostMapping // operacja CREATE
    public HotelDTO create(@Valid @RequestBody HotelDTO hotelDTO){   //@Valid sprawdza czy dane są poprawne
        return hotelService.create(hotelDTO);
    }

    @PutMapping("/{id}") // operacja UPDATE
    public HotelDTO update(@PathVariable Long id, @RequestBody HotelDTO hotelDTO){
        return hotelService.update(id, hotelDTO);
    }

    @DeleteMapping("/{id}") // operacja DELETE
    public void delete(@PathVariable Long id){
        hotelService.delete(id);
    }

}
