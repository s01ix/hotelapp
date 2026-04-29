package com.example.hotelapp.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class RoomPriceDTO {
    private Long id;
    private Long roomId;
    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal price;
    private String seasonName;
}