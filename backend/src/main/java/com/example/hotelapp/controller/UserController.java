package com.example.hotelapp.controller;

import com.example.hotelapp.dto.UserDTO;
import com.example.hotelapp.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.HashMap;
import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public Map<String, Object> getCurrentUser(org.springframework.security.core.Authentication authentication) {
        Map<String, Object> response = new HashMap<>();

        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            response.put("isLoggedIn", false);
            return response;
        }
        response.put("isLoggedIn", true);

        if (authentication.getPrincipal() instanceof OAuth2User oauth2User) {
            String email = oauth2User.getAttribute("email");
            String name = oauth2User.getAttribute("name");

            UserDTO localUser = userService.getOrCreateUserFromGoogle(email, name);
            response.put("id", localUser.getId());
            response.put("name", localUser.getName());
            response.put("email", localUser.getEmail());
            response.put("role", localUser.getRole());
        }else if (authentication.getPrincipal() instanceof org.springframework.security.core.userdetails.UserDetails userDetails) {
            String email = userDetails.getUsername();

            UserDTO localUser = userService.getUserByEmail(email);

            response.put("id", localUser.getId());
            response.put("name", localUser.getName());
            response.put("email", localUser.getEmail());
            response.put("role", localUser.getRole());
        }

        return response;
    }

    @GetMapping
    public List<UserDTO> getAll() {
        return userService.getAll();
    }

    @PostMapping
    public UserDTO create(@Valid @RequestBody UserDTO userDTO) {
        return userService.create(userDTO);
    }

    @PutMapping("/{id}")
    public UserDTO update(@PathVariable Long id, @RequestBody UserDTO userDTO) {
        return userService.update(id, userDTO);
    }

    @PutMapping("/{id}/role")
    public org.springframework.http.ResponseEntity<String> updateUserRole(@PathVariable Long id, @RequestParam String role) {
        userService.updateUserRole(id, role);
        return org.springframework.http.ResponseEntity.ok().body("Rola została pomyślnie zmieniona.");
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        userService.delete(id);
    }
}
