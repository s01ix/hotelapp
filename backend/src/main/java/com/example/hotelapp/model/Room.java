package com.example.hotelapp.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "pokoje")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "hotel_id", nullable = false)
    private Hotel hotel;

    @Column(name = "numer_pokoju")
    private String roomNumber;

    @Column(name = "nazwa", nullable = false)
    private String name;

    @Column(name = "opis", length = 4000)
    private String description;

    @Column(name = "liczba_lozek", nullable = false)
    private Integer bedCount;

    @Column(name = "max_osob", nullable = false)
    private Integer maxGuests;

    @Column(name = "cena_bazowa", nullable = false)
    private BigDecimal basePrice;

    @Column(name = "waluta", nullable = false)
    private String currency = "PLN";

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private RoomStatus status = RoomStatus.AVAILABLE;

    @Column(name = "utworzono", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}