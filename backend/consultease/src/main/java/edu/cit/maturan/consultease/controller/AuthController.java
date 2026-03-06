package edu.cit.maturan.consultease.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.cit.maturan.consultease.dto.AuthResponse;
import edu.cit.maturan.consultease.dto.ChangePasswordRequest;
import edu.cit.maturan.consultease.dto.LoginRequest;
import edu.cit.maturan.consultease.dto.RegisterRequest;
import edu.cit.maturan.consultease.entity.User;
import edu.cit.maturan.consultease.exception.BadRequestException;
import edu.cit.maturan.consultease.service.AuthService;
import edu.cit.maturan.consultease.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserService userService;

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
    @PreAuthorize("hasRole('FACULTY')")
    public ResponseEntity<String> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        // Validate that new passwords match
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("New passwords do not match");
        }

        User currentUser = userService.getCurrentUser();
        userService.changePassword(currentUser.getId(), request.getCurrentPassword(), request.getNewPassword());

        return ResponseEntity.ok("Password changed successfully");
    }
}
