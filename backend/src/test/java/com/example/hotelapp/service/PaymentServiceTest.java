package com.example.hotelapp.service;

import com.example.hotelapp.dto.PaymentDTO;
import com.example.hotelapp.model.Booking;
import com.example.hotelapp.model.Payment;
import com.example.hotelapp.model.PaymentStatus;
import com.example.hotelapp.repository.BookingRepository;
import com.example.hotelapp.repository.PaymentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("PaymentService - Testy jednostkowe")
class PaymentServiceTest {

    @Mock
    private PaymentRepository paymentRepository;

    @Mock
    private BookingRepository bookingRepository;

    @InjectMocks
    private PaymentService paymentService;

    private Booking testBooking;
    private Payment testPayment;
    private PaymentDTO testPaymentDTO;

    @BeforeEach
    void setUp() {
        testBooking = new Booking();
        testBooking.setId(1L);

        testPayment = new Payment();
        testPayment.setId(1L);
        testPayment.setAmount(new BigDecimal("500.00"));
        testPayment.setCurrency("PLN");
        testPayment.setMethod("CARD");
        testPayment.setStatus(PaymentStatus.OCZEKUJACA);
        testPayment.setTransactionNumber("TXN123456");
        testPayment.setBooking(testBooking);

        testPaymentDTO = new PaymentDTO();
        testPaymentDTO.setId(1L);
        testPaymentDTO.setAmount(new BigDecimal("500.00"));
        testPaymentDTO.setCurrency("PLN");
        testPaymentDTO.setMethod("CARD");
        testPaymentDTO.setStatus(PaymentStatus.OCZEKUJACA);
        testPaymentDTO.setTransactionNumber("TXN123456");
        testPaymentDTO.setBookingId(1L);
    }

