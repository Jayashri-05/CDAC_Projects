package com.petadoption.config;

import com.petadoption.model.Pet;
import com.petadoption.model.Shelter;
import com.petadoption.model.StrayPetReport;
import com.petadoption.model.User;
import com.petadoption.repository.PetRepository;
import com.petadoption.repository.ShelterRepository;
import com.petadoption.repository.StrayPetReportRepository;
import com.petadoption.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ShelterRepository shelterRepository;

    @Autowired
    private PetRepository petRepository;

    @Autowired
    private StrayPetReportRepository strayPetReportRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("🚀 Starting data loader...");
        
        // Only load test data if no users exist
        if (userRepository.count() == 0) {
            loadTestUsers();
            loadTestShelters();
            loadTestPets();
            loadTestStrayPetReports();
        } else {
            System.out.println("✅ Database already has data, skipping test data creation.");
        }
    }

    private void loadTestUsers() {
       
        User admin = new User();
        admin.setUsername("admin");
        admin.setEmail("admin@petadoption.com");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setRole("ADMIN");
        admin.setFullName("System Administrator");
        admin.setPhone("1234567890");
        admin.setAddress("Admin Office");
        admin.setApproved(true);

       
        User testUser = new User();
        testUser.setUsername("praj123");
        testUser.setEmail("praj123@gmail.com");
        testUser.setPassword(passwordEncoder.encode("password123"));
        testUser.setRole("USER");
        testUser.setFullName("Praj Test User");
        testUser.setPhone("9876543210");
        testUser.setAddress("Test Address");
        testUser.setApproved(true);

      
        User vet = new User();
        vet.setUsername("drsmith");
        vet.setEmail("vet@petadoption.com");
        vet.setPassword(passwordEncoder.encode("vet123"));
        vet.setRole("VET");
        vet.setFullName("Dr. John Smith");
        vet.setPhone("5555551234");
        vet.setAddress("Veterinary Clinic");
        vet.setApproved(true);

       
        User shelter = new User();
        shelter.setUsername("shelter1");
        shelter.setEmail("shelter@petadoption.com");
        shelter.setPassword(passwordEncoder.encode("shelter123"));
        shelter.setRole("SHELTER");
        shelter.setFullName("Happy Paws Shelter");
        shelter.setPhone("5555555678");
        shelter.setAddress("123 Shelter Street");
        shelter.setApproved(true);

        
        userRepository.save(admin);
        userRepository.save(testUser);
        userRepository.save(vet);
        userRepository.save(shelter);

        System.out.println("✅ Test users created successfully!");
        System.out.println("📧 Admin: admin@petadoption.com / admin123");
        System.out.println("📧 User: praj123@gmail.com / password123");
        System.out.println("📧 Vet: vet@petadoption.com / vet123");
        System.out.println("📧 Shelter: shelter@petadoption.com / shelter123");
    }

    private void loadTestShelters() {
     
        Shelter shelter1 = new Shelter("Happy Paws Shelter", "shelter@petadoption.com", "5555555678", "123 Shelter Street");
        Shelter shelter2 = new Shelter("Furry Friends Rescue", "furry@petadoption.com", "5555555679", "456 Rescue Avenue");
        
        shelterRepository.save(shelter1);
        shelterRepository.save(shelter2);
        
        System.out.println("✅ Test shelters created successfully!");
    }

    private void loadTestPets() {
      
        Shelter shelter = shelterRepository.findAll().get(0);
        
       
        Pet pet1 = new Pet("Max", "Dog", "Golden Retriever", 3, false, shelter);
        pet1.setDescription("Friendly and energetic Golden Retriever");
        pet1.setHealthStatus("Healthy");
        pet1.setSize("Large");
        pet1.setGender("Male");
        pet1.setColor("Golden");
        
        Pet pet2 = new Pet("Luna", "Cat", "Persian", 2, false, shelter);
        pet2.setDescription("Beautiful and calm Persian cat");
        pet2.setHealthStatus("Healthy");
        pet2.setSize("Medium");
        pet2.setGender("Female");
        pet2.setColor("White");
        
        Pet pet3 = new Pet("Buddy", "Dog", "Labrador", 1, false, shelter);
        pet3.setDescription("Playful and loving Labrador puppy");
        pet3.setHealthStatus("Healthy");
        pet3.setSize("Large");
        pet3.setGender("Male");
        pet3.setColor("Black");
        
        petRepository.save(pet1);
        petRepository.save(pet2);
        petRepository.save(pet3);
        
        System.out.println("✅ Test pets created successfully!");
        System.out.println("🐕 Max (Golden Retriever)");
        System.out.println("🐱 Luna (Persian Cat)");
        System.out.println("🐕 Buddy (Labrador)");
    }

    private void loadTestStrayPetReports() {
       
        User testUser = userRepository.findByUsername("praj123").orElse(null);
        
        if (testUser != null) {
           
            StrayPetReport report1 = new StrayPetReport();
            report1.setReporter(testUser);
            report1.setPetType("dog");
            report1.setDescription("Golden retriever with matted fur, appears friendly but hungry");
            report1.setLocation("Near Central Park");
            report1.setAddress("123 Main St");
            report1.setCity("New York");
            report1.setState("NY");
            report1.setZipCode("10001");
            report1.setContactPhone("555-0123");
            report1.setUrgency("high");
            report1.setAdditionalNotes("Dog has a collar but no tags");
            report1.setPhotoUrl("af87cac2-6601-4b80-a38a-3cc3d918c592.jpg");
            report1.setStatus("pending");
            report1.setTimestamp(LocalDateTime.now().minusDays(1));

            StrayPetReport report2 = new StrayPetReport();
            report2.setReporter(testUser);
            report2.setPetType("cat");
            report2.setDescription("Black and white cat, seems healthy, very friendly");
            report2.setLocation("Behind Walmart");
            report2.setAddress("456 Oak Ave");
            report2.setCity("New York");
            report2.setState("NY");
            report2.setZipCode("10002");
            report2.setContactPhone("555-0456");
            report2.setUrgency("medium");
            report2.setAdditionalNotes("Cat comes when called, might be someone's pet");
            report2.setPhotoUrl("43c3e3fa-e2fe-4ff3-a13b-38a47203178d.jpg");
            report2.setStatus("pending");
            report2.setTimestamp(LocalDateTime.now().minusDays(2));

            strayPetReportRepository.save(report1);
            strayPetReportRepository.save(report2);
            
            System.out.println("✅ Test stray pet reports created successfully!");
            System.out.println("🐕 Report 1: Golden retriever near Central Park");
            System.out.println("🐱 Report 2: Black and white cat behind Walmart");
        }
    }
}