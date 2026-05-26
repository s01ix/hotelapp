package com.example.hotelapp.controller;

import com.example.hotelapp.dto.BookingDTO;
import com.example.hotelapp.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/bookings")
@RequiredArgsConstructor
@CrossOrigin
public class BookingController {
    private final BookingService bookingService;

    @GetMapping("/my")
    public ResponseEntity<?> getMyBookings(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Brak aktywnej sesji. Zaloguj się.");
        }

        String userEmail;

        if (authentication instanceof OAuth2AuthenticationToken) {
            OAuth2AuthenticationToken oauthToken = (OAuth2AuthenticationToken) authentication;
            userEmail = oauthToken.getPrincipal().getAttribute("email");
        } else {

            userEmail = authentication.getName();
        }

        List<BookingDTO> userBookings = bookingService.getBookingsForUser(userEmail);

        return ResponseEntity.ok(userBookings);
    }

    @GetMapping
    public List<BookingDTO> getAll() {
        return bookingService.getAll();
    }

    @PostMapping
    public BookingDTO create(@Valid @RequestBody BookingDTO bookingDTO) {
        return bookingService.create(bookingDTO);
    }

    @PutMapping("/{id}")
    public BookingDTO update(@PathVariable Long id, @RequestBody BookingDTO bookingDTO) {
        return bookingService.update(id, bookingDTO);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateBookingStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String newStatus = payload.get("status");

        if (newStatus == null) {
            return ResponseEntity.badRequest().body("Brak pola 'status' w żądaniu.");
        }

        bookingService.updateStatus(id, newStatus);

        return ResponseEntity.ok().body("Status został pomyślnie zaktualizowany.");
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        bookingService.delete(id);
    }
}
