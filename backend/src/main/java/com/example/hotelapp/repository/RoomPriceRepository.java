package com.example.hotelapp.repository;

import com.example.hotelapp.model.RoomPrice;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoomPriceRepository extends JpaRepository<RoomPrice, Long> {
}
