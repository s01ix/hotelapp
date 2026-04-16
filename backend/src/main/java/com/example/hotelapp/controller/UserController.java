package com.example.hotelapp.controller;

import com.example.hotelapp.model.User;
import com.example.hotelapp.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.webmvc.autoconfigure.WebMvcProperties;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/users")
@RequiredArgsConstructor

public class UserController {

    private final UserRepository userRepository;

    @GetMapping
    public List<User> getAll(){
        return userRepository.findAll();
    }

    @PostMapping
    public User create(@Valid @RequestBody User user){
        user.setId(null);
        return userRepository.save(user);
    }

    @PutMapping("/{id}")
    public User update(@RequestBody User user, @PathVariable Long id){
        return userRepository.findById(id).
                map(existingUser ->{
                    if(user.getEmail() != null){
                        existingUser.setEmail(user.getEmail());
                    }
                    if(user.getPasswordHash() != null){
                        existingUser.setPasswordHash(user.getPasswordHash());
                    }
                    if(user.getName() != null){
                        existingUser.setName(user.getName());
                    }
                    if(user.getLastName() != null){
                        existingUser.setLastName(user.getLastName());
                    }
                    if(user.getPhone() != null){
                        existingUser.setPhone(user.getPhone());
                    }
                    if(user.getRole() != null){
                        existingUser.setRole(user.getRole());
                    }
                    return userRepository.save(existingUser);
                }).orElseThrow(()-> new RuntimeException("Nie ma użytkownika o podanym ID"));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id){
        if(userRepository.existsById(id)) {
            userRepository.deleteById(id);
        }else {
            throw new RuntimeException("Nie można usunąć: brak użytkownika o podanym ID");
        }
    }
}
