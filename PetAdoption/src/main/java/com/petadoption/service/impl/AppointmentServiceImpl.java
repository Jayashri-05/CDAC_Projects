package com.petadoption.service.impl;

import com.petadoption.model.Appointment;
import com.petadoption.model.Pet;
import com.petadoption.model.Veterinarian;
import com.petadoption.repository.AppointmentRepository;
import com.petadoption.repository.PetRepository;
import com.petadoption.repository.VeterinarianRepository;
import com.petadoption.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AppointmentServiceImpl implements AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private PetRepository petRepository;

    @Autowired
    private VeterinarianRepository veterinarianRepository;

    @Override
    public Appointment scheduleAppointment(Appointment appointment, Long petId, Long vetId) {
        Pet pet = petRepository.findById(petId)
                .orElseThrow(() -> new RuntimeException("Pet not found"));
        Veterinarian vet = veterinarianRepository.findById(vetId)
                .orElseThrow(() -> new RuntimeException("Veterinarian not found"));

        appointment.setPet(pet);
        appointment.setVeterinarian(vet);

        return appointmentRepository.save(appointment);
    }

    @Override
    public List<Appointment> getAppointmentsByPet(Long petId) {
        Pet pet = petRepository.findById(petId)
                .orElseThrow(() -> new RuntimeException("Pet not found"));
        return appointmentRepository.findByPet(pet);
    }

    @Override
    public List<Appointment> getAppointmentsByVeterinarian(Long vetId) {
        Veterinarian vet = veterinarianRepository.findById(vetId)
                .orElseThrow(() -> new RuntimeException("Veterinarian not found"));
        return appointmentRepository.findByVeterinarian(vet);
    }

    @Override
    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    @Override
    public Appointment createAppointment(Appointment appointment) {
        return appointmentRepository.save(appointment);
    }

    @Override
    public void deleteAppointment(Long id) {
        appointmentRepository.deleteById(id);
    }
}
