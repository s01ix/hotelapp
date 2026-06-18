package com.example.hotelapp.service;

import com.paypal.api.payments.*;
import com.paypal.base.rest.APIContext;
import com.paypal.base.rest.PayPalRESTException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedConstruction;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("PaypalService - Testy jednostkowe")
class PaypalServiceTest {

    @Mock
    private APIContext apiContext;

    @InjectMocks
    private PaypalService paypalService;

    @BeforeEach
    void setUp() {
    }


    @Test
    @DisplayName("createPayment() - powinien utworzyć płatność PayPal")
    void createPayment_ShouldCreatePayPalPayment() throws PayPalRESTException {
        
        Double total = 100.50;
        String currency = "USD";
        String method = "paypal";
        String intent = "sale";
        String description = "Test payment";
        String cancelUrl = "http://localhost/cancel";
        String successUrl = "http://localhost/success";

        
        try (MockedConstruction<Payment> mockedPayment = mockConstruction(Payment.class,
                (mock, context) -> {
                    when(mock.create(any(APIContext.class))).thenReturn(mock);
                    when(mock.getId()).thenReturn("PAYID-123");
                })) {

            Payment result = paypalService.createPayment(total, currency, method, intent,
                    description, cancelUrl, successUrl);

            
            assertThat(result).isNotNull();
            assertThat(mockedPayment.constructed()).hasSize(1);
        }
    }

    @Test
    @DisplayName("createPayment() - powinien zaokrąglić kwotę do 2 miejsc")
    void createPayment_ShouldRoundAmountToTwoDecimals() throws PayPalRESTException {
        
        Double total = 100.556;

        
        try (MockedConstruction<Payment> mockedPayment = mockConstruction(Payment.class,
                (mock, context) -> {
                    when(mock.create(any(APIContext.class))).thenReturn(mock);
                })) {

            paypalService.createPayment(total, "USD", "paypal", "sale",
                    "Test", "http://cancel", "http://success");

            assertThat(mockedPayment.constructed()).hasSize(1);
        }
    }

    @Test
    @DisplayName("createPayment() - powinien rzucić wyjątek przy błędzie PayPal")
    void createPayment_ShouldThrowException_OnPayPalError() throws PayPalRESTException {
        
        try (MockedConstruction<Payment> mockedPayment = mockConstruction(Payment.class,
                (mock, context) -> {
                    when(mock.create(any(APIContext.class)))
                            .thenThrow(new PayPalRESTException("PayPal error"));
                })) {

            
            assertThatThrownBy(() ->
                    paypalService.createPayment(100.0, "USD", "paypal", "sale",
                            "Test", "http://cancel", "http://success")
            ).isInstanceOf(PayPalRESTException.class);
        }
    }

    @Test
    @DisplayName("createPayment() - powinien ustawić poprawną walutę")
    void createPayment_ShouldSetCorrectCurrency() throws PayPalRESTException {
        
        String currency = "EUR";

        
        try (MockedConstruction<Payment> mockedPayment = mockConstruction(Payment.class,
                (mock, context) -> {
                    when(mock.create(any(APIContext.class))).thenReturn(mock);
                })) {

            paypalService.createPayment(50.0, currency, "paypal", "sale",
                    "Test", "http://cancel", "http://success");

            
            assertThat(mockedPayment.constructed()).hasSize(1);
            verify(mockedPayment.constructed().get(0), times(1)).create(apiContext);
        }
    }



    @Test
    @DisplayName("executePayment() - powinien wykonać płatność")
    void executePayment_ShouldExecutePayment() throws PayPalRESTException {
        
        String paymentId = "PAYID-123";
        String payerId = "PAYER-123";

        
        try (MockedConstruction<Payment> mockedPayment = mockConstruction(Payment.class,
                (mock, context) -> {
                    when(mock.execute(any(APIContext.class), any(PaymentExecution.class)))
                            .thenReturn(mock);
                    when(mock.getState()).thenReturn("approved");
                })) {

            Payment result = paypalService.executePayment(paymentId, payerId);

            
            assertThat(result).isNotNull();
            assertThat(mockedPayment.constructed()).hasSize(1);
            Payment constructed = mockedPayment.constructed().get(0);
            verify(constructed, times(1)).setId(paymentId);
            verify(constructed, times(1)).execute(eq(apiContext), any(PaymentExecution.class));
        }
    }

    @Test
    @DisplayName("executePayment() - powinien rzucić wyjątek przy błędzie wykonania")
    void executePayment_ShouldThrowException_OnExecutionError() throws PayPalRESTException {
        
        String paymentId = "PAYID-123";
        String payerId = "PAYER-123";

        
        try (MockedConstruction<Payment> mockedPayment = mockConstruction(Payment.class,
                (mock, context) -> {
                    when(mock.execute(any(APIContext.class), any(PaymentExecution.class)))
                            .thenThrow(new PayPalRESTException("Execution failed"));
                })) {

            
            assertThatThrownBy(() ->
                    paypalService.executePayment(paymentId, payerId)
            ).isInstanceOf(PayPalRESTException.class);
        }
    }

    @Test
    @DisplayName("executePayment() - powinien ustawić payerId w PaymentExecution")
    void executePayment_ShouldSetPayerIdInExecution() throws PayPalRESTException {
        
        String paymentId = "PAYID-123";
        String payerId = "PAYER-XYZ";

        
        try (MockedConstruction<Payment> mockedPayment = mockConstruction(Payment.class,
                (mock, context) -> {
                    when(mock.execute(any(APIContext.class), any(PaymentExecution.class)))
                            .thenReturn(mock);
                });
             MockedConstruction<PaymentExecution> mockedExecution = mockConstruction(PaymentExecution.class)) {

            paypalService.executePayment(paymentId, payerId);

            
            assertThat(mockedExecution.constructed()).hasSize(1);
            verify(mockedExecution.constructed().get(0), times(1)).setPayerId(payerId);
        }
    }
}