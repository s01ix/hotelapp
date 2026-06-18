package com.example.hotelapp.service;

import com.example.hotelapp.model.User;
import com.example.hotelapp.model.UserRole;
import com.example.hotelapp.repository.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
@DisplayName("AuthService - Testy integracyjne")
class AuthServiceIntegrationTest {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @AfterEach
    void cleanUp() {
        userRepository.deleteAll();
    }


    @Test
    @DisplayName("Powinien zarejestrować nowego użytkownika i zapisać w bazie")
    void shouldRegisterNewUserAndPersist() {
        String email = "newuser@example.com";
        String password = "password123";
        String name = "Jan";
        String lastName = "Kowalski";
        String phone = "123456789";

        authService.register(name, lastName, email, password, phone);

        User savedUser = userRepository.findByEmail(email).orElseThrow();
        assertThat(savedUser.getEmail()).isEqualTo(email);
        assertThat(savedUser.getName()).isEqualTo(name);
        assertThat(savedUser.getLastName()).isEqualTo(lastName);
        assertThat(savedUser.getPhone()).isEqualTo(phone);
        assertThat(savedUser.getRole()).isEqualTo(UserRole.USER);
        assertThat(passwordEncoder.matches(password, savedUser.getPasswordHash())).isTrue();
    }

    @Test
    @DisplayName("Powinien zakodować hasło przy rejestracji używając BCrypt")
    void shouldEncodePasswordOnRegistration() {
        String plainPassword = "mySecretPassword123";

        authService.register("Anna", "Nowak", "anna@example.com", plainPassword, "987654321");

        User savedUser = userRepository.findByEmail("anna@example.com").orElseThrow();
        assertThat(savedUser.getPasswordHash()).isNotEqualTo(plainPassword);
        assertThat(savedUser.getPasswordHash()).startsWith("$2a$");
        assertThat(savedUser.getPasswordHash().length()).isGreaterThan(50);
        assertThat(passwordEncoder.matches(plainPassword, savedUser.getPasswordHash())).isTrue();
    }

    @Test
    @DisplayName("Powinien rzucić wyjątek gdy próbujemy zarejestrować użytkownika z istniejącym emailem")
    void shouldThrowExceptionWhenRegisteringDuplicateEmail() {
        String email = "duplicate@example.com";
        authService.register("Jan", "Kowalski", email, "password1", "123456789");

        assertThatThrownBy(() ->
                authService.register("Anna", "Nowak", email, "password2", "987654321")
        )
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Użytkownik z tym e-mailem już istnieje");

        assertThat(userRepository.findAll()).hasSize(1);
    }

    @Test
    @DisplayName("Powinien ustawić domyślną rolę USER przy rejestracji")
    void shouldSetDefaultUserRoleOnRegistration() {
        authService.register("Maria", "Kowalczyk", "maria@example.com", "password", "111222333");

        User savedUser = userRepository.findByEmail("maria@example.com").orElseThrow();
        assertThat(savedUser.getRole()).isEqualTo(UserRole.USER);
    }

    @Test
    @DisplayName("Powinien zapisać wszystkie pola użytkownika w bazie danych")
    void shouldPersistAllUserFields() {
        String name = "Tomasz";
        String lastName = "Zieliński";
        String email = "tomasz@example.com";
        String password = "securePassword";
        String phone = "444555666";

        authService.register(name, lastName, email, password, phone);

        User savedUser = userRepository.findByEmail(email).orElseThrow();
        assertThat(savedUser.getId()).isNotNull();
        assertThat(savedUser.getName()).isEqualTo(name);
        assertThat(savedUser.getLastName()).isEqualTo(lastName);
        assertThat(savedUser.getEmail()).isEqualTo(email);
        assertThat(savedUser.getPhone()).isEqualTo(phone);
        assertThat(savedUser.getPasswordHash()).isNotNull();
        assertThat(savedUser.getRole()).isEqualTo(UserRole.USER);
    }

    @Test
    @DisplayName("Powinien zarejestrować wielu użytkowników z różnymi emailami")
    void shouldRegisterMultipleUsersWithDifferentEmails() {
        authService.register("Jan", "Kowalski", "jan@example.com", "pass1", "111111111");
        authService.register("Anna", "Nowak", "anna@example.com", "pass2", "222222222");
        authService.register("Piotr", "Wiśniewski", "piotr@example.com", "pass3", "333333333");

        assertThat(userRepository.findAll()).hasSize(3);
        assertThat(userRepository.findByEmail("jan@example.com")).isPresent();
        assertThat(userRepository.findByEmail("anna@example.com")).isPresent();
        assertThat(userRepository.findByEmail("piotr@example.com")).isPresent();
    }

    @Test
    @DisplayName("Powinien załadować UserDetails dla istniejącego użytkownika z bazy")
    void shouldLoadUserDetailsByUsername() {
        String email = "test@example.com";
        String password = "password123";
        authService.register("Piotr", "Wiśniewski", email, password, "555666777");

        UserDetails userDetails = authService.loadUserByUsername(email);

        assertThat(userDetails).isNotNull();
        assertThat(userDetails.getUsername()).isEqualTo(email);
        assertThat(userDetails.getAuthorities()).hasSize(1);
        assertThat(userDetails.getAuthorities().iterator().next().getAuthority())
                .isEqualTo("ROLE_USER");

        User dbUser = userRepository.findByEmail(email).orElseThrow();
        assertThat(userDetails.getPassword()).isEqualTo(dbUser.getPasswordHash());
    }

