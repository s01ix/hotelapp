package com.example.hotelapp.repository;

import com.example.hotelapp.model.RoomPhoto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RoomPhotoRepository extends JpaRepository<RoomPhoto, Long> {

    List<RoomPhoto> findByRoomId(Long roomId);
}
