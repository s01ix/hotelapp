package com.example.hotelapp.controller;

import com.example.hotelapp.dto.OpinionsDTO;
import com.example.hotelapp.service.OpinionsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/opinions")
@RequiredArgsConstructor
public class OpinionsController {

    private final OpinionsService opinionsService;

    @GetMapping
    public List<OpinionsDTO> getAll() {
        return opinionsService.getAll();
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
