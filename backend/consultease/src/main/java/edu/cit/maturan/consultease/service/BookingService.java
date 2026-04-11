package edu.cit.maturan.consultease.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import edu.cit.maturan.consultease.dto.BookingRequest;
import edu.cit.maturan.consultease.dto.BookingResponse;
import edu.cit.maturan.consultease.dto.BookingUpdateRequest;
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
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ConsultationSlotRepository consultationSlotRepository;
    private final UserService userService;

    @Transactional(readOnly = true)
    public List<BookingResponse> getBookingsForCurrentUser() {
        User currentUser = userService.getCurrentUser();

        List<Booking> bookings;
        if (currentUser.getRole() == User.Role.STUDENT) {
            bookings = bookingRepository.findByStudentIdOrderByCreatedAtDesc(currentUser.getId());
        } else if (currentUser.getRole() == User.Role.FACULTY) {
            bookings = bookingRepository.findByFacultyIdOrderByCreatedAtDesc(currentUser.getId());
        } else {
            bookings = bookingRepository.findAll();
        }

        return bookings.stream().map(this::toResponse).toList();
    }

    @Transactional
    public BookingResponse createBooking(BookingRequest request) {
        User currentUser = userService.getCurrentUser();
        if (currentUser.getRole() != User.Role.STUDENT) {
            throw new BadRequestException("Only students can create bookings");
        }

        ConsultationSlot slot = consultationSlotRepository.findById(request.getSlotId())
                .orElseThrow(() -> new ResourceNotFoundException("Consultation slot not found"));

        if (Boolean.TRUE.equals(slot.getIsBooked()) || bookingRepository.existsBySlotId(slot.getId())) {
            throw new BadRequestException("Selected slot is already booked");
        }

        Booking booking = Booking.builder()
                .slot(slot)
                .purpose(request.getPurpose().trim())
                .status(Booking.Status.PENDING)
                .student(currentUser)
                .faculty(slot.getFaculty())
                .build();

        slot.setIsBooked(true);
        consultationSlotRepository.save(slot);

        return toResponse(bookingRepository.save(booking));
    }

    @Transactional
    public BookingResponse updateBooking(Long id, BookingUpdateRequest request) {
        User currentUser = userService.getCurrentUser();

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (currentUser.getRole() == User.Role.STUDENT) {
            if (!booking.getStudent().getId().equals(currentUser.getId())) {
                throw new BadRequestException("Students can only update their own bookings");
            }

            if (StringUtils.hasText(request.getPurpose())) {
                booking.setPurpose(request.getPurpose().trim());
            }
        } else if (currentUser.getRole() == User.Role.FACULTY) {
            if (!booking.getFaculty().getId().equals(currentUser.getId())) {
                throw new BadRequestException("Faculty can only update assigned bookings");
            }

            if (StringUtils.hasText(request.getPurpose())) {
                booking.setPurpose(request.getPurpose().trim());
            }

            if (StringUtils.hasText(request.getStatus())) {
                try {
                    Booking.Status status = Booking.Status.valueOf(request.getStatus().trim().toUpperCase());
                    booking.setStatus(status);
                } catch (IllegalArgumentException ex) {
                    throw new BadRequestException("Invalid booking status");
                }
            }
        } else {
            if (StringUtils.hasText(request.getPurpose())) {
                booking.setPurpose(request.getPurpose().trim());
            }
            if (StringUtils.hasText(request.getStatus())) {
                try {
                    booking.setStatus(Booking.Status.valueOf(request.getStatus().trim().toUpperCase()));
                } catch (IllegalArgumentException ex) {
                    throw new BadRequestException("Invalid booking status");
                }
            }
        }

        return toResponse(bookingRepository.save(booking));
    }

    private BookingResponse toResponse(Booking booking) {
        return BookingResponse.builder()
                .id(booking.getId())
                .slotId(booking.getSlot().getId())
                .purpose(booking.getPurpose())
                .status(booking.getStatus().name())
                .studentId(booking.getStudent().getId())
                .facultyId(booking.getFaculty().getId())
                .student(BookingResponse.UserSummary.builder()
                        .id(booking.getStudent().getId())
                        .email(booking.getStudent().getEmail())
                        .build())
                .faculty(BookingResponse.UserSummary.builder()
                        .id(booking.getFaculty().getId())
                        .email(booking.getFaculty().getEmail())
                        .build())
                .build();
    }
}
