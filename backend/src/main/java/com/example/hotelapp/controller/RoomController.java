package com.example.hotelapp.controller;

import com.example.hotelapp.model.Room;
import com.example.hotelapp.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/rooms")
@RequiredArgsConstructor

public class RoomController {

    private final RoomRepository roomRepository;

    @GetMapping
    public List<Room> getAll(){
        return roomRepository.findAll();
    }

    @PostMapping
    public Room create(@Valid @RequestBody Room room){
        room.setId(null);
        return roomRepository.save(room);
    }

    @PutMapping("/{id}")
    public Room update(@PathVariable Long id, @RequestBody Room room){
        return roomRepository.findById(id)
                .map(existingRoom ->{
                    if(room.getHotel() != null) {
                        existingRoom.setHotel(room.getHotel());
                    }
                    if(room.getRoomNumber() != null){
                        existingRoom.setRoomNumber(room.getRoomNumber());
                    }
                    if(room.getName() != null){
                        existingRoom.setName(room.getName());
                    }
                    if(room.getDescription() != null){
                        existingRoom.setDescription(room.getDescription());
                    }
                    if(room.getBedCount() != null){
                        existingRoom.setBedCount(room.getBedCount());
                    }
                    if(room.getMaxGuests() != null){
                        existingRoom.setMaxGuests(room.getMaxGuests());
                    }
                    if(room.getBasePrice() != null){
                        existingRoom.setBasePrice(room.getBasePrice());
                    }
                    if(room.getCurrency() != null){
                        existingRoom.setCurrency(room.getCurrency());
                    }
                    if(room.getStatus() != null){
                        existingRoom.setStatus(room.getStatus());
                    }

                    return roomRepository.save(existingRoom);
                }).orElseThrow(()-> new RuntimeException("Nie znaleziono pokoju o podanym ID"));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id){
        if(roomRepository.existsById(id)){
            roomRepository.deleteById(id);
        }else {
            throw new RuntimeException("Nie znaleziono pokoju o podanym ID");
        }
    }
}
