package com.petadoption.service.impl;

import com.petadoption.model.Pet;
import com.petadoption.model.Shelter;
import com.petadoption.model.AdoptionRequest;
import com.petadoption.model.HealthRecord;
import com.petadoption.model.Appointment;
import com.petadoption.model.AppointmentRequest;
import com.petadoption.repository.PetRepository;
import com.petadoption.repository.ShelterRepository;
import com.petadoption.repository.AdoptionRequestRepository;
import com.petadoption.repository.HealthRecordRepository;
import com.petadoption.repository.AppointmentRepository;
import com.petadoption.repository.AppointmentRequestRepository;
import com.petadoption.service.PetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.HashMap;

@Service
public class PetServiceImpl implements PetService {

    @Autowired
    private PetRepository petRepository;

    @Autowired
    private ShelterRepository shelterRepository;

    @Autowired
    private AdoptionRequestRepository adoptionRequestRepository;

    @Autowired
    private HealthRecordRepository healthRecordRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;
    
    @Autowired
    private AppointmentRequestRepository appointmentRequestRepository;

    @Override
    public List<Pet> getAllPets() {
        System.out.println("[DEBUG] PetService.getAllPets called");
        List<Pet> pets = petRepository.findAll();
        System.out.println("[DEBUG] PetService found " + pets.size() + " pets");
        return pets;
    }

    @Override
    public Pet getPetById(Long id) {
        return petRepository.findById(id).orElse(null);
    }

    @Override
    public Pet createPet(Pet pet) {
        // Optional: Validate that the shelter exists
        if (pet.getShelter() != null && pet.getShelter().getId() != null) {
            Optional<Shelter> shelterOpt = shelterRepository.findById(pet.getShelter().getId());
            shelterOpt.ifPresent(pet::setShelter);
        }
        return petRepository.save(pet);
    }

    @Override
    public Pet updatePet(Long id, Pet pet) {
        Optional<Pet> existingPetOpt = petRepository.findById(id);
        if (existingPetOpt.isPresent()) {
            Pet existingPet = existingPetOpt.get();
            existingPet.setPetName(pet.getPetName());
            existingPet.setSpecies(pet.getSpecies());
            existingPet.setBreed(pet.getBreed());
            existingPet.setAge(pet.getAge());
            existingPet.setAdopted(pet.isAdopted());
            existingPet.setDescription(pet.getDescription());
            existingPet.setHealthStatus(pet.getHealthStatus());
            existingPet.setSize(pet.getSize());
            existingPet.setGender(pet.getGender());
            existingPet.setColor(pet.getColor());
            existingPet.setSpecialNeeds(pet.getSpecialNeeds());
            existingPet.setAdoptionFee(pet.getAdoptionFee());
            existingPet.setPhotoUrls(pet.getPhotoUrls());

            // Only update shelter if provided in the input
            if (pet.getShelter() != null) {
                existingPet.setShelter(pet.getShelter());
            }

            return petRepository.save(existingPet);
        } else {
            return null;
        }
    }

    @Override
    public void deletePet(Long id) {
        try {
            // Check if pet exists first
            if (!petRepository.existsById(id)) {
                throw new RuntimeException("Pet with ID " + id + " not found");
            }
            
            petRepository.deleteById(id);
            System.out.println("[DEBUG] Successfully deleted pet with ID " + id);
        } catch (Exception e) {
            System.out.println("[DEBUG] Error deleting pet with ID " + id + ": " + e.getMessage());
            throw e; // Re-throw to let the controller handle it
        }
    }

    @Override
    public void forceDeletePet(Long id) {
        try {
            System.out.println("[DEBUG] Starting force deletion for pet ID: " + id);
            
            // Check if pet exists
            Pet pet = petRepository.findById(id).orElse(null);
            if (pet == null) {
                throw new RuntimeException("Pet with ID " + id + " not found");
            }
            
            // First delete all associated adoption requests
            List<AdoptionRequest> adoptionRequests = adoptionRequestRepository.findByPetId(id);
            System.out.println("[DEBUG] Found " + adoptionRequests.size() + " adoption requests to delete");
            for (AdoptionRequest request : adoptionRequests) {
                adoptionRequestRepository.deleteById(request.getId());
                System.out.println("[DEBUG] Deleted adoption request ID: " + request.getId());
            }
            
            // Delete all associated health records
            List<HealthRecord> healthRecords = healthRecordRepository.findByPet(pet);
            System.out.println("[DEBUG] Found " + healthRecords.size() + " health records to delete");
            for (HealthRecord record : healthRecords) {
                healthRecordRepository.deleteById(record.getId());
                System.out.println("[DEBUG] Deleted health record ID: " + record.getId());
            }
            
            // Delete all associated appointments
            List<Appointment> appointments = appointmentRepository.findByPet(pet);
            System.out.println("[DEBUG] Found " + appointments.size() + " appointments to delete");
            for (Appointment appointment : appointments) {
                appointmentRepository.deleteById(appointment.getId());
                System.out.println("[DEBUG] Deleted appointment ID: " + appointment.getId());
            }
            
            // Delete all associated appointment requests
            List<AppointmentRequest> appointmentRequests = appointmentRequestRepository.findByPet(pet);
            System.out.println("[DEBUG] Found " + appointmentRequests.size() + " appointment requests to delete");
            for (AppointmentRequest request : appointmentRequests) {
                appointmentRequestRepository.deleteById(request.getId());
                System.out.println("[DEBUG] Deleted appointment request ID: " + request.getId());
            }
            
            // Finally delete the pet
            petRepository.deleteById(id);
            System.out.println("[DEBUG] Successfully force deleted pet with ID " + id + " and all associated records");
        } catch (Exception e) {
            System.out.println("[DEBUG] Error force deleting pet with ID " + id + ": " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @Override
    public List<Pet> getPetsByShelterId(Long shelterId) {
        return petRepository.findByShelterId(shelterId);
    }

    @Override
    public Map<String, Object> checkPetDeletability(Long id) {
        Map<String, Object> result = new HashMap<>();
        
        // Check if pet exists
        Pet pet = getPetById(id);
        if (pet == null) {
            result.put("deletable", false);
            result.put("message", "Pet not found");
            return result;
        }
        
        // For now, we'll assume the pet can be deleted
        // In a more sophisticated implementation, you could check for related records
        // by querying the adoption requests, health records, and appointments
        result.put("deletable", true);
        result.put("message", "Pet can be deleted");
        
        return result;
    }
}
