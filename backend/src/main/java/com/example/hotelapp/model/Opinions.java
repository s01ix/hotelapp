package com.example.hotelapp.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;


@Entity
@Table(name = "opinie")
@Data
@AllArgsConstructor
@NoArgsConstructor

public class Opinions {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "uzytkownik_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "pokoj_id", nullable = false)
    private Room room;

    @OneToOne
    @JoinColumn(name = "rezerwacja_id", nullable = false)
    private Booking booking;

    @NotNull
    @Min(1)
    @Max(5)
    @Column(name = "ocena")
    private Integer rate;

    @Column(name = "komentarz", length = 1000)
    private String comment;

    @Column(name = "utworzono", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

}
