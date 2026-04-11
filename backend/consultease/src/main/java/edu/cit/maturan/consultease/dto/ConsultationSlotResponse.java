package edu.cit.maturan.consultease.dto;

import java.time.LocalDate;
import java.time.LocalTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConsultationSlotResponse {

    private Long id;
    private LocalDate date;
    private LocalTime startTime;
    private Integer duration;
    private Boolean isBooked;
    private Long facultyId;
}
