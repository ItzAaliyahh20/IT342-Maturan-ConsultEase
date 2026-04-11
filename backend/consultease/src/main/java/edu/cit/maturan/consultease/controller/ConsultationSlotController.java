package edu.cit.maturan.consultease.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.cit.maturan.consultease.dto.ConsultationSlotRequest;
import edu.cit.maturan.consultease.dto.ConsultationSlotResponse;
import edu.cit.maturan.consultease.service.ConsultationSlotService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/consultation-slots")
@RequiredArgsConstructor
public class ConsultationSlotController {

    private final ConsultationSlotService consultationSlotService;

    @GetMapping
    public ResponseEntity<List<ConsultationSlotResponse>> getAll() {
        return ResponseEntity.ok(consultationSlotService.getAll());
    }

    @PostMapping
    @PreAuthorize("hasRole('FACULTY')")
    public ResponseEntity<ConsultationSlotResponse> create(@Valid @RequestBody ConsultationSlotRequest request) {
        return new ResponseEntity<>(consultationSlotService.create(request), HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('FACULTY')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        consultationSlotService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
