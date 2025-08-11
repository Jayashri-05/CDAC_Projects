package com.petadoption.repository;

import com.petadoption.model.AppointmentRequest;
import com.petadoption.model.User;
import com.petadoption.model.Pet;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AppointmentRequestRepository extends JpaRepository<AppointmentRequest, Long> {
    List<AppointmentRequest> findByUser(User user);
    List<AppointmentRequest> findByPet(Pet pet);
    List<AppointmentRequest> findByStatus(String status);
    List<AppointmentRequest> findByStatusOrderByRequestDateDesc(String status);
    List<AppointmentRequest> findByUserOrderByRequestDateDesc(User user);
} 