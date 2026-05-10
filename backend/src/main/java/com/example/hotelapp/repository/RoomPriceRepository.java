package com.example.hotelapp.repository;

import com.example.hotelapp.model.RoomPrice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.Optional;

public interface RoomPriceRepository extends JpaRepository<RoomPrice, Long> {
    //szukanie ceny dla konkretnego pokoju, która obowiązuje w danej dacie
    Optional<RoomPrice> findByRoomIdAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
            Long roomId, LocalDate date, LocalDate dateAgain);
}
