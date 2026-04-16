package com.example.hotelapp.repository;

import com.example.hotelapp.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    // przydatna do pobrania historii rezerwacji danego klienta
    List<Booking> findByUserId(Long userId);

    // przydatne do sprawdzenia rezerwacji dla konkretnego pokojku
    List<Booking> findByRoomId(Long roomId);
}
