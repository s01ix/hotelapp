package com.example.hotelapp.repository;

import com.example.hotelapp.model.Booking;
import com.example.hotelapp.model.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    //sprawdzenie dostępności pokoju przy tworzeniu
    @Query("SELECT CASE WHEN COUNT(b) > 0 THEN true ELSE false END FROM Booking b " +
            "WHERE b.room.id = :roomId " +
            "AND b.status != :status " +
            "AND b.checkInDate < :checkOutDate " +
            "AND b.checkOutDate > :checkInDate")
    boolean existsOverlappingBooking(@Param("roomId") Long roomId,
                                     @Param("checkInDate") LocalDate checkInDate,
                                     @Param("checkOutDate") LocalDate checkOutDate,
                                     @Param("status") BookingStatus status);

    //sprawdzenie dostępności pokoju przy edycji
    @Query("SELECT CASE WHEN COUNT(b) > 0 THEN true ELSE false END FROM Booking b " +
            "WHERE b.room.id = :roomId " +
            "AND b.id != :bookingId " +
            "AND b.status != :status " +
            "AND b.checkInDate < :checkOutDate " +
            "AND b.checkOutDate > :checkInDate")
    boolean existsOverlappingBookingForUpdate(@Param("roomId") Long roomId,
                                              @Param("checkInDate") LocalDate checkInDate,
                                              @Param("checkOutDate") LocalDate checkOutDate,
                                              @Param("bookingId") Long bookingId,
                                              @Param("status") BookingStatus status);
}
