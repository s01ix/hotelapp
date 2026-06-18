package com.example.hotelapp.controller;

import com.example.hotelapp.dto.RoomPhotoDTO;
import com.example.hotelapp.service.RoomPhotoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/room_photos") 
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true") 
public class RoomPhotoController {
    
    private final RoomPhotoService roomPhotoService;

    @GetMapping
    public List<RoomPhotoDTO> getAll() {
        return roomPhotoService.getAll();
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public RoomPhotoDTO create(
            @RequestParam("file") MultipartFile file,
            @RequestParam("roomId") Long roomId,
            @RequestParam(value = "isPrimary", required = false) Boolean isPrimary) {
        return roomPhotoService.createWithFile(file, roomId, isPrimary);
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