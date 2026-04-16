package com.example.hotelapp.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "rezerwacje")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "uzytkownik_id", nullable = false)
    @NotNull(message = "Użytkownik jest wymagany")
    private User user;

    @ManyToOne
    @JoinColumn(name = "pokoj_id", nullable = false)
    @NotNull(message = "Pokoj jest wymagany")
    private Room room;

    @NotNull(message = "Data zameldowania jest wymagana")
    @Column(name = "data_zameldowania", nullable = false)
    private LocalDate checkInDate;

    @NotNull(message = "Data wymeldowania jest wymagana")
    @Column(name = "data_wymeldowania", nullable = false)
    private LocalDate checkOutDate;

    @Min(value = 1, message = "Musi być conajmniej jedna osoba dorosła")
    @Column(name = "liczba_doroslych", nullable = false)
    private Integer adults = 1;

    @Min(value = 0)
    @Column(name = "liczba_dzieci", nullable = false)
    private Integer children = 0;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private BookingStatus status = BookingStatus.OCZEKUJACA;

    @NotNull(message = "Kwota całkowita jest wymagana")
    @DecimalMin(value = "0.0", message = "Kwota nie może być ujemna")
    @Column(name = "kwota_calkowita", nullable = false)
    private BigDecimal totalAmount;

    @Column(name = "uwagi", length = 4000)
    private String notes;

    @Column(name = "utworzono", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "anulowano_at")
    private LocalDateTime cancelledAt;
}
