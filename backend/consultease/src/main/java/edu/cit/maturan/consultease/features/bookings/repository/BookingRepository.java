package edu.cit.maturan.consultease.features.bookings.repository;

import java.util.Optional;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import edu.cit.maturan.consultease.features.bookings.entity.Booking;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    @Query("SELECT DISTINCT b FROM Booking b LEFT JOIN FETCH b.student LEFT JOIN FETCH b.faculty LEFT JOIN FETCH b.slot WHERE b.student.id = :studentId ORDER BY b.createdAt DESC")
    List<Booking> findByStudentIdOrderByCreatedAtDesc(@Param("studentId") Long studentId);

    @Query("SELECT DISTINCT b FROM Booking b LEFT JOIN FETCH b.student LEFT JOIN FETCH b.faculty LEFT JOIN FETCH b.slot WHERE b.faculty.id = :facultyId ORDER BY b.createdAt DESC")
    List<Booking> findByFacultyIdOrderByCreatedAtDesc(@Param("facultyId") Long facultyId);

    boolean existsBySlotId(Long slotId);

    Optional<Booking> findBySlotId(Long slotId);
}
