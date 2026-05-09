package edu.cit.maturan.consultease.features.bookings.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingUpdateRequest {

    private String purpose;
    private String status;
}
