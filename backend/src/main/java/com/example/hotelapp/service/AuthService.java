package com.example.hotelapp.service;

import com.example.hotelapp.model.User;
import com.example.hotelapp.model.UserRole;
import com.example.hotelapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class AuthService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UsernameNotFoundException("Nie znaleziono użytkownika o podanym e-mailu"));

        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPasswordHash())
                .roles(user.getRole().name())
                .build();
    }

    public void register(String name, String lastName,String email, String password, String phone){
        if(userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("Użytkownik z tym e-mailem już istnieje");
        }

        User user = new User();
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(password));
        user.setName(name);
        user.setLastName(lastName);
        user.setPhone(phone);
        user.setRole(UserRole.USER);

        userRepository.save(user);
    }
}