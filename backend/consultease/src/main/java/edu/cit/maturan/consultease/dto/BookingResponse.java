package edu.cit.maturan.consultease.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponse {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserSummary {
        private Long id;
        private String email;
    }

    private Long id;
    private Long slotId;
    private String purpose;
    private String status;
    private Long studentId;
    private Long facultyId;
    private UserSummary student;
    private UserSummary faculty;
}
