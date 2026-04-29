package com.example.hotelapp.dto;

import lombok.Data;

@Data
public class RoomPhotoDTO {
    private Long id;

    private Long roomId;

    private String url;
    private Boolean isPrimary;
}