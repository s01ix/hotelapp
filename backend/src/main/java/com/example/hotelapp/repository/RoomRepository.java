package com.example.hotelapp.repository;

import com.example.hotelapp.model.Room;
import com.example.hotelapp.model.RoomStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
    //filtracja pokoi
    @Query("SELECT r FROM Room r WHERE " +
            "r.maxGuests >= :guests AND " +
            "NOT EXISTS (SELECT b FROM Booking b WHERE b.room.id = r.id " +
            "AND b.status <> 'ANULOWANA' " +
            "AND b.checkInDate < :checkOut AND b.checkOutDate > :checkIn)")
    List<Room> findAvailableRooms(
            @Param("checkIn") LocalDate checkIn,
            @Param("checkOut") LocalDate checkOut,
            @Param("guests") Integer guests
    );
}