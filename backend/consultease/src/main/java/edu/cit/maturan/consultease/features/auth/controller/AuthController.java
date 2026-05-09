package edu.cit.maturan.consultease.features.auth.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.cit.maturan.consultease.features.auth.dto.AuthResponse;
import edu.cit.maturan.consultease.features.auth.dto.ChangePasswordRequest;
import edu.cit.maturan.consultease.features.auth.dto.LoginRequest;
import edu.cit.maturan.consultease.features.auth.dto.RegisterRequest;
import edu.cit.maturan.consultease.features.auth.service.AuthService;
import edu.cit.maturan.consultease.shared.entity.User;
import edu.cit.maturan.consultease.shared.exception.BadRequestException;
import edu.cit.maturan.consultease.shared.exception.ResourceNotFoundException;
import edu.cit.maturan.consultease.shared.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthService authService;
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout() {
        authService.logout();
        return ResponseEntity.ok("Logged out successfully");
    }

    @PutMapping("/change-password")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        // Validate that new passwords match
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("New passwords do not match");
        }

        User currentUser = userService.getCurrentUser();
        userService.changePassword(currentUser.getId(), request.getCurrentPassword(), request.getNewPassword());

        return ResponseEntity.ok("Password changed successfully");
    }

    // Diagnostic endpoint - helps debug password encoding issues
    @PostMapping("/debug/verify-password")
    public ResponseEntity<String> verifyPassword(@Valid @RequestBody LoginRequest request) {
        try {
            User user = userService.findByEmail(request.getEmail());
            boolean passwordMatches = passwordEncoder.matches(request.getPassword(), user.getPasswordHash());
            
            log.info("Password verification for {}: matches={}", request.getEmail(), passwordMatches);
            
            if (passwordMatches) {
                return ResponseEntity.ok("✓ User found and password matches");
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("✗ User found but password does not match. Password may not be properly encoded.");
            }
        } catch (ResourceNotFoundException e) {
            log.warn("User not found during password verification: {}", request.getEmail());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("✗ User not found with email: " + request.getEmail());
        }
    }
}
