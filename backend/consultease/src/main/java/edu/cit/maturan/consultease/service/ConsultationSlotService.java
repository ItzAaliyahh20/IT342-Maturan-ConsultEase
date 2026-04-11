package edu.cit.maturan.consultease.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.cit.maturan.consultease.dto.ConsultationSlotRequest;
import edu.cit.maturan.consultease.dto.ConsultationSlotResponse;
import edu.cit.maturan.consultease.entity.Booking;
import edu.cit.maturan.consultease.entity.ConsultationSlot;
import edu.cit.maturan.consultease.entity.User;
import edu.cit.maturan.consultease.exception.BadRequestException;
import edu.cit.maturan.consultease.exception.ResourceNotFoundException;
import edu.cit.maturan.consultease.repository.BookingRepository;
import edu.cit.maturan.consultease.repository.ConsultationSlotRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ConsultationSlotService {

    private final ConsultationSlotRepository consultationSlotRepository;
    private final BookingRepository bookingRepository;
    private final UserService userService;

    @Transactional(readOnly = true)
    public List<ConsultationSlotResponse> getAll() {
        return consultationSlotRepository.findAllByOrderByDateAscStartTimeAsc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public ConsultationSlotResponse create(ConsultationSlotRequest request) {
        User currentUser = userService.getCurrentUser();
        if (currentUser.getRole() != User.Role.FACULTY) {
            throw new BadRequestException("Only faculty can create consultation slots");
        }

        ConsultationSlot slot = ConsultationSlot.builder()
                .date(request.getDate())
                .startTime(request.getStartTime())
                .duration(request.getDuration())
                .isBooked(false)
                .faculty(currentUser)
                .build();

        return toResponse(consultationSlotRepository.save(slot));
    }

    @Transactional
    public void delete(Long id) {
        User currentUser = userService.getCurrentUser();
        if (currentUser.getRole() != User.Role.FACULTY) {
            throw new BadRequestException("Only faculty can delete consultation slots");
        }

        ConsultationSlot slot = consultationSlotRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Consultation slot not found"));

        if (!slot.getFaculty().getId().equals(currentUser.getId())) {
            throw new BadRequestException("You can only delete your own consultation slots");
        }

        if (Boolean.TRUE.equals(slot.getIsBooked()) || bookingRepository.existsBySlotId(id)) {
            throw new BadRequestException("Booked slots cannot be deleted");
        }

        consultationSlotRepository.delete(slot);
    }

    protected ConsultationSlotResponse toResponse(ConsultationSlot slot) {
        Booking booking = bookingRepository.findBySlotId(slot.getId()).orElse(null);

        return ConsultationSlotResponse.builder()
                .id(slot.getId())
                .date(slot.getDate())
                .startTime(slot.getStartTime())
                .duration(slot.getDuration())
                .isBooked(Boolean.TRUE.equals(slot.getIsBooked()))
                .facultyId(slot.getFaculty().getId())
            .facultyName(slot.getFaculty().getFullName())
            .bookingId(booking != null ? booking.getId() : null)
            .consultationStatus(booking != null ? booking.getStatus().name() : "PENDING")
                .build();
    }
}