    @Test
    @DisplayName("getAll() - powinien zwrócić wszystkie płatności")
    void getAll_ShouldReturnAllPayments() {
        
        List<Payment> payments = Arrays.asList(testPayment);
        when(paymentRepository.findAll()).thenReturn(payments);

        
        List<PaymentDTO> result = paymentService.getAll();

        
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getAmount()).isEqualByComparingTo(new BigDecimal("500.00"));
        assertThat(result.get(0).getCurrency()).isEqualTo("PLN");
        verify(paymentRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("getAll() - powinien zwrócić pustą listę gdy brak płatności")
    void getAll_ShouldReturnEmptyList_WhenNoPayments() {
        
        when(paymentRepository.findAll()).thenReturn(List.of());

        
        List<PaymentDTO> result = paymentService.getAll();

        
        assertThat(result).isEmpty();
        verify(paymentRepository, times(1)).findAll();
    }

    

    @Test
    @DisplayName("create() - powinien utworzyć płatność")
    void create_ShouldCreatePayment() {
        
        when(bookingRepository.findById(1L)).thenReturn(Optional.of(testBooking));
        when(paymentRepository.save(any(Payment.class))).thenReturn(testPayment);

        
        PaymentDTO result = paymentService.create(testPaymentDTO);

        
        assertThat(result).isNotNull();
        assertThat(result.getAmount()).isEqualByComparingTo(new BigDecimal("500.00"));
        verify(bookingRepository, times(1)).findById(1L);
        verify(paymentRepository, times(1)).save(any(Payment.class));
    }

    @Test
    @DisplayName("create() - powinien ustawić paidAt gdy status to OPLACONA")
    void create_ShouldSetPaidAt_WhenStatusIsOplacona() {
        
        testPaymentDTO.setStatus(PaymentStatus.OPLACONA);
        when(bookingRepository.findById(1L)).thenReturn(Optional.of(testBooking));
        when(paymentRepository.save(any(Payment.class))).thenAnswer(inv -> inv.getArgument(0));

        
        LocalDateTime beforeCreation = LocalDateTime.now().minusSeconds(1);
        paymentService.create(testPaymentDTO);
        LocalDateTime afterCreation = LocalDateTime.now().plusSeconds(1);

        
        ArgumentCaptor<Payment> captor = ArgumentCaptor.forClass(Payment.class);
        verify(paymentRepository).save(captor.capture());
        Payment savedPayment = captor.getValue();

        assertThat(savedPayment.getPaidAt()).isNotNull();
        assertThat(savedPayment.getPaidAt()).isAfter(beforeCreation);
        assertThat(savedPayment.getPaidAt()).isBefore(afterCreation);
    }

    @Test
    @DisplayName("create() - nie powinien ustawić paidAt gdy status nie jest OPLACONA")
    void create_ShouldNotSetPaidAt_WhenStatusIsNotOplacona() {
        
        testPaymentDTO.setStatus(PaymentStatus.OCZEKUJACA);
        when(bookingRepository.findById(1L)).thenReturn(Optional.of(testBooking));
        when(paymentRepository.save(any(Payment.class))).thenAnswer(inv -> inv.getArgument(0));

        
        paymentService.create(testPaymentDTO);

        
        ArgumentCaptor<Payment> captor = ArgumentCaptor.forClass(Payment.class);
        verify(paymentRepository).save(captor.capture());
        assertThat(captor.getValue().getPaidAt()).isNull();
    }

    @Test
    @DisplayName("create() - powinien użyć domyślnej waluty PLN gdy nie podano")
    void create_ShouldUseDefaultCurrency_WhenNotProvided() {
        
        testPaymentDTO.setCurrency(null);
        when(bookingRepository.findById(1L)).thenReturn(Optional.of(testBooking));
        when(paymentRepository.save(any(Payment.class))).thenAnswer(inv -> inv.getArgument(0));

        
        paymentService.create(testPaymentDTO);

        
        ArgumentCaptor<Payment> captor = ArgumentCaptor.forClass(Payment.class);
        verify(paymentRepository).save(captor.capture());
        assertThat(captor.getValue().getCurrency()).isEqualTo("PLN");
    }

    @Test
    @DisplayName("create() - powinien użyć domyślnego statusu OCZEKUJACA gdy nie podano")
    void create_ShouldUseDefaultStatus_WhenNotProvided() {
        
        testPaymentDTO.setStatus(null);
        when(bookingRepository.findById(1L)).thenReturn(Optional.of(testBooking));
        when(paymentRepository.save(any(Payment.class))).thenAnswer(inv -> inv.getArgument(0));

        
        paymentService.create(testPaymentDTO);

        
        ArgumentCaptor<Payment> captor = ArgumentCaptor.forClass(Payment.class);
        verify(paymentRepository).save(captor.capture());
        assertThat(captor.getValue().getStatus()).isEqualTo(PaymentStatus.OCZEKUJACA);
    }

    @Test
    @DisplayName("create() - powinien rzucić wyjątek gdy rezerwacja nie istnieje")
    void create_ShouldThrowException_WhenBookingNotFound() {
        
        when(bookingRepository.findById(1L)).thenReturn(Optional.empty());

        
        assertThatThrownBy(() -> paymentService.create(testPaymentDTO))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Nie znaleziono rezerwacji o ID");

        verify(paymentRepository, never()).save(any(Payment.class));
    }

    @Test
    @DisplayName("create() - powinien przypisać rezerwację do płatności")
    void create_ShouldAssignBookingToPayment() {
        
        when(bookingRepository.findById(1L)).thenReturn(Optional.of(testBooking));
        when(paymentRepository.save(any(Payment.class))).thenAnswer(inv -> inv.getArgument(0));

        
        paymentService.create(testPaymentDTO);

        
        ArgumentCaptor<Payment> captor = ArgumentCaptor.forClass(Payment.class);
        verify(paymentRepository).save(captor.capture());
        assertThat(captor.getValue().getBooking()).isEqualTo(testBooking);
    }


    @Test
    @DisplayName("update() - powinien zaktualizować płatność")
    void update_ShouldUpdatePayment() {
        
        when(paymentRepository.findById(1L)).thenReturn(Optional.of(testPayment));
        when(bookingRepository.findById(1L)).thenReturn(Optional.of(testBooking));
        when(paymentRepository.save(any(Payment.class))).thenReturn(testPayment);

        PaymentDTO updateDTO = new PaymentDTO();
        updateDTO.setAmount(new BigDecimal("600.00"));
        updateDTO.setCurrency("EUR");
        updateDTO.setMethod("PAYPAL");
        updateDTO.setStatus(PaymentStatus.OCZEKUJACA);
        updateDTO.setTransactionNumber("TXN999999");
        updateDTO.setBookingId(1L);

        
        PaymentDTO result = paymentService.update(1L, updateDTO);

        
        assertThat(result).isNotNull();
        verify(paymentRepository, times(1)).save(any(Payment.class));
    }

    @Test
    @DisplayName("update() - powinien ustawić paidAt gdy zmiana statusu na OPLACONA")
    void update_ShouldSetPaidAt_WhenStatusChangedToOplacona() {
        
        testPayment.setPaidAt(null);
        testPayment.setStatus(PaymentStatus.OCZEKUJACA);

        when(paymentRepository.findById(1L)).thenReturn(Optional.of(testPayment));
        when(bookingRepository.findById(1L)).thenReturn(Optional.of(testBooking));
        when(paymentRepository.save(any(Payment.class))).thenAnswer(inv -> inv.getArgument(0));

        testPaymentDTO.setStatus(PaymentStatus.OPLACONA);

        
        paymentService.update(1L, testPaymentDTO);

        
        assertThat(testPayment.getPaidAt()).isNotNull();
        assertThat(testPayment.getStatus()).isEqualTo(PaymentStatus.OPLACONA);
    }

    @Test
    @DisplayName("update() - nie powinien nadpisać paidAt gdy już istnieje")
    void update_ShouldNotOverridePaidAt_WhenAlreadyExists() {
        
        LocalDateTime existingPaidAt = LocalDateTime.now().minusDays(1);
        testPayment.setPaidAt(existingPaidAt);
        testPayment.setStatus(PaymentStatus.OPLACONA);

        when(paymentRepository.findById(1L)).thenReturn(Optional.of(testPayment));
        when(bookingRepository.findById(1L)).thenReturn(Optional.of(testBooking));
        when(paymentRepository.save(any(Payment.class))).thenAnswer(inv -> inv.getArgument(0));

        testPaymentDTO.setStatus(PaymentStatus.OPLACONA);

        
        paymentService.update(1L, testPaymentDTO);

        
        assertThat(testPayment.getPaidAt()).isEqualTo(existingPaidAt);
    }

    @Test
    @DisplayName("update() - powinien rzucić wyjątek gdy płatność nie istnieje")
    void update_ShouldThrowException_WhenPaymentNotFound() {
        
        when(paymentRepository.findById(1L)).thenReturn(Optional.empty());

        
        assertThatThrownBy(() -> paymentService.update(1L, testPaymentDTO))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Nie znaleziono płatności o ID");

        verify(paymentRepository, never()).save(any(Payment.class));
    }

    @Test
    @DisplayName("update() - powinien rzucić wyjątek gdy nowa rezerwacja nie istnieje")
    void update_ShouldThrowException_WhenNewBookingNotFound() {
        
        when(paymentRepository.findById(1L)).thenReturn(Optional.of(testPayment));
        when(bookingRepository.findById(1L)).thenReturn(Optional.empty());

        
        assertThatThrownBy(() -> paymentService.update(1L, testPaymentDTO))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Nie znaleziono rezerwacji o ID");

        verify(paymentRepository, never()).save(any(Payment.class));
    }

    @Test
    @DisplayName("update() - powinien zaktualizować wszystkie pola")
    void update_ShouldUpdateAllFields() {
        
        when(paymentRepository.findById(1L)).thenReturn(Optional.of(testPayment));
        when(bookingRepository.findById(1L)).thenReturn(Optional.of(testBooking));
        when(paymentRepository.save(any(Payment.class))).thenAnswer(inv -> inv.getArgument(0));

        PaymentDTO updateDTO = new PaymentDTO();
        updateDTO.setAmount(new BigDecimal("999.99"));
        updateDTO.setCurrency("USD");
        updateDTO.setMethod("TRANSFER");
        updateDTO.setStatus(PaymentStatus.ZWROCONA);
        updateDTO.setTransactionNumber("NEW_TXN");
        updateDTO.setBookingId(1L);

        
        paymentService.update(1L, updateDTO);

        
        assertThat(testPayment.getAmount()).isEqualByComparingTo(new BigDecimal("999.99"));
        assertThat(testPayment.getCurrency()).isEqualTo("USD");
        assertThat(testPayment.getMethod()).isEqualTo("TRANSFER");
        assertThat(testPayment.getStatus()).isEqualTo(PaymentStatus.ZWROCONA);
        assertThat(testPayment.getTransactionNumber()).isEqualTo("NEW_TXN");
    }


    @Test
    @DisplayName("delete() - powinien usunąć płatność gdy istnieje")
    void delete_ShouldDeletePayment_WhenExists() {
        
        when(paymentRepository.existsById(1L)).thenReturn(true);
        doNothing().when(paymentRepository).deleteById(1L);

        
        paymentService.delete(1L);

        
        verify(paymentRepository, times(1)).existsById(1L);
        verify(paymentRepository, times(1)).deleteById(1L);
    }

    @Test
    @DisplayName("delete() - powinien rzucić wyjątek gdy płatność nie istnieje")
    void delete_ShouldThrowException_WhenPaymentNotFound() {
        
        when(paymentRepository.existsById(1L)).thenReturn(false);

        
        assertThatThrownBy(() -> paymentService.delete(1L))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Brak płatności o ID");

        verify(paymentRepository, never()).deleteById(anyLong());
    }
}