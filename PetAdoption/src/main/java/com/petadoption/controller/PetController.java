package com.petadoption.controller;

import com.petadoption.dto.CreatePetRequest;
import com.petadoption.model.Pet;
import com.petadoption.model.Shelter;
import com.petadoption.service.PetService;
import com.petadoption.service.ShelterService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;
import java.util.Map;
import java.util.stream.Collectors;
import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;
import org.springframework.core.io.Resource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpHeaders;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/pets")
@CrossOrigin(origins = "*")
public class PetController {

    @Autowired
    private PetService petService;
    
    @Autowired
    private ShelterService shelterService;

    @GetMapping("/test")
    public ResponseEntity<?> testEndpoint() {
        try {
            List<Pet> pets = petService.getAllPets();
            return ResponseEntity.ok(Map.of(
                "message", "Database connection successful",
                "petCount", pets.size(),
                "pets", pets.stream().map(pet -> Map.of(
                    "id", pet.getId(),
                    "name", pet.getPetName(),
                    "species", pet.getSpecies()
                )).collect(Collectors.toList())
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "error", "Database error: " + e.getMessage()
            ));
        }
    }

    @GetMapping
    public List<Pet> getAllPets() {
        System.out.println("[DEBUG] getAllPets called");
        List<Pet> pets = petService.getAllPets();
        System.out.println("[DEBUG] Found " + pets.size() + " pets in database");
        for (Pet pet : pets) {
            System.out.println("[DEBUG] Pet: " + pet.getPetName() + " (ID: " + pet.getId() + ")");
        }
        return pets;
    }

    @GetMapping("/{id}")
    public Pet getPetById(@PathVariable Long id) {
        return petService.getPetById(id);
    }

    @GetMapping("/available")
    public List<Pet> getAvailablePets() {
        return petService.getAllPets().stream()
                .filter(pet -> !pet.isAdopted())
                .collect(Collectors.toList());
    }

