package com.example.hotelapp.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "zdjecia_pokoi")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class RoomPhoto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "pokoj_id", nullable = false)
    private Room room;

    @Column(name = "url_zdjecia", nullable = false)
    private String url;

    @Column(name = "czy_glowne")
    private Boolean isPrimary = false;

    @Column(name = "utworzono", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

}
