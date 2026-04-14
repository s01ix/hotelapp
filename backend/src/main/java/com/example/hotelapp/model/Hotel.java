package com.example.hotelapp.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity // mowi springowi ze to encja w bazie
@Table(name = "hotele") // nazwa tabeli w bazie
@Data // generuje gettery settery tostring i equals
@NoArgsConstructor // tworzy konstruktor bez argumentow
@AllArgsConstructor // a tu z
public class Hotel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // automatyczne nadawanie numeru id
    private Long id;

    @NotBlank(message = "Hotel name is required") // walidacja mowi ze  pole nie moze byc puste
    @Column(name = "nazwa") // do jakiej kolumny w tabeli to idzie
    private String name;

    @Column(name = "opis", length = 4000) // mapuje na kolumne i ustawia limit znakow
    private String description;

    @Min(1) @Max(5)
    @Column(name = "gwiazdki")
    private Integer stars = 3;

    @Column(name = "telefon")
    private String phone;

    @Column(name = "email")
    private String email;

    @ManyToOne(fetch = FetchType.EAGER) // relacja wiele hoteli do jednej lokalizacji
    @JoinColumn(name = "lokalizacja_id", nullable = false) // nazwa kolumny z kluczem obcym
    private Location location;
}