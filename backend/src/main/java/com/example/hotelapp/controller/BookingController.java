package com.example.hotelapp.controller;

import com.example.hotelapp.dto.BookingDTO;
import com.example.hotelapp.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/bookings")
@RequiredArgsConstructor
public class BookingController {
    private final BookingService bookingService;

    @GetMapping
    public List<BookingDTO> getAll() {
        return bookingService.getAll();
    }

    @PostMapping
    public BookingDTO create(@Valid @RequestBody BookingDTO bookingDTO) {
        return bookingService.create(bookingDTO);
    }

    @PutMapping("/{id}")
    public BookingDTO update(@PathVariable Long id, @RequestBody BookingDTO bookingDTO) {
        return bookingService.update(id, bookingDTO);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        bookingService.delete(id);
    }
}
