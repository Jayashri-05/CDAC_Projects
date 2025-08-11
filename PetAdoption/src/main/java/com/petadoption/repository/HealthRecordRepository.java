package com.petadoption.repository;

import com.petadoption.model.HealthRecord;
import com.petadoption.model.Pet;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HealthRecordRepository extends JpaRepository<HealthRecord, Long> {
    List<HealthRecord> findByPet(Pet pet);
}
