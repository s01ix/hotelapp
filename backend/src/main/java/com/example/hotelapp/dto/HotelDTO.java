package com.example.hotelapp.dto;

import lombok.Data;

@Data
public class HotelDTO {
    private Long id;
    private String name;
    private String description;
    private Integer stars;
    private String phone;
    private String email;
    //zamiast całego obiektu samo id
    private Long locationId;
}
