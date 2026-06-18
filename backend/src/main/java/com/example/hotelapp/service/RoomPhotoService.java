package com.example.hotelapp.service;

import com.example.hotelapp.dto.RoomPhotoDTO;
import com.example.hotelapp.model.Room;
import com.example.hotelapp.model.RoomPhoto;
import com.example.hotelapp.repository.RoomPhotoRepository;
import com.example.hotelapp.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RoomPhotoService {
    private final RoomPhotoRepository roomPhotoRepository;
    private final RoomRepository roomRepository;
    
    private final String UPLOAD_DIR = "C:/Users/HARDPC/Desktop/Frontendowe/backend/uploads/";

    public List<RoomPhotoDTO> getAll() {
        List<RoomPhoto> photosFromDatabase = roomPhotoRepository.findAll();
        List<RoomPhotoDTO> dtoList = new ArrayList<>();
        for (RoomPhoto photo : photosFromDatabase) {
            dtoList.add(mapToDto(photo));
        }
        return dtoList;
    }

    public RoomPhotoDTO createWithFile(MultipartFile file, Long roomId, Boolean isPrimary) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nie znaleziono pokoju o ID"));

        try {
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path filePath = uploadPath.resolve(fileName);

            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            RoomPhoto photo = new RoomPhoto();
            photo.setRoom(room);
            
            photo.setUrl("http://localhost:8080/uploads/" + fileName); 
            photo.setIsPrimary(isPrimary != null ? isPrimary : false);

            RoomPhoto savedPhoto = roomPhotoRepository.save(photo);
            return mapToDto(savedPhoto);

        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Nie udało się zapisać pliku", e);
        }
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
        if (entity.getRoom() != null) dto.setRoomId(entity.getRoom().getId());
        return dto;
    }
}