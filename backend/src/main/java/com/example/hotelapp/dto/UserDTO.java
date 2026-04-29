package com.example.hotelapp.dto;

import com.example.hotelapp.model.UserRole;
import lombok.Data;

@Data
public class UserDTO {
    private Long id;
    private String email;
    private String passwordHash;
    private String name;
    private String lastName;
    private String phone;
    private UserRole role;
}