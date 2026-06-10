package com.example.hotelapp.repository;

import com.example.hotelapp.model.Opinions;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OpinionsRepository extends JpaRepository<Opinions, Long> {
    List<Opinions> findByUserId(Long userId);
    List<Opinions> findByRoomId(Long roomId);
    Optional<Opinions> findByBookingId(Long bookingId);
    boolean existsByBookingId(Long bookingId);
}
