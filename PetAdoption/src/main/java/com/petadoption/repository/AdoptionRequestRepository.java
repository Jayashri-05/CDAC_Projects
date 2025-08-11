package com.petadoption.repository;

import com.petadoption.model.AdoptionRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AdoptionRequestRepository extends JpaRepository<AdoptionRequest, Long> {
    List<AdoptionRequest> findByAdopterId(Long adopterId);
    List<AdoptionRequest> findByPetId(Long petId);
    List<AdoptionRequest> findByAdopterIdOrderByApplicationDateDesc(Long adopterId);
    List<AdoptionRequest> findByStatusOrderByApplicationDateDesc(String status);
    List<AdoptionRequest> findByAdopterIdAndPetId(Long adopterId, Long petId);
}
