package com.example.hotelapp.service;

import com.example.hotelapp.dto.UserDTO;
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
import org.springframework.web.server.ResponseStatusException;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("UserService - Testy jednostkowe")
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    private User testUser;
    private UserDTO testUserDTO;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setEmail("user@example.com");
        testUser.setPasswordHash("hashedPassword");
        testUser.setName("Jan");
        testUser.setLastName("Kowalski");
        testUser.setPhone("123456789");
        testUser.setRole(UserRole.USER);

        testUserDTO = new UserDTO();
        testUserDTO.setId(1L);
        testUserDTO.setEmail("user@example.com");
        testUserDTO.setPasswordHash("hashedPassword");
        testUserDTO.setName("Jan");
        testUserDTO.setLastName("Kowalski");
        testUserDTO.setPhone("123456789");
        testUserDTO.setRole(UserRole.USER);
    }

    @Test
    @DisplayName("getOrCreateUserFromGoogle() - powinien zwrócić istniejącego użytkownika")
    void getOrCreateUserFromGoogle_ShouldReturnExistingUser() {
        
        String email = "user@gmail.com";
        String fullName = "Jan Kowalski";
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(testUser));

        
        UserDTO result = userService.getOrCreateUserFromGoogle(email, fullName);

        
        assertThat(result).isNotNull();
        assertThat(result.getEmail()).isEqualTo(testUser.getEmail());
        verify(userRepository, times(1)).findByEmail(email);
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("getOrCreateUserFromGoogle() - powinien utworzyć nowego użytkownika")
    void getOrCreateUserFromGoogle_ShouldCreateNewUser() {
        
        String email = "newuser@gmail.com";
        String fullName = "Anna Nowak";
        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenAnswer(inv -> {
            User user = inv.getArgument(0);
            user.setId(2L);
            return user;
        });

        
        UserDTO result = userService.getOrCreateUserFromGoogle(email, fullName);

        
        assertThat(result).isNotNull();
        assertThat(result.getEmail()).isEqualTo(email);
        verify(userRepository, times(1)).findByEmail(email);
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    @DisplayName("getOrCreateUserFromGoogle() - powinien rozdzielić imię i nazwisko")
    void getOrCreateUserFromGoogle_ShouldSplitNameCorrectly() {
        
        String email = "newuser@gmail.com";
        String fullName = "Jan Kowalski";
        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

        
        userService.getOrCreateUserFromGoogle(email, fullName);

        
        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(captor.capture());
        User saved = captor.getValue();

        assertThat(saved.getName()).isEqualTo("Jan");
        assertThat(saved.getLastName()).isEqualTo("Kowalski");
    }

    @Test
    @DisplayName("getOrCreateUserFromGoogle() - powinien obsłużyć imię bez nazwiska")
    void getOrCreateUserFromGoogle_ShouldHandleSingleName() {
        
        String email = "newuser@gmail.com";
        String fullName = "Jan";
        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

        
        userService.getOrCreateUserFromGoogle(email, fullName);

        
        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(captor.capture());
        User saved = captor.getValue();

        assertThat(saved.getName()).isEqualTo("Jan");
        assertThat(saved.getLastName()).isEqualTo("GoogleUser");
    }

    @Test
    @DisplayName("getOrCreateUserFromGoogle() - powinien ustawić domyślne wartości")
    void getOrCreateUserFromGoogle_ShouldSetDefaultValues() {
        
        String email = "newuser@gmail.com";
        String fullName = "Jan Kowalski";
        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

        
        userService.getOrCreateUserFromGoogle(email, fullName);

        
        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(captor.capture());
        User saved = captor.getValue();

        assertThat(saved.getPhone()).isEqualTo("000000000");
        assertThat(saved.getPasswordHash()).startsWith("OAUTH2_ACCOUNT_");
        assertThat(saved.getRole()).isEqualTo(UserRole.USER);
    }

    @Test
    @DisplayName("getUserByEmail() - powinien zwrócić użytkownika po email")
    void getUserByEmail_ShouldReturnUser() {
        
        String email = "user@example.com";
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(testUser));

        
        UserDTO result = userService.getUserByEmail(email);

        
        assertThat(result).isNotNull();
        assertThat(result.getEmail()).isEqualTo(email);
        verify(userRepository, times(1)).findByEmail(email);
    }

    @Test
    @DisplayName("getUserByEmail() - powinien rzucić wyjątek gdy użytkownik nie istnieje")
    void getUserByEmail_ShouldThrowException_WhenUserNotFound() {
        
        String email = "nonexistent@example.com";
        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());

        
        assertThatThrownBy(() -> userService.getUserByEmail(email))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Nie znaleziono użytkownika");
    }

    @Test
    @DisplayName("getAll() - powinien zwrócić wszystkich użytkowników")
    void getAll_ShouldReturnAllUsers() {
        
        List<User> users = Arrays.asList(testUser);
        when(userRepository.findAll()).thenReturn(users);

        
        List<UserDTO> result = userService.getAll();

        
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getEmail()).isEqualTo("user@example.com");
        verify(userRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("getAll() - powinien zwrócić pustą listę gdy brak użytkowników")
    void getAll_ShouldReturnEmptyList_WhenNoUsers() {
        
        when(userRepository.findAll()).thenReturn(List.of());

        
        List<UserDTO> result = userService.getAll();

        
        assertThat(result).isEmpty();
        verify(userRepository, times(1)).findAll();
    }

    

    @Test
    @DisplayName("create() - powinien utworzyć użytkownika")
    void create_ShouldCreateUser() {
        
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        
        UserDTO result = userService.create(testUserDTO);

        
        assertThat(result).isNotNull();
        assertThat(result.getEmail()).isEqualTo("user@example.com");
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    @DisplayName("create() - powinien użyć domyślnej roli USER gdy nie podano")
    void create_ShouldUseDefaultRole_WhenNotProvided() {
        
        testUserDTO.setRole(null);
        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

        
        userService.create(testUserDTO);

        
        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(captor.capture());
        assertThat(captor.getValue().getRole()).isEqualTo(UserRole.USER);
    }

    @Test
    @DisplayName("create() - powinien zmapować wszystkie pola")
    void create_ShouldMapAllFields() {
        
        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

        
        userService.create(testUserDTO);

        
        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(captor.capture());
        User saved = captor.getValue();

        assertThat(saved.getEmail()).isEqualTo("user@example.com");
        assertThat(saved.getPasswordHash()).isEqualTo("hashedPassword");
        assertThat(saved.getName()).isEqualTo("Jan");
        assertThat(saved.getLastName()).isEqualTo("Kowalski");
        assertThat(saved.getPhone()).isEqualTo("123456789");
        assertThat(saved.getRole()).isEqualTo(UserRole.USER);
    }


    @Test
    @DisplayName("update() - powinien zaktualizować użytkownika")
    void update_ShouldUpdateUser() {
        
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        UserDTO updateDTO = new UserDTO();
        updateDTO.setEmail("newemail@example.com");
        updateDTO.setPasswordHash("newHash");
        updateDTO.setName("Anna");
        updateDTO.setLastName("Nowak");
        updateDTO.setPhone("987654321");
        updateDTO.setRole(UserRole.ADMIN);

        
        UserDTO result = userService.update(1L, updateDTO);

        
        assertThat(result).isNotNull();
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    @DisplayName("update() - powinien rzucić wyjątek gdy użytkownik nie istnieje")
    void update_ShouldThrowException_WhenUserNotFound() {
        
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        
        assertThatThrownBy(() -> userService.update(1L, testUserDTO))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Nie znaleziono użytkownika o ID");

        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("update() - powinien zaktualizować wszystkie pola")
    void update_ShouldUpdateAllFields() {
        
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

        UserDTO updateDTO = new UserDTO();
        updateDTO.setEmail("updated@example.com");
        updateDTO.setPasswordHash("updatedHash");
        updateDTO.setName("Piotr");
        updateDTO.setLastName("Wiśniewski");
        updateDTO.setPhone("111222333");
        updateDTO.setRole(UserRole.RECEPTIONIST);

        
        userService.update(1L, updateDTO);

        
        assertThat(testUser.getEmail()).isEqualTo("updated@example.com");
        assertThat(testUser.getPasswordHash()).isEqualTo("updatedHash");
        assertThat(testUser.getName()).isEqualTo("Piotr");
        assertThat(testUser.getLastName()).isEqualTo("Wiśniewski");
        assertThat(testUser.getPhone()).isEqualTo("111222333");
        assertThat(testUser.getRole()).isEqualTo(UserRole.RECEPTIONIST);
    }

    @Test
    @DisplayName("updateUserRole() - powinien zaktualizować rolę użytkownika")
    void updateUserRole_ShouldUpdateRole() {
        
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

        
        userService.updateUserRole(1L, "ADMIN");

        
        assertThat(testUser.getRole()).isEqualTo(UserRole.ADMIN);
        verify(userRepository, times(1)).save(testUser);
    }

    @Test
    @DisplayName("updateUserRole() - powinien rzucić wyjątek gdy użytkownik nie istnieje")
    void updateUserRole_ShouldThrowException_WhenUserNotFound() {
        
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        
        assertThatThrownBy(() -> userService.updateUserRole(1L, "ADMIN"))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Nie znaleziono użytkownika");

        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("updateUserRole() - powinien obsłużyć role w małych literach")
    void updateUserRole_ShouldHandleLowercaseRole() {
        
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

        
        userService.updateUserRole(1L, "receptionist");

        
        assertThat(testUser.getRole()).isEqualTo(UserRole.RECEPTIONIST);
    }


    @Test
    @DisplayName("delete() - powinien usunąć użytkownika gdy istnieje")
    void delete_ShouldDeleteUser_WhenExists() {
        
        when(userRepository.existsById(1L)).thenReturn(true);
        doNothing().when(userRepository).deleteById(1L);

        
        userService.delete(1L);

        
        verify(userRepository, times(1)).existsById(1L);
        verify(userRepository, times(1)).deleteById(1L);
    }

    @Test
    @DisplayName("delete() - powinien rzucić wyjątek gdy użytkownik nie istnieje")
    void delete_ShouldThrowException_WhenUserNotFound() {
        
        when(userRepository.existsById(1L)).thenReturn(false);

        
        assertThatThrownBy(() -> userService.delete(1L))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Brak użytkownika o ID");

        verify(userRepository, never()).deleteById(anyLong());
    }
}