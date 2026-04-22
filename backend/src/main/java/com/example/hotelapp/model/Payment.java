package com.example.hotelapp.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "platnosci")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @NotNull(message = "Rezerwacja jest wymagana")
    @JoinColumn(name = "rezerwacja_id", nullable = false)
    private Booking booking;

    @NotNull(message = "Kwota jest wymagana")
    @DecimalMin(value = "0.0", message = "Kwota nie może być ujemna")
    @Column(name = "kwota", nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @NotBlank(message = "Waluta jest wymagana")
    @Column(name = "waluta", nullable = false, length = 3)
    private String currency = "PLN";

    @NotBlank(message = "Metoda płatności jest wymagana")
    @Column(name = "metoda", nullable = false, length = 30)
    private String method;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private PaymentStatus status = PaymentStatus.OCZEKUJACA;

    @Column(name = "numer_transakcji", unique = true)
    private String transactionNumber;

    @Column(name = "utworzono", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "oplaconoAt")
    private LocalDateTime paidAt;
}
