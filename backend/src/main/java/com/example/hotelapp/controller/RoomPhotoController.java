package com.example.hotelapp.controller;

import com.example.hotelapp.dto.RoomPhotoDTO;
import com.example.hotelapp.service.RoomPhotoService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/room_photos")
@RequiredArgsConstructor
public class RoomPhotoController {
    private final RoomPhotoService roomPhotoService;

    @GetMapping
    public List<RoomPhotoDTO> getAll() {
        return roomPhotoService.getAll();
    }

    @PostMapping
    public RoomPhotoDTO create(@RequestBody RoomPhotoDTO dto) {
        return roomPhotoService.create(dto);
    }

    @PutMapping("/{id}")
    public RoomPhotoDTO update(@PathVariable Long id, @RequestBody RoomPhotoDTO dto) {
        return roomPhotoService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        roomPhotoService.delete(id);
    }
}
