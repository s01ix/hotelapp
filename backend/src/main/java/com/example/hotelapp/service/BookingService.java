package com.example.hotelapp.service;

import com.example.hotelapp.dto.BookingDTO;
import com.example.hotelapp.model.Booking;
import com.example.hotelapp.model.BookingStatus;
import com.example.hotelapp.model.Room;
import com.example.hotelapp.model.User;
import com.example.hotelapp.repository.BookingRepository;
import com.example.hotelapp.repository.RoomRepository;
import com.example.hotelapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final RoomRepository roomRepository;

    public List<BookingDTO> getAll() {
        List<Booking> bookingsFromDb = bookingRepository.findAll();
        List<BookingDTO> dtoList = new ArrayList<>();

        for (Booking booking : bookingsFromDb) {
            dtoList.add(mapToDto(booking));
        }
        return dtoList;
    }

    public BookingDTO create(BookingDTO bookingDTO) {
        User user = userRepository.findById(bookingDTO.getUserId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nie znaleziono użytkownika o ID"));
        Room room = roomRepository.findById(bookingDTO.getRoomId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nie znaleziono pokoju o ID"));

        Booking bookingToSave = mapToEntity(bookingDTO);
        bookingToSave.setUser(user);
        bookingToSave.setRoom(room);

        Booking savedBooking = bookingRepository.save(bookingToSave);
        return mapToDto(savedBooking);
    }

    public BookingDTO update(Long id, BookingDTO bookingDTO) {
        Booking existingBooking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Nie znaleziono rezerwacji o ID: " + id));

        User user = userRepository.findById(bookingDTO.getUserId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nie znaleziono użytkownika o ID: " + bookingDTO.getUserId()));

        Room room = roomRepository.findById(bookingDTO.getRoomId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nie znaleziono pokoju o ID: " + bookingDTO.getRoomId()));

        existingBooking.setCheckInDate(bookingDTO.getCheckInDate());
        existingBooking.setCheckOutDate(bookingDTO.getCheckOutDate());
        existingBooking.setAdults(bookingDTO.getAdults());
        existingBooking.setChildren(bookingDTO.getChildren());
        existingBooking.setTotalAmount(bookingDTO.getTotalAmount());
        existingBooking.setNotes(bookingDTO.getNotes());

        existingBooking.setUser(user);
        existingBooking.setRoom(room);

        existingBooking.setStatus(bookingDTO.getStatus());
        if (bookingDTO.getStatus() == BookingStatus.ANULOWANA) {
            existingBooking.setCancelledAt(LocalDateTime.now());
        }

        Booking savedBooking = bookingRepository.save(existingBooking);
        return mapToDto(savedBooking);
    }

    public void delete(Long id) {
        if (bookingRepository.existsById(id)) {
            bookingRepository.deleteById(id);
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Nie można usunąć: brak rezerwacji o ID");
        }
    }
    private BookingDTO mapToDto(Booking booking) {
        BookingDTO dto = new BookingDTO();
        dto.setId(booking.getId());
        dto.setCheckInDate(booking.getCheckInDate());
        dto.setCheckOutDate(booking.getCheckOutDate());
        dto.setAdults(booking.getAdults());
        dto.setChildren(booking.getChildren());
        dto.setStatus(booking.getStatus());
        dto.setTotalAmount(booking.getTotalAmount());
        dto.setNotes(booking.getNotes());
        dto.setCancelledAt(booking.getCancelledAt());

        if (booking.getUser() != null) {
            dto.setUserId(booking.getUser().getId());
        }
        if (booking.getRoom() != null) {
            dto.setRoomId(booking.getRoom().getId());
        }

        return dto;
    }

    private Booking mapToEntity(BookingDTO dto) {
        Booking booking = new Booking();
        booking.setCheckInDate(dto.getCheckInDate());
        booking.setCheckOutDate(dto.getCheckOutDate());
        booking.setAdults(dto.getAdults());
        booking.setChildren(dto.getChildren());
        booking.setStatus(dto.getStatus() != null ? dto.getStatus() : BookingStatus.OCZEKUJACA);

        booking.setTotalAmount(dto.getTotalAmount());
        booking.setNotes(dto.getNotes());

        return booking;
    }

}
