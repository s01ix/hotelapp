package com.example.hotelapp.repository;

import com.example.hotelapp.model.Opinions;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OpinionsRepository extends JpaRepository<Opinions, Long> {
}
