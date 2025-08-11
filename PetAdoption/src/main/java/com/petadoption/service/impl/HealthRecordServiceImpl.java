package com.petadoption.service.impl;

import com.petadoption.model.HealthRecord;
import com.petadoption.model.Pet;
import com.petadoption.model.Veterinarian;
import com.petadoption.repository.HealthRecordRepository;
import com.petadoption.repository.PetRepository;
import com.petadoption.repository.VeterinarianRepository;
import com.petadoption.service.HealthRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class HealthRecordServiceImpl implements HealthRecordService {

    @Autowired
    private HealthRecordRepository healthRecordRepository;

    @Autowired
    private PetRepository petRepository;

    @Autowired
    private VeterinarianRepository veterinarianRepository;

    @Override
    public HealthRecord addRecord(HealthRecord healthRecord, Long petId, Long vetId) {
        Pet pet = petRepository.findById(petId)
                .orElseThrow(() -> new RuntimeException("Pet not found"));

        Veterinarian vet = veterinarianRepository.findById(vetId)
                .orElseThrow(() -> new RuntimeException("Veterinarian not found"));

        healthRecord.setPet(pet);
        healthRecord.setVeterinarian(vet);
        healthRecord.setDate(LocalDate.now());

        return healthRecordRepository.save(healthRecord);
    }

    @Override
    public List<HealthRecord> getRecordsByPet(Long petId) {
        Pet pet = petRepository.findById(petId)
                .orElseThrow(() -> new RuntimeException("Pet not found"));
        return healthRecordRepository.findByPet(pet);
    }

    @Override
    public List<HealthRecord> getAllRecords() {
        return healthRecordRepository.findAll();
    }

    @Override
    public HealthRecord createRecord(HealthRecord healthRecord) {
        healthRecord.setDate(LocalDate.now());
        return healthRecordRepository.save(healthRecord);
    }

    @Override
    public void deleteRecord(Long id) {
        healthRecordRepository.deleteById(id);
    }
}
