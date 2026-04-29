package com.example.hotelapp.service;

import com.example.hotelapp.dto.RoomDTO;
import com.example.hotelapp.model.Amenity;
import com.example.hotelapp.model.Hotel;
import com.example.hotelapp.model.Room;
import com.example.hotelapp.repository.AmenityRepository;
import com.example.hotelapp.repository.HotelRepository;
import com.example.hotelapp.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RoomService {
    private final RoomRepository roomRepository;
    private final HotelRepository hotelRepository;
    private final AmenityRepository amenityRepository;

    public List<RoomDTO> getAll() {
        List<Room> roomsFromDb = roomRepository.findAll();
        List<RoomDTO> dtoList = new ArrayList<>();

        for (Room room : roomsFromDb) {
            dtoList.add(mapToDto(room));
        }
        return dtoList;
    }

    public RoomDTO create(RoomDTO roomDTO) {

        Hotel hotel = hotelRepository.findById(roomDTO.getHotelId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nie znaleziono hotelu o ID"));

        List<Amenity> amenities = new ArrayList<>();
        if (roomDTO.getAmenityIds() != null && !roomDTO.getAmenityIds().isEmpty()) {
            amenities = amenityRepository.findAllById(roomDTO.getAmenityIds());
        }

        Room roomToSave = mapToEntity(roomDTO);

        roomToSave.setHotel(hotel);
        roomToSave.setAmenities(amenities);

        Room savedRoom = roomRepository.save(roomToSave);
        return mapToDto(savedRoom);
    }

    public RoomDTO update(Long id, RoomDTO roomDTO) {
        Room existingRoom = roomRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Nie znaleziono pokoju o ID: " + id));

        Hotel newHotel = hotelRepository.findById(roomDTO.getHotelId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nie znaleziono hotelu o ID: " + roomDTO.getHotelId()));

        List<Amenity> newAmenities = new ArrayList<>();
        if (roomDTO.getAmenityIds() != null && !roomDTO.getAmenityIds().isEmpty()) {
            newAmenities = amenityRepository.findAllById(roomDTO.getAmenityIds());
        }

        existingRoom.setRoomNumber(roomDTO.getRoomNumber());
        existingRoom.setName(roomDTO.getName());
        existingRoom.setDescription(roomDTO.getDescription());
        existingRoom.setBedCount(roomDTO.getBedCount());
        existingRoom.setMaxGuests(roomDTO.getMaxGuests());
        existingRoom.setBasePrice(roomDTO.getBasePrice());
        existingRoom.setCurrency(roomDTO.getCurrency());
        existingRoom.setStatus(roomDTO.getStatus());

        existingRoom.setHotel(newHotel);
        existingRoom.setAmenities(newAmenities);

        Room savedRoom = roomRepository.save(existingRoom);
        return mapToDto(savedRoom);
    }

    public void delete(Long id){
        if(roomRepository.existsById(id)){
            roomRepository.deleteById(id);
        }else{
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Nie można usunąć: brak pokoju o ID");
        }
    }
    private RoomDTO mapToDto(Room room) {
        RoomDTO dto = new RoomDTO();
        dto.setId(room.getId());
        dto.setRoomNumber(room.getRoomNumber());
        dto.setName(room.getName());
        dto.setDescription(room.getDescription());
        dto.setBedCount(room.getBedCount());
        dto.setMaxGuests(room.getMaxGuests());
        dto.setBasePrice(room.getBasePrice());
        dto.setCurrency(room.getCurrency());
        dto.setStatus(room.getStatus());

        // Zabezpieczenie hotelu
        if (room.getHotel() != null) {
            dto.setHotelId(room.getHotel().getId());
        }

        // Zabezpieczenie udogodnień: zamieniamy obiekty na prostą listę numerów ID
        if (room.getAmenities() != null) {
            List<Long> amenityIds = new ArrayList<>();
            for (Amenity amenity : room.getAmenities()) {
                amenityIds.add(amenity.getId());
            }
            dto.setAmenityIds(amenityIds);
        }

        return dto;
    }

    private Room mapToEntity(RoomDTO dto) {
        Room room = new Room();
        room.setRoomNumber(dto.getRoomNumber());
        room.setName(dto.getName());
        room.setDescription(dto.getDescription());
        room.setBedCount(dto.getBedCount());
        room.setMaxGuests(dto.getMaxGuests());
        room.setBasePrice(dto.getBasePrice());
        room.setCurrency(dto.getCurrency() != null ? dto.getCurrency() : "PLN");
        room.setStatus(dto.getStatus());

        return room;
    }
}
