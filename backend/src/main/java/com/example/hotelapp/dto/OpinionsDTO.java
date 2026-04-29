package com.example.hotelapp.dto;

import lombok.Data;

@Data
public class OpinionsDTO {
    private Long id;

    private Long userId;
    private Long roomId;
    private Long bookingId;

    private Integer rate;
    private String comment;
}