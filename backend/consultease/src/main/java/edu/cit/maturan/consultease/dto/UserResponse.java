package edu.cit.maturan.consultease.dto;

import java.time.LocalDateTime;

import edu.cit.maturan.consultease.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private Long id;
    private String email;
    private String fullName;
    private User.Role role;
    private String provider;
    private LocalDateTime createdAt;
}
