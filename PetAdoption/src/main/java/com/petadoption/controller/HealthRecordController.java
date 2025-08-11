package com.petadoption.controller;

import com.petadoption.model.HealthRecord;
import com.petadoption.model.Pet;
import com.petadoption.model.Veterinarian;
import com.petadoption.service.HealthRecordService;
import com.petadoption.service.PetService;
import com.petadoption.service.VeterinarianService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/health-records")
@CrossOrigin(origins = "*")
public class HealthRecordController {

    @Autowired
    private HealthRecordService healthRecordService;

    @Autowired
    private PetService petService;

    @Autowired
    private VeterinarianService veterinarianService;

    @GetMapping
    public List<HealthRecord> getAllHealthRecords() {
        return healthRecordService.getAllRecords();
    }

    @PostMapping
    public ResponseEntity<?> createHealthRecord(@RequestBody Map<String, Object> recordData) {
        try {
            System.out.println("[DEBUG] HealthRecordController: Received record data: " + recordData);
            
            // Extract data from the request
            Long petId = Long.valueOf(recordData.get("petId").toString());
            String diagnosis = (String) recordData.get("diagnosis");
            String treatment = (String) recordData.get("treatment");
            String medications = (String) recordData.get("medications");
            String notes = (String) recordData.get("notes");
            String followUpDate = (String) recordData.get("followUpDate");
            String status = (String) recordData.get("status");
            
            // Validate required fields
            if (petId == null || diagnosis == null || treatment == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Missing required fields"));
            }
            
            // Get Pet object
            Pet pet = petService.getPetById(petId);
            if (pet == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Pet not found"));
            }
            
            // Get current veterinarian (you might need to get this from authentication)
            // For now, we'll create a record without veterinarian
            HealthRecord record = new HealthRecord();
            record.setPet(pet);
            record.setDiagnosis(diagnosis);
            record.setTreatment(treatment);
            record.setDate(LocalDate.now());
            
            HealthRecord createdRecord = healthRecordService.createRecord(record);
            return ResponseEntity.ok(createdRecord);
        } catch (Exception e) {
            System.out.println("[DEBUG] HealthRecordController: Error creating health record: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to create health record: " + e.getMessage()));
        }
    }

    @PostMapping("/add/{petId}/{vetId}")
    public HealthRecord addHealthRecord(@RequestBody HealthRecord record,
                                        @PathVariable Long petId,
                                        @PathVariable Long vetId) {
        return healthRecordService.addRecord(record, petId, vetId);
    }

    @GetMapping("/pet/{petId}")
    public List<HealthRecord> getRecordsByPet(@PathVariable Long petId) {
        return healthRecordService.getRecordsByPet(petId);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteHealthRecord(@PathVariable Long id) {
        try {
            healthRecordService.deleteRecord(id);
            return ResponseEntity.ok(Map.of("message", "Health record deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to delete health record: " + e.getMessage()));
        }
    }
}
