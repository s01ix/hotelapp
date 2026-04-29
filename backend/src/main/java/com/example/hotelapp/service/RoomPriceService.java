package com.example.hotelapp.service;

import com.example.hotelapp.dto.RoomPriceDTO;
import com.example.hotelapp.model.Room;
import com.example.hotelapp.model.RoomPrice;
import com.example.hotelapp.repository.RoomPriceRepository;
import com.example.hotelapp.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RoomPriceService {
    private final RoomPriceRepository roomPriceRepository;
    private final RoomRepository roomRepository;

    public List<RoomPriceDTO> getAll() {
        List<RoomPrice> roomPricesFromDatabase = roomPriceRepository.findAll();

        List<RoomPriceDTO> dtoList = new ArrayList<>();

        for (RoomPrice roomPrice : roomPricesFromDatabase) {
            RoomPriceDTO dto = mapToDto(roomPrice);
            dtoList.add(dto);
        }
        return dtoList;
    }

    public RoomPriceDTO create(RoomPriceDTO dto) {
        Room room = roomRepository.findById(dto.getRoomId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nie znaleziono pokoju o ID"));

        RoomPrice price = mapToEntity(dto);
        price.setRoom(room);
        return mapToDto(roomPriceRepository.save(price));
    }

    public RoomPriceDTO update(Long id, RoomPriceDTO dto) {
        RoomPrice existing = roomPriceRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Nie znaleziono ceny o ID: " + id));

        Room room = roomRepository.findById(dto.getRoomId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nie znaleziono pokoju o ID: " + dto.getRoomId()));

        existing.setStartDate(dto.getStartDate());
        existing.setEndDate(dto.getEndDate());
        existing.setPrice(dto.getPrice());
        existing.setSeasonName(dto.getSeasonName());
        existing.setRoom(room);

        RoomPrice saveRoomPrice = roomPriceRepository.save(existing);
        return mapToDto(saveRoomPrice);
    }

    public void delete(Long id){
        if(roomPriceRepository.existsById(id)){
            roomPriceRepository.deleteById(id);
        }else{
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Brak ceny o ID: ");
        }
    }

    private RoomPriceDTO mapToDto(RoomPrice entity) {
        RoomPriceDTO dto = new RoomPriceDTO();
        dto.setId(entity.getId());
        dto.setStartDate(entity.getStartDate());
        dto.setEndDate(entity.getEndDate());
        dto.setPrice(entity.getPrice());
        dto.setSeasonName(entity.getSeasonName());
        if (entity.getRoom() != null) dto.setRoomId(entity.getRoom().getId());
        return dto;
    }

    private RoomPrice mapToEntity(RoomPriceDTO dto) {
        RoomPrice entity = new RoomPrice();
        entity.setStartDate(dto.getStartDate());
        entity.setEndDate(dto.getEndDate());
        entity.setPrice(dto.getPrice());
        entity.setSeasonName(dto.getSeasonName());
        return entity;
    }
}
