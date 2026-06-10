package com.example.hotelapp.controller;

import com.example.hotelapp.dto.OpinionsDTO;
import com.example.hotelapp.service.OpinionsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/opinions")
@RequiredArgsConstructor
public class OpinionsController {

    private final OpinionsService opinionsService;

    @GetMapping
    public List<OpinionsDTO> getAll() {
        return opinionsService.getAll();
    }

    @GetMapping("/user/{userId}")
    public List<OpinionsDTO> getUserOpinions(@PathVariable Long userId) {
        return opinionsService.getUserOpinions(userId);
    }

    @GetMapping("/room/{roomId}")
    public List<OpinionsDTO> getRoomOpinions(@PathVariable Long roomId) {
        return opinionsService.getRoomOpinions(roomId);
    }

    @GetMapping("/can-review/{bookingId}/user/{userId}")
    public ResponseEntity<Map<String, Boolean>> canReview(
            @PathVariable Long bookingId,
            @PathVariable Long userId) {
        boolean canReview = opinionsService.canReviewBooking(bookingId, userId);
        return ResponseEntity.ok(Map.of("canReview", canReview));
    }

    @PostMapping
    public OpinionsDTO create(@Valid @RequestBody OpinionsDTO opinionsDTO) {
        return opinionsService.create(opinionsDTO);
    }

    @PutMapping("/{id}")
    public OpinionsDTO update(@PathVariable Long id, @RequestBody OpinionsDTO opinionsDTO) {
        return opinionsService.update(id, opinionsDTO);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        opinionsService.delete(id);
    }
}
