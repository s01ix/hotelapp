package com.example.hotelapp.controller;

import com.example.hotelapp.model.Opinions;
import com.example.hotelapp.repository.OpinionsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/opinions")
@RequiredArgsConstructor
public class OpinionsController {
    private final OpinionsRepository opinionsRepository;

    @GetMapping
    public List<Opinions> getAll(){
        return opinionsRepository.findAll();
    }

    @PostMapping
    public Opinions create(@RequestBody Opinions opinions){
        opinions.setId(null);
        return opinionsRepository.save(opinions);
    }

    @PutMapping("/{id}")
    public Opinions update(@RequestBody Opinions opinions, @PathVariable Long id){
        return opinionsRepository.findById(id)
                .map(existingOpinions ->{
                    if(opinions.getRate() != null){
                        existingOpinions.setRate(opinions.getRate());
                    }
                    if(opinions.getComment() != null){
                        existingOpinions.setComment(opinions.getComment());
                    }

                    return opinionsRepository.save(existingOpinions);
                }).orElseThrow(()-> new RuntimeException("Nie znaleziono opini o podanym ID"));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id){
        if(opinionsRepository.existsById(id)){
            opinionsRepository.deleteById(id);
        }else {
            throw new RuntimeException("Nie znaleziono opini o podanym ID");
        }
    }
}
