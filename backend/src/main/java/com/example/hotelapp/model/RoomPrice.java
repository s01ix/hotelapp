package com.example.hotelapp.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "ceny_pokoi")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class RoomPrice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "pokoj_id", nullable = false)
    private Room room;

    @NotNull(message = "Data rozpoczęcia jest wymagana")
    @Column(name = "data_od", nullable = false)
    private LocalDate startDate;

    @NotNull(message = "Data zakończenia jest wymagana")
    @Column(name = "data_do", nullable = false)
    private LocalDate endDate;

    @NotNull(message = "Cena jest wymagana")
    @Column(name = "cena", nullable = false)
    private BigDecimal price;

    @Column(name = "nazwa_sezonu")
    private String seasonName;

}
