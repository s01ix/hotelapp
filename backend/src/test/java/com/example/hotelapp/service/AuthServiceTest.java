package com.example.hotelapp.service;

import com.example.hotelapp.model.User;
import com.example.hotelapp.model.UserRole;
import com.example.hotelapp.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("AuthService - Testy jednostkowe")
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthService authService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setEmail("test@example.com");
        testUser.setPasswordHash("$2a$10$hashedPassword");
        testUser.setName("Jan");
        testUser.setLastName("Kowalski");
        testUser.setPhone("123456789");
        testUser.setRole(UserRole.USER);
    }


    @Test
    @DisplayName("loadUserByUsername() - powinien zwrócić UserDetails gdy użytkownik istnieje")
    void loadUserByUsername_ShouldReturnUserDetails_WhenUserExists() {
        
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));

        
        UserDetails userDetails = authService.loadUserByUsername("test@example.com");

        
        assertThat(userDetails).isNotNull();
        assertThat(userDetails.getUsername()).isEqualTo("test@example.com");
        assertThat(userDetails.getPassword()).isEqualTo("$2a$10$hashedPassword");
        assertThat(userDetails.getAuthorities()).hasSize(1);
        assertThat(userDetails.getAuthorities().iterator().next().getAuthority())
                .isEqualTo("ROLE_USER");

        verify(userRepository, times(1)).findByEmail("test@example.com");
    }

    @Test
    @DisplayName("loadUserByUsername() - powinien zwrócić UserDetails z rolą ADMIN")
    void loadUserByUsername_ShouldReturnUserDetailsWithAdminRole() {
        
        testUser.setRole(UserRole.ADMIN);
        when(userRepository.findByEmail("admin@example.com")).thenReturn(Optional.of(testUser));

        
        UserDetails userDetails = authService.loadUserByUsername("admin@example.com");

        
        assertThat(userDetails.getAuthorities().iterator().next().getAuthority())
                .isEqualTo("ROLE_ADMIN");
    }

    @Test
    @DisplayName("loadUserByUsername() - powinien rzucić UsernameNotFoundException gdy użytkownik nie istnieje")
    void loadUserByUsername_ShouldThrowException_WhenUserNotFound() {
        
        when(userRepository.findByEmail("nonexistent@example.com")).thenReturn(Optional.empty());

        
        assertThatThrownBy(() -> authService.loadUserByUsername("nonexistent@example.com"))
                .isInstanceOf(UsernameNotFoundException.class)
                .hasMessageContaining("Nie znaleziono użytkownika o podanym e-mailu");

        verify(userRepository, times(1)).findByEmail("nonexistent@example.com");
    }


    @Test
    @DisplayName("register() - powinien zarejestrować nowego użytkownika")
    void register_ShouldCreateNewUser() {
        
        String email = "newuser@example.com";
        String password = "password123";
        String name = "Anna";
        String lastName = "Nowak";
        String phone = "987654321";

        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());
        when(passwordEncoder.encode(password)).thenReturn("$2a$10$encodedPassword");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        
        authService.register(name, lastName, email, password, phone);

        
        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());

        User savedUser = userCaptor.getValue();
        assertThat(savedUser.getEmail()).isEqualTo(email);
        assertThat(savedUser.getPasswordHash()).isEqualTo("$2a$10$encodedPassword");
        assertThat(savedUser.getName()).isEqualTo(name);
        assertThat(savedUser.getLastName()).isEqualTo(lastName);
        assertThat(savedUser.getPhone()).isEqualTo(phone);
        assertThat(savedUser.getRole()).isEqualTo(UserRole.USER);

        verify(userRepository, times(1)).findByEmail(email);
        verify(passwordEncoder, times(1)).encode(password);
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    @DisplayName("register() - powinien zakodować hasło przed zapisem")
    void register_ShouldEncodePasswordBeforeSaving() {
        
        String plainPassword = "mySecretPassword";
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(plainPassword)).thenReturn("$2a$10$hashedPassword");

        
        authService.register("Jan", "Kowalski", "jan@example.com", plainPassword, "123456789");

        
        verify(passwordEncoder, times(1)).encode(plainPassword);

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());

        assertThat(userCaptor.getValue().getPasswordHash()).isEqualTo("$2a$10$hashedPassword");
        assertThat(userCaptor.getValue().getPasswordHash()).isNotEqualTo(plainPassword);
    }

    @Test
    @DisplayName("register() - powinien ustawić domyślną rolę USER")
    void register_ShouldSetDefaultUserRole() {
        
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");

        
        authService.register("Jan", "Kowalski", "jan@example.com", "password", "123456789");

        
        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());

        assertThat(userCaptor.getValue().getRole()).isEqualTo(UserRole.USER);
    }

    @Test
    @DisplayName("register() - powinien rzucić wyjątek gdy email już istnieje")
    void register_ShouldThrowException_WhenEmailAlreadyExists() {
        
        String existingEmail = "existing@example.com";
        when(userRepository.findByEmail(existingEmail)).thenReturn(Optional.of(testUser));

        
        assertThatThrownBy(() -> authService.register(
                "Jan", "Kowalski", existingEmail, "password", "123456789"
        ))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Użytkownik z tym e-mailem już istnieje");

        verify(userRepository, times(1)).findByEmail(existingEmail);
        verify(userRepository, never()).save(any(User.class));
        verify(passwordEncoder, never()).encode(anyString());
    }

    @Test
    @DisplayName("register() - powinien ustawić wszystkie wymagane pola")
    void register_ShouldSetAllRequiredFields() {
        
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");

        
        authService.register("Piotr", "Wiśniewski", "piotr@example.com", "pass123", "555666777");

        
        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());

        User savedUser = userCaptor.getValue();
        assertThat(savedUser.getName()).isEqualTo("Piotr");
        assertThat(savedUser.getLastName()).isEqualTo("Wiśniewski");
        assertThat(savedUser.getEmail()).isEqualTo("piotr@example.com");
        assertThat(savedUser.getPhone()).isEqualTo("555666777");
        assertThat(savedUser.getPasswordHash()).isNotNull();
        assertThat(savedUser.getRole()).isNotNull();
    }

    @Test
    @DisplayName("register() - nie powinien zapisać użytkownika gdy email istnieje")
    void register_ShouldNotSaveUser_WhenEmailExists() {
        
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(testUser));

        
        try {
            authService.register("Jan", "Kowalski", "test@example.com", "password", "123456789");
        } catch (RuntimeException e) {
        }

        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("register() - powinien wywołać repository.save dokładnie raz")
    void register_ShouldCallRepositorySaveOnce() {
        
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");

        
        authService.register("Jan", "Kowalski", "jan@example.com", "password", "123456789");

        
        verify(userRepository, times(1)).save(any(User.class));
    }
}