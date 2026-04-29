package com.example.hotelapp.dto;

import com.example.hotelapp.model.RoomStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class RoomDTO {
    private Long id;

    private Long hotelId;

    private String roomNumber;
    private String name;
    private String description;
    private Integer bedCount;
    private Integer maxGuests;
    private BigDecimal basePrice;
    private String currency;
    private RoomStatus status;

    private List<Long> amenityIds;
}