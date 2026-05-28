package com.example.hotelapp.controller;

import com.example.hotelapp.dto.PaymentDTO;
import com.example.hotelapp.model.PaymentStatus;
import com.example.hotelapp.service.PaymentService;
import com.example.hotelapp.service.PaypalService;
import com.paypal.api.payments.Links;
import com.paypal.api.payments.Payment;
import com.paypal.base.rest.PayPalRESTException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequestMapping("/paypal")
@RequiredArgsConstructor
public class PaypalController {

    private final PaypalService paypalService;
    private final PaymentService paymentService;

    @GetMapping("/pay")
    public String pay(@RequestParam("paymentId") Long internalPaymentId) {
        try {
            // Fetch internal payment to get amount and info.
            // Simplified for demonstration: getting by id, assuming it exists.
            PaymentDTO pDto = paymentService.getAll().stream()
                    .filter(p -> p.getId().equals(internalPaymentId))
                    .findFirst()
                    .orElse(null);

            if (pDto == null) return "redirect:http://localhost:5173/dashboard?error=payment_not_found";

            String cancelUrl = "http://localhost:8080/paypal/cancel";
            String successUrl = "http://localhost:8080/paypal/success?internalPaymentId=" + internalPaymentId;

            Payment payment = paypalService.createPayment(
                    pDto.getAmount().doubleValue(),
                    "PLN",
                    "paypal",
                    "sale",
                    "Opłata za rezerwację " + pDto.getBookingId(),
                    cancelUrl,
                    successUrl);

            for(Links links : payment.getLinks()) {
                if(links.getRel().equals("approval_url")) {
                    return "redirect:" + links.getHref();
                }
            }
        } catch (PayPalRESTException e) {
            e.printStackTrace();
        }
        return "redirect:http://localhost:5173/dashboard?error=paypal_init_failed";
    }

    @GetMapping("/cancel")
    public String cancelPay() {
        return "redirect:http://localhost:5173/dashboard?status=canceled";
    }

    @GetMapping("/success")
    public String successPay(@RequestParam("paymentId") String paymentId,
                             @RequestParam("PayerID") String payerId,
                             @RequestParam("internalPaymentId") Long internalPaymentId) {
        try {
            Payment payment = paypalService.executePayment(paymentId, payerId);
            if(payment.getState().equals("approved")) {

                PaymentDTO pDto = paymentService.getAll().stream()
                    .filter(p -> p.getId().equals(internalPaymentId))
                    .findFirst()
                    .orElse(null);

                if(pDto != null) {
                    pDto.setStatus(PaymentStatus.OPLACONA);
                    pDto.setTransactionNumber(paymentId);
                    paymentService.update(internalPaymentId, pDto);
                }

                return "redirect:http://localhost:5173/dashboard?status=success";
            }
        } catch (PayPalRESTException e) {
            e.printStackTrace();
        }
        return "redirect:http://localhost:5173/dashboard?status=error";
    }
}
