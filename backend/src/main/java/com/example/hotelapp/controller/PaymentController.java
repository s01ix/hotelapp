package com.example.hotelapp.controller;

import com.example.hotelapp.dto.PaymentDTO;
import com.example.hotelapp.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/payments")
@RequiredArgsConstructor
public class PaymentController {
    private final PaymentService paymentService;

    @GetMapping
    public List<PaymentDTO> getAll() {
        return paymentService.getAll();
    }

    @PostMapping
    public PaymentDTO create(@Valid @RequestBody PaymentDTO paymentDTO) {
        return paymentService.create(paymentDTO);
    }

    @PutMapping("/{id}")
    public PaymentDTO update(@PathVariable Long id, @RequestBody PaymentDTO paymentDTO) {
        return paymentService.update(id, paymentDTO);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        paymentService.delete(id);
    }
}
