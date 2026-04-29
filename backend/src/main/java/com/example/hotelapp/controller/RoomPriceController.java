package com.example.hotelapp.controller;

import com.example.hotelapp.dto.RoomPriceDTO;
import com.example.hotelapp.model.RoomPrice;
import com.example.hotelapp.service.RoomPriceService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/room_price")
@RequiredArgsConstructor

public class RoomPriceController {
    private final RoomPriceService roomPriceService;

    @GetMapping
    public List<RoomPriceDTO> getAll(){
        return roomPriceService.getAll();
    }

    @PostMapping
    public RoomPriceDTO create(@RequestBody RoomPriceDTO dto) {
        return roomPriceService.create(dto);
    }

    @PutMapping("/{id}")
    public RoomPriceDTO update(@PathVariable Long id, @RequestBody RoomPriceDTO dto) {
        return roomPriceService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        roomPriceService.delete(id);
    }
}
