package edu.cit.maturan.consultease.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.cit.maturan.consultease.entity.Booking;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByStudentIdOrderByCreatedAtDesc(Long studentId);

    List<Booking> findByFacultyIdOrderByCreatedAtDesc(Long facultyId);

    boolean existsBySlotId(Long slotId);
}
