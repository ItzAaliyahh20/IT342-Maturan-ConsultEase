package edu.cit.maturan.consultease.features.admin.service;

import org.springframework.stereotype.Service;

import edu.cit.maturan.consultease.shared.dto.UserResponse;
import edu.cit.maturan.consultease.shared.service.UserService;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserService userService;

    public UserResponse createFacultyUser(edu.cit.maturan.consultease.features.admin.dto.CreateFacultyRequest request) {
        return userService.createFaculty(request);
    }
}
