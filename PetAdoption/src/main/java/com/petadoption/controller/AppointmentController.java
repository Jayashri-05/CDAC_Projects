package com.petadoption.controller;

import com.petadoption.model.Appointment;
import com.petadoption.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "*")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @GetMapping
    public List<Appointment> getAllAppointments() {
        return appointmentService.getAllAppointments();
    }

    @PostMapping
    public ResponseEntity<?> createAppointment(@RequestBody Appointment appointment) {
        try {
            Appointment createdAppointment = appointmentService.createAppointment(appointment);
            return ResponseEntity.ok(createdAppointment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to create appointment: " + e.getMessage()));
        }
    }

    @PostMapping("/schedule/{petId}/{vetId}")
    public Appointment schedule(@RequestBody Appointment appointment,
                                @PathVariable Long petId,
                                @PathVariable Long vetId) {
        return appointmentService.scheduleAppointment(appointment, petId, vetId);
    }

    @GetMapping("/pet/{petId}")
    public List<Appointment> getByPet(@PathVariable Long petId) {
        return appointmentService.getAppointmentsByPet(petId);
    }

    @GetMapping("/vet/{vetId}")
    public List<Appointment> getByVet(@PathVariable Long vetId) {
        return appointmentService.getAppointmentsByVeterinarian(vetId);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAppointment(@PathVariable Long id) {
        try {
            appointmentService.deleteAppointment(id);
            return ResponseEntity.ok(Map.of("message", "Appointment deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to delete appointment: " + e.getMessage()));
        }
    }
}
