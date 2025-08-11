package com.petadoption.controller;

import com.petadoption.model.AdoptionRequest;
import com.petadoption.model.Pet;
import com.petadoption.model.User;
import com.petadoption.service.AdoptionRequestService;
import com.petadoption.service.PetService;
import com.petadoption.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private AdoptionRequestService adoptionRequestService;

    @Autowired
    private PetService petService;

    @GetMapping
    public List<User> getAllUsers() {
        System.out.println("[DEBUG] ===== GET /api/users called =====");
        System.out.println("[DEBUG] Getting all users...");
        try {
            List<User> users = userService.getAllUsers();
            System.out.println("[DEBUG] Found " + users.size() + " users");
            for (User user : users) {
                System.out.println("[DEBUG] User: " + user.getUsername() + " | Role: " + user.getRole() + " | Status: " + user.getStatus());
            }
            System.out.println("[DEBUG] ===== Returning users successfully =====");
            return users;
        } catch (Exception e) {
            System.out.println("[DEBUG] Error getting users: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @GetMapping("/{id}")
    public User getUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    @PostMapping
    public User createUser(@RequestBody User user) {
        return userService.createUser(user);
    }

    @PutMapping("/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody User user) {
        return userService.updateUser(id, user);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateUserStatus(@PathVariable Long id, @RequestBody Map<String, String> request) {
        try {
            String status = request.get("status");
            User updatedUser = userService.updateUserStatus(id, status);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to update user status: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/{userId}/adopted-pets")
    public ResponseEntity<?> getAdoptedPetsByUser(@PathVariable Long userId) {
        try {
            List<AdoptionRequest> approvedRequests = adoptionRequestService.getRequestsByUser(userId)
                    .stream()
                    .filter(request -> "approved".equals(request.getStatus()))
                    .collect(Collectors.toList());

            List<Pet> adoptedPets = approvedRequests.stream()
                    .map(AdoptionRequest::getPet)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(adoptedPets);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch adopted pets: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/{userId}/adoption-applications")
    public ResponseEntity<?> getAdoptionApplicationsByUser(@PathVariable Long userId) {
        try {
            List<AdoptionRequest> applications = adoptionRequestService.getRequestsByUser(userId);
            return ResponseEntity.ok(applications);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch adoption applications: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}
