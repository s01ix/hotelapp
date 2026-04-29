package com.example.hotelapp.service;

import com.example.hotelapp.dto.RoomPhotoDTO;
import com.example.hotelapp.model.Room;
import com.example.hotelapp.model.RoomPhoto;
import com.example.hotelapp.repository.RoomPhotoRepository;
import com.example.hotelapp.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RoomPhotoService {
    private final RoomPhotoRepository roomPhotoRepository;
    private final RoomRepository roomRepository;

    public List<RoomPhotoDTO> getAll() {
        List<RoomPhoto> photosFromDatabase = roomPhotoRepository.findAll();
        List<RoomPhotoDTO> dtoList = new ArrayList<>();

        for (RoomPhoto photo : photosFromDatabase) {
            dtoList.add(mapToDto(photo));
        }
        return dtoList;
    }

    public RoomPhotoDTO create(RoomPhotoDTO dto) {
        Room room = roomRepository.findById(dto.getRoomId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nie znaleziono pokoju o ID"));

        RoomPhoto photoToSave = mapToEntity(dto);
        photoToSave.setRoom(room);

        RoomPhoto savedPhoto = roomPhotoRepository.save(photoToSave);
        return mapToDto(savedPhoto);
    }
    public RoomPhotoDTO update(Long id, RoomPhotoDTO dto) {
        RoomPhoto existingPhoto = roomPhotoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Nie znaleziono zdjęcia o ID"));

        Room room = roomRepository.findById(dto.getRoomId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nie znaleziono pokoju o ID"));

        existingPhoto.setUrl(dto.getUrl());
        existingPhoto.setIsPrimary(dto.getIsPrimary());
        existingPhoto.setRoom(room);

        RoomPhoto savedPhoto = roomPhotoRepository.save(existingPhoto);
        return mapToDto(savedPhoto);
    }

    public void delete(Long id) {
        if (roomPhotoRepository.existsById(id)) {
            roomPhotoRepository.deleteById(id);
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Brak zdjęcia o ID");
        }
    }

    private RoomPhotoDTO mapToDto(RoomPhoto entity) {
        RoomPhotoDTO dto = new RoomPhotoDTO();
        dto.setId(entity.getId());
        dto.setUrl(entity.getUrl());
        dto.setIsPrimary(entity.getIsPrimary());

        if (entity.getRoom() != null) {
            dto.setRoomId(entity.getRoom().getId());
        }
        return dto;
    }

    private RoomPhoto mapToEntity(RoomPhotoDTO dto) {
        RoomPhoto entity = new RoomPhoto();
        entity.setUrl(dto.getUrl());
        entity.setIsPrimary(dto.getIsPrimary() != null ? dto.getIsPrimary() : false);
        return entity;
    }
}
