package com.petadoption.repository;

import com.petadoption.model.Appointment;
import com.petadoption.model.Pet;
import com.petadoption.model.Veterinarian;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByPet(Pet pet);
    List<Appointment> findByVeterinarian(Veterinarian vet);
}