    @PostMapping
    @CrossOrigin(origins = "*")
    public ResponseEntity<?> createPet(
            @RequestParam("petName") String petName,
            @RequestParam("species") String species,
            @RequestParam("breed") String breed,
            @RequestParam("age") Integer age,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "healthStatus", required = false) String healthStatus,
            @RequestParam(value = "size", required = false) String size,
            @RequestParam(value = "gender", required = false) String gender,
            @RequestParam(value = "color", required = false) String color,
            @RequestParam(value = "specialNeeds", required = false) String specialNeeds,
            @RequestParam(value = "adoptionFee", required = false) Double adoptionFee,
            @RequestParam("shelterId") Long shelterId,
            @RequestParam(value = "photos", required = false) MultipartFile[] photos) {
        
        try {
            System.out.println("[DEBUG] Creating pet with shelterId: " + shelterId);
            
            // Create pet object
            Pet pet = new Pet();
            pet.setPetName(petName);
            pet.setSpecies(species);
            pet.setBreed(breed);
            pet.setAge(age);
            pet.setDescription(description);
            pet.setHealthStatus(healthStatus != null ? healthStatus : "Healthy");
            pet.setSize(size != null ? size : "Medium");
            pet.setGender(gender != null ? gender : "Unknown");
            pet.setColor(color);
            pet.setSpecialNeeds(specialNeeds);
            pet.setAdoptionFee(adoptionFee);
            pet.setAdopted(false);

            // Handle shelter - try to find existing first
            Shelter shelter = shelterService.getShelterById(shelterId);
            if (shelter == null) {
                System.out.println("[DEBUG] Shelter not found, creating new shelter for user ID: " + shelterId);
                // Create a basic shelter for the user
                shelter = new Shelter();
                shelter.setShelterName("Shelter " + shelterId);
                shelter.setAddress("Address not specified");
                shelter.setPhone("Phone not specified");
                shelter.setEmail("shelter" + shelterId + "@example.com");
                try {
                    shelter = shelterService.createShelter(shelter);
                    System.out.println("[DEBUG] New shelter created with ID: " + shelter.getId());
                } catch (Exception e) {
                    System.out.println("[DEBUG] Error creating shelter: " + e.getMessage());
                    return ResponseEntity.badRequest().body("Error creating shelter: " + e.getMessage());
                }
            } else {
                System.out.println("[DEBUG] Found existing shelter with ID: " + shelter.getId());
            }
            
            pet.setShelter(shelter);

            // Handle photo uploads - save files to disk
            if (photos != null && photos.length > 0) {
                StringBuilder photoUrls = new StringBuilder();
                // Use absolute path to ensure files are saved in the right location
                String uploadDir = System.getProperty("user.dir") + File.separator + "uploads" + File.separator + "pets" + File.separator;
                File dir = new File(uploadDir);
                if (!dir.exists()) {
                    boolean created = dir.mkdirs();
                    System.out.println("[DEBUG] Created upload directory: " + uploadDir + " (success: " + created + ")");
                }
                
                for (int i = 0; i < photos.length; i++) {
                    if (photos[i] != null && !photos[i].isEmpty()) {
                        try {
                            String fileName = UUID.randomUUID().toString() + "_" + photos[i].getOriginalFilename();
                            String filePath = uploadDir + fileName;
                            File dest = new File(filePath);
                            photos[i].transferTo(dest);
                            
                            if (i > 0) photoUrls.append(",");
                            photoUrls.append(fileName);
                            System.out.println("[DEBUG] Saved photo: " + fileName + " to: " + filePath);
                        } catch (Exception e) {
                            System.out.println("[DEBUG] Error saving photo: " + e.getMessage());
                            e.printStackTrace();
                        }
                    }
                }
                pet.setPhotoUrls(photoUrls.toString());
            }

            System.out.println("[DEBUG] Saving pet to database...");
            Pet savedPet = petService.createPet(pet);
            System.out.println("[DEBUG] Pet saved successfully with ID: " + savedPet.getId());
            
            return ResponseEntity.status(HttpStatus.CREATED).body(savedPet);
            
        } catch (Exception e) {
            System.out.println("[DEBUG] Error in createPet: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error creating pet: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public Pet updatePet(@PathVariable Long id, @RequestBody Pet pet) {
        // Ownership check
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName(); // email from JWT
        Pet existingPet = petService.getPetById(id);
        if (existingPet == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Pet not found");
        }
        if (existingPet.getShelter() == null || !existingPet.getShelter().getEmail().equals(currentUsername)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not allowed to edit this pet");
        }
        return petService.updatePet(id, pet);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePet(@PathVariable Long id) {
        try {
            // First check if the pet can be deleted normally
            try {
                petService.deletePet(id);
                return ResponseEntity.ok(Map.of(
                    "message", "Pet deleted successfully"
                ));
            } catch (Exception e) {
                // If normal deletion fails, try force deletion
                System.out.println("[DEBUG] Normal deletion failed, trying force deletion: " + e.getMessage());
                petService.forceDeletePet(id);
                return ResponseEntity.ok(Map.of(
                    "message", "Pet and all associated records deleted successfully"
                ));
            }
        } catch (Exception e) {
            System.out.println("[DEBUG] Error deleting pet with ID " + id + ": " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Failed to delete pet: " + e.getMessage()
            ));
        }
    }

    @PutMapping("/{id}/adopt")
    public ResponseEntity<?> markPetAsAdopted(@PathVariable Long id) {
        try {
            Pet pet = petService.getPetById(id);
            if (pet == null) {
                return ResponseEntity.notFound().build();
            }
            
            pet.setAdopted(true);
            Pet updatedPet = petService.updatePet(id, pet);
            
            return ResponseEntity.ok(Map.of(
                "message", "Pet marked as adopted successfully",
                "pet", updatedPet
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Failed to mark pet as adopted: " + e.getMessage()
            ));
        }
    }

    @GetMapping("/shelter/{shelterId}")
    public List<Pet> getPetsByShelterId(@PathVariable Long shelterId) {
        return petService.getPetsByShelterId(shelterId);
    }

    @GetMapping("/my-pets")
    public ResponseEntity<?> getMyPets(@RequestParam Long userId) {
        try {
            System.out.println("[DEBUG] getMyPets called with userId: " + userId);
            
            // For now, return all pets since the shelter-user relationship is not properly set up
            // This is a temporary fix until the data model is properly aligned
            List<Pet> allPets = petService.getAllPets();
            System.out.println("[DEBUG] Found " + allPets.size() + " total pets");
            
            // Filter pets that have a shelter (to avoid null pointer issues)
            List<Pet> petsWithShelter = allPets.stream()
                .filter(pet -> pet.getShelter() != null)
                .collect(Collectors.toList());
            
            System.out.println("[DEBUG] Pets with shelter: " + petsWithShelter.size());
            
            return ResponseEntity.ok(petsWithShelter);
        } catch (Exception e) {
            System.out.println("[DEBUG] Error in getMyPets: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Failed to fetch pets: " + e.getMessage()
            ));
        }
    }

    @GetMapping("/images/{fileName}")
    public ResponseEntity<Resource> getImage(@PathVariable String fileName) {
        try {
            String uploadDir = System.getProperty("user.dir") + File.separator + "uploads" + File.separator + "pets" + File.separator;
            Path filePath = Paths.get(uploadDir + fileName);
            Resource resource = new FileSystemResource(filePath.toFile());
            
            System.out.println("[DEBUG] Looking for image: " + filePath.toString());
            System.out.println("[DEBUG] File exists: " + resource.exists());
            System.out.println("[DEBUG] File readable: " + resource.isReadable());
            
            if (resource.exists() && resource.isReadable()) {
                return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + fileName + "\"")
                    .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            System.out.println("[DEBUG] Error serving image: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.notFound().build();
        }
    }
}
