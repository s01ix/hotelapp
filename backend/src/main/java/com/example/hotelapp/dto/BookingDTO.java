package com.example.hotelapp.dto;

import com.example.hotelapp.model.BookingStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class BookingDTO {
    private Long id;

    private Long userId;
    private Long roomId;

    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private Integer adults;
    private Integer children;
    private BookingStatus status;
    private BigDecimal totalAmount;
    private String notes;
    private LocalDateTime cancelledAt;
}