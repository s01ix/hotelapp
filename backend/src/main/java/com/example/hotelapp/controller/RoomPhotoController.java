package com.example.hotelapp.controller;

import com.example.hotelapp.model.RoomPhoto;
import com.example.hotelapp.repository.RoomPhotoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/room_photos")
@RequiredArgsConstructor
public class RoomPhotoController {
    private final RoomPhotoRepository roomPhotoRepository;

    @GetMapping
    public List<RoomPhoto> getAll(){
        return roomPhotoRepository.findAll();
    }

    @PostMapping
    public RoomPhoto create(@RequestBody RoomPhoto roomPhoto){
        roomPhoto.setId(null);
        return roomPhotoRepository.save(roomPhoto);
    }

    @PutMapping("/{id}")
    public RoomPhoto update(@RequestBody RoomPhoto roomPhoto, @PathVariable Long id){
        return roomPhotoRepository.findById(id).
                map(existing ->{
                    if(roomPhoto.getUrl() != null){
                        existing.setUrl(roomPhoto.getUrl());
                    }
                    if(roomPhoto.getIsPrimary() != null){
                        existing.setIsPrimary(roomPhoto.getIsPrimary());
                    }

                    return roomPhotoRepository.save(existing);
                }).orElseThrow(()-> new RuntimeException("Nie znaleziono zdjęcia o podanym ID"));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id){
        if(roomPhotoRepository.existsById(id)){
            roomPhotoRepository.deleteById(id);
        }else {
            throw new RuntimeException("Nie znaleziono zdjęcia o podanym ID");
        }
    }
}
