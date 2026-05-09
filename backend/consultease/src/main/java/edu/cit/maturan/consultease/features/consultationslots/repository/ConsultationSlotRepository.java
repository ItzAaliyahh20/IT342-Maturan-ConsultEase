package edu.cit.maturan.consultease.features.consultationslots.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import edu.cit.maturan.consultease.features.consultationslots.entity.ConsultationSlot;

public interface ConsultationSlotRepository extends JpaRepository<ConsultationSlot, Long> {

    @Query("SELECT DISTINCT cs FROM ConsultationSlot cs LEFT JOIN FETCH cs.faculty ORDER BY cs.date ASC, cs.startTime ASC")
    List<ConsultationSlot> findAllByOrderByDateAscStartTimeAsc();

    @Query("SELECT DISTINCT cs FROM ConsultationSlot cs LEFT JOIN FETCH cs.faculty f WHERE f.id = :facultyId ORDER BY cs.date ASC, cs.startTime ASC")
    List<ConsultationSlot> findByFacultyIdOrderByDateAscStartTimeAsc(@Param("facultyId") Long facultyId);
}