    @Test
    @DisplayName("Powinien załadować UserDetails z rolą ADMIN")
    void shouldLoadUserDetailsWithAdminRole() {
        String email = "admin@example.com";
        User admin = new User();
        admin.setEmail(email);
        admin.setName("Admin");
        admin.setLastName("User");
        admin.setPhone("999999999");
        admin.setPasswordHash(passwordEncoder.encode("adminpass"));
        admin.setRole(UserRole.ADMIN);
        userRepository.save(admin);

        UserDetails userDetails = authService.loadUserByUsername(email);

        assertThat(userDetails.getAuthorities()).hasSize(1);
        assertThat(userDetails.getAuthorities().iterator().next().getAuthority())
                .isEqualTo("ROLE_ADMIN");
    }

    @Test
    @DisplayName("Powinien rzucić UsernameNotFoundException dla nieistniejącego użytkownika")
    void shouldThrowExceptionWhenLoadingNonExistentUser() {
        assertThatThrownBy(() -> authService.loadUserByUsername("nonexistent@example.com"))
                .isInstanceOf(UsernameNotFoundException.class)
                .hasMessageContaining("Nie znaleziono użytkownika o podanym e-mailu");
    }

    @Test
    @DisplayName("Powinien poprawnie weryfikować hasło po rejestracji")
    void shouldCorrectlyVerifyPasswordAfterRegistration() {
        String email = "verify@example.com";
        String correctPassword = "myPassword123";
        String wrongPassword = "wrongPassword";

        authService.register("Test", "User", email, correctPassword, "123456789");

        User user = userRepository.findByEmail(email).orElseThrow();

        assertThat(passwordEncoder.matches(correctPassword, user.getPasswordHash())).isTrue();
        assertThat(passwordEncoder.matches(wrongPassword, user.getPasswordHash())).isFalse();
    }

    @Test
    @DisplayName("Hasło nie powinno być przechowywane w postaci jawnej w bazie")
    void passwordShouldNotBeStoredInPlainText() {
        String plainPassword = "verySecretPassword";

        authService.register("Katarzyna", "Lewandowska", "kasia@example.com", plainPassword, "777888999");

        User savedUser = userRepository.findByEmail("kasia@example.com").orElseThrow();
        assertThat(savedUser.getPasswordHash()).isNotEqualTo(plainPassword);
        assertThat(savedUser.getPasswordHash().length()).isGreaterThan(plainPassword.length());
        assertThat(savedUser.getPasswordHash()).doesNotContain(plainPassword);
    }

    @Test
    @DisplayName("loadUserByUsername powinien zwrócić ten sam hash hasła co w bazie")
    void loadUserByUsernameShouldReturnCorrectPasswordHash() {
        String email = "user@example.com";
        String password = "testPassword";
        authService.register("Test", "User", email, password, "123123123");

        UserDetails userDetails = authService.loadUserByUsername(email);
        User dbUser = userRepository.findByEmail(email).orElseThrow();

        assertThat(userDetails.getPassword()).isEqualTo(dbUser.getPasswordHash());
        assertThat(passwordEncoder.matches(password, userDetails.getPassword())).isTrue();
    }

    @Test
    @DisplayName("Powinien obsługiwać różne role użytkowników")
    void shouldHandleDifferentUserRoles() {
        User user = new User();
        user.setEmail("user@test.com");
        user.setName("User");
        user.setLastName("Test");
        user.setPhone("111111111");
        user.setPasswordHash(passwordEncoder.encode("pass"));
        user.setRole(UserRole.USER);
        userRepository.save(user);

        User receptionist = new User();
        receptionist.setEmail("receptionist@test.com");
        receptionist.setName("Receptionist");
        receptionist.setLastName("Test");
        receptionist.setPhone("222222222");
        receptionist.setPasswordHash(passwordEncoder.encode("pass"));
        receptionist.setRole(UserRole.RECEPTIONIST);
        userRepository.save(receptionist);

        User admin = new User();
        admin.setEmail("admin@test.com");
        admin.setName("Admin");
        admin.setLastName("Test");
        admin.setPhone("333333333");
        admin.setPasswordHash(passwordEncoder.encode("pass"));
        admin.setRole(UserRole.ADMIN);
        userRepository.save(admin);

        UserDetails userDetails = authService.loadUserByUsername("user@test.com");
        assertThat(userDetails.getAuthorities().iterator().next().getAuthority())
                .isEqualTo("ROLE_USER");

        UserDetails receptionistDetails = authService.loadUserByUsername("receptionist@test.com");
        assertThat(receptionistDetails.getAuthorities().iterator().next().getAuthority())
                .isEqualTo("ROLE_RECEPTIONIST");

        UserDetails adminDetails = authService.loadUserByUsername("admin@test.com");
        assertThat(adminDetails.getAuthorities().iterator().next().getAuthority())
                .isEqualTo("ROLE_ADMIN");
    }

    @Test
    @DisplayName("Powinien transakcyjnie zapisać użytkownika")
    void shouldTransactionallySaveUser() {
        String email = "transaction@example.com";

        authService.register("Trans", "User", email, "password", "123456789");

        assertThat(userRepository.findByEmail(email)).isPresent();
    }
}