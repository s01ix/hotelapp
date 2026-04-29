package com.example.hotelapp.dto;

import lombok.Data;

@Data
public class LocationDTO {
    private Long id;
    private String country;
    private String city;
    private String street;
    private String buildingNumber;
    private String postalCode;
}
