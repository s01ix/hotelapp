package com.example.hotelapp.service;

import com.example.hotelapp.dto.PaymentDTO;
import com.example.hotelapp.model.Booking;
import com.example.hotelapp.model.Payment;
import com.example.hotelapp.model.PaymentStatus;
import com.example.hotelapp.repository.BookingRepository;
import com.example.hotelapp.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentService {
    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;

    public List<PaymentDTO> getAll() {
        List<Payment> paymentsFromDb = paymentRepository.findAll();
        List<PaymentDTO> dtoList = new ArrayList<>();

        for (Payment payment : paymentsFromDb) {
            dtoList.add(mapToDto(payment));
        }
        return dtoList;
    }

    public PaymentDTO create(PaymentDTO paymentDTO) {
        Booking booking = bookingRepository.findById(paymentDTO.getBookingId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nie znaleziono rezerwacji o ID: " + paymentDTO.getBookingId()));

        Payment paymentToSave = mapToEntity(paymentDTO);
        paymentToSave.setBooking(booking);

        if (paymentToSave.getStatus() == PaymentStatus.OPLACONA) {
            paymentToSave.setPaidAt(LocalDateTime.now());
        }

        Payment savedPayment = paymentRepository.save(paymentToSave);
        return mapToDto(savedPayment);
    }

    public PaymentDTO update(Long id, PaymentDTO paymentDTO) {
        Payment existingPayment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Nie znaleziono płatności o ID"));

        Booking booking = bookingRepository.findById(paymentDTO.getBookingId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nie znaleziono rezerwacji o ID"));

        existingPayment.setAmount(paymentDTO.getAmount());
        existingPayment.setCurrency(paymentDTO.getCurrency());
        existingPayment.setMethod(paymentDTO.getMethod());
        existingPayment.setTransactionNumber(paymentDTO.getTransactionNumber());
        existingPayment.setBooking(booking);

        existingPayment.setStatus(paymentDTO.getStatus());
        if (paymentDTO.getStatus() == PaymentStatus.OPLACONA && existingPayment.getPaidAt() == null) {
            existingPayment.setPaidAt(LocalDateTime.now());
        }

        Payment savedPayment = paymentRepository.save(existingPayment);
        return mapToDto(savedPayment);
    }

    public void delete(Long id) {
        if (paymentRepository.existsById(id)) {
            paymentRepository.deleteById(id);
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Brak płatności o ID");
        }
    }
    private PaymentDTO mapToDto(Payment payment) {
        PaymentDTO dto = new PaymentDTO();
        dto.setId(payment.getId());
        dto.setAmount(payment.getAmount());
        dto.setCurrency(payment.getCurrency());
        dto.setMethod(payment.getMethod());
        dto.setStatus(payment.getStatus());
        dto.setTransactionNumber(payment.getTransactionNumber());
        dto.setPaidAt(payment.getPaidAt());

        if (payment.getBooking() != null) {
            dto.setBookingId(payment.getBooking().getId());
        }

        return dto;
    }

    private Payment mapToEntity(PaymentDTO dto) {
        Payment payment = new Payment();
        payment.setAmount(dto.getAmount());

        payment.setCurrency(dto.getCurrency() != null ? dto.getCurrency() : "PLN");
        payment.setStatus(dto.getStatus() != null ? dto.getStatus() : PaymentStatus.OCZEKUJACA);

        payment.setMethod(dto.getMethod());
        payment.setTransactionNumber(dto.getTransactionNumber());
        return payment;
    }
}
