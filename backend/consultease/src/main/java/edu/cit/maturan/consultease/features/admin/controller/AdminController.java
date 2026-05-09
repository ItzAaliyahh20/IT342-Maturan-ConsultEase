package edu.cit.maturan.consultease.features.admin.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.cit.maturan.consultease.features.admin.dto.CreateFacultyRequest;
import edu.cit.maturan.consultease.features.admin.service.AdminService;
import edu.cit.maturan.consultease.shared.dto.UserResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @PostMapping("/faculty")
    public ResponseEntity<UserResponse> createFaculty(@Valid @RequestBody CreateFacultyRequest request) {
        UserResponse faculty = adminService.createFacultyUser(request);
        return new ResponseEntity<>(faculty, HttpStatus.CREATED);
    }

    // Additional admin endpoints can be added here
    // For example: getAllUsers, deleteUser, updateUserRole, etc.
}
