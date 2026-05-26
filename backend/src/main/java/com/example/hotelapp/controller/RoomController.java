package com.example.hotelapp.controller;

import com.example.hotelapp.dto.RoomDTO;
import com.example.hotelapp.service.RoomService;
import lombok.RequiredArgsConstructor;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("api/rooms")
@RequiredArgsConstructor
public class RoomController {

    private final RoomService roomService;

    @GetMapping
    public List<RoomDTO> getAll(){
        return roomService.getAll();
    }
    //filtrowanie dostępnych pokoi po dacie i liczbie gosci
    @GetMapping("/available")
    public List<RoomDTO> getAvailableRooms(@RequestParam LocalDate checkIn, @RequestParam LocalDate checkOut, @RequestParam(required = false) Integer maxGuests) {
        return roomService.searchAvailableRooms(checkIn, checkOut, maxGuests);
    }

    //pobieranie szczegółów jednego pokoju po ID
    @GetMapping("/{id}")
    public RoomDTO getRoomById(@PathVariable Long id) {
        return roomService.getRoomById(id);
    }

    @PostMapping
    public RoomDTO create(@Valid @RequestBody RoomDTO roomDTO) {
        return roomService.create(roomDTO);
    }

    @PutMapping("/{id}")
    public RoomDTO update(@PathVariable Long id, @RequestBody RoomDTO roomDTO) {
        return roomService.update(id, roomDTO);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        roomService.delete(id);
    }
}
