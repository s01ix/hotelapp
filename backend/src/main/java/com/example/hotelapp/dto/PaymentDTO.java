package com.example.hotelapp.dto;

import com.example.hotelapp.model.PaymentStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class PaymentDTO {
    private Long id;

    private Long bookingId;

    private BigDecimal amount;
    private String currency;
    private String method;
    private PaymentStatus status;
    private String transactionNumber;
    private LocalDateTime paidAt;
}