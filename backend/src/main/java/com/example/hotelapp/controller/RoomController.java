package com.example.hotelapp.controller;

import com.example.hotelapp.dto.RoomDTO;
import com.example.hotelapp.model.Room;
import com.example.hotelapp.repository.RoomRepository;
import com.example.hotelapp.service.RoomService;
import lombok.RequiredArgsConstructor;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

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
