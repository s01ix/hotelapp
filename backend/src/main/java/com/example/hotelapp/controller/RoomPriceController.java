package com.example.hotelapp.controller;

import com.example.hotelapp.model.RoomPrice;
import com.example.hotelapp.repository.RoomPriceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/room_price")
@RequiredArgsConstructor

public class RoomPriceController {
    private final RoomPriceRepository roomPriceRepository;

    @GetMapping
    public List<RoomPrice> getAll(){
        return roomPriceRepository.findAll();
    }

    @PostMapping
    public RoomPrice create(@RequestBody RoomPrice roomPrice){
        roomPrice.setId(null);
        return roomPriceRepository.save(roomPrice);
    }

    @PutMapping("/{id}")
    public RoomPrice update(@RequestBody RoomPrice roomPrice, @PathVariable Long id){
        return roomPriceRepository.findById(id)
                .map(existingRoomPrice ->{
                    if(roomPrice.getStartDate() != null){
                        existingRoomPrice.setStartDate(roomPrice.getStartDate());
                    }
                    if(roomPrice.getEndDate() != null){
                        existingRoomPrice.setEndDate(roomPrice.getEndDate());
                    }
                    if(roomPrice.getPrice() != null){
                        existingRoomPrice.setPrice(roomPrice.getPrice());
                    }
                    if(roomPrice.getSeasonName() != null){
                        existingRoomPrice.setSeasonName(roomPrice.getSeasonName());
                    }

                    return roomPriceRepository.save(existingRoomPrice);
                }).orElseThrow(()-> new RuntimeException("Nie znaleziono ceny o podanym ID"));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id){
        if(roomPriceRepository.existsById(id)){
            roomPriceRepository.deleteById(id);
        }else {
            throw new RuntimeException("Nie można usunąć: brak ceny o podanym ID");
        }
    }
}
