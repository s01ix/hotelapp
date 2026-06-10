package com.example.hotelapp.service;

import com.example.hotelapp.dto.OpinionsDTO;
import com.example.hotelapp.model.Booking;
import com.example.hotelapp.model.Opinions;
import com.example.hotelapp.model.Room;
import com.example.hotelapp.model.User;
import com.example.hotelapp.repository.BookingRepository;
import com.example.hotelapp.repository.OpinionsRepository;
import com.example.hotelapp.repository.RoomRepository;
import com.example.hotelapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OpinionsService {
    private final OpinionsRepository opinionsRepository;
    private final UserRepository userRepository;
    private final RoomRepository roomRepository;
    private final BookingRepository bookingRepository;

    public List<OpinionsDTO> getAll() {
        List<Opinions> opinionsFromDb = opinionsRepository.findAll();
        List<OpinionsDTO> dtoList = new ArrayList<>();

        for (Opinions opinion : opinionsFromDb) {
            dtoList.add(mapToDto(opinion));
        }
        return dtoList;
    }
    public List<OpinionsDTO> getUserOpinions(Long userId) {
        List<Opinions> opinions = opinionsRepository.findByUserId(userId);
        List<OpinionsDTO> dtoList = new ArrayList<>();
        for (Opinions opinion : opinions) {
            dtoList.add(mapToDto(opinion));
        }
        return dtoList;
    }

    public List<OpinionsDTO> getRoomOpinions(Long roomId) {
        List<Opinions> opinions = opinionsRepository.findByRoomId(roomId);
        List<OpinionsDTO> dtoList = new ArrayList<>();
        for (Opinions opinion : opinions) {
            dtoList.add(mapToDto(opinion));
        }
        return dtoList;
    }

    public boolean canReviewBooking(Long bookingId, Long userId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Nie znaleziono rezerwacji"));

        if (!booking.getUser().getId().equals(userId)) {
            return false;
        }

        if (booking.getCheckOutDate().isAfter(LocalDate.now())) {
            return false;
        }

        return !opinionsRepository.existsByBookingId(bookingId);
    }


    public OpinionsDTO create(OpinionsDTO dto) {
        if (!canReviewBooking(dto.getBookingId(), dto.getUserId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Nie możesz wystawić opinii dla tej rezerwacji");
        }

        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Nie znaleziono użytkownika o ID"));

        Room room = roomRepository.findById(dto.getRoomId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Nie znaleziono pokoju o ID"));

        Booking booking = bookingRepository.findById(dto.getBookingId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Nie znaleziono rezerwacji o ID"));

        Opinions opinionToSave = mapToEntity(dto);
        opinionToSave.setUser(user);
        opinionToSave.setRoom(room);
        opinionToSave.setBooking(booking);

        Opinions savedOpinion = opinionsRepository.save(opinionToSave);
        return mapToDto(savedOpinion);
    }

    public OpinionsDTO update(Long id, OpinionsDTO dto) {
        Opinions existingOpinion = opinionsRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Nie znaleziono opinii o ID"));

        if (!existingOpinion.getUser().getId().equals(dto.getUserId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Nie możesz edytować cudzej opinii");
        }

        existingOpinion.setRate(dto.getRate());
        existingOpinion.setComment(dto.getComment());

        Opinions savedOpinion = opinionsRepository.save(existingOpinion);
        return mapToDto(savedOpinion);
    }


    public void delete(Long id) {
        if (opinionsRepository.existsById(id)) {
            opinionsRepository.deleteById(id);
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Brak opinii o ID");
        }
    }

    private OpinionsDTO mapToDto(Opinions opinion) {
        OpinionsDTO dto = new OpinionsDTO();
        dto.setId(opinion.getId());
        dto.setRate(opinion.getRate());
        dto.setComment(opinion.getComment());

        if (opinion.getUser() != null) dto.setUserId(opinion.getUser().getId());
        if (opinion.getRoom() != null) dto.setRoomId(opinion.getRoom().getId());
        if (opinion.getBooking() != null) dto.setBookingId(opinion.getBooking().getId());

        return dto;
    }

    private Opinions mapToEntity(OpinionsDTO dto) {
        Opinions opinion = new Opinions();
        opinion.setRate(dto.getRate());
        opinion.setComment(dto.getComment());
        return opinion;
    }
}
