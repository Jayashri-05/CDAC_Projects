package com.petadoption.service;

import com.petadoption.model.HealthRecord;

import java.util.List;

public interface HealthRecordService {
    List<HealthRecord> getAllRecords();
    HealthRecord createRecord(HealthRecord healthRecord);
    HealthRecord addRecord(HealthRecord healthRecord, Long petId, Long vetId);
    List<HealthRecord> getRecordsByPet(Long petId);
    void deleteRecord(Long id);
}
