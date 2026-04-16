package com.example.hotelapp.controller;

import com.example.hotelapp.model.Booking;
import com.example.hotelapp.model.BookingStatus;
import com.example.hotelapp.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingRepository bookingRepository;

    @GetMapping
    public List<Booking> getAll(){
        return bookingRepository.findAll();
    }

    @PostMapping
    public Booking create(@RequestBody Booking booking){
        booking.setId(null);
        return bookingRepository.save(booking);
    }

    @PutMapping("/{id}")
    public Booking update(@RequestBody Booking booking, @PathVariable Long id){
        return bookingRepository.findById(id)
                .map(existingBooking ->{
                    if(booking.getCheckInDate() != null){
                        existingBooking.setCheckInDate(booking.getCheckInDate());
                    }
                    if(booking.getCheckOutDate() != null){
                        existingBooking.setCheckOutDate(booking.getCheckOutDate());
                    }
                    if(booking.getAdults() != null){
                        existingBooking.setAdults(booking.getAdults());
                    }
                    if(booking.getChildren() != null){
                        existingBooking.setChildren(booking.getChildren());
                    }
                    if(booking.getTotalAmount() != null){
                        existingBooking.setTotalAmount(booking.getTotalAmount());
                    }
                    if(booking.getNotes() != null){
                        existingBooking.setNotes(booking.getNotes());
                    }
                    if(booking.getStatus() != null){
                        existingBooking.setStatus(booking.getStatus());
                        if(booking.getStatus() == BookingStatus.ANULOWANA){
                            existingBooking.setCancelledAt(LocalDateTime.now());
                        }
                    }

                    return bookingRepository.save(existingBooking);
                }).orElseThrow(() -> new RuntimeException("Nie można zaktualizować: brak rezerwacji o podanym ID"));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id){
        if(bookingRepository.existsById(id)){
            bookingRepository.deleteById(id);
        }else {
            throw new RuntimeException("Nie można usunąć: brak rezerwacji o podanym ID");
        }
    }
}
