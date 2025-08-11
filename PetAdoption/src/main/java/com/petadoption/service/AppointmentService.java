package com.petadoption.service;

import com.petadoption.model.Appointment;

import java.util.List;

public interface AppointmentService {
    List<Appointment> getAllAppointments();
    Appointment createAppointment(Appointment appointment);
    Appointment scheduleAppointment(Appointment appointment, Long petId, Long vetId);
    List<Appointment> getAppointmentsByPet(Long petId);
    List<Appointment> getAppointmentsByVeterinarian(Long vetId);
    void deleteAppointment(Long id);
}
