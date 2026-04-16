package com.example.hotelapp.repository;


import com.example.hotelapp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    //metoda pomocna w logowaniu
    Optional<User> findByEmail(String email);

    //sprawdzanie czy email istnieje
    boolean existsByEmail(String email);
}
