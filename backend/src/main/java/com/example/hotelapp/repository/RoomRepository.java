package com.example.hotelapp.repository;

import com.example.hotelapp.model.Room;
import com.example.hotelapp.model.RoomStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
}