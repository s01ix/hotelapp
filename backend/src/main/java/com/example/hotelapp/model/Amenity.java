package com.example.hotelapp.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "udogodnienia")
@Data
@NoArgsConstructor
@AllArgsConstructor

public class Amenity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Nazawa udogodnienia jest wymagana")
    @Column(name = "nazwa", nullable = false, unique = true)
    private String name;

    @Column(name = "kategoria")
    private String category;

    @Column(name = "opis", length = 500)
    private String description;

    @ManyToMany(mappedBy = "amenities")
    @JsonIgnore // zapobiega nieskączonej pętli przy generowaniu JSON-a
    private List<Room> rooms;

}
