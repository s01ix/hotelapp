package com.example.hotelapp.controller;

import com.example.hotelapp.dto.PaymentDTO;
import com.example.hotelapp.model.PaymentStatus;
import com.example.hotelapp.service.PaymentService;
import com.example.hotelapp.service.PaypalService;
import com.paypal.api.payments.Amount;
import com.paypal.api.payments.Links;
import com.paypal.api.payments.Payment;
import com.paypal.base.rest.PayPalRESTException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;

@Slf4j
@Controller
@RequestMapping("/paypal")
@RequiredArgsConstructor
public class PaypalController {

    private static final String FRONTEND_DASHBOARD = "redirect:http://localhost:5173/dashboard";

    private final PaypalService paypalService;
    private final PaymentService paymentService;

    @GetMapping("/pay")
    public String pay(@RequestParam("paymentId") Long internalPaymentId) {
        PaymentDTO pDto;
        try {
            pDto = paymentService.getById(internalPaymentId);
        } catch (ResponseStatusException e) {
            return FRONTEND_DASHBOARD + "?error=payment_not_found";
        }

        if (pDto.getStatus() == PaymentStatus.OPLACONA) {
            return FRONTEND_DASHBOARD + "?error=already_paid";
        }

        String currency = pDto.getCurrency() != null ? pDto.getCurrency() : "PLN";
        String cancelUrl = "http://localhost:8080/paypal/cancel";
        String successUrl = "http://localhost:8080/paypal/success?internalPaymentId=" + internalPaymentId;

        try {
            Payment payment = paypalService.createPayment(
                    pDto.getAmount().doubleValue(),
                    currency,
                    "paypal",
                    "sale",
                    "Opłata za rezerwację " + pDto.getBookingId(),
                    cancelUrl,
                    successUrl);

            // Zapamiętujemy identyfikator płatności PayPal, żeby przy powrocie
            // potwierdzić, że opłacono właśnie tę płatność wewnętrzną.
            paymentService.attachExternalPayment(internalPaymentId, payment.getId());

            for (Links link : payment.getLinks()) {
                if ("approval_url".equals(link.getRel())) {
                    return "redirect:" + link.getHref();
                }
            }
        } catch (PayPalRESTException | ResponseStatusException e) {
            log.warn("Nie udało się rozpocząć płatności PayPal dla płatności {}", internalPaymentId, e);
        }
        return FRONTEND_DASHBOARD + "?error=paypal_init_failed";
    }

    @GetMapping("/cancel")
    public String cancelPay() {
        return FRONTEND_DASHBOARD + "?status=canceled";
    }

    @GetMapping("/success")
    public String successPay(@RequestParam("paymentId") String paymentId,
                             @RequestParam("PayerID") String payerId,
                             @RequestParam("internalPaymentId") Long internalPaymentId) {
        try {
            Payment payment = paypalService.executePayment(paymentId, payerId);

            if ("approved".equals(payment.getState())
                    && payment.getTransactions() != null
                    && !payment.getTransactions().isEmpty()) {

                Amount paid = payment.getTransactions().get(0).getAmount();

                // Weryfikacja: identyfikator transakcji, kwota i waluta muszą się zgadzać
                // z płatnością wewnętrzną, zanim oznaczymy ją jako opłaconą.
                paymentService.markAsPaid(
                        internalPaymentId,
                        paymentId,
                        new BigDecimal(paid.getTotal()),
                        paid.getCurrency());

                return FRONTEND_DASHBOARD + "?status=success";
            }
        } catch (PayPalRESTException | ResponseStatusException | NumberFormatException e) {
            log.warn("Weryfikacja płatności PayPal {} nie powiodła się", paymentId, e);
        }
        return FRONTEND_DASHBOARD + "?status=error";
    }
}
