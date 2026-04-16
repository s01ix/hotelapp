package com.example.hotelapp.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "uzytkownicy")
@Data
@NoArgsConstructor
@AllArgsConstructor

public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Email jest obowiązkowy")
    @Email(message = "Podaj poprawny adres email")
    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @NotBlank(message = "Hasło nie może być puste")
    @Column(name = "haslo_hash", nullable = false)
    private String passwordHash;

    @NotBlank(message = "Imię jest obowiązkowe")
    @Column(name = "imie", nullable = false)
    private String name;

    @NotBlank(message = "Nazwisko jest obowiązkowe")
    @Column(name = "nazwisko", nullable = false)
    private String lastName;

    @Column(name = "telefon")
    private String phone;

    @NotNull(message = "Rola użytkownika jest wymagana")
    @Enumerated(EnumType.STRING)
    @Column(name = "rola", nullable = false)
    private UserRole role = UserRole.USER;

    @NotNull
    @Column(name = "utworzono", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

}
