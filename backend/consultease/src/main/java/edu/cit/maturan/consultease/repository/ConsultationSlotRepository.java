package edu.cit.maturan.consultease.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.cit.maturan.consultease.entity.ConsultationSlot;

public interface ConsultationSlotRepository extends JpaRepository<ConsultationSlot, Long> {

    List<ConsultationSlot> findAllByOrderByDateAscStartTimeAsc();

    List<ConsultationSlot> findByFacultyIdOrderByDateAscStartTimeAsc(Long facultyId);
}
