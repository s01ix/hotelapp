package com.example.hotelapp.service;

import com.example.hotelapp.dto.UserDTO;
import com.example.hotelapp.model.User;
import com.example.hotelapp.model.UserRole;
import com.example.hotelapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public List<UserDTO> getAll() {
        List<User> usersFromDb = userRepository.findAll();
        List<UserDTO> dtoList = new ArrayList<>();

        for (User user : usersFromDb) {
            dtoList.add(mapToDto(user));
        }
        return dtoList;
    }
    public UserDTO create(UserDTO userDTO) {
        User userToSave = mapToEntity(userDTO);

        User savedUser = userRepository.save(userToSave);
        return mapToDto(savedUser);
    }

    public UserDTO update(Long id, UserDTO userDTO) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Nie znaleziono użytkownika o ID"));

        existingUser.setEmail(userDTO.getEmail());
        existingUser.setPasswordHash(userDTO.getPasswordHash());
        existingUser.setName(userDTO.getName());
        existingUser.setLastName(userDTO.getLastName());
        existingUser.setPhone(userDTO.getPhone());
        existingUser.setRole(userDTO.getRole());

        User savedUser = userRepository.save(existingUser);
        return mapToDto(savedUser);
    }

    public void delete(Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Brak użytkownika o ID");
        }
    }

    private UserDTO mapToDto(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setPasswordHash(user.getPasswordHash());
        dto.setName(user.getName());
        dto.setLastName(user.getLastName());
        dto.setPhone(user.getPhone());
        dto.setRole(user.getRole());
        return dto;
    }

    private User mapToEntity(UserDTO dto) {
        User user = new User();
        user.setEmail(dto.getEmail());
        user.setPasswordHash(dto.getPasswordHash());
        user.setName(dto.getName());
        user.setLastName(dto.getLastName());
        user.setPhone(dto.getPhone());
        user.setRole(dto.getRole() != null ? dto.getRole() : UserRole.USER);
        return user;
    }
}
