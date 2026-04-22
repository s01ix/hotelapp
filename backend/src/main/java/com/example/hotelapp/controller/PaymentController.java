package com.example.hotelapp.controller;

import com.example.hotelapp.model.Payment;
import com.example.hotelapp.model.PaymentStatus;
import com.example.hotelapp.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("api/payments")
@RequiredArgsConstructor
public class PaymentController {
    private final PaymentRepository paymentRepository;

    @GetMapping
    public List<Payment> getAll(){
        return paymentRepository.findAll();
    }

    @PostMapping
    public Payment create(@RequestBody Payment payment){
        payment.setId(null);
        return paymentRepository.save(payment);
    }

    @PutMapping("/{id}")
    public Payment update(@RequestBody Payment payment, @PathVariable Long id){
        return paymentRepository.findById(id)
                .map(existingPayment ->{
                    if(payment.getAmount() != null){
                        existingPayment.setAmount(payment.getAmount());
                    }
                    if(payment.getCurrency() != null){
                        existingPayment.setCurrency(payment.getCurrency());
                    }
                    if(payment.getMethod() != null){
                        existingPayment.setMethod(payment.getMethod());
                    }
                    if(payment.getStatus() != null){
                        existingPayment.setStatus(payment.getStatus());
                        if(payment.getStatus() == PaymentStatus.OPLACONA){
                            existingPayment.setPaidAt(LocalDateTime.now());
                        }
                    }
                    if(payment.getTransactionNumber() != null){
                        existingPayment.setTransactionNumber(payment.getTransactionNumber());
                    }

                    return paymentRepository.save(existingPayment);
                }).orElseThrow(()-> new RuntimeException("Nie znaleziono płatności o podanym ID"));
    }
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id){
        if(paymentRepository.existsById(id)){
            paymentRepository.deleteById(id);
        }else {
            throw new RuntimeException("Nie znaleziono płatności o podanym ID");
        }
    }
}
